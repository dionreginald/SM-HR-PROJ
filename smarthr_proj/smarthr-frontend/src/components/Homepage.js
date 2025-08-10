// HomePage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Typography,
  Box,
  Container,
  Grid,
  IconButton,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';

// Social Media Icons
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

import './HomePage.css';

// Styled components for main content
const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(4),
  background: 'linear-gradient(135deg, #f0f2f5 0%, #e0e4e8 100%)',
  color: '#333',
  overflow: 'hidden',
  position: 'relative',
}));

const HeroTitle = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(2.5rem, 6vw, 5rem)',
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  letterSpacing: '-0.03em',
  lineHeight: 1.1,
  background: 'linear-gradient(45deg, #1a237e 30%, #42a5f5 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: 'fadeInUp 1s ease-out',
}));

const HeroSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
  fontWeight: 400,
  maxWidth: '800px',
  marginBottom: theme.spacing(4),
  color: '#555',
  animation: 'fadeInUp 1.2s ease-out',
}));

const CtaButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: '50px',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(45deg, #007aff 30%, #00c6ff 90%)',
  boxShadow: '0 4px 15px rgba(0, 122, 255, 0.3)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 20px rgba(0, 122, 255, 0.4)',
    background: 'linear-gradient(45deg, #005bb5 30%, #0099e6 90%)',
  },
  animation: 'fadeInUp 1.4s ease-out',
}));

const FeaturesSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 4),
  backgroundColor: '#ffffff',
  textAlign: 'center',
  borderTop: '1px solid #eee',
}));

const FeaturesGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: theme.spacing(6),
  marginTop: theme.spacing(6),
  maxWidth: '1200px',
  margin: 'auto',
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  background: '#f9f9f9',
  borderRadius: '20px',
  padding: theme.spacing(4),
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  border: '1px solid #f0f0f0',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
  },
}));

const FeatureIcon = styled('img')(({ theme }) => ({
  height: '80px',
  width: '80px',
  marginBottom: theme.spacing(3),
}));

const StyledFooter = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8f8f8',
  padding: theme.spacing(6, 0),
  borderTop: '1px solid #eee',
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: '#555',
  textDecoration: 'none',
  marginBottom: theme.spacing(1),
  fontSize: '0.95rem',
  '&:hover': {
    color: '#007aff',
    textDecoration: 'underline',
  },
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  color: '#888',
  '&:hover': {
    color: '#007aff',
    backgroundColor: 'transparent',
  },
}));

const menuItems = [
  { label: 'Home', to: '/' },
  { label: 'Features', to: '/features' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
];

const HomePage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawerList = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <List>
        {menuItems.map(({ label, to }) => (
          <ListItem button component={Link} to={to} key={label}>
            <ListItemText primary={label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Navbar */}
      <AppBar position="sticky" color="primary" sx={{ boxShadow: 'none' }}>
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            SmartHR
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer}
                size="large"
              >
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
                {drawerList}
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {menuItems.map(({ label, to }) => (
                <Button
                  key={label}
                  component={Link}
                  to={to}
                  color="inherit"
                  sx={{ fontWeight: 600 }}
                >
                  {label}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <div className="homepage-new">
        {/* Hero Section */}
        <HeroSection>
          <HeroTitle variant="h1">Smart HR, Simplified.</HeroTitle>
          <HeroSubtitle variant="h5">
            Unlock the full potential of your team with intuitive HR tools
            designed for modern businesses. From employee records to seamless
            payroll, all in one elegant platform.
          </HeroSubtitle>
          <CtaButton variant="contained" component={Link} to="/register">
            Get Started For Free
          </CtaButton>
          <Box
            sx={{
              mt: 8,
              maxWidth: '90%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <img
              src="/images/dashboard-mockup.png"
              alt="SmartHR Dashboard"
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '15px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
                transform: 'translateY(20px)',
                opacity: 0,
                animation: 'slideInUp 1.5s forwards 0.5s',
                objectFit: 'contain',
              }}
            />
          </Box>
        </HeroSection>

        {/* Features Section */}
        <FeaturesSection id="features">
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: '#1a237e',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              animation: 'fadeIn 1s ease-out',
            }}
          >
            Manage Your HR with Unrivaled Simplicity
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: '#666', mb: 6, animation: 'fadeIn 1.2s ease-out' }}
          >
            Everything you need to empower your workforce and streamline
            operations.
          </Typography>

          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon
                src="/images/icon-employee-records.png"
                alt="Employee Records"
              />
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, mb: 1.5, color: '#333' }}
              >
                Centralized Employee Hub
              </Typography>
              <Typography variant="body1" sx={{ color: '#777' }}>
                Keep all employee information, documents, and performance reviews
                neatly organized and securely accessible.
              </Typography>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon
                src="/images/icon-leave-management.png"
                alt="Leave Management"
              />
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, mb: 1.5, color: '#333' }}
              >
                Effortless Leave Management
              </Typography>
              <Typography variant="body1" sx={{ color: '#777' }}>
                Simplify time-off requests, approvals, and balance tracking with
                an intuitive self-service portal for staff.
              </Typography>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon
                src="/images/icon-payroll.png"
                alt="Payroll Tracking"
              />
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, mb: 1.5, color: '#333' }}
              >
                Smart Payroll Processing
              </Typography>
              <Typography variant="body1" sx={{ color: '#777' }}>
                Automate payroll calculations, deductions, and bonuses, ensuring
                accuracy and compliance every pay cycle.
              </Typography>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesSection>

        {/* About Section */}
        <Box
          id="about"
          sx={{ padding: 8, textAlign: 'center', backgroundColor: '#eef2f5' }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 3, color: '#1a237e' }}
          >
            About SmartHR
          </Typography>
          <Typography
            variant="body1"
            sx={{ maxWidth: '800px', mx: 'auto', color: '#555', lineHeight: 1.8 }}
          >
            SmartHR.lk is committed to providing small and medium businesses in
            Sri Lanka with powerful, yet incredibly easy-to-use human resource
            management solutions. We believe that great HR shouldn't be
            complicated or expensive. Our platform is built to empower your
            business, allowing you to focus on growth while we handle the
            complexities of HR administration.
          </Typography>
        </Box>

        {/* Contact Section */}
        <Box
          id="contact"
          sx={{ padding: 8, textAlign: 'center', backgroundColor: '#f9f9f9' }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 3, color: '#1a237e' }}
          >
            Get in Touch
          </Typography>
          <Typography
            variant="body1"
            sx={{ maxWidth: '800px', mx: 'auto', color: '#555', lineHeight: 1.8 }}
          >
            Have questions or ready to see SmartHR in action? Our team is here to
            help. Contact us for a personalized demo or more information.
          </Typography>
          <CtaButton variant="contained" component={Link} to="/contact" sx={{ mt: 4 }}>
            Contact Our Team
          </CtaButton>
        </Box>

        {/* Footer */}
        <StyledFooter
          sx={{
            backgroundColor: '#cde6ffff'
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} justifyContent="space-between">
              {/* Company Info / Logo */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <img
                    src="/images/smarthr-logo.png"
                    alt="SmartHR Logo"
                    style={{ height: 40, marginRight: 10 }}
                  />
                  <Typography variant="h6" sx={{ color: '#333', fontWeight: 600 }}>
                    SmartHR
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  SmartHR is a comprehensive Human Resources Management System
                  designed to streamline HR operations, from employee management
                  and payroll to leave requests and notifications.
                </Typography>
              </Grid>

              {/* Quick Links */}
              <Grid item xs={6} sm={4} md={2}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: '#333', fontWeight: 600, mb: 2 }}
                >
                  Quick Links
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <FooterLink to="/">Home</FooterLink>
                  <FooterLink to="/features">Features</FooterLink>
                  <FooterLink to="/pricing">Pricing</FooterLink>
                  <FooterLink to="/about">About Us</FooterLink>
                  <FooterLink to="/contact">Contact Us</FooterLink>
                </Box>
              </Grid>

              {/* Resources */}
              <Grid item xs={6} sm={4} md={2}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: '#333', fontWeight: 600, mb: 2 }}
                >
                  Resources
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <FooterLink to="/resources">Blog</FooterLink>
                  <FooterLink to="/faq">FAQ</FooterLink>
                  <FooterLink to="/support">Support</FooterLink>
                  <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
                  <FooterLink to="/terms-of-service">Terms of Service</FooterLink>
                </Box>
              </Grid>

              {/* Contact Us */}
              <Grid item xs={12} sm={4} md={3}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: '#333', fontWeight: 600, mb: 2 }}
                >
                  Contact Us
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  123 HR Solutions St.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Suite 400, Business City
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  info@smarthr.com
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  +1 (555) 123-4567
                </Typography>

                {/* Social Media */}
                <Box sx={{ mt: 3 }}>
                  <SocialIconButton aria-label="facebook" href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <FacebookIcon />
                  </SocialIconButton>
                  <SocialIconButton aria-label="twitter" href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <TwitterIcon />
                  </SocialIconButton>
                  <SocialIconButton aria-label="linkedin" href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <LinkedInIcon />
                  </SocialIconButton>
                  <SocialIconButton aria-label="instagram" href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <InstagramIcon />
                  </SocialIconButton>
                </Box>
              </Grid>
            </Grid>

            {/* Copyright */}
            <Box sx={{ borderTop: '1px solid #eee', pt: 3, mt: 5, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} SmartHR. All rights reserved.
              </Typography>
            </Box>
          </Container>
        </StyledFooter>
      </div>
    </>
  );
};

export default HomePage;
