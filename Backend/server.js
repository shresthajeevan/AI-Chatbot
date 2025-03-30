require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');  // JWT package
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const axios = require('axios');

// Initialize app
const app = express();

// Enhanced security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// MongoDB connection with robust error handling
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Chatbot', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// MongoDB connection events
mongoose.connection.on('connected', () => console.log('📊 MongoDB event connected'));
mongoose.connection.on('disconnected', () => console.warn('⚠️ MongoDB event disconnected'));
mongoose.connection.on('error', err => console.error('❌ MongoDB event error:', err));

// User Schema with enhanced validation
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  }
}, { timestamps: true });

// Indexes
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

// Gemini API Setup
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;  // Ensure to have your Gemini API key in the .env
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`;

// Enhanced Signup Endpoint
app.post('/api/signup', async (req, res) => {
  try {
    console.log('📩 Signup request received');
    const { email, password, confirmPassword } = req.body;

    // Validation
    if (!email || !password || !confirmPassword) {
      console.warn('Validation failed: Missing fields');
      return res.status(400).json({ 
        success: false,
        error: 'All fields are required' 
      });
    }

    if (password !== confirmPassword) {
      console.warn('Validation failed: Password mismatch');
      return res.status(400).json({ 
        success: false,
        error: 'Passwords do not match' 
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn('Registration failed: Email already exists', email);
      return res.status(409).json({ 
        success: false,
        error: 'Email already in use' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({ 
      email, 
      password: hashedPassword 
    });
    
    await newUser.save();
    
    console.log('✅ New user created:', email);
    return res.status(201).json({ 
      success: true,
      message: 'User registered successfully',
      user: { email: newUser.email }
    });

  } catch (error) {
    console.error('❌ Signup Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: error.message
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Duplicate Email',
        details: 'Email already exists'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'Please try again later'
    });
  }
});

// Login Endpoint with JWT Authentication
app.post('/api/login', async (req, res) => {
  try {
    console.log('📩 Login request received');
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.warn('Validation failed: Missing fields');
      return res.status(400).json({
        success: false,
        error: 'Email and Password are required'
      });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.warn('Login failed: User not found', email);
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn('Login failed: Incorrect password');
      return res.status(400).json({
        success: false,
        error: 'Incorrect password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,  // Use JWT secret key from environment variables
      { expiresIn: '1h' }  // Token expires in 1 hour
    );

    console.log('✅ User logged in successfully:', email);

    return res.json({
      success: true,
      message: 'Login successful',
      token  // Send the token to the client
    });

  } catch (error) {
    console.error('❌ Login Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'Please try again later'
    });
  }
});

// Chat with Gemini Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    // Extract the query from the request body
    const { query } = req.body;  // Expecting { query: "your question" }

    // Validate the query to make sure it's a string
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query must be a string' });
    }

    // Prepare the payload to send to the Gemini API
    const payload = {
      contents: [{
        role: "user",
        parts: [{ text: query }]
      }]
    };

    // Make a POST request to the Gemini API
    const response = await axios.post(GEMINI_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 15000  // 15-second timeout
    });

    // Extract the response text from Gemini's API response
    const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text 
                          || 'No response generated';

    // Return the response from Gemini API
    return res.json({ response: responseText });

  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);

    // Handle errors from the API or other internal errors
    if (error.response) {
      return res.status(error.response.status).json({
        error: 'Gemini API Error',
        details: error.response.data
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('⚠️ Unhandled Error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' 
      ? err.message 
      : undefined
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 MongoDB state: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('🔴 Server closed');
    process.exit(0);
  });
});
