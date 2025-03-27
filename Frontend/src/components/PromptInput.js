import React, { useState } from 'react';

const PromptInput = ({ onSubmit, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(input);
    setInput('');
  };

  return (
    <form className="prompt-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your query here..."
        required
        disabled={disabled}
      />
      <button type="submit" className="send-btn" disabled={disabled}>
        <i className="fas fa-paper-plane"></i> {/* FontAwesome paper plane icon */}
      </button>
    </form>
  );
};

export default PromptInput;
