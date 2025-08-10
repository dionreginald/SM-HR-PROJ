import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import './HomeNavbar.css';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  boxShadow: 'none',
  backdropFilter: 'blur(10px)',
  '-webkit-backdrop-filter': 'blur(10px)',
  zIndex: (theme.zIndex?.drawer ?? 1200) + 1,
  '&.scrolled': {
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
  },
}));

const NavLink = styled(Button)(({ theme }) => ({
  color: '#555',
  fontWeight: 500,
  fontSize: '1rem',
  textTransform: 'none',
  margin: theme.spacing(0, 1.5),
  '&:hover': {
    color: '#007aff',
    backgroundColor: 'transparent',
  },
}));

const CtaButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(0.8, 2.5),
  borderRadius: '30px',
  fontSize: '0.95rem',
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(45deg, #007aff 30%, #00c6ff 90%)',
  boxShadow: '0 4px 10px rgba(0, 122, 255, 0.2)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 15px rgba(0, 122, 255, 0.3)',
    background: 'linear-gradient(45deg, #005bb5 30%, #0099e6 90%)',
  },
}));

const menuItems = [
  { label: 'Features', to: '/features' },
  { label: 'Resources', to: '/resources' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const HomeNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      <StyledAppBar position="fixed" className={scrolled ? 'scrolled' : ''}>
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            maxWidth: '1400px',
            width: '100%',
            margin: '0 auto',
          }}
        >
          {/* Logo */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                color: '#555',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img
                src="/images/smarthr-logo.png"
                alt="SmartHR Logo"
                className="navbar-logo"
              />
            </Link>
          </Typography>

          {/* Desktop nav links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {menuItems.map((item) => (
              <NavLink
                key={item.label}
                component={Link}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
            <CtaButton variant="contained" component={Link} to="/login">
              Login
            </CtaButton>
          </Box>

          {/* Mobile hamburger button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              size="large"
            >
              <MenuIcon sx={{ color: '#007aff' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </StyledAppBar>

      {/* Drawer for mobile menu */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{
            width: 250,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              p: 2,
            }}
          >
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            {menuItems.map(({ label, to }) => (
              <ListItem key={label} disablePadding>
                <ListItemButton component={Link} to={to}>
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            ))}

            <ListItem disablePadding>
              <ListItemButton component={Link} to="/login">
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default HomeNavbar;
