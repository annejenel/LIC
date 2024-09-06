import React from 'react';
import Sheet from '@mui/joy/Sheet';
import Badge from '@mui/joy/Badge';
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
import NotificationsIcon from '@mui/icons-material/Notifications';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SearchIcon from '@mui/icons-material/Search';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';

import './App.css';
import InsightsTwoTone from '@mui/icons-material/InsightsTwoTone';

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
                  sx={{
                    '--Button-radius': '1.5rem',
                    backgroundColor: '#B53737',
                    color: 'white',
                    fontSize: '20px'
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
                    fontSize: '20px'
                  }}
                >
                  <MenuItem>
                    <ListItemDecorator>
                      <ManageAccountsIcon />
                    </ListItemDecorator>
                    Account
                  </MenuItem>
                  <ListDivider />
                  <MenuItem>Manage Staff</MenuItem>
                  <MenuItem>Settings</MenuItem>
                </Menu>
              </Dropdown>
              <Button
                sx={{
                  marginLeft: '8px',
                  backgroundColor: 'transparent',
                  border: '2px solid #a94442;',
                  color: '#a94442',
                  marginRight: '50px',
                }}
              >
                <InsightsTwoTone/>
              </Button>
            </Box>

            <Box className="header-actions">
                  <ExitToAppOutlinedIcon />
            </Box>
    
          </Sheet>

          <div className="hello-world-container">
            <Button
              startDecorator={<AddIcon />}
              sx={{ 
                position: 'absolute',
                top: '16px',
                left: '16px',
                backgroundColor: '#a94442',
                fontSize: '20px'
              }}
            >
              Add Student
            </Button>
            <div className="hello-world-content">
              Hello world!
            </div>
            <Input
              placeholder="Search for student ID..."
              variant="soft"
              size="sm"
              endDecorator={
                <SearchIcon />
              }
              className="search-input"
            />
          </div>
        </Sheet>
      </div>
    </CssVarsProvider>
  );
}
