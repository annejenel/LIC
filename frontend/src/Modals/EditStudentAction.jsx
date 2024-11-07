import React, { useEffect, useState } from "react";
import './EditStudentAction.css';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import axios from 'axios';

export default function EditStudentModal({ isOpen, onClose, studentID, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [currentPasswordIsDefault, setCurrentPasswordIsDefault] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [isSnackbarVisible, setIsSnackbarVisible] = useState(false); 
    const [staffUsername, setStaffUsername] = useState('');


    useEffect(() => {
        if (isOpen && studentID) {
            const fetchPasswordStatus = async () => {
                try {
                    setIsLoading(true);
                    const response = await axios.get(`/students/${studentID}/password/`);
                    setCurrentPasswordIsDefault(response.data.is_default);
                } catch (error) {
                    console.error("Error fetching password status:", error.response ? error.response.data : error.message);
                    setSnackbarMessage("Failed to fetch password status.");
                    setIsSnackbarVisible(true);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchPasswordStatus();
        }
    }, [isOpen, studentID]);



    const logActivity = async (action, username) => {
        const logData = {
            username: username,
            action: action,
            timestamp: new Date().toISOString(),
        };
    
        try {
            console.log("Logging activity with data: ", logData);  // For debugging
            // Ensure this is hitting the correct backend endpoint
            await axios.post('http://localhost:8000/api/activity-logs/', logData);
            console.log("Activity logged successfully");
        } catch (error) {
            console.error("Error logging activity:", error.response?.data || error.message);
        }
    };
    


  const handleResetPassword = async () => {
    try {
        const response = await axios.post(`http://localhost:8000/api/students/${studentID}/reset-password/`);
        setSnackbarMessage("Password reset successful!");
        setIsSnackbarVisible(true);

        await logActivity(`Reset password for student ${studentID}`, username);


        onClose(); 
    } catch (error) {
        if (error.response && error.response.data.message === 'Current password is already the default.') {
            setSnackbarMessage("The password is already set to default.");
        } else {
            setSnackbarMessage("Error resetting password.");
        }
        setIsSnackbarVisible(true);
        console.error("Error resetting password:", error.response ? error.response.data : error.message);
    }
};


  

    const handleCloseSnackbar = () => {
        setIsSnackbarVisible(false); 
    };

    useEffect(() => {
        if (isSnackbarVisible) {
            const timer = setTimeout(() => {
                handleCloseSnackbar();
            }, 3000); 

            return () => clearTimeout(timer); 
        }
    }, [isSnackbarVisible]);

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
                        <button className="confirm-button" onClick={handleResetPassword} disabled={isLoading}>
                            Yes
                        </button>
                        <button className="cancel-button" onClick={onClose} disabled={isLoading}>
                            No
                        </button>
                    </div>
                </div>

                {/* Snackbar for notifications */}
                {isSnackbarVisible && (
                    <div className="snackbar">
                        {snackbarMessage}
                        <button onClick={handleCloseSnackbar} className="snackbar-close-button">✖️</button>
                    </div>
                )}
            </div>
        )
    );
}
