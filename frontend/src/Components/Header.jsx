import React, { useState } from 'react';
import { Sheet, Box, Typography, Dropdown, MenuButton, Menu, MenuItem, Button, CssVarsProvider, extendTheme, ListDivider, ListItemDecorator, IconButton } from '@mui/joy';
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import InsightsTwoToneIcon from '@mui/icons-material/InsightsTwoTone';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate, useLocation } from 'react-router-dom';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';

const theme = extendTheme({
  components: {
    JoyTypography: {
      styleOverrides: {
        root: {
          fontFamily: "Poppins, sans-serif",
          fontSize: "12px",
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

const Header = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine the current path and set the active page label
  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Manage Staff", path: "/staff" },
    { label: "Settings", path: "/settings" },
  ];

  const activePage = menuItems.find(item => location.pathname === item.path)?.label || "Analytics";

  return (
    <CssVarsProvider theme={theme}>
      <div>
        <Sheet variant="outlined" className="headerSheet">
          <Sheet
            variant="solid"
            className="header"
            sx={{
              backgroundColor: "#ffd000",
              borderRadius: "0",
              marginTop: "0",
              marginRight: "0",
              top: 0,
              left: 0,
              marginBottom: 0,
              zIndex: 1000,
            }}
            
          >
            <Box className="logo" />
            <Typography
              component="div"
              sx={{
                marginLeft: "0",
                paddingLeft: "0",
                textAlign: "left",
                fontSize: "18px",
              }}
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
                  {activePage}
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
                  {menuItems.map((item, index) => (
                    <MenuItem key={index} onClick={() => navigate(item.path)}>
                      {item.label}
                    </MenuItem>
                  ))}
                  

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
                  onClick={() => navigate("/analytics")}
                >
                    {showTooltip && (
                  <div className="tooltip-text">View Analytics</div>
                )}
                  <InsightsTwoToneIcon />
                </Button>
              </Box>
            </Box>

            <Box className="header-actions">
              <IconButton
                variant="none"
                className="logout"
                sx={{
                  color: "#89343b",
                }}
                onClick={() => navigate("/")}
              >
                <ExitToAppOutlinedIcon />
              </IconButton>
            </Box>
          </Sheet>
        </Sheet>
      </div>
    </CssVarsProvider>
  );
};

export default Header;
