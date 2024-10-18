import React, { useState } from 'react';
import './Confirmation.css';

const Confirmation = ({ isOpen, onClose, onConfirm, newStatus }) => {
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleConfirm = () => {
    try {
      onConfirm(); // Call the confirm function from the parent
      setAlertMessage('Status changed successfully!');
      setAlertType('success');
      setSnackbarVisible(true);
    } catch (error) {
      // Handle error state
      setAlertMessage('Error changing status.');
      setAlertType('error');
      setSnackbarVisible(true);
    }
  
    // Close the modal only after showing the snackbar for a bit
    setTimeout(() => {
      onClose(); // Close the modal
      setSnackbarVisible(false);
    }, 2000);
  };
  
  

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Content */}
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Confirm Status Change</h2>
          <p>
            Are you sure you want to change the student's status to
            <span className="status-pill">{newStatus}</span>?
          </p>
          <div className="modal-actions">
            <button className="btn-confirm" onClick={handleConfirm}>
              Confirm
            </button>
            <button className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Snackbar/Alert outside the modal */}
      <div className={`snackbar ${alertType} ${snackbarVisible ? 'show' : ''}`}>
        {alertMessage}
      </div>
    </>
  );
};

export default Confirmation;
