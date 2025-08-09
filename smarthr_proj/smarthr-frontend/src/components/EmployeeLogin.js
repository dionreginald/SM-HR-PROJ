// src/components/EmployeeLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Alert, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // For the success icon

// --- Styled Components for the New Design ---

const FullScreenContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f6f9fc', // Very light, cool background
  overflow: 'hidden',
  // On small screens, center the form
  [theme.breakpoints.down('md')]: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
}));

// Left Column for Login Form
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

// Right Column for Illustration
const IllustrationColumn = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  // Background for illustration side, complementary to form
  background: 'linear-gradient(135deg, #e0f0f5 0%, #cce7ee 100%)', // Soft blue/green gradient
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    display: 'none', // Hide on screens smaller than medium
  },
}));

const IllustrationImage = styled('img')({
  maxWidth: '90%',
  maxHeight: '80vh',
  objectFit: 'contain',
  animation: 'fadeInScale 1.2s ease-out forwards', // Animation for image entrance
  opacity: 0,
  transform: 'scale(0.9)',
  '@keyframes fadeInScale': {
    '0%': { opacity: 0, transform: 'scale(0.9)' },
    '100%': { opacity: 1, transform: 'scale(1)' },
  },
});

const IllustrationTagline = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(4),
  fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
  fontWeight: 600,
  color: '#34495e', // Darker text for readability
  textAlign: 'center',
  maxWidth: '80%',
  animation: 'slideInUp 1s ease-out forwards', // Animation for tagline
  opacity: 0,
  transform: 'translateY(20px)',
  '@keyframes slideInUp': {
    '0%': { opacity: 0, transform: 'translateY(20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
  animationDelay: '0.5s', // Delay tagline animation
}));

const EmployeeLoginCard = styled(Box)(({ theme, loginSuccess }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: theme.spacing(6, 5),
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
  maxWidth: '400px', // Adjusted for typical single column width
  width: '100%',
  textAlign: 'center',
  animation: 'fadeInUp 0.7s ease-out forwards', // Initial card fade-in
  opacity: 0,
  transform: 'translateY(20px)',
  '@keyframes fadeInUp': {
    '0%': { opacity: 0, transform: 'translateY(20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
  // Animation for success state: card shrinks and fades out
  ...(loginSuccess && {
    animation: 'cardShrinkFadeOut 0.5s ease-out forwards',
    '@keyframes cardShrinkFadeOut': {
      '0%': { opacity: 1, transform: 'translateY(0) scale(1)' },
      '100%': { opacity: 0, transform: 'translateY(-50px) scale(0.8)' },
    },
  }),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4, 3),
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(2.2rem, 4vw, 3rem)',
  fontWeight: 700,
  color: '#333333',
  marginBottom: theme.spacing(2),
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  color: '#6e7e90',
  marginBottom: theme.spacing(5),
  fontSize: '1.1rem',
}));

// Wrapper for form inputs to apply fade-out animation
const FormInputsWrapper = styled(Box)(({ theme, loginSuccess }) => ({
  overflow: 'hidden',
  transition: 'max-height 0.5s ease-out, opacity 0.4s ease-out 0.1s',
  maxHeight: '300px', // A height large enough for inputs
  opacity: 1,
  ...(loginSuccess && {
    maxHeight: '0',
    opacity: 0,
  }),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3.5),
  '& .MuiInput-underline:before': {
    borderBottom: '1px solid #e0e0e0',
    transition: 'border-bottom-color 0.3s ease-in-out',
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    borderBottom: '2px solid #a0a0a0',
  },
  '& .MuiInput-underline:after': {
    borderBottom: '2px solid #663399', // Primary purple on focus
    transform: 'scaleX(0)',
    transition: 'transform 0.3s ease-in-out',
  },
  '& .MuiInput-underline.Mui-focused:after': {
    transform: 'scaleX(1)',
  },
  '& .MuiInputBase-input': {
    padding: '12px 0px 10px',
    fontSize: '1.1rem',
    color: '#333333',
  },
  '& .MuiInputLabel-root': {
    color: '#909090',
    fontSize: '1.1rem',
    transform: 'translate(0, 12px) scale(1)',
    '&.Mui-focused': {
        color: '#663399',
    },
    '&.MuiFormLabel-filled': {
        transform: 'translate(0, -4px) scale(0.85)',
    },
    '&.Mui-focused.MuiInputLabel-shrink': {
        transform: 'translate(0, -4px) scale(0.85)',
    },
    '&.MuiInputLabel-shrink': {
      transform: 'translate(0, -4px) scale(0.85)',
    },
  },
}));

const LoginButton = styled(Button)(({ theme, loginSuccess }) => ({
  padding: theme.spacing(1.8, 5),
  borderRadius: '8px',
  fontSize: '1.2rem',
  fontWeight: 600,
  textTransform: 'none',
  backgroundColor: '#663399',
  color: 'white',
  boxShadow: '0 8px 25px rgba(102, 51, 153, 0.4)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, width 0.3s ease, padding 0.3s ease, border-radius 0.3s ease',
  '&:hover': {
    backgroundColor: '#552288',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 30px rgba(102, 51, 153, 0.5)',
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
  width: '100%',
  // Animation for success state: button becomes a circle
  ...(loginSuccess && {
    width: '56px', // Shrink to a circle (icon size)
    padding: theme.spacing(1.5), // Adjust padding for circle
    borderRadius: '50%', // Make it round
    backgroundColor: '#4CAF50', // Green for success
    boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)',
    '&:hover': {
      backgroundColor: '#4CAF50', // Keep green on hover
      transform: 'none',
      boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)',
    },
  }),
}));

const SuccessIcon = styled(CheckCircleIcon)(({ theme }) => ({
  fontSize: '28px',
  color: 'white',
  animation: 'scaleIn 0.3s ease-out forwards',
  '@keyframes scaleIn': {
    '0%': { transform: 'scale(0)' },
    '100%': { transform: 'scale(1)' },
  },
}));

const MessageAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '8px',
  textAlign: 'left',
}));

export default function EmployeeLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false); // New state for success animation
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    setLoginSuccess(false); // Reset success state on new attempt

    try {
      const response = await fetch('http://localhost/smarthr_proj/employee_login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('employee', JSON.stringify(data.user));
        //setMessage('Login successful!'); // Message will fade out with card
        setLoginSuccess(true); // Trigger success animation

        setTimeout(() => {
          navigate('/employee-dashboard');
        }, 1000); // Wait for card shrink animation to complete (0.5s card + 0.3s icon + buffer)
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FullScreenContainer>
      {/* Left Column for Login Form */}
      <FormColumn>
        {/* Pass loginSuccess prop to EmployeeLoginCard to trigger its animation */}
        <EmployeeLoginCard loginSuccess={loginSuccess}>
          <Title variant="h4">Login</Title>
          <Subtitle variant="body1">
            Welcome back! Please enter your details.
          </Subtitle>

          {/* Message Alert: only show if not in success state */}
          {message && !loginSuccess && (
            <MessageAlert severity={message.includes('successful') ? 'success' : 'error'}>
              {message}
            </MessageAlert>
          )}

          {/* Wrapper for inputs to animate their disappearance */}
          <FormInputsWrapper loginSuccess={loginSuccess}>
            <form onSubmit={handleLogin}>
              <StyledTextField
                fullWidth
                label="Email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                variant="standard"
                required
                autoComplete="email"
                disabled={loading || loginSuccess} // Disable inputs during loading/success
              />

              <StyledTextField
                fullWidth
                label="Password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                variant="standard"
                required
                autoComplete="current-password"
                disabled={loading || loginSuccess} // Disable inputs during loading/success
              />

              <LoginButton
                type="submit"
                variant="contained"
                disabled={loading || loginSuccess} // Disable during loading/success
                loginSuccess={loginSuccess} // Pass prop to button for styling
              >
                {/* Conditionally render content based on loading/success state */}
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : loginSuccess ? (
                  <SuccessIcon />
                ) : (
                  'Log In'
                )}
              </LoginButton>
            </form>
          </FormInputsWrapper>

          {/* Links should disappear once the login is successful and the card starts animating out */}
          {!loginSuccess && (
            <>
            </>
          )}
        </EmployeeLoginCard>
      </FormColumn>

      {/* Right Column for Illustration */}
      <IllustrationColumn>
        <IllustrationImage
          src="/images/your-illustration.gif" // **IMPORTANT: Replace with your actual illustration image path**
          alt="Login Illustration"
          onLoad={(e) => {
            // Optional: ensures animation plays if image loads slowly
            e.target.style.opacity = 1;
            e.target.style.transform = 'scale(1)';
          }}
        />
        <IllustrationTagline variant="h6">
          Your path to a smarter workforce starts here.
        </IllustrationTagline>
      </IllustrationColumn>
    </FullScreenContainer>
  );
}