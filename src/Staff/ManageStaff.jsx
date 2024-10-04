import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Sheet from '@mui/joy/Sheet';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Dropdown from '@mui/joy/Dropdown';
import IconButton from '@mui/joy/IconButton';
import ListDivider from '@mui/joy/ListDivider';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Typography from '@mui/joy/Typography';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import InsightsTwoTone from '@mui/icons-material/InsightsTwoTone';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';

import AddStaffModal from '../Modals/AddStaff'; // Import the modal component
import './ManageStaff.css';

const ManageStaff = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [staffList, setStaffList] = useState([]); // State to hold staff list
  const [error, setError] = useState(null); // State to hold error messages
  const [selectedStaffID, setSelectedStaffID] = useState(null); // State to hold the selected staff ID
  const [loading, setLoading] = useState(false); // State to manage loading state
  const navigate = useNavigate(); 

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
      throw new Error(data.alert.message || 'Failed to add staff member.');
    }

    // Display success alert
    alert(data.alert.message); // Use a more sophisticated alert if necessary
    await fetchStaffList(); // Optionally refresh the staff list
  } catch (error) {
    // Display error alert
    alert(error.message); // Show error message in alert
  }
};


  // Handle row click to show selected staff ID in the left table
  const handleRowClick = (staffID) => {
    // If the same staff ID is clicked again, clear the selection
    if (selectedStaffID === staffID) {
      setSelectedStaffID(null); // Clear selection
      return; // Exit the function
    }

    setLoading(true); // Set loading state
    setSelectedStaffID(staffID); // Set the selected staff ID

    // Simulate loading delay
    setTimeout(() => {
      setLoading(false); // Reset loading state after 2 seconds
    }, 2000);
  };

  return (
    <div className="container">
      <Sheet variant="outlined" className="sheet">
        {/* Header Section */}
        <Sheet
          variant="solid"
          className="header"
          sx={{
            backgroundColor: "#ffd000",
            borderRadius: "0",
            marginTop: "0",
            top: 0,
            left: 0,
            zIndex: 1000,
          }}
        >
          <Box className="logo" />
          <Typography
            component="div"
            sx={{ marginLeft: "16px", textAlign: "left", fontSize: "20px" }}
          >
            <div>LIC Connect</div>
            <div>Library Internet Center</div>
          </Typography>

          <Box className="header-content">
            <Dropdown>
              <MenuButton
                className="menu-button"
                sx={{
                  "--Button-radius": "1.5rem",
                  backgroundColor: "#89343b",
                  color: "white",
                  fontSize: "12px",
                  "&:hover": {
                    color: "#89343b",
                    backgroundColor: "white",
                  },
                }}
                variant="outlined"
                endDecorator={<KeyboardArrowDownIcon />}
              >
                Manage Staff
              </MenuButton>
              <Menu
                variant="outlined"
                placement="bottom-start"
                disablePortal
                size="sm"
                sx={{
                  "--ListItemDecorator-size": "24px",
                  "--ListItem-minHeight": "40px",
                  "--ListDivider-gap": "4px",
                  minWidth: 200,
                  fontSize: "12px",
                }}
              >
                <MenuItem>
                  <ListItemDecorator>
                    <ManageAccountsIcon />
                  </ListItemDecorator>
                  Account
                </MenuItem>
                <ListDivider />
                <MenuItem onClick={() => navigate("/dashboard")}>
                  Dashboard
                </MenuItem>
                <MenuItem onClick={() => navigate("/settings")}>
                  Settings
                </MenuItem>
              </Menu>
            </Dropdown>

            <Box
              className="analytics-container"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Button
                className="analytics-button"
                sx={{
                  marginLeft: "8px",
                  backgroundColor: "transparent",
                  border: "2px solid #89343b",
                  color: "#89343b",
                  marginRight: "50px",
                  "&:hover": {
                    color: "white",
                    backgroundColor: "#89343b",
                    borderColor: "#89343b",
                  },
                }}
              >
                <InsightsTwoTone />
              </Button>
              {showTooltip && (
                <div className="tooltip-text">View Analytics</div>
              )}
            </Box>
          </Box>

          <Box className="header-actions">
            <IconButton
              variant="none"
              className="logout"
              sx={{
                color: "#89343b",
              }}
            >
              <ExitToAppOutlinedIcon />
            </IconButton>
          </Box>
        </Sheet>

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
              <Typography className="table-title">
                STAFF/NAS TRANSACTION
              </Typography>
              {/* Left table for transactions */}
              <div className="transaction-table">
                <table>
                  <thead>
                    <tr>
                      <th>Transaction Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td>Loading...</td>
                      </tr>
                    ) : selectedStaffID ? (
                      <tr>
                        <td>{`Selected Staff ID: ${selectedStaffID}`}</td>
                      </tr>
                    ) : (
                      <tr>
                        <td>No transactions yet.</td>
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
                          key={staff.staffID} 
                          onClick={() => handleRowClick(staff.staffID)} 
                          style={{ cursor: 'pointer' }}
                        >
                          <td>{staff.staffID}</td>
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
      </Sheet>
    </div>
  );
};

export default ManageStaff;
