import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';

const Sidebar = ({ history, onHistoryItemClick, onEditHistory, onDeleteHistory }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState(null);
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState(null);
  const [hoveredAction, setHoveredAction] = useState(null);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleEdit = (index, e) => {
    e.stopPropagation();
    onEditHistory(history[index]);
    setActiveItemIndex(null);
  };

  const handleDelete = (index, e) => {
    e.stopPropagation();
    onDeleteHistory(history[index]);
    setActiveItemIndex(null);
  };

  const handleHistoryClick = (index, query) => {
    setSelectedHistoryIndex(index);
    onHistoryItemClick(query);
  };

  return (
    <>
      {/* Sidebar Content - completely removed from DOM when collapsed */}
      {!isCollapsed && (
        <div 
          style={{
            width: '260px',
            padding: '12px',
            position: 'fixed',
            top: 0,
            backgroundColor: '#fafafa',
            left: 0,
            bottom: 0,
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            borderRight: '1px solid #e0e0e0',
          }}
        >
          <h3 style={{
            fontSize: '14px',
            margin: '0 0 16px 8px',
            color: '#555',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            paddingTop: '12px'
          }}>Chat History</h3>
          
          <ul style={{ 
            padding: 0,
            margin: 0,
            listStyle: 'none'
          }}>
            {history.map((item, index) => (
              <li 
                key={index}
                onClick={() => handleHistoryClick(index, item.query)}
                style={{
                  position: 'relative',
                  fontSize: '13px',
                  color: '#333',
                  padding: '8px 8px 8px 12px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'background-color 0.2s ease',
                  backgroundColor: selectedHistoryIndex === index ? '#e8e8e8' : 'transparent',
                }}
              >
                {/* One Line Text without ellipsis */}
                <div style={{
                  flex: 1,
                  whiteSpace: 'nowrap', // One line only
                  overflow: 'hidden',   // Hide overflow
                }}>
                  {item.query}
                </div>

                {/* Three dots menu button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveItemIndex(activeItemIndex === index ? null : index);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    color: '#666',
                  }}
                >
                  <FaEllipsisV size={14} />
                </button>

                {/* Edit/Delete dropdown with icons and hover effects */}
                {activeItemIndex === index && (
                  <div style={{
                    position: 'absolute',
                    right: '8px',
                    top: '32px',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    zIndex: 10,
                    minWidth: '120px',
                    overflow: 'hidden',
                  }}>
                    <div 
                      onClick={(e) => handleEdit(index, e)}
                      onMouseEnter={() => setHoveredAction('edit')}
                      onMouseLeave={() => setHoveredAction(null)}
                      style={{
                        padding: '8px 12px',
                        fontSize: '13px',
                        color: '#333',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: hoveredAction === 'edit' ? '#f0f0f0' : 'transparent',
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <FaEdit size={12} />
                      <span>Edit</span>
                    </div>
                    <div 
                      onClick={(e) => handleDelete(index, e)}
                      onMouseEnter={() => setHoveredAction('delete')}
                      onMouseLeave={() => setHoveredAction(null)}
                      style={{
                        padding: '8px 12px',
                        fontSize: '13px',
                        color: '#e74c3c',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: hoveredAction === 'delete' ? '#f0f0f0' : 'transparent',
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <FaTrash size={12} />
                      <span>Delete</span>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Larger Toggle Button positioned higher */}
      <div 
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          left: isCollapsed ? '0' : '260px',
          top: '16px',
          zIndex: 101,
          width: '24px',
          height: '40px',
          backgroundColor: '#f7f7f7',
          border: '1px solid #e0e0e0',
          borderLeft: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          borderRadius: '0 6px 6px 0',
          boxShadow: '1px 1px 3px rgba(0,0,0,0.1)',
          transition: 'left 0.3s ease, background-color 0.2s ease',
        }}
      >
        {isCollapsed ? (
          <FaChevronRight size={14} style={{ color: '#555' }} />
        ) : (
          <FaChevronLeft size={14} style={{ color: '#555' }} />
        )}
      </div>
    </>
  );
};

export default Sidebar;
