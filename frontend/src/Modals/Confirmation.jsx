import React, { useState } from 'react';
import './Confirmation.css';  

const Confirmation = ({ isOpen, onClose, onConfirm, newStatus }) => {
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const handleConfirm = () => {
    try {
      onConfirm();
      setAlertMessage('Status changed successfully!');
      setAlertType('success');
    } catch (error) {
      setAlertMessage('Error changing status.');
      setAlertType('error');
    }

    setTimeout(() => {
      setAlertMessage('');
      onClose();
    }, 2000); 
  };

  if (!isOpen) return null; 

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Status Change</h2>
        <p>
          Are you sure you want to change the student's status to 
          <span className="status-pill">{newStatus}</span>?
        </p>
        <div className="modal-actions">
          <button className="btn-confirm" onClick={handleConfirm}>Confirm</button>
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
        </div>

        {/* Display alert message if exists */}
        {alertMessage && (
          <div className={`alert-message ${alertType}`}>
            {alertMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Confirmation;
