import React from 'react';
import Sheet from '@mui/joy/Sheet';
import Tooltip from '@mui/material/Tooltip';
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
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import InsightsTwoTone from '@mui/icons-material/InsightsTwoTone';

import './ManageStaff.css';

const theme = extendTheme({
  components: {
    JoyTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'Poppins, sans-serif',
          fontSize: '20px',
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

export default function App() {
  return (
    <CssVarsProvider theme={theme}>
      <div className="container">
        <Sheet
          variant="outlined"
          className="sheet"
          sx={{ backgroundColor: '#fff0f2' }}
        >
          <Sheet
            variant="solid"
            className="header"
            sx={{ backgroundColor: '#ffd404' }}
          >
            <Box className="logo" />
            <Typography
              component="div"
              sx={{ marginLeft: '16px', textAlign: 'left' }}
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
                    backgroundColor: '#B53737',
                    color: 'white',
                    fontSize: '20px',
                    '&:hover': {
                      color: '#a94442',
                      backgroundColor: 'white',
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
                    '--ListItemDecorator-size': '24px',
                    '--ListItem-minHeight': '40px',
                    '--ListDivider-gap': '4px',
                    minWidth: 200,
                    fontSize: '20px',
                  }}
                >
                  <MenuItem>
                    <ListItemDecorator>
                      <ManageAccountsIcon />
                    </ListItemDecorator>
                    Account
                  </MenuItem>
                  <ListDivider />
                  <MenuItem>Dashboard</MenuItem>
                  <MenuItem>Settings</MenuItem>
                </Menu>
              </Dropdown>

              <Tooltip title="Analytics" arrow sx={{ height: '10px' }}>
                <Button
                  className="analytics-button"
                  sx={{
                    marginLeft: '8px',
                    backgroundColor: 'transparent',
                    border: '2px solid #a94442',
                    color: '#a94442',
                    marginRight: '50px',
                    '&:hover': {
                      color: 'white',
                      backgroundColor: '#a94442',
                      borderColor: '#a94442',
                    },
                  }}
                >
                  <InsightsTwoTone />
                </Button>
              </Tooltip>
            </Box>

            <Box className="header-actions">
              <IconButton variant="soft" className="logout">
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
                  '&:hover': {
                    backgroundColor: '#218838',
                  },
                }}
              >
                Add Staff
              </Button>
            </div>

            <div className="table-container">
              {/* Table 1 content */}
              <div className="table">
                <Typography className="table-title">
                  STAFF/ NAS TRANSACTION
                </Typography>
              </div>

              {/* Table 2 content */}
              <div className="table">
                <Typography className="table-title">
                  STAFF TABLE
                </Typography>
              </div>
            </div>
          </div>
        </Sheet>
      </div>

      <Sheet>
        hello
      </Sheet>
    </CssVarsProvider>
  );
}
