import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Removed useLocation
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import './HomeNavbar.css'; // Import the CSS

// Styled AppBar for dynamic background on scroll
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

// Styled Link for navigation items
const NavLink = styled(Button)(({ theme }) => ({
  color: '#555', // Darker text color
  fontWeight: 500,
  fontSize: '1rem',
  textTransform: 'none', // Prevent uppercase
  margin: theme.spacing(0, 1.5),
  '&:hover': {
    color: '#007aff', // Apple blue on hover
    backgroundColor: 'transparent',
  },
}));

// Styled CTA Button
const CtaButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(0.8, 2.5),
  borderRadius: '30px', // More rounded for modern look
  fontSize: '0.95rem',
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(45deg, #007aff 30%, #00c6ff 90%)', // iOS blue gradient
  boxShadow: '0 4px 10px rgba(0, 122, 255, 0.2)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 15px rgba(0, 122, 255, 0.3)',
    background: 'linear-gradient(45deg, #005bb5 30%, #0099e6 90%)',
  },
}));

const HomeNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  // const location = useLocation(); // This line has been removed

  // Detect scroll event
  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <StyledAppBar position="fixed" className={scrolled ? 'scrolled' : ''}>
      <Toolbar sx={{ justifyContent: 'space-between', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        {/* SmartHR Logo */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#555', display: 'flex', alignItems: 'center' }}>
            <img src="/images/smarthr-logo.png" alt="SmartHR Logo" className="navbar-logo" />
          </Link>
        </Typography>

        {/* Navbar Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          {/* Using component={Link} to integrate react-router-dom Link with Material-UI Button */}
          <NavLink component={Link} to="/features">Features</NavLink>
          <NavLink component={Link} to="/resources">Resources</NavLink>
          <NavLink component={Link} to="/pricing">Pricing</NavLink>
          <NavLink component={Link} to="/about">About</NavLink>
          <NavLink component={Link} to="/contact">Contact</NavLink>
          <CtaButton variant="contained" component={Link} to="/login">
            Login
          </CtaButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default HomeNavbar;