import React, { useState } from "react";
import { FaPaperclip, FaArrowUp } from "react-icons/fa";

const PromptInput = ({ onSubmit, disabled }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmit(input);
    setInput("");
  };

  return (
    <form className="prompt-input" onSubmit={handleSubmit}>
      {/* Attachment Icon */}
      <button type="button" className="attachment-btn">
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
      <button type="submit" className="send-btn" disabled={disabled}>
        <FaArrowUp />
      </button>
    </form>
  );
};

export default PromptInput;
