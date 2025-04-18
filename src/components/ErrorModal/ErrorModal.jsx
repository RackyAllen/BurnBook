import React from 'react';
import './style.css';

export const ErrorModal = ({ message, onClose }) => {
  return (
    <div className="error-modal-overlay" onClick={onClose}>
      <div className="error-modal" onClick={e => e.stopPropagation()}>
        <div className="error-modal-content">
          <p>{message}</p>
          <button className="error-modal-close" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
}; 