import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sheet from '@mui/joy/Sheet';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Dropdown from '@mui/joy/Dropdown';
import Input from '@mui/joy/Input';
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
import SearchIcon from '@mui/icons-material/Search';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import InsightsTwoTone from '@mui/icons-material/InsightsTwoTone';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import HistoryEduRoundedIcon from '@mui/icons-material/HistoryEduRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import EditAttributesTwoToneIcon from '@mui/icons-material/EditAttributesTwoTone';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import './Dashboard.css';

const theme = extendTheme({
  components: {
    JoyTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'Poppins, sans-serif',
          fontSize: '15px',
          fontWeight: 'bold',
          color: '#a94442',
        },
      },
    },
    JoySheet: {
      styleOverrides: {
        root: {
          '&.header': {
            backgroundColor: '#ffd404',
          },
        },
      },
    },
  },
});

const statusColors = {
  Active: 'success',
  Inactive: 'error',
  'Dropped Out': 'default'
};

export default function Dashboard() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [students, setStudents] = useState([]);
  const [statusDropdown, setStatusDropdown] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/api/students/')
      .then(response => {
        const fetchedStudents = response.data.map(student => ({
          ...student,
          timeLeft: formatTimeLeft(student.time_left),
          status: student.status || 'Change' 
        }));
        setStudents(fetchedStudents);
      })
      .catch(error => {
        console.error('Error fetching student data:', error);
      });
  }, []);

  const formatTimeLeft = (timeLeft) => {
    const hours = Math.floor(timeLeft / 60);
    const minutes = timeLeft % 60;
    return `${hours} hours ${minutes} minutes`;
  };

  const handleStatusChange = (studentID, newStatus) => {
    setStudents(students.map(student =>
      student.studentID === studentID ? { ...student, status: newStatus } : student
    ));
    // if i saved ang stats to db
  };

  return (
    <CssVarsProvider theme={theme}>
      <div className="container">
        <Sheet
          variant="outlined"
          className="sheet"
          sx={{ backgroundColor: '#fff0f2',
            padding: '20px',
            width: '100%',  
            height: '100%',            
        
           }}
        >
          {/* Header Section */}
          <Sheet
            variant="solid"
            className="header"
            sx={{ backgroundColor: '#ffd000', }}
          >
            <Box className="logo" />
            <Typography
              component="div"
              sx={{ marginLeft: '16px', textAlign: 'left', fontSize: '20px' }}
            >
              <div>LIC Connect</div>
              <div>Library Internet Center</div>
            </Typography>

            <Box className="header-content">
              <Dropdown>
                <MenuButton
                  className="menu-button"
                  sx={{
                    '--Button-radius': '1.5rem',
                    backgroundColor: '#89343b',
                    color: 'white',
                    fontSize: '12px',
                    '&:hover': {
                      color: '#89343b',
                      backgroundColor: 'white',
                    },
                  }}
                  variant="outlined"
                  endDecorator={<KeyboardArrowDownIcon />}
                >
                  Dashboard
                </MenuButton>
                <Menu
                  variant="outlined"
                  placement="bottom-start"
                  disablePortal
                  size="sm"
                  sx={{
                    '--ListItemDecorator-size': '24px',
                    '--ListItem-minHeight': '40px',
                    '--ListDivider-gap': '4px',
                    minWidth: 200,
                    fontSize: '12px'
                  }}
                >
                  <MenuItem>
                    <ListItemDecorator>
                      <ManageAccountsIcon />
                    </ListItemDecorator>
                    Account
                  </MenuItem>
                  <ListDivider />
                  <MenuItem onClick={() => navigate('/staff')}>
                    Manage Staff
                  </MenuItem>
                  <MenuItem>Settings</MenuItem>
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
                    marginLeft: '8px',
                    backgroundColor: 'transparent',
                    border: '2px solid #89343b',
                    color: '#89343b',
                    marginRight: '50px',
                    '&:hover': {
                      color: 'white',
                      backgroundColor: '#89343b',
                      borderColor: '#89343b',
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
              <IconButton variant="none" className="logout"
              sx={{
                color: '#89343b'
              }}>
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Sheet>

          {/* Search and Add Student Section */}
          <Box
            className="actions-container"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '95%',
              padding: '10px',
            }}
          >
            <Button
              startDecorator={<AddIcon />}
              sx={{
                backgroundColor: '#89343b',
                color: 'white',
                fontSize: '12px',
                '&:hover': {
                  color: '#89343b',
                  backgroundColor: '#ffd000',
                  borderColor: '#a94442',
                },
                height: '20px'
              }}
            >
              Add Student
            </Button>

            <Input
              placeholder="Search for student ID..."
              variant="soft"
              size="sm"
              endDecorator={<SearchIcon />}
              className="search-input"
              sx={{
                width: '250px',
                height: '20px',
                fontSize: '13px'
              }}
            />
          </Box>

          {/* Student Table */}
          <Box className="tables"> 
            <Typography level="h6" className="studentlist">Student List</Typography>
            {students.length === 0 ? (
              <p>No students available</p>
            ) : (
              <div className="table-wrapper">
                <table className="student-table">
                  <thead>
                    <tr>
                      <th>STUDENT ID</th>
                      <th>NAME</th>
                      <th>COURSE</th>
                      <th>TIME LEFT</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.studentID}>
                        <td>{student.studentID}</td>
                        <td>{student.name}</td>
                        <td>{student.course}</td>
                        <td>{student.timeLeft}</td>
                        <td>
                          <Dropdown>
                            <IconButton>
                              <EditAttributesTwoToneIcon />
                            </IconButton>
                            <Menu
                              variant="outlined"
                              placement="bottom-start"
                              disablePortal
                              size="sm"
                            >
                              <MenuItem onClick={() => handleStatusChange(student.studentID, 'Active')}>
                                <Chip label="Active" color={statusColors.Active} />
                              </MenuItem>
                              <MenuItem onClick={() => handleStatusChange(student.studentID, 'Inactive')}>
                                <Chip label="Inactive" color={statusColors.Inactive} />
                              </MenuItem>
                              <MenuItem onClick={() => handleStatusChange(student.studentID, 'Dropped Out')}>
                                <Chip label="Dropped Out" color={statusColors['Dropped Out']} />
                              </MenuItem>
                            </Menu>
                          </Dropdown>
                        </td>
                        <td>
                          <IconButton>
                            <HistoryEduRoundedIcon />
                          </IconButton>
                          <IconButton>
                            <PaymentsRoundedIcon />
                          </IconButton>
                          <IconButton>
                            <BorderColorRoundedIcon />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Box>
        </Sheet>
        
      </div>
    </CssVarsProvider>
  );
}
