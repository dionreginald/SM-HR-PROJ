// src/components/Login.js
import React, { useState } from 'react';
import { TextField, Button, Typography, Box,} from '@mui/material'; // Removed IconButton
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
// Removed social login icon imports (GoogleIcon, AppleIcon, FacebookIcon)

// Styled Box for the main page container (full viewport)
const FullScreenContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh', // Ensure it takes full viewport height
  // Soft, clean gradient matching the Dribbble shot
  background: 'linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)',
  overflow: 'hidden', // Prevent scrollbars from animation
  [theme.breakpoints.down('md')]: {
    justifyContent: 'center', // Center content on small screens
    alignItems: 'center',
    padding: theme.spacing(2),
  },
}));

// Styled Box for the left (illustration) column
const IllustrationColumn = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column', // Align content vertically
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    display: 'none', // Hide on screens smaller than medium
  },
}));

// Styled image for the illustration
const IllustrationImage = styled('img')({
  maxWidth: '90%',
  maxHeight: '80vh', // Limit height
  objectFit: 'contain',
  // Animation for image entrance
  animation: 'slideInLeft 1s ease-out forwards',
  opacity: 0,
  transform: 'translateX(-50px)',
  '@keyframes slideInLeft': {
    '0%': { opacity: 0, transform: 'translateX(-50px)' },
    '100%': { opacity: 1, transform: 'translateX(0)' },
  },
});

// Optional: Add a tagline/branding text for the illustration side
const IllustrationTagline = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(4),
  fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
  fontWeight: 600,
  color: theme.palette.text.secondary,
  textAlign: 'center',
  maxWidth: '80%',
  animation: 'fadeIn 1.2s ease-out forwards',
  opacity: 0,
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
}));


// Styled Box for the right (form) column
const FormColumn = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    flex: 'none',
    width: '100%',
  },
}));

// Styled Box for the login form card
const LoginFormCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '24px', // More rounded, matching Dribbble shot
  padding: theme.spacing(6, 5),
  // Softer, more diffused shadow
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), 0 8px 20px rgba(0, 0, 0, 0.05)',
  maxWidth: '480px',
  width: '100%',
  textAlign: 'center',
  // Animation for card entrance
  animation: 'fadeInRight 1s ease-out forwards',
  opacity: 0,
  transform: 'translateX(50px)',
  '@keyframes fadeInRight': {
    '0%': { opacity: 0, transform: 'translateX(50px)' },
    '100%': { opacity: 1, transform: 'translateX(0)' },
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4, 3),
  },
}));

// Styled Typography for the title (e.g., "Welcome Back!")
const Title = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(2rem, 4vw, 2.8rem)',
  fontWeight: 700,
  marginBottom: theme.spacing(4),
  // Gradient text from Dribbble shot
  background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)', // Adjusted gradient for Material-ish blue
  '-webkit-background-clip': 'text',
  '-webkit-text-fill-color': 'transparent',
}));

// Styled TextField for input fields
const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px', // Rounded input fields
    backgroundColor: '#f5f8fa', // Light background for input area
    '& fieldset': {
      borderColor: '#e0e0e0',
      transition: 'border-color 0.3s ease',
    },
    '&:hover fieldset': {
      borderColor: '#c0c0c0',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main, // Primary color on focus
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#777',
  },
  '& .MuiInputBase-input': {
    padding: '14px 16px', // Comfortable padding
  },
}));

// Styled Button for login action
const LoginButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: '12px', // Match input field rounding
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  // Vibrant gradient from Dribbble shot
  background: 'linear-gradient(45deg, #007bff 30%, #00c6ff 90%)',
  boxShadow: '0 8px 25px rgba(0, 122, 255, 0.35)', // Deeper shadow
  transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)', // More pronounced lift
    boxShadow: '0 12px 30px rgba(0, 122, 255, 0.5)', // Even deeper shadow on hover
    background: 'linear-gradient(45deg, #005bb5 30%, #0099e6 90%)', // Slightly darker gradient on hover
  },
  color: '#ffffff',
  width: '100%',
}));

// Styled Typography for messages
const MessageText = styled(Typography)(({ theme, type }) => ({
  marginTop: theme.spacing(2),
  fontSize: '0.95rem',
  color: type === 'error' ? theme.palette.error.main : type === 'success' ? theme.palette.success.main : theme.palette.text.secondary,
  animation: 'fadeIn 0.5s ease-out',
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
}));

// SocialButton and related styles removed as they are no longer needed

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('Logging in...');
    setMessageType('');

    try {
      const currentDateTime = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Colombo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      console.log(`Login attempt at ${currentDateTime}`);

      const res = await fetch('http://localhost/smarthr_proj/admin_login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Login successful!');
        setMessageType('success');
        localStorage.setItem('admin', JSON.stringify(data.admin));
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        setMessage('Error: ' + data.message);
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
      setMessageType('error');
    }
  }

  return (
    <FullScreenContainer>
      {/* Left Column for Illustration */}
      <IllustrationColumn>
        <IllustrationImage
          src="/images/login-illustration-v2.gif" // Placeholder image path - REPLACE WITH YOUR DRIBBBLE-STYLE ILLUSTRATION
          alt="Login Illustration"
          onLoad={(e) => {
            // Optional: Trigger animation once image is loaded
            e.target.style.opacity = 1;
            e.target.style.transform = 'translateX(0)';
          }}
        />
        <IllustrationTagline variant="h6">
          Streamline Your HR, Empower Your Team.
        </IllustrationTagline>
      </IllustrationColumn>

      {/* Right Column for Login Form */}
      <FormColumn>
        <LoginFormCard>
          <Title variant="h4">Welcome Back!</Title>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to your Admin account.
          </Typography>
          <form onSubmit={handleSubmit}>
            <StyledTextField
              fullWidth
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              variant="outlined"
              required
              autoComplete="username"
            />
            <StyledTextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              variant="outlined"
              required
              autoComplete="current-password"
            />
            <LoginButton type="submit" variant="contained">
              Sign In
            </LoginButton>
          </form>

          {message && <MessageText type={messageType}>{message}</MessageText>}

          {/* Social login section removed */}
          {/* Divider and social buttons are no longer rendered */}
          
          <Typography variant="body2" sx={{ mt: 3, color: '#777' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ textDecoration: 'none', color: '#007aff', fontWeight: 500 }}>
              Register here
            </Link>
          </Typography>
        </LoginFormCard>
      </FormColumn>
    </FullScreenContainer>
  );
}