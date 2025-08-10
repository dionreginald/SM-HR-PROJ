import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

// Import Material-UI Icons
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import PaidIcon from '@mui/icons-material/Paid';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import CodeIcon from '@mui/icons-material/Code';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

// Styled Card for features
const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12)',
  },
  backgroundColor: '#ffffff',
}));

// Styled Image for features - ensuring it sits at the top of the card
const FeatureImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 300, // Fixed height for consistent image size
  objectFit: 'cover', // Cover ensures images fill the space without distortion, cropping if necessary
  borderTopLeftRadius: theme.shape.borderRadius * 2,
  borderTopRightRadius: theme.shape.borderRadius * 2,
  marginBottom: theme.spacing(2), // Space below the image
}));

// Styled Icon container - positioned slightly differently to be below the image
const FeatureIconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: '#e0f2f7', // Light blue background
  color: '#007aff', // Apple blue icon color
  borderRadius: '50%',
  width: 50, // Slightly smaller icon
  height: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute', // Positioning it over the card for a more integrated look
  top: '155px', // Adjust as needed to overlap the image and content area
  left: '50%', // Center horizontally
  transform: 'translateX(-50%)', // Adjust for centering
  zIndex: 1, // Ensure it's above other elements
  boxShadow: '0 4px 12px rgba(0, 122, 255, 0.1)',
}));

// Styled components for the Footer
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

const FeaturesPage = () => {
  const features = [
    {
      icon: <LockOpenIcon sx={{ fontSize: 26 }} />,
      image: 'https://miro.medium.com/v2/resize:fit:1400/1*tO75phy4qIPz-S7sG0n7kQ.gif',
      title: 'Authentication & Admin Access',
      description: 'Secure login and registration system for administrators. Admins can register for an account, log in using secure credentials, and update their passwords when needed. These features ensure that only authorized personnel can access sensitive HR data.',
    },
    {
      icon: <PersonIcon sx={{ fontSize: 26 }} />,
      image: 'https://assets-v2.lottiefiles.com/a/7ed64552-1180-11ee-a916-ab928951c9e0/YzDI1yWTq3.gif',
      title: 'Admin Profile Management',
      description: 'Personalized admin dashboard and profile control. Administrators can view and update their personal profile information, ensuring that user records are accurate and up to date. This includes name, contact details, and profile-specific settings.',
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 26 }} />,
      image: 'https://i.pinimg.com/originals/8b/04/c9/8b04c9405a307df013312b2057e791fe.gif',
      title: 'Employee Management',
      description: 'Full-featured employee data management system. Admins can add new employees, edit existing details, delete records, or view comprehensive employee profiles. This module helps maintain a centralized and organized employee database.',
    },
    {
      icon: <PaidIcon sx={{ fontSize: 26 }} />,
      image: 'https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyYWYwZm96MWN0eWlsa3hxbDE1MHdnZTFrOXM3bHhmM2ZzMHJsam95MiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/cJFQJzZxFMhONxDTnt/source.gif',
      title: 'Payroll Management',
      description: 'Automated payroll generation and viewing. Admins can create payroll entries for each employee based on salary and other factors. Employees can view their individual payroll details, ensuring transparency and timely salary disbursements.',
    },
    {
      icon: <EventAvailableIcon sx={{ fontSize: 26 }} />,
      image: 'https://www.simplepay.com.sg/blog/assets/images/2016/01/waving.gif',
      title: 'Leave Request Management',
      description: 'Manage and monitor employee leave requests. Leave applications submitted by employees are visible in the admin dashboard. Admins can view, approve, or decline requests, streamlining the leave approval workflow.',
    },
    {
      icon: <DashboardIcon sx={{ fontSize: 26 }} />,
      image: 'https://cdn.document360.io/4749ddf8-aa05-4f3f-80e1-07a5d2d0f137/Images/Documentation/Drill%20By%20-%20Main.gif',
      title: 'Dashboard Overview',
      description: 'Interactive admin dashboard with real-time data. The dashboard aggregates key metrics such as total employees, pending leave requests, and generated payrolls. This gives the admin a high-level overview of HR operations.',
    },
    {
      icon: <StorageIcon sx={{ fontSize: 26 }} />,
      image: 'https://cdn.dribbble.com/userupload/22252775/file/original-ef70ecef4b9bf27b385020aad29b0ea2.gif',
      title: 'Database Connectivity',
      description: 'Centralized and secure data handling. A dedicated database configuration file (db.php) manages secure connections to the MySQL database. All user and employee data is stored and retrieved via structured queries.',
    },
    {
      icon: <CodeIcon sx={{ fontSize: 26 }} />,
      image: 'https://i.pinimg.com/originals/5c/8f/08/5c8f08b5fe55e12baae6fc54e46c343a.gif',
      title: 'PHP Dependency Management (Composer)',
      description: 'Robust and maintainable codebase using Composer. The project uses Composer to manage PHP libraries and dependencies. This improves the maintainability of the code and allows integration of additional packages in the future.',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f7', py: 10, pt: 12 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#333' }}>
            Our Core Features
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 700, mx: 'auto' }}>
            Discover the powerful tools SmartHR offers to streamline your HR operations and empower your workforce.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard sx={{ position: 'relative' }}>
                <FeatureImage src={feature.image} alt={feature.title} />
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', position: 'absolute', top: 155, left: 0 }}>
                  <FeatureIconWrapper>
                    {feature.icon}
                  </FeatureIconWrapper>
                </Box>
                <CardContent sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  pt: 6,
                  pb: 4,
                  px: 3
                }}>
                  <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: '#444' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>
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
                <img src="/images/smarthr-logo.png" alt="SmartHR Logo" style={{ height: 40, marginRight: 10 }} />
                <Typography variant="h6" sx={{ color: '#333', fontWeight: 600 }}>
                  SmartHR
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                SmartHR is a comprehensive Human Resources Management System designed to streamline HR operations,
                from employee management and payroll to leave requests and notifications.
              </Typography>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={6} sm={4} md={2}>
              <Typography variant="h6" gutterBottom sx={{ color: '#333', fontWeight: 600, mb: 2 }}>
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
              <Typography variant="h6" gutterBottom sx={{ color: '#333', fontWeight: 600, mb: 2 }}>
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
              <Typography variant="h6" gutterBottom sx={{ color: '#333', fontWeight: 600, mb: 2 }}>
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
                <SocialIconButton aria-label="facebook" href="https://facebook.com" target="_blank">
                  <FacebookIcon />
                </SocialIconButton>
                <SocialIconButton aria-label="twitter" href="https://twitter.com" target="_blank">
                  <TwitterIcon />
                </SocialIconButton>
                <SocialIconButton aria-label="linkedin" href="https://linkedin.com" target="_blank">
                  <LinkedInIcon />
                </SocialIconButton>
                <SocialIconButton aria-label="instagram" href="https://instagram.com" target="_blank">
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
    </Box>
  );
};

export default FeaturesPage;