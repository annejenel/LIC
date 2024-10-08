import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Dropdown from "@mui/joy/Dropdown";
import ListDivider from "@mui/joy/ListDivider";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Typography from "@mui/joy/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { Container, TextField } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import Header from '../Components/Header.jsx';
import "./Settings.css";
const Settings = () => {
  const navigate = useNavigate();

  //Handle Logout
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/logout/"); // Adjust the URL to your logout endpoint
      // On success, navigate to the login page or home page
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  //State to store form values
  const [formValues, setFormValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  //Handle reset button click
  const handleReset = () => {
    //Clear all form values
    setFormValues({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  //Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <>
    <Header></Header>
      <div className="containerSettings">
        <Sheet variant="outlined" className="sheet">
          {/* Header Section */}
          
          <Container maxWidth="sm" className="passwordForm">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                mt: 4,
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Change Password
              </Typography>
              <TextField
                label="Current Password"
                variant="outlined"
                type="password"
                name="currentPassword"
                value={formValues.currentPassword}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="New Password"
                variant="outlined"
                type="password"
                name="newPassword"
                value={formValues.newPassword}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Confirm Password"
                variant="outlined"
                type="password"
                name="confirmPassword"
                value={formValues.confirmPassword}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  width: "auto",
                }}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{
                    mt: 2,
                    "&:hover": {
                      color: "#FFD000",
                    },
                  }}
                  onClick={handleReset}
                >
                  Reset
                </Button>

                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    mt: 2,
                    backgroundColor: "#89343B",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#b04049",
                    },
                  }}
                >
                  Change
                </Button>
              </Box>
            </Box>
          </Container>
        </Sheet>
      </div>

      {/* Change Password Form */}
    </>
  );
};

export default Settings;