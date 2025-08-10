// src/components/EmployeeNavbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';

import {
  Box,
  Typography,
  Button,
  Tooltip,
  IconButton,
  Badge,
  Switch,
  FormControlLabel,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';

import { styled, alpha } from '@mui/material/styles';

import { useThemeContext } from '../contexts/ThemeContext';

// Styled Components

const NavbarContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  background:
    theme.palette.mode === 'light'
      ? `linear-gradient(to right, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.98)})`
      : `linear-gradient(to right, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.98)})`,
  boxShadow:
    theme.palette.mode === 'light'
      ? '0 4px 15px rgba(0, 0, 0, 0.1)'
      : '0 4px 15px rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 3),
  zIndex: 1100,
  height: '70px',
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 2),
    height: '60px',
  },
}));

const LogoContainer = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'inherit',
  '& img': {
    height: '45px',
    width: 'auto',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
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
  gap: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(1),
  },
  [theme.breakpoints.down('sm')]: {
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '90px',
  height: '45px',
  borderRadius: '25px',
  transition: 'background-color 0.3s ease, transform 0.2s ease, color 0.3s ease, box-shadow 0.3s ease',
  textTransform: 'none',
  fontSize: '0.9rem',
  fontWeight: 600,

  backgroundColor: active ? theme.palette.primary.main : 'transparent',
  color: active ? theme.palette.primary.contrastText : theme.palette.text.secondary,

  boxShadow: active ? `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}` : 'none',

  '&:hover': {
    backgroundColor: active
      ? theme.palette.primary.dark
      : theme.palette.mode === 'light'
      ? alpha(theme.palette.primary.main, 0.08)
      : alpha(theme.palette.text.primary, 0.08),
    transform: 'translateY(-3px)',
    color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
    boxShadow: active
      ? `0 6px 20px ${alpha(theme.palette.primary.main, 0.6)}`
      : theme.palette.mode === 'light'
      ? '0 2px 8px rgba(0, 0, 0, 0.1)'
      : '0 2px 8px rgba(255, 255, 255, 0.1)',
  },

  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(0.5),
    fontSize: '20px',
    color: active ? theme.palette.primary.contrastText : theme.palette.text.secondary,
    transition: 'color 0.3s ease',
  },

  [theme.breakpoints.down('sm')]: {
    minWidth: 'unset',
    padding: theme.spacing(0.8, 1.2),
    fontSize: '0.8rem',
    '& .MuiButton-startIcon': {
      fontSize: '18px',
      marginRight: theme.spacing(0.3),
    },
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  transition: 'color 0.3s ease, transform 0.2s ease, background-color 0.3s ease',
  '&:hover': {
    color: theme.palette.primary.main,
    transform: 'scale(1.15)',
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

const WelcomeText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginRight: theme.spacing(2),
  fontSize: '0.95rem',
  fontWeight: 500,
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const LogoutButton = styled(NavButton)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  boxShadow: `0 4px 15px ${alpha(theme.palette.error.main, 0.4)}`,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
    boxShadow: `0 6px 20px ${alpha(theme.palette.error.main, 0.6)}`,
    transform: 'translateY(-3px)',
  },
  color: theme.palette.error.contrastText,
  '& .MuiButton-startIcon': {
    color: theme.palette.error.contrastText,
  },
}));

export default function EmployeeNavbar({ employee }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount] = useState(0);
  const { toggleColorMode, mode } = useThemeContext();

  // Mobile drawer open state
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('employee');
    navigate('/employee-login');
  };

  const isActive = (path) => location.pathname === path;

  // Navigation items for Drawer and desktop
  const navItems = [
    { name: 'Home', icon: <HomeIcon />, path: '/employee-dashboard' },
    { name: 'Payroll', icon: <AccountBalanceWalletIcon />, path: '/employee-payslips' },
    { name: 'Profile', icon: <PersonIcon />, path: '/employee-profile' },
    { name: 'Leave', icon: <CalendarMonthIcon />, path: '/employee-leave-request' },
  ];

  return (
    <>
      <NavbarContainer aria-label="Employee Navigation Bar">
        {/* Logo */}
        <LogoContainer to="/employee-dashboard" aria-label="Go to Employee Dashboard" tabIndex={0}>
          <img
            src={mode === 'light' ? '/images/smarthr-logo.png' : '/images/smarthr-logo-dark.png'}
            alt="SmartHR Logo"
          />
        </LogoContainer>

        {/* Right Side - Navigation Items */}
        <NavItemsContainer>
          {/* Desktop nav buttons - hide on xs */}
          {navItems.map((item) => (
            <NavButton
              key={item.name}
              component={Link}
              to={item.path}
              active={isActive(item.path) ? 1 : 0}
              startIcon={item.icon}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              {item.name}
            </NavButton>
          ))}

          {/* Notification Icon - ALWAYS visible */}
          <Tooltip title="Notifications" sx={{ display: 'flex', mr: 1 }}>
            <StyledIconButton
              component={Link}
              to="/employee-notifications"
              aria-label={`View notifications, ${unreadCount} unread`}
              size="large"
            >
              <Badge badgeContent={unreadCount} color="error" overlap="circular" max={99}>
                <NotificationsIcon />
              </Badge>
            </StyledIconButton>
          </Tooltip>

          {/* Dark/Light Mode Toggle - hide on xs */}
          <Tooltip
            title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={mode === 'dark'}
                  onChange={toggleColorMode}
                  name="darkModeToggle"
                  color="primary"
                  sx={(theme) => ({
                    '& .MuiSwitch-thumb': {
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor:
                        theme.palette.mode === 'light'
                          ? alpha(theme.palette.secondary.main, 0.5)
                          : alpha(theme.palette.primary.dark, 0.7),
                    },
                  })}
                />
              }
              label={mode === 'light' ? 'Light' : 'Dark'}
              labelPlacement="start"
              sx={(theme) => ({
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1),
                '& .MuiTypography-root': {
                  fontSize: '0.875rem',
                  fontWeight: 500,
                },
              })}
            />
          </Tooltip>

          {/* Welcome Text - hide on xs */}
          <WelcomeText sx={{ display: { xs: 'none', sm: 'flex' } }}>
            {employee ? `Welcome, ${employee.full_name || employee.email.split('@')[0]}` : ''}
          </WelcomeText>

          {/* Logout Button - hide on xs */}
          <LogoutButton
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Logout
          </LogoutButton>

          {/* Hamburger menu button for mobile xs only */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, ml: 1 }}>
            <IconButton
              color="inherit"
              aria-label="open mobile menu"
              onClick={toggleMobileDrawer}
              size="large"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </NavItemsContainer>
      </NavbarContainer>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={toggleMobileDrawer}
        PaperProps={{
          sx: { width: 280, bgcolor: 'background.paper' },
        }}
      >
        <Box sx={{ width: '100%', mt: 2 }}>
          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.name}
                component={Link}
                to={item.path}
                selected={isActive(item.path)}
                onClick={toggleMobileDrawer}
              >
                <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            ))}
          </List>

          <Divider />

          {/* Dark Mode Toggle */}
          <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body1">Dark Mode</Typography>
            <Switch
              checked={mode === 'dark'}
              onChange={toggleColorMode}
              inputProps={{ 'aria-label': 'toggle dark mode' }}
              color="primary"
            />
          </Box>

          <Divider />

          {/* Logout Button */}
          <Box sx={{ px: 2, py: 1 }}>
            <LogoutButton
              onClick={() => {
                handleLogout();
                toggleMobileDrawer();
              }}
              startIcon={<LogoutIcon />}
              fullWidth
            >
              Logout
            </LogoutButton>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
