import React, { useState, useRef } from "react";
import { FaPaperclip, FaArrowUp } from "react-icons/fa";

const PromptInput = ({ onSubmit, disabled, onFileUpload }) => {
  const [input, setInput] = useState("");
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmit(input);
    setInput("");
  };

  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (onFileUpload) {
        onFileUpload(files[0]);
      }
    }
    // Reset the input to allow selecting the same file again
    e.target.value = null;
  };

  return (
    <form className="prompt-input" onSubmit={handleSubmit}>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.pptx,.jpg,.jpeg,.png" // Specify accepted file types
      />
      
      {/* Attachment Icon */}
      <button 
        type="button" 
        className="attachment-btn"
        onClick={handleAttachmentClick}
        disabled={disabled}
      >
        <FaPaperclip />
      </button>

      {/* Input Field */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask anything..."
        disabled={disabled}
      />

      {/* Send Button */}
      <button type="submit" className="send-btn" disabled={disabled || !input.trim()}>
        <FaArrowUp />
      </button>
    </form>
  );
};

export default PromptInput;