import React from 'react';

const Sidebar = ({ history, onHistoryItemClick }) => {
  return (
    <div className="sidebar">
      <h3>History</h3>
      <ul>
        {history.map((item, index) => (
          <li key={index} onClick={() => onHistoryItemClick(item)}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;