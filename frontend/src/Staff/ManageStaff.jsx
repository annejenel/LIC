import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Dropdown from "@mui/joy/Dropdown";
import Input from "@mui/joy/Input";
import IconButton from "@mui/joy/IconButton";
import ListDivider from "@mui/joy/ListDivider";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Typography from "@mui/joy/Typography";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SearchIcon from "@mui/icons-material/Search";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import InsightsTwoTone from "@mui/icons-material/InsightsTwoTone";
import axios from "axios";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import "./ManageStaff.css";

const theme = extendTheme({
  components: {
    JoyTypography: {
      styleOverrides: {
        root: {
          fontFamily: "Poppins, sans-serif",
          fontSize: "20px",
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

const ManageStaff = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate(); // Hook to navigate programmatically
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/logout/"); // Adjust the URL to your logout endpoint
      // On success, navigate to the login page or home page
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <CssVarsProvider theme={theme}>
      <div className="container">
        <Sheet
          variant="outlined"
          className="sheet"
          sx={{ backgroundColor: "#fff0f2" }}
        >
          <Sheet
            variant="solid"
            className="header"
            sx={{ backgroundColor: "#ffd404" }}
          >
            <Box className="logo" />
            <Typography
              component="div"
              sx={{ marginLeft: "16px", textAlign: "left" }}
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
                    backgroundColor: "#B53737",
                    color: "white",
                    fontSize: "20px",
                    "&:hover": {
                      color: "#a94442",
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
                    fontSize: "20px",
                  }}
                >
                  <MenuItem>
                    <ListItemDecorator>
                      <ManageAccountsIcon />
                    </ListItemDecorator>
                    Account
                  </MenuItem>
                  <ListDivider />
                  {/* Add onClick to navigate back to Dashboard */}
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
                    border: "2px solid #a94442",
                    color: "#a94442",
                    marginRight: "50px",
                    "&:hover": {
                      color: "white",
                      backgroundColor: "#a94442",
                      borderColor: "#a94442",
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
              <Dropdown>
                <MenuButton
                  variant="none"
                  className="logout"
                  sx={{
                    color: "#89343b",
                  }}
                >
                  <MoreVertIcon />
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
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Dropdown>
            </Box>
          </Sheet>

          <Typography
            component="h1"
            className="header-text"
            sx={{
              textAlign: "center",
              fontSize: "36px",
              fontWeight: "bold",
              color: "#a94442",
              margin: "20px 0",
            }}
          >
            MANAGE LIC STAFF
          </Typography>

          <div className="hello-world-container">
            <div className="add-staff-button">
              <Button
                startDecorator={<AddIcon />}
                sx={{
                  backgroundColor: "#28a745",
                  color: "white",
                  fontSize: "17px",
                  "&:hover": {
                    backgroundColor: "#218838",
                  },
                }}
              >
                Add Staff
              </Button>
            </div>

            <div className="table-container">
              <div className="table">
                <Typography className="table-title">
                  STAFF/ NAS TRANSACTION
                </Typography>
              </div>
              <div className="table">
                <Typography className="table-title">STAFF TABLE</Typography>
              </div>
            </div>
          </div>
        </Sheet>
      </div>

      <Sheet>hello</Sheet>
    </CssVarsProvider>
  );
};

export default ManageStaff;