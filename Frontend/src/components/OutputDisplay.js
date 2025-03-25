import React, { useEffect, useState, useRef } from 'react';

const OutputDisplay = ({ output }) => {
  const [displayedOutput, setDisplayedOutput] = useState('');
  const outputRef = useRef(null);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= output.length) {
        setDisplayedOutput(output.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 25); // Smooth typing animation

    return () => clearInterval(interval);
  }, [output]);

  // Auto-scroll to bottom on new output
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
