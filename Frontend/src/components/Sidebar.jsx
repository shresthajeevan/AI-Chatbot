import React from 'react';

const Sidebar = ({ history, onHistoryItemClick }) => {
  return (
    <div className="sidebar">
      <h3>History</h3>
      <ul>
        {history.map((item, index) => (
          <li key={index} onClick={() => onHistoryItemClick(item.query)} className="history-item">
            {/* Display the query and response */}
            <div><strong></strong>{item.query}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
