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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';

import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

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
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { useThemeContext } from '../contexts/ThemeContext';

const SmartHRLogo = "/images/smarthr-logo.png";
const SmartHRLogoDark = "/images/smarthr-logo.png";

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
  gap: theme.spacing(1),
  [`@media (max-width:600px)`]: {
    display: 'none',
  },
}));

const NavStyledButton = styled(Button)(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '100px',
  height: '45px',
  borderRadius: '25px',
  transition: 'background-color 0.3s ease, transform 0.2s ease, color 0.3s ease, box-shadow 0.3s ease',
  textTransform: 'none',
  fontSize: '0.9rem',
  fontWeight: 600,
  padding: theme.spacing(0.8, 1.5),
  backgroundColor: active ? theme.palette.primary.main : 'transparent',
  color: active ? '#fff' : theme.palette.text.secondary,
  boxShadow: active ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}` : 'none',
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.main : alpha(theme.palette.text.secondary, 0.1),
    color: active ? '#fff' : theme.palette.text.primary,
    transform: 'scale(1.05)',
    boxShadow: active
      ? `0 6px 16px ${alpha(theme.palette.primary.main, 0.5)}`
      : `0 2px 8px ${alpha(theme.palette.text.primary, 0.15)}`,
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(0.8),
    fontSize: '20px',
    color: 'inherit',
  },
}));

const NavActionIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
  padding: theme.spacing(1.2),
  borderRadius: '12px',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    color: theme.palette.primary.main,
    transform: 'scale(1.1)',
  },
  [`@media (max-width:600px)`]: {
    display: 'none',
  },
}));

const LogoImage = styled('img')({
  height: '40px',
  marginRight: '8px',
  objectFit: 'contain',
});

// Navigation Items
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

// Helper to check active nav
const isParentActive = (item, locationPathname) => {
  if (locationPathname === item.path) return true;
  if (item.subItems) {
    return item.subItems.some(subItem => locationPathname.startsWith(subItem.path));
  }
  return false;
};

export default function MacOsTopNavbar() {
  const location = useLocation();
  const theme = useTheme();
  const { toggleColorMode, mode } = useThemeContext();

  // Desktop submenu anchors
  const [anchorElMap, setAnchorElMap] = useState({});

  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubmenusOpen, setMobileSubmenusOpen] = useState({});

  const handleMenuOpen = (event, itemName) => {
    setAnchorElMap(prev => ({ ...prev, [itemName]: event.currentTarget }));
  };

  const handleMenuClose = (itemName) => {
    setAnchorElMap(prev => ({ ...prev, [itemName]: null }));
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    window.location.href = '/login';
  };

  const toggleMobileDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleMobileSubmenu = (itemName) => {
    setMobileSubmenusOpen(prev => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  return (
    <>
      <StyledAppBar>
        <StyledToolbar>
          {/* Left Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center' }}>
              <LogoImage
                src={mode === 'light' ? SmartHRLogo : SmartHRLogoDark}
                alt="SmartHR Logo"
              />
            </Link>
          </Box>

          {/* This Box pushes the hamburger icon to the right */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Mobile Hamburger Icon on the right */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center' }}>
            <IconButton
              color='secondary'
              edge="end"
              aria-label="menu"
              onClick={toggleMobileDrawer}
              size="large"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Desktop Nav Buttons */}
          <NavGroup>
            {navItems.map((item) => (
              <React.Fragment key={item.name}>
                <Tooltip title={item.name} arrow>
                  <NavStyledButton
                    aria-controls={item.subItems ? `${item.name}-menu` : undefined}
                    aria-haspopup={item.subItems ? "true" : undefined}
                    onClick={item.subItems ? (event) => handleMenuOpen(event, item.name) : undefined}
                    component={item.subItems ? 'button' : Link}
                    to={!item.subItems ? item.path : undefined}
                    active={isParentActive(item, location.pathname) ? 1 : 0}
                    startIcon={item.icon}
                  >
                    {item.name}
                  </NavStyledButton>
                </Tooltip>

                {item.subItems && (
                  <Menu
                    id={`${item.name}-menu`}
                    anchorEl={anchorElMap[item.name]}
                    open={Boolean(anchorElMap[item.name])}
                    onClose={() => handleMenuClose(item.name)}
                    MenuListProps={{
                      'aria-labelledby': `nav-styled-button-${item.name}`,
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

          {/* Right Action Icons (hidden on mobile) */}
          <NavGroup>
            <Tooltip title="Profile" arrow>
              <NavActionIconButton component={Link} to="/dashboard/profile" size="large">
                <SettingsIcon />
              </NavActionIconButton>
            </Tooltip>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Light Mode" arrow>
                <Brightness7Icon sx={{ color: mode === 'light' ? theme.palette.primary.main : theme.palette.text.secondary }} />
              </Tooltip>
              <Switch
                checked={mode === 'dark'}
                onChange={toggleColorMode}
                inputProps={{ 'aria-label': 'toggle dark mode' }}
                color="primary"
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

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={toggleMobileDrawer}
        PaperProps={{
          sx: { width: 280, bgcolor: theme.palette.background.paper },
        }}
      >
        <Box sx={{ width: '100%', mt: 2 }}>
          <List>
            {navItems.map((item) => {
              const isOpen = !!mobileSubmenusOpen[item.name];
              const hasSubmenu = !!item.subItems;

              return (
                <React.Fragment key={item.name}>
                  <ListItem disablePadding>
                    {hasSubmenu ? (
                      <ListItemButton onClick={() => toggleMobileSubmenu(item.name)}>
                        <ListItemIcon sx={{ color: isParentActive(item, location.pathname) ? theme.palette.primary.main : theme.palette.text.secondary }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.name}
                          primaryTypographyProps={{
                            fontWeight: isParentActive(item, location.pathname) ? 'bold' : 'normal',
                            color: isParentActive(item, location.pathname) ? theme.palette.primary.main : 'inherit',
                          }}
                        />
                        {isOpen ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                    ) : (
                      <ListItemButton
                        component={Link}
                        to={item.path}
                        selected={location.pathname === item.path}
                        onClick={toggleMobileDrawer}
                      >
                        <ListItemIcon sx={{ color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.secondary }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.name} />
                      </ListItemButton>
                    )}
                  </ListItem>
                  {hasSubmenu && (
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.subItems.map(subItem => (
                          <ListItemButton
                            key={subItem.name}
                            sx={{ pl: 4 }}
                            component={Link}
                            to={subItem.path}
                            selected={location.pathname === subItem.path}
                            onClick={toggleMobileDrawer}
                          >
                            <ListItemIcon sx={{ color: location.pathname === subItem.path ? theme.palette.primary.main : theme.palette.text.secondary }}>
                              {subItem.icon}
                            </ListItemIcon>
                            <ListItemText primary={subItem.name} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </React.Fragment>
              );
            })}
          </List>

          <Divider />

          {/* Theme toggle and Logout inside drawer for mobile */}
          <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Brightness7Icon sx={{ color: mode === 'light' ? theme.palette.primary.main : theme.palette.text.secondary }} />
              <Switch
                checked={mode === 'dark'}
                onChange={toggleColorMode}
                inputProps={{ 'aria-label': 'toggle dark mode' }}
                color="primary"
              />
              <Brightness4Icon sx={{ color: mode === 'dark' ? theme.palette.primary.main : theme.palette.text.secondary }} />
            </Box>
            <Tooltip title="Logout" arrow>
              <IconButton onClick={handleLogout} size="large" color="primary">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
