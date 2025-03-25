from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

# Set your Hugging Face API key here or load it from an environment variable
HF_API_KEY = os.getenv("HF_API_KEY", "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")  # Replace with your actual Hugging Face API key

@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        query = data.get("query", "")

        # Hugging Face Inference API URL
        url = "https://api-inference.huggingface.co/models/gpt2"  # Replace with the model you are using (e.g., gpt2)

        headers = {
            "Authorization": f"Bearer {HF_API_KEY}",
            "Content-Type": "application/json",
        }

        # Payload for text generation with updated parameters
        payload = {
            "inputs": query,
            "parameters": {
                "max_length": 150,  # Avoid too long outputs
                "temperature": 0.7,  # Controls randomness (values between 0 and 1)
                "top_p": 0.9,  # Controls diversity via nucleus sampling (value between 0 and 1)
                "top_k": 50,  # Limits the number of possible next tokens to consider
            }
        }

        # Make API request to Hugging Face
        response = requests.post(url, json=payload, headers=headers)

        if response.status_code != 200:
            return jsonify({"error": f"API error: {response.status_code} - {response.text}"}), response.status_code

        # Extract response from Hugging Face
        result = response.json()
        answer = result[0]['generated_text'].strip()
        return jsonify({"response": answer})

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Request error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
