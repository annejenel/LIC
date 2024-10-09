import React, { useState, useEffect } from 'react';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import AddIcon from '@mui/icons-material/Add';
import Header from '../Components/Header.jsx';
import SnackbarComponent from '../Components/SnackbarComponent.jsx';

import AddStaffModal from '../Modals/AddStaff'; // Import the modal component
import './ManageStaff.css';

const ManageStaff = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [staffList, setStaffList] = useState([]); // State to hold staff list
  const [error, setError] = useState(null); // State to hold error messages
  const [selectedUsername, setSelectedUsername] = useState(null); // State to hold the selected staff ID
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
};
  // Function to fetch staff list
  const fetchStaffList = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/staff/'); // Adjust URL as needed
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json();
        setStaffList(data); // Update staffList state with fetched data
    } catch (error) {
        console.error('Failed to fetch staff list:', error);
        setError('Failed to fetch staff list'); // Set error message
    }
  };

  // Fetch staff list when the component mounts
  useEffect(() => {
    fetchStaffList();
  }, []);

  const handleAddStaff = async (newStaff) => {
  try {
    const response = await fetch('http://localhost:8000/api/staff/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStaff),
    });

    const data = await response.json();

    if (!response.ok) {
      // If the response is not okay, throw an error with the alert message
      throw new Error(data.alert.message || 'Failed to add staff.');
    }

    // Display success alert
    setAlert({ type: 'success', message: data.alert.message });
    setSnackbarOpen(true); // Open the Snackbar
    await fetchStaffList(); // Optionally refresh the staff list
  } catch (error) {
    // Display error alert
    setAlert({ type: 'error', message: error.message });
    setSnackbarOpen(true); // Open the Snackbar for error message
  }
};


  // Handle row click to show selected staff ID in the left table
  const handleRowClick = (username) => {
    // If the same staff ID is clicked again, clear the selection
    if (selectedUsername === username) {
      setSelectedUsername(null); // Clear selection
      return; // Exit the function
    }

    setLoading(true); // Set loading state
    setSelectedUsername(username); // Set the selected staff ID

    // Simulate loading delay
    setTimeout(() => {
      setLoading(false); // Reset loading state after 2 seconds
    }, 2000);
  };

  return (
  
  <div className="containerStaff">
      <Header/>
        <Typography
          component="h1"
          className="header-text"
          sx={{
            textAlign: 'center',
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#a94442',
            margin: '20px 0',
          }}
        >
          MANAGE LIC STAFF
        </Typography>

        <div className="hello-world-container">
          <div className="add-staff-button">
            <Button
              startDecorator={<AddIcon />}
              sx={{
                backgroundColor: '#28a745',
                color: 'white',
                fontSize: '12px',
                '&:hover': {
                  backgroundColor: '#218838',
                },
              }}
              onClick={() => setIsModalOpen(true)} // Open the modal on click
            >
              Add Staff
            </Button>
          </div>

          {/* Render the AddStaffModal */}
          <AddStaffModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)} // Close the modal
            onAddStaff={handleAddStaff} // Pass the add staff handler
          />

          {/* Display error message if there is one */}
          {error && (
            <Typography sx={{ color: 'red', textAlign: 'center' }}>
              {error}
            </Typography>
          )}

          <div className="table-container">
            <div className="table">
            <SnackbarComponent 
                open={snackbarOpen} 
                handleClose={handleSnackbarClose} 
                alert={alert} 
            />
              {/* Left table for transactions */}
              <div className="transaction-table">
                <table>
                  <thead>
                    <tr>
                      <th>Logs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td>Loading...</td>
                      </tr>
                    ) : selectedUsername ? (
                      <tr>
                        <td>{`Selected Staff ID: ${selectedUsername}`}</td>
                      </tr>
                    ) : (
                      <tr>
                        <td>No logs yet...</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="table">
              {/* Render the staff list here */}
              <div className="staff-table">
                <table>
                  <thead>
                    <tr>
                      <th>Staff ID</th>
                      <th>Name</th>
                      {/* Add more columns as needed */}
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.length > 0 ? (
                      staffList.map((staff) => (
                        <tr 
                          key={staff.username} 
                          onClick={() => handleRowClick(staff.username)} 
                          style={{ cursor: 'pointer' }}
                        >
                          <td>{staff.username}</td>
                          <td>{staff.name}</td>
                          {/* Add more cells as needed */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2">No staff members found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      
    </div>

  );
};

export default ManageStaff;