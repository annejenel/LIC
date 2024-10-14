import React, { useState, useEffect } from 'react';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import AddIcon from '@mui/icons-material/Add';
import Header from '../Components/Header.jsx';
import SnackbarComponent from '../Components/SnackbarComponent.jsx';
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import AddStaffModal from '../Modals/AddStaff'; // Import the modal component
import './ManageStaff.css';
import Dropdown from "@mui/joy/Dropdown";
import MenuButton from "@mui/joy/MenuButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

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
        const response = await fetch('http://localhost:8000/api/staffview/'); // Adjust URL as needed
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
    const response = await fetch('http://localhost:8000/api/create-user/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStaff),
    });

    const data = await response.json();

    if (!response.ok) {
      // If the response is not okay, throw an error with the alert message
      throw new Error(data.alert?.message || 'Failed to add staff.');
    }

    // Display success alert
    setAlert({ type: 'success', message: data.alert?.message || 'Staff added successfully!'});
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

  // Handle Staff Status Change
  const handleStatusChange = async (username, newStatus) => {
    console.log("Updating status for:", username, "to:", newStatus); // Debugging line
    try {
      const response = await fetch(`http://localhost:8000/api/update-status/${username}/`, { // Adjust URL as needed
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Refresh the staff list to reflect changes
      await fetchStaffList();
      setAlert({ type: 'success', message: 'Status updated successfully!' });
      setSnackbarOpen(true);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
      setSnackbarOpen(true);
    }
  };
  return (
  
  <div>
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
    <SnackbarComponent 
                open={snackbarOpen} 
                handleClose={handleSnackbarClose} 
                alert={alert} 
            />
      <Header/>
      <div className="staff-container">
        
        <div className="staff-container-body">

          <div className="staff-container-content">
           
            {/* Render the staff list here */}
            <div className="staff-table">
            <div className='staff-container-header'>
          <Typography
            component="h1"
            sx={{
              fontSize: '36px',
              fontWeight: 'normal',
              color: '#a94442',
              
            }}
          >STAFF
          </Typography>
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
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Status</th>
                      
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
                          <td>{staff.first_name}</td>
                          <td>{staff.username}</td>
                          <td>
                          <Dropdown>
                            <MenuButton
                            variant="outlined"
                            endDecorator={<KeyboardArrowDownIcon />}>
                            {staff.is_active ? 'Active' : 'Inactive'}
                            </MenuButton>
                            <Menu>
                              <MenuItem onClick={() => handleStatusChange(staff.username, true)}>Active</MenuItem>
                              <MenuItem onClick={() => handleStatusChange(staff.username, false)}>Inactive</MenuItem>
                            </Menu>
                          </Dropdown>
                          </td>
                          
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
              
              {/* Left table for transactions */}
              <div className="logs-table">
              <Typography
            component="h1"
            sx={{
              fontSize: '36px',
              fontWeight: 'normal',
              color: '#a94442',
            }}
          >LOGS
          </Typography>
                <table>
                  <thead>
                    <tr>
                      
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
        </div>
        </div>
    </div>

  );
};

export default ManageStaff;