import React, { useState, useEffect, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Dropdown from "@mui/joy/Dropdown";
import Input from "@mui/joy/Input";
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Typography from "@mui/joy/Typography";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import HistoryEduRoundedIcon from "@mui/icons-material/HistoryEduRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import Header from '../Components/Header.jsx';
import Confirmation from '../Modals/Confirmation.jsx';


// Lazy load the modals
const AddStudent = lazy(() => import("../Modals/AddStudent"));
const StudentTransaction = lazy(() => import("../Modals/StudentTransaction"));
const TransactionHistory = lazy(() => import("../Modals/TransactionHistory"));
const AddNewSem = lazy(() => import("../Modals/AddNewSem"));
const Import = lazy(() => import("../Modals/ImportStudents"));
import EditStudentAction from '../Modals/EditStudentAction';
import Footer from '../Components/Footer.jsx';

import "../Modals/AddNewSem.css";
import "./Dashboard.css";
import "../Modals/AddStudent.css";
import "../Modals/ImportStudents.css";
import ImportStudents from "../Modals/ImportStudents";

const theme = extendTheme({
  components: {
    JoyTypography: {
      styleOverrides: {
        root: {
          fontFamily: "Poppins, sans-serif",
          fontSize: "15px",
          fontWeight: "bold",
          color: "#a94442",
        },
      },
    },
    JoySheet: {
      styleOverrides: {
        root: {
          "&.header": {
            backgroundColor: "#ffd404",
          },
        },
      },
    },
  },
});

const statusColors = {
  Active: "success",
  Inactive: "error",
  "Dropped Out": "default",
};

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isAddNewSemOpen, setIsAddNewSemOpen] = useState(false);
  const [upload, setUpload] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedStudentID, setSelectedStudentID] = useState(null);
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [studentToChange, setStudentToChange] = useState(null);
  const [newStatus, setNewStatus] = useState('');



  const [isTransactionHistoryModalOpen, setIsTransactionHistoryModalOpen] =
    useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    // Reset to page 0 whenever the search query changes
    setCurrentPage(0);
  }, [searchQuery]);

  
  const formatTimeLeft = (timeLeft) => {
    const hours = Math.floor(timeLeft / 60);
    const minutes = timeLeft % 60;
    return `${hours} hours ${minutes} minutes`;
  };

  const fetchStudents = () => {
    setLoading(true);
    axios
      .get("http://localhost:8000/api/students/")
      .then((response) => {
        const fetchedStudents = response.data.map((student) => ({
          ...student,
          timeLeft: formatTimeLeft(student.time_left),
          status: student.status || "Change",
        }));
        setStudents(fetchedStudents);
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleStudentAdded = () => {
    fetchStudents();
  };

  const handleEditStudent = (studentID) => {
    setSelectedStudentID(studentID);
    setIsEditStudentModalOpen(true);
  };

  const closeEditStudentModal = () => {
    setIsEditStudentModalOpen(false);
    setSelectedStudentID(null); 
  };

  const handleStudentUpdated = () => {
    fetchStudents(); 
  };

  const handleStatusChange = (studentID, status) => {
    setStudentToChange(studentID);  
    setNewStatus(status);         
    setIsConfirmModalOpen(true);   
  };

  const confirmStatusChange = () => {
    const encodedStudentID = encodeURIComponent(studentToChange);
    const originalStudents = [...students];
  
    const updatedStudents = students.map((student) =>
      student.studentID === studentToChange
        ? { ...student, status: newStatus }
        : student
    );
    setStudents(updatedStudents);
  
    axios
      .patch(`http://localhost:8000/api/students/${encodedStudentID}/`, {
        status: newStatus,
      })
      .then((response) => {
        console.log("Status updated successfully:", response.data);
        fetchStudents();
      })
      .catch((error) => {
        console.error(
          "Error updating status:",
          error.response ? error.response.data : error.message
        );
        setStudents(originalStudents); 
      });

    setIsConfirmModalOpen(false);
  };
  

  const openAddStudentModal = () => setIsAddStudentModalOpen(true);
  const closeAddStudentModal = () => {setIsAddStudentModalOpen(false); console.log("Closing modal");}

  const openAddNewSem = () => {setIsAddNewSemOpen(true); console.log("Opening modal");}
  const closeAddNewSem = () => {setIsAddNewSemOpen(false); console.log("Closing modal");}

  const openUpload = () => {setUpload(true); console.log("Opening modal");}
  const closeUpload = () => {setUpload(false); console.log("Closing modal");}
  
  const openTransactionModal = (studentID) => {
    setSelectedStudentID(studentID);
    setIsTransactionModalOpen(true);
  };

  const closeTransactionModal = () => setIsTransactionModalOpen(false);
  const openTransactionHistoryModal = () =>
    setIsTransactionHistoryModalOpen(true);
  const closeTransactionHistoryModal = () =>
    setIsTransactionHistoryModalOpen(false);

  const handleConfirmStatusChange = () => {
    // Simulate the logic to change the status, e.g., an API call
    console.log('Status changed successfully!');
  };

  const filteredStudents = students.filter((student) =>
    student.studentID
      .toString()
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const paginatedStudents = filteredStudents.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    // Update page number if it exceeds the total number of pages
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [totalPages, currentPage]);

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0); 
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleTransactionCompleted = () => {
    console.log("Transaction completed!");
    fetchStudents();
  };

  return (
    <CssVarsProvider theme={theme}>
      <Header/>
      <div className="containerDashboard">
        <Sheet variant="outlined" className="sheet">
          {/* Header Section */}
          

          {/* Search and Add Student Section */}
          <Box
            className="actions-container"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "95%",
              padding: "10px",
            }}
          >
            <Box className="button-group">
              <Button
                startDecorator={<PersonAddAltIcon />}
                sx={{
                  backgroundColor: "#89343b",
                  color: "white",
                  fontSize: "12px",
                  "&:hover": {
                    color: "#89343b",
                    backgroundColor: "#ffd000",
                    borderColor: "#a94442",
                  },
                  height: "20px",
                  margin: 0,
                }}
                onClick={openAddStudentModal}
              >
                Add Student
              </Button>
              
              <Button
                startDecorator={<ReceiptLongIcon />}
                sx={{
                  backgroundColor: "#89343b",
                  color: "white",
                  fontSize: "12px",
                  "&:hover": {
                    color: "#89343b",
                    backgroundColor: "#ffd000",
                    borderColor: "#a94442",
                  },
                  height: "20px",
                  margin: 0,
                }}
                onClick={openTransactionHistoryModal} 
              >
                Transaction
              </Button>
              <Button
                startDecorator={<DriveFolderUploadIcon />}
                sx={{
                  backgroundColor: "#89343b",
                  color: "white",
                  fontSize: "12px",
                  "&:hover": {
                    color: "#89343b",
                    backgroundColor: "#ffd000",
                    borderColor: "#a94442",
                  },
                  height: "20px",
                  margin: 0,
                }}
                onClick={openUpload}  
              >
                Import
              </Button>
              <Button 
              startDecorator={<AddIcon />}
              sx={{                   
                  backgroundColor: "#89343b",
                  color: "white",                   
                  fontSize: "12px",
                  "&:hover": {
                    color: "#89343b",
                    backgroundColor: "#ffd000",
                    borderColor: "#a94442",
                  },
                  height: "20px",
                  margin: 0,  
                }} onClick={openAddNewSem}>New Semester</Button>    
            </Box>

            
            <Input
              placeholder="Search for student ID..."
              variant="soft"
              size="sm"
              endDecorator={<SearchIcon />}
              className="search-input"
              sx={{
                width: "250px",
                height: "20px",
                fontSize: "13px",
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Box>

          {/* Student Table */}
<Box className="tables">
  <Typography level="h6" className="studentlist">
    Student List
  </Typography>
  {loading ? (
    <p>Loading...</p>
  ) : filteredStudents.length === 0 ? (
    <p>No students available</p>
  ) : (
    <div className="table-wrapper">
      {/* Pagination Controls */}
      <div className="pagination">
        {/* Back Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          <ArrowBackIos />
        </button>

        {/* Page Numbers Logic */}
        {Array.from({ length: 3 }, (_, index) => {
          const startPage = Math.floor(currentPage / 3) * 3; 
          const pageIndex = startPage + index;

          if (pageIndex < totalPages) {
            return (
              <button
                key={pageIndex}
                onClick={() => handlePageChange(pageIndex)}
                className={currentPage === pageIndex ? "active" : ""}
              >
                {pageIndex + 1}
              </button>
            );
          } else {
            return null;
          }
        })}

        {/* Forward Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
        >
          <ArrowForwardIos />
        </button>
      </div>



                <table className="student-table">
                  <thead>
                    <tr>
                      <th>STUDENT ID</th>
                      <th>NAME</th>
                      <th>COURSE</th>
                      <th>TIME LEFT</th>
                      <th>TYPE</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStudents.map((student) => (
                      <tr key={student.studentID}>
                        <td>{student.studentID}</td>
                        <td>{student.name}</td>
                        <td>{student.course}</td>
                        <td>{student.timeLeft}</td>
                        <td>
                          <Dropdown>
                            <MenuButton
                              className="menu-button"
                              sx={{
                                "--Button-radius": "1.5rem",
                                backgroundColor:
                                  statusColors[student.status] || "default",
                                color:
                                  statusColors[student.status] === "default"
                                    ? "black"
                                    : "maroon",
                                fontSize: "12px",
                                "&:hover": {
                                  color: "#89343b",
                                  backgroundColor: "white",
                                },
                              }}
                              variant="outlined"
                              endDecorator={<KeyboardArrowDownIcon />}
                            >
                              {student.status}
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
                              <MenuItem
                                onClick={() =>
                                  handleStatusChange(
                                    student.studentID,
                                    "Student"
                                  )
                                }
                              >
                                Student
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  handleStatusChange(
                                    student.studentID,
                                    "Alumnus"
                                  )
                                }
                              >
                                Alumnus
                              </MenuItem>
                            </Menu>
                          </Dropdown>
                        </td>
                        <td>
                          <IconButton>
                            <HistoryEduRoundedIcon />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              openTransactionModal(student.studentID)
                            }
                          >
                            <PaymentsRoundedIcon />
                          </IconButton>
                          <IconButton onClick={() => handleEditStudent(student.studentID)}>
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
          <Footer/>
        </Sheet>

        {/* Modals */}
        <Suspense fallback={<div>Loading modals...</div>}>
          {isAddStudentModalOpen && (
            <AddStudent
              isOpen={isAddStudentModalOpen}
              onClose={closeAddStudentModal}
              onStudentAdded={handleStudentAdded}
            />
          )}
          {isTransactionModalOpen && (
            <StudentTransaction
              isOpen={isTransactionModalOpen}
              onClose={closeTransactionModal}
              studentID={selectedStudentID}
              onTransactionCompleted={handleTransactionCompleted}
            />
          )}
          {isTransactionHistoryModalOpen && (
            <TransactionHistory
              isOpen={isTransactionHistoryModalOpen}
              onClose={closeTransactionHistoryModal}
            />
          )}
          {isAddNewSemOpen && (
            <AddNewSem
              isOpen={isAddNewSemOpen}
              onClose={closeAddNewSem}
            />
          )}
          {upload && (
            <ImportStudents
              isOpen={upload}
              onClose={closeUpload}
            />
          )}
          {isEditStudentModalOpen && (
        <EditStudentAction
          isOpen={isEditStudentModalOpen}
          onClose={closeEditStudentModal}
          studentID={selectedStudentID}
          onPasswordReset={handleStudentUpdated}
        />
      )}

{isConfirmModalOpen && (
    <Confirmation
      isOpen={isConfirmModalOpen}
      onClose={() => setIsConfirmModalOpen(false)}
      onConfirm={handleConfirmStatusChange}
      newStatus={newStatus}
    />
  )}
        </Suspense>
      </div>
    </CssVarsProvider>
  );
}