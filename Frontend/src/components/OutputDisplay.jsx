import React, { useEffect, useState, useRef } from 'react';

const OutputDisplay = ({ output }) => {
  const [displayedOutput, setDisplayedOutput] = useState('');
  const [isTypingCompleted, setIsTypingCompleted] = useState(false); // Track typing completion
  const outputRef = useRef(null);
  const prevOutput = useRef(''); // Store the previous output

  useEffect(() => {
    // Ensure output is a string
    const responseText = output || ''; 

    // If the output is the same as the previous one, skip animation
    if (responseText === prevOutput.current) return;

    prevOutput.current = responseText; // Update previous output reference
    setIsTypingCompleted(false); // Reset typing completion status

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < responseText.length) {
        setDisplayedOutput(prev => prev + responseText.charAt(currentIndex)); // Append new text
        currentIndex++;
      } else {
        setIsTypingCompleted(true); // Mark typing as completed
        clearInterval(interval);
      }
    }, 25); // Smooth typing animation

    return () => clearInterval(interval);
  }, [output]); // Run only when the output prop changes

  // Auto-scroll to bottom when new output is displayed
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [displayedOutput]);

  return (
    <div className="output-display" ref={outputRef}>
      {/* Add a new paragraph for each new output */}
      <p style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
        {displayedOutput}
      </p>
    </div>
  );
};

export default OutputDisplay;
