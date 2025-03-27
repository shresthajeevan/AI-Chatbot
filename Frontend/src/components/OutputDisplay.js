import React, { useEffect, useState, useRef } from 'react';

const OutputDisplay = ({ output }) => {
  const [displayedOutput, setDisplayedOutput] = useState('');
  const outputRef = useRef(null);

  useEffect(() => {
    // Ensure output is a string
    const responseText = output || ''; 
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex <= responseText.length) {
        setDisplayedOutput(responseText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 25); // Smooth typing animation

    return () => clearInterval(interval);
  }, [output]); // Depend on the output prop

  // Auto-scroll to bottom when new output is displayed
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [displayedOutput]);

  return (
    <div className="output-display" ref={outputRef}>
      <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
        {displayedOutput}
      </pre>
    </div>
  );
};

export default OutputDisplay;
