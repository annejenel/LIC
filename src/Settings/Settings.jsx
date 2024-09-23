import React from 'react'
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsightsTwoTone from '@mui/icons-material/InsightsTwoTone';

const Settings = () =>  {
  const navigate = useNavigate()
  
  return (
    <>
      <div className="container">
        <Sheet variant="outlined" className="sheet">
          {/* Header Section */}
          <Sheet variant="solid"
            className="header"
            sx={{ 
              backgroundColor: '#ffd000', 
              borderRadius: '0',
              marginTop: '0',
              top: 0, 
              left: 0,
              zIndex: 1000,
            }}
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
                  className="menu-Button"
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
                  variant= "outlined"
                  endDecorator={<KeyboardArrowDownIcon />}
                >Settings</MenuButton>
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
                  <MenuItem onClick={() => navigate('/dashboard')}>Dashboard</MenuItem>
                  <ListDivider />
                  <MenuItem onClick={() => navigate('/staff')}>Manage Staff</MenuItem>
                </Menu>
              </Dropdown>
            </Box>
            
      
          </Sheet>
          
        </Sheet>
        <Sheet>

        </Sheet>
     </div>

    </>
  )
}

export default Settings