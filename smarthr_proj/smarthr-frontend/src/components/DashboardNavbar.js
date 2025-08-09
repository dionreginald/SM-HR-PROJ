// src/components/DashboardNavbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // useLocation for active state
import { Box, Button, Menu, MenuItem } from '@mui/material'; // Added Menu, MenuItem
import { styled } from '@mui/system'; // Added alpha for transparency

// Import Icons
import PeopleIcon from '@mui/icons-material/People'; // For Employees
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'; // For Payroll
import NotificationsIcon from '@mui/icons-material/Notifications'; // For Notifications
import PersonIcon from '@mui/icons-material/Person'; // For Profile
import LogoutIcon from '@mui/icons-material/Logout'; // For Logout
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // For Add Employee/Payroll
import VisibilityIcon from '@mui/icons-material/Visibility'; // For View Employees/Payrolls
import ReceiptIcon from '@mui/icons-material/Receipt'; // For Payslips
import SendIcon from '@mui/icons-material/Send'; // For Send Notification

// --- Styled Components for the Navbar ---

const NavbarContainer = styled(Box)(({ theme }) => ({
  position: 'fixed', // Fixed at the top
  top: 0,
  left: 0,
  width: '100%',
  backgroundColor: '#34495e', // Dark blue-grey background
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)', // Soft shadow below the navbar
  display: 'flex',
  justifyContent: 'space-between', // Space between logo and nav items
  alignItems: 'center',
  padding: theme.spacing(1, 3), // Vertical and horizontal padding
  zIndex: 1100, // Ensure it's above other content
  height: '70px', // Fixed height for the navbar
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 2),
    height: '60px',
  },
}));

const LogoContainer = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none', // Remove underline from link
  color: 'inherit', // Inherit color
  '& img': {
    height: '45px', // Logo height
    width: 'auto',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)', // Subtle scale on hover
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& img': {
      height: '35px',
    },
  },
}));

const NavItemsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2), // Space between main nav buttons
  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(1), // Reduce gap on smaller screens
  },
  [theme.breakpoints.down('sm')]: {
    // For very small screens, you might consider a collapsed menu or scrollable nav
    // For now, we'll let them wrap or overflow if too many items
  },
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '100px', // Minimum width for each button
  height: '45px', // Fixed height for consistency
  borderRadius: '25px', // More rounded, pill-shaped buttons
  transition: 'background-color 0.3s ease, transform 0.2s ease, color 0.3s ease, box-shadow 0.3s ease',
  textTransform: 'none', // Prevent uppercase text
  fontSize: '0.9rem',
  fontWeight: 600,

  // Active state styling
  backgroundColor: active ? '#4a90e2' : 'transparent', // Vibrant blue for active background
  color: active ? 'white' : 'rgba(255, 255, 255, 0.7)', // White for active, muted white for inactive
  boxShadow: active ? '0 4px 15px rgba(74, 144, 226, 0.4)' : 'none', // Blue shadow for active

  '&:hover': {
    backgroundColor: active ? '#4a90e2' : 'rgba(255, 255, 255, 0.1)', // Keep active color, subtle hover for inactive
    transform: 'translateY(-2px)', // Subtle lift up on hover
    color: 'white', // White text/icon on hover
    boxShadow: active ? '0 6px 20px rgba(74, 144, 226, 0.5)' : '0 2px 8px rgba(255, 255, 255, 0.1)', // Enhanced shadow for active, subtle for inactive
  },

  '& .MuiButton-startIcon': { // Style for the icon within the button
    marginRight: theme.spacing(0.5), // Space between icon and text
    fontSize: '20px', // Icon size
    color: active ? 'white' : 'rgba(255, 255, 255, 0.7)',
    transition: 'color 0.3s ease',
  },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#34495e', // Dark blue-grey background for dropdown
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    minWidth: '180px',
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.9)', // Slightly transparent white text
  fontSize: '0.9rem',
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Subtle hover effect
    color: 'white',
  },
  '& .MuiSvgIcon-root': { // Style for icons within menu items
    marginRight: theme.spacing(1),
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.7)',
  },
}));

export default function DashboardNavbar() {
  const location = useLocation(); // Hook to get current path for active state

  // State for dropdown menus
  const [anchorElEmployee, setAnchorElEmployee] = useState(null);
  const [anchorElPayroll, setAnchorElPayroll] = useState(null);
  const [anchorElNotification, setAnchorElNotification] = useState(null);

  const handleMenuOpen = (event, setter) => {
    setter(event.currentTarget);
  };

  const handleMenuClose = (setter) => {
    setter(null);
  };

  // Helper to check if a main nav item is active (or if any of its children are active)
  const isActiveParent = (paths) => {
    return paths.some(path => location.pathname.startsWith(path));
  };

  return (
    <NavbarContainer>
      {/* Company Logo */}
      <LogoContainer to="/dashboard">
        <img
          src="/images/smarthr-logo-white.png" // Assuming you have a white version for dark background
          alt="SmartHR Logo"
        />
      </LogoContainer>

      {/* Navigation Items */}
      <NavItemsContainer>
        {/* Employees Dropdown */}
        <NavButton
          aria-controls="employees-menu"
          aria-haspopup="true"
          onClick={(e) => handleMenuOpen(e, setAnchorElEmployee)}
          active={isActiveParent(['/dashboard/add-employee', '/dashboard/employees']) ? 1 : 0}
          startIcon={<PeopleIcon />}
        >
          Employees
        </NavButton>
        <StyledMenu
          id="employees-menu"
          anchorEl={anchorElEmployee}
          open={Boolean(anchorElEmployee)}
          onClose={() => handleMenuClose(setAnchorElEmployee)}
          MenuListProps={{ onMouseLeave: () => handleMenuClose(setAnchorElEmployee) }} // Close on mouse leave
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <StyledMenuItem onClick={() => handleMenuClose(setAnchorElEmployee)} component={Link} to="/dashboard/add-employee">
            <AddCircleOutlineIcon /> Add Employee
          </StyledMenuItem>
          <StyledMenuItem onClick={() => handleMenuClose(setAnchorElEmployee)} component={Link} to="/dashboard/employees">
            <VisibilityIcon /> View Employees
          </StyledMenuItem>
        </StyledMenu>

        {/* Payroll Dropdown */}
        <NavButton
          aria-controls="payroll-menu"
          aria-haspopup="true"
          onClick={(e) => handleMenuOpen(e, setAnchorElPayroll)}
          active={isActiveParent(['/dashboard/add-payroll', '/dashboard/view-payrolls', '/dashboard/payslips']) ? 1 : 0}
          startIcon={<AccountBalanceWalletIcon />}
        >
          Payroll
        </NavButton>
        <StyledMenu
          id="payroll-menu"
          anchorEl={anchorElPayroll}
          open={Boolean(anchorElPayroll)}
          onClose={() => handleMenuClose(setAnchorElPayroll)}
          MenuListProps={{ onMouseLeave: () => handleMenuClose(setAnchorElPayroll) }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <StyledMenuItem onClick={() => handleMenuClose(setAnchorElPayroll)} component={Link} to="/dashboard/add-payroll">
            <AddCircleOutlineIcon /> Add Payroll
          </StyledMenuItem>
          <StyledMenuItem onClick={() => handleMenuClose(setAnchorElPayroll)} component={Link} to="/dashboard/view-payrolls">
            <VisibilityIcon /> View Payrolls
          </StyledMenuItem>
          <StyledMenuItem onClick={() => handleMenuClose(setAnchorElPayroll)} component={Link} to="/dashboard/payslips">
            <ReceiptIcon /> Payslips
          </StyledMenuItem>
        </StyledMenu>

        {/* Notifications Dropdown */}
        <NavButton
          aria-controls="notification-menu"
          aria-haspopup="true"
          onClick={(e) => handleMenuOpen(e, setAnchorElNotification)}
          active={isActiveParent(['/dashboard/notifications', '/dashboard/send-notification']) ? 1 : 0}
          startIcon={<NotificationsIcon />}
        >
          Notifications
        </NavButton>
        <StyledMenu
          id="notification-menu"
          anchorEl={anchorElNotification}
          open={Boolean(anchorElNotification)}
          onClose={() => handleMenuClose(setAnchorElNotification)}
          MenuListProps={{ onMouseLeave: () => handleMenuClose(setAnchorElNotification) }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <StyledMenuItem onClick={() => handleMenuClose(setAnchorElNotification)} component={Link} to="/dashboard/notifications">
            <VisibilityIcon /> View Notifications
          </StyledMenuItem>
          <StyledMenuItem onClick={() => handleMenuClose(setAnchorElNotification)} component={Link} to="/dashboard/send-notification">
            <SendIcon /> Send Notification
          </StyledMenuItem>
        </StyledMenu>

        {/* Profile Link */}
        <NavButton
          component={Link}
          to="/dashboard/profile"
          active={location.pathname === '/dashboard/profile' ? 1 : 0}
          startIcon={<PersonIcon />}
        >
          Profile
        </NavButton>

        {/* Logout Link */}
        <NavButton
          component={Link}
          to="/logout" // Assuming /logout handles actual logout logic
          active={location.pathname === '/logout' ? 1 : 0}
          startIcon={<LogoutIcon />}
        >
          Logout
        </NavButton>
      </NavItemsContainer>
    </NavbarContainer>
  );
}