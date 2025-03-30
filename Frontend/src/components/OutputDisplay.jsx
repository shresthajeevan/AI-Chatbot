import React, { useEffect, useState, useRef } from 'react';
import { FaCopy, FaRedo, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const OutputDisplay = ({ output, query, onRegenerate }) => {
  const [messages, setMessages] = useState([]);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [copied, setCopied] = useState(false);
  const [hoveringButton, setHoveringButton] = useState(null);
  const outputRef = useRef(null);

  // Enhanced text formatting with all requirements
  const formatText = (text) => {
    if (!text) return '';

    // Process code blocks first (```language\ncode\n```)
    let formattedText = text.replace(/```(\w+)?\n([\s\S]+?)\n```/g, (match, language, code) => {
      return `<div style="background:#1E1E1E;color:#F0F0F0;border-radius:6px;padding:12px;margin:12px 0;font-family:'Courier New',monospace;font-size:14px;position:relative;overflow-x:auto;">
        ${language ? `<div style="color:#A9B7C6;margin-bottom:8px;font-size:13px;font-weight:500;">${language}</div>` : ''}
        <pre style="margin:0;white-space:pre-wrap;">${code}</pre>
      </div>`;
    });

    // Process numbered lists
    const lines = formattedText.split('\n');
    let inOrderedList = false;
    let result = [];

    lines.forEach((line) => {
      const isNumberedListItem = /^\d+\.\s/.test(line);
      
      if (isNumberedListItem) {
        if (!inOrderedList) {
          result.push('<ol style="list-style-type:decimal;padding-left:24px;margin:12px 0;">');
          inOrderedList = true;
        }
        const content = line.replace(/^\d+\.\s/, '');
        result.push(`<li style="margin-bottom:8px;font-size:15px;line-height:1.6;">${content}</li>`);
      } else {
        if (inOrderedList) {
          result.push('</ol>');
          inOrderedList = false;
        }

        // Process special formatting
        let processedLine = line
          // Bold numbers (standalone numbers)
          .replace(/(^|\s)(\d+)(\s|$)/g, '$1<strong>$2</strong>$3')
          // Bold text in quotes ("text")
          .replace(/"([^"]+)"/g, '<strong>"$1"</strong>')
          // Bold important quotes (marked with **)
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          // Italic
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          // Inline code
          .replace(/`([^`]+)`/g, '<code style="background:#f0f0f0;padding:2px 4px;border-radius:3px;font-family:monospace;">$1</code>');

        if (processedLine.trim()) {
          result.push(`<p style="margin:12px 0;line-height:2;font-size:15px;text-align:justify;">${processedLine}</p>`);
        }
      }
    });

    if (inOrderedList) result.push('</ol>');
    return result.join('');
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleFeedback = (messageId, type) => {
    setFeedback((prev) => ({
      ...prev,
      [messageId]: prev[messageId] === type ? null : type,
    }));
  };

  useEffect(() => {
    if (query) {
      setMessages((prev) => [
        ...prev,
        {
          type: 'user',
          content: query,
          id: Date.now(),
        },
      ]);
    }
    if (output) {
      setIsTyping(true);
      setMessages((prev) => [
        ...prev,
        {
          type: 'ai',
          content: output,
          id: Date.now(),
        },
      ]);
      setTypingText('');
    }
  }, [query, output]);

  useEffect(() => {
    if (isTyping && messages.length > 0) {
      const currentMessage = messages[messages.length - 1];
      if (currentMessage.type !== 'ai') return;

      let index = 0;
      const messageLength = currentMessage.content.length;
      setTypingText(currentMessage.content.charAt(0));

      const typeEffect = setInterval(() => {
        setTypingText((prev) => prev + currentMessage.content.charAt(index));
        index++;

        if (index === messageLength) {
          clearInterval(typeEffect);
          setIsTyping(false);
        }
      }, 5);

      return () => clearInterval(typeEffect);
    }
  }, [isTyping, messages]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTo({
        top: outputRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, typingText]);

  return (
    <div
      className="chat-container"
      style={{
        width: '100%',
        maxWidth: '800px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 100px)',
          
      }}
    >
      <div
        className="chat-conversation"
        ref={outputRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {messages.map((message, index) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: message.type === 'user' ? 'flex-end' : 'flex-start',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                maxWidth: 'calc(100% - 40px)',
                width: 'fit-content',
                padding: '12px 16px',
                borderRadius:
                  message.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  // Removed background color
                color: 'black',
                textAlign: 'left',
                fontSize: '15px',
                lineHeight: '1.6',
              }}
              dangerouslySetInnerHTML={{
                __html:
                  message.type === 'ai' && index === messages.length - 1 && isTyping
                    ? formatText(typingText)
                    : formatText(message.content),
              }}
            />

            {/* Action buttons */}
            {message.type === 'ai' && !isTyping && index === messages.length - 1 && (
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '8px',
                  alignItems: 'center',
                  height: '28px',
                  padding: '4px 8px',
                  borderRadius: '14px',
                }}
              >
                {/* Copy Button */}
                <div
                  style={buttonWrapperStyle}
                  onMouseEnter={() => setHoveringButton('copy')}
                  onMouseLeave={() => setHoveringButton(null)}
                >
                  <button
                    onClick={() => handleCopy(message.content)}
                    style={buttonStyle(copied ? '#4CAF50' : '#666')}
                  >
                    <FaCopy />
                  </button>
                  {hoveringButton === 'copy' && <div style={tooltipStyle}>Copy</div>}
                </div>

                {/* Regenerate Button */}
                <div
                  style={buttonWrapperStyle}
                  onMouseEnter={() => setHoveringButton('regenerate')}
                  onMouseLeave={() => setHoveringButton(null)}
                >
                  <button onClick={onRegenerate} style={buttonStyle('#666')}>
                    <FaRedo />
                  </button>
                  {hoveringButton === 'regenerate' && (
                    <div style={tooltipStyle}>Regenerate</div>
                  )}
                </div>

                {/* Like Button */}
                <div
                  style={buttonWrapperStyle}
                  onMouseEnter={() => setHoveringButton('like')}
                  onMouseLeave={() => setHoveringButton(null)}
                >
                  <button
                    onClick={() => handleFeedback(message.id, 'like')}
                    style={buttonStyle(feedback[message.id] === 'like' ? '#4CAF50' : '#666')}
                  >
                    <FaThumbsUp />
                  </button>
                  {hoveringButton === 'like' && <div style={tooltipStyle}>Like</div>}
                </div>

                {/* Dislike Button */}
                <div
                  style={buttonWrapperStyle}
                  onMouseEnter={() => setHoveringButton('dislike')}
                  onMouseLeave={() => setHoveringButton(null)}
                >
                  <button
                    onClick={() => handleFeedback(message.id, 'dislike')}
                    style={buttonStyle(feedback[message.id] === 'dislike' ? '#F44336' : '#666')}
                  >
                    <FaThumbsDown />
                  </button>
                  {hoveringButton === 'dislike' && <div style={tooltipStyle}>Dislike</div>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


// Styles for buttons and tooltip
const buttonWrapperStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
};

const buttonStyle = (color) => ({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: color,
  fontSize: '15px',
  display: 'flex',
  alignItems: 'center',
  padding: '4px',
  gap: '6px',
  minWidth: '28px',
  height: '28px',
  justifyContent: 'center',
});

const tooltipStyle = {
  position: 'absolute',
  top: '28px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'rgba(0,0,0,0.8)',
  color: '#fff',
  padding: '4px 6px',
  borderRadius: '4px',
  fontSize: '13px',
  whiteSpace: 'nowrap',
  zIndex: 10,
};

export default OutputDisplay;