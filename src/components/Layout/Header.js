import {
    AccountCircle,
    Dashboard as DashboardIcon,
    ExitToApp,
} from '@mui/icons-material';
import {
    AppBar,
    Box,
    Button,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const Header = () => {
  const navigate = useNavigate();
  const { logout, userRole } = useAuth();
  const { showNotification } = useNotification();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleClose();
      showNotification('Logged out successfully');
      navigate('/login', { replace: true });
    } catch (error) {
      showNotification('Error logging out', 'error');
    }
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const getRoleColor = () => {
    return userRole === 'admin' ? 'error' : 'primary';
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Traffic Management System
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            color="inherit"
            startIcon={<DashboardIcon />}
            onClick={handleDashboard}
            sx={{ 
              textTransform: 'none',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Dashboard
          </Button>

          {userRole && (
            <Chip
              label={`Role: ${userRole}`}
              color={getRoleColor()}
              variant="outlined"
              size="small"
              sx={{ 
                color: 'white',
                borderColor: 'white',
              }}
            />
          )}
          
          <IconButton
            size="large"
            edge="end"
            aria-label="account menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => {
                handleClose();
                navigate('/profile');
                }}>
                Profile
                </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
