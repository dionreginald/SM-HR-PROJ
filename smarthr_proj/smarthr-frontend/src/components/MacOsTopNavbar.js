// src/components/MacOsTopNavbar.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Menu,
  MenuItem,
  Switch,
  Button,
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PaidIcon from '@mui/icons-material/Paid';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EventIcon from '@mui/icons-material/Event';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon for dark mode
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon for light mode

// Import your custom theme context
import { useThemeContext } from '../contexts/ThemeContext'; // Adjust path if necessary

// Import your logo images from the public folder
const SmartHRLogo = "/images/smarthr-logo.png"; // Default (light mode) logo
const SmartHRLogoDark = "/images/smarthr-logo.png"; // Logo for dark mode

// Styled Components (Adapted for theme modes)
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.85),
  backdropFilter: 'blur(15px)',
  boxShadow: `0 4px 15px ${alpha(theme.palette.text.primary, 0.08)}`,
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1200,
  height: '70px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '0 0 20px 20px',
  overflow: 'hidden',
  borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  width: '100%',
  maxWidth: 1200,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0, 3),
}));

const NavGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1), // Adjust gap as needed for text buttons
}));

// Adapted from NavIconButton to be a full Button with text
const NavStyledButton = styled(Button)(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '100px', // Increased minWidth to accommodate text
  height: '45px',
  borderRadius: '25px', // Pill shape
  transition: 'background-color 0.3s ease, transform 0.2s ease, color 0.3s ease, box-shadow 0.3s ease',
  textTransform: 'none', // Keep text as is
  fontSize: '0.9rem',
  fontWeight: 600,
  padding: theme.spacing(0.8, 1.5), // Adjust padding for text content

  backgroundColor: active ? theme.palette.primary.main : 'transparent',
  color: active ? '#ffffff' : theme.palette.text.secondary, // Text color adapts to theme
  boxShadow: active ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}` : 'none',
  
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.main : alpha(theme.palette.text.secondary, 0.1), // Hover background
    color: active ? '#ffffff' : theme.palette.text.primary, // Hover text color
    transform: 'scale(1.05)', // Slightly smaller scale for text buttons
    boxShadow: active ? `0 6px 16px ${alpha(theme.palette.primary.main, 0.5)}` : `0 2px 8px ${alpha(theme.palette.text.primary, 0.15)}`,
  },

  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(0.8), // Space between icon and text
    fontSize: '20px',
    color: 'inherit', // Icon color inherits from button text color
  },
}));

// Retaining StyledIconButton for standalone icons (like settings, logout, theme toggle)
const NavActionIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary, // Muted text color for icons
  transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
  padding: theme.spacing(1.2),
  borderRadius: '12px',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    color: theme.palette.primary.main,
    transform: 'scale(1.1)',
  },
}));

const LogoImage = styled('img')({
  height: '40px',
  marginRight: '8px',
  objectFit: 'contain',
});


// --- Navigation Items with Concise Text Labels and Sub-Menus ---
const navItems = [
  { name: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  {
    name: 'Employees',
    icon: <PeopleIcon />,
    path: '/dashboard/employees',
    subItems: [
      { name: 'Add', icon: <AddIcon />, path: '/dashboard/add-employee' },
      { name: 'View', icon: <VisibilityIcon />, path: '/dashboard/employees' },
    ],
  },
  {
    name: 'Payroll',
    icon: <PaidIcon />,
    path: '/dashboard/view-payrolls',
    subItems: [
      { name: 'Add', icon: <PaidOutlinedIcon />, path: '/dashboard/add-payroll' },
      { name: 'View', icon: <VisibilityIcon />, path: '/dashboard/view-payrolls' },
      { name: 'Payslips', icon: <ReceiptIcon />, path: '/dashboard/payslips' },
    ],
  },
  {
    name: 'Leaves',
    icon: <EventBusyIcon />,
    path: '/dashboard/leave-requests',
  },
  {
    name: 'Notifications',
    icon: <NotificationsIcon />,
    path: '/dashboard/notifications',
  },
  {
    name: 'Events',
    icon: <EventIcon />,
    path: '/dashboard/events',
  },
];

// Helper to determine if a main nav item should be 'selected' due to its submenu item being active
const isParentActive = (item, locationPathname) => {
  if (locationPathname === item.path) return true;
  if (item.subItems) {
    return item.subItems.some(subItem => locationPathname.startsWith(subItem.path));
  }
  return false;
};

// --- MacOsTopNavbar Component ---
export default function MacOsTopNavbar() {
  const location = useLocation();
  const theme = useTheme(); // Access the current theme for colors
  const { toggleColorMode, mode } = useThemeContext(); // Get the toggle function and current mode

  const [anchorElMap, setAnchorElMap] = useState({});

  const handleMenuOpen = (event, itemName) => {
    setAnchorElMap(prev => ({ ...prev, [itemName]: event.currentTarget }));
  };

  const handleMenuClose = (itemName) => {
    setAnchorElMap(prev => ({ ...prev, [itemName]: null }));
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <StyledAppBar>
      <StyledToolbar>
        {/* Left Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/dashboard">
            <LogoImage
              src={mode === 'light' ? SmartHRLogo : SmartHRLogoDark} // Change logo based on theme mode
              alt="SmartHR Logo"
            />
          </Link>
        </Box>

        {/* Center Dock Items with Text Labels and Dropdowns */}
        <NavGroup>
          {navItems.map((item) => (
            <React.Fragment key={item.name}>
              <Tooltip title={item.name} arrow>
                {/* Use NavStyledButton for items with text labels */}
                <NavStyledButton
                  aria-controls={item.subItems ? `${item.name}-menu` : undefined}
                  aria-haspopup={item.subItems ? "true" : undefined}
                  onClick={item.subItems ? (event) => handleMenuOpen(event, item.name) : undefined}
                  component={item.subItems ? 'button' : Link}
                  to={!item.subItems ? item.path : undefined}
                  active={isParentActive(item, location.pathname) ? 1 : 0} // Pass active state
                  startIcon={item.icon} // Pass icon to startIcon prop
                >
                  {item.name} {/* Display the text label */}
                </NavStyledButton>
              </Tooltip>

              {item.subItems && (
                <Menu
                  id={`${item.name}-menu`}
                  anchorEl={anchorElMap[item.name]}
                  open={Boolean(anchorElMap[item.name])}
                  onClose={() => handleMenuClose(item.name)}
                  MenuListProps={{
                    'aria-labelledby': `nav-styled-button-${item.name}`, // Update aria-labelledby
                  }}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  PaperProps={{
                    sx: {
                      borderRadius: '12px',
                      backgroundColor: alpha(theme.palette.background.paper, 0.95),
                      boxShadow: `0 8px 24px ${alpha(theme.palette.text.primary, 0.15)}`,
                      minWidth: '180px',
                      border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
                      overflow: 'hidden',
                    },
                  }}
                >
                  {item.subItems.map((subItem) => (
                    <MenuItem
                      key={subItem.name}
                      component={Link}
                      to={subItem.path}
                      onClick={() => handleMenuClose(item.name)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        padding: '10px 15px',
                        color: theme.palette.text.primary,
                        fontWeight: 500,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.15),
                          color: theme.palette.primary.main,
                        },
                        ...(location.pathname === subItem.path && {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                        }),
                      }}
                    >
                      {subItem.icon}
                      <Typography variant="body2">{subItem.name}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              )}
            </React.Fragment>
          ))}
        </NavGroup>

        {/* Right Settings, Theme Toggle, and Logout */}
        <NavGroup>
          <Tooltip title="Profile" arrow>
            <NavActionIconButton
              component={Link}
              to="/dashboard/profile"
              // Removed .Mui-selected class from NavActionIconButton as it's not a NavStyledButton type
              // If you want selection for these, you'd need a separate styled component or logic
              size="large"
            >
              <SettingsIcon />
            </NavActionIconButton>
          </Tooltip>

          {/* Dark Mode / Light Mode Toggle Switch */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              // Optional: Add some padding/background to the toggle switch itself if desired
              // backgroundColor: alpha(theme.palette.text.secondary, 0.05),
              // borderRadius: '12px',
              // padding: '4px 8px',
              // gap: '4px',
            }}
          >
            <Tooltip title="Light Mode" arrow>
              <Brightness7Icon sx={{ color: mode === 'light' ? theme.palette.primary.main : theme.palette.text.secondary }} />
            </Tooltip>
            <Switch
              checked={mode === 'dark'}
              onChange={toggleColorMode}
              inputProps={{ 'aria-label': 'toggle dark mode' }}
              color="primary" // Uses primary color for checked state
            />
            <Tooltip title="Dark Mode" arrow>
              <Brightness4Icon sx={{ color: mode === 'dark' ? theme.palette.primary.main : theme.palette.text.secondary }} />
            </Tooltip>
          </Box>


          <Tooltip title="Logout" arrow>
            <NavActionIconButton onClick={handleLogout} size="large">
              <LogoutIcon />
            </NavActionIconButton>
          </Tooltip>
        </NavGroup>
      </StyledToolbar>
    </StyledAppBar>
  );
}