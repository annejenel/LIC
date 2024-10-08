import React, { useEffect, useState } from "react";
import './EditStudentAction.css';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import axios from 'axios';

export default function EditStudentModal({ isOpen, onClose, studentID, onPasswordReset }) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPasswordIsDefault, setCurrentPasswordIsDefault] = useState(false);

  useEffect(() => {
    if (isOpen && studentID) {
      const fetchPasswordStatus = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`/api/students/${studentID}/password/`);
          setCurrentPasswordIsDefault(response.data.is_default);
        } catch (error) {
          console.error("Error fetching password status:", error.response ? error.response.data : error.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPasswordStatus();
    }
  }, [isOpen, studentID]);

  const handleResetPassword = async (studentID) => {
    try {
        const response = await axios.post(`http://localhost:8000/api/students/${studentID}/reset-password/`);
        console.log("Password reset response:", response.data);
        // Optionally, show a success notification
        alert("Password reset successful.");
    } catch (error) {
        // Check if error response exists and log it
        console.error("Error resetting password:", error.response ? error.response.data : error.message);
        
        // Display error message based on the response
        if (error.response && error.response.data.message) {
            alert(error.response.data.message); // Show the error message from the server
        } else {
            alert("An error occurred while resetting the password."); // Generic error message
        }
    }
};



  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="header-title">
              <span className="warning-icon" role="img" aria-label="warning">⚠️</span>
              Warning
              <button className="close-button" onClick={onClose}>
                <HighlightOffIcon />
              </button>
            </h2>
          </div>
          <div className="modal-body">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <p>
                Are you sure you want to reset student ID: <strong>{studentID}</strong>'s password?
                This action is not reversible!
              </p>
            )}
          </div>
          <div className="modal-footer">
            <button className="confirm-button" onClick={() => handleResetPassword(studentID)} disabled={isLoading}>
              Yes
            </button>
            <button className="cancel-button" onClick={onClose} disabled={isLoading}>
              No
            </button>
          </div>
        </div>
      </div>
    )
  );
}
