import React, { useEffect, useState } from "react";
import './EditStudentAction.css';
import axios from 'axios';


export default function EditStudentModal({ isOpen, onClose, studentID, username }) {
    const [isLoading, setIsLoading] = useState(false);
    const [currentPasswordIsDefault, setCurrentPasswordIsDefault] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [isSnackbarVisible, setIsSnackbarVisible] = useState(false); 


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
            <div className="resetpass_modal-overlay">
                <div className="resetpass_modal-content">
                    <div className="resetpass_modal-header">
                        <h2 className="resetpass_header-title">
                           Reset Password
                        </h2>
                    </div>
                    <div className="resetpass_modal-body">
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : (
                            <p>
                                Are you sure you want to Reset student <strong>{studentID}</strong>'s password?
                                
                            </p>
                        )}
                    </div>
                    <div className="resetpass_modal-footer">
                        <button className="resetpass_confirm-button" onClick={handleResetPassword} disabled={isLoading}>
                            Yes
                        </button>
                        <button className="resetpass_cancel-button" onClick={onClose} disabled={isLoading}>
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
