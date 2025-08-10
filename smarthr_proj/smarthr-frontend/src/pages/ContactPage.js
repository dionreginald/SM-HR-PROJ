import React, { useState } from 'react';
import { Box, Typography, Container, TextField, Button, Grid, CircularProgress, Snackbar, Alert, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

// Import Social Media Icons for the footer and contact info
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Styled components for the Footer (retained for consistency)
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

// Styled components for the Contact Page
const ContactCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(6),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4),
  },
}));

const StyledSubmitButton = styled(Button)(({ theme }) => ({
  padding: '12px 30px',
  borderRadius: '30px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(45deg, #007aff 30%, #00c6ff 90%)',
  boxShadow: '0 4px 10px rgba(0, 122, 255, 0.2)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 15px rgba(0, 122, 255, 0.3)',
    background: 'linear-gradient(45deg, #005bb5 30%, #0099e6 90%)',
  },
  '&.Mui-disabled': {
    background: '#ccc',
    color: '#666',
    boxShadow: 'none',
  },
}));

const ContactInfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  color: '#555',
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1.5),
    color: '#007aff',
    fontSize: '1.5rem',
  },
}));

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseSeverity, setResponseSeverity] = useState('success');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponseMessage('');
    setSnackbarOpen(false);

    // Basic client-side validation
    if (!formData.name || !formData.email || !formData.message) {
      setResponseMessage('Please fill in all required fields.');
      setResponseSeverity('error');
      setSnackbarOpen(true);
      setIsLoading(false);
      return;
    }

    const API_ENDPOINT = 'http://localhost/smarthr_proj/contact.php'; // Adjust if your PHP is hosted elsewhere

    let retries = 0;
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    while (retries < maxRetries) {
      try {
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (result.success) {
          setResponseMessage(result.message);
          setResponseSeverity('success');
          setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
        } else {
          setResponseMessage(result.message || 'An unknown error occurred.');
          setResponseSeverity('error');
        }
        setSnackbarOpen(true);
        break; // Exit loop on success or clear error response
      } catch (error) {
        retries++;
        if (retries < maxRetries) {
          const delay = baseDelay * Math.pow(2, retries - 1); // Exponential backoff
          await new Promise(res => setTimeout(res, delay));
        } else {
          setResponseMessage('Failed to connect to the server. Please try again later.');
          setResponseSeverity('error');
          setSnackbarOpen(true);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f0f2f5', pt: 8 }}>
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#333' }}>
            Get in Touch
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 700, mx: 'auto' }}>
            We'd love to hear from you! Whether you have questions, feedback, or need support, our team is here to help.
          </Typography>
        </Box>

        <ContactCard>
          <Grid container spacing={5}>
            {/* Contact Form */}
            <Grid item xs={12} md={7}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#333', mb: 3 }}>
                Send Us a Message
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      variant="outlined"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Email"
                      name="email"
                      type="email"
                      variant="outlined"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      variant="outlined"
                      value={formData.subject}
                      onChange={handleChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Your Message"
                      name="message"
                      multiline
                      rows={5}
                      variant="outlined"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledSubmitButton
                      type="submit"
                      fullWidth
                      disabled={isLoading}
                    >
                      {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send Message'}
                    </StyledSubmitButton>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} md={5}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#333', mb: 3 }}>
                Our Contact Details
              </Typography>
              <ContactInfoItem>
                <LocationOnIcon />
                <Typography variant="body1">
                  123 HR Solutions St., Suite 400, Business City
                </Typography>
              </ContactInfoItem>
              <ContactInfoItem>
                <EmailIcon />
                <Typography variant="body1">
                  info@smarthr.com
                </Typography>
              </ContactInfoItem>
              <ContactInfoItem>
                <PhoneIcon />
                <Typography variant="body1">
                  +1 (555) 123-4567
                </Typography>
              </ContactInfoItem>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
                  Connect With Us
                </Typography>
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
        </ContactCard>
      </Container>

      {/* Snackbar for messages */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={responseSeverity} sx={{ width: '100%' }}>
          {responseMessage}
        </Alert>
      </Snackbar>

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

export default ContactPage;