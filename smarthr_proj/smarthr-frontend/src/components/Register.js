import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/system';

// --- Styled Components ---

// FullScreenContainer: Now back to a row-based flex container
const FullScreenContainer = styled(Box)(({ theme }) => ({
  display: 'flex', // Arrange children in a row
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #eef2f5 0%, #dbe3e8 100%)',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    justifyContent: 'center', // Center content on small screens when one column is hidden
    alignItems: 'center',
    padding: theme.spacing(2),
  },
}));

// FormColumn: For the form, now on the LEFT
const FormColumn = styled(Box)(({ theme }) => ({
  flex: 1, // Takes less space (e.g., 1/3 of the width)
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    flex: 'none', // Remove flex on small screens
    width: '100%', // Take full width
  },
}));

// IllustrationColumn: For the illustration, now on the RIGHT
const IllustrationColumn = styled(Box)(({ theme }) => ({
  flex: 2, // This column takes more space (e.g., 2/3 of the width) for the huge pic
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  position: 'relative',
  // Optional: Add a background gradient to the illustration column itself
  // background: 'linear-gradient(135deg, #a8dadc 0%, #457b9d 100%)',
  overflow: 'hidden', // Crucial: ensure image doesn't overflow
  [theme.breakpoints.down('md')]: {
    display: 'none', // Hide on screens smaller than medium
  },
}));

// IllustrationImage: For the huge illustration
const IllustrationImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '100vh', // Allow it to take up full viewport height
  objectFit: 'cover', // IMPORTANT: Cover the entire space, cropping if necessary
  animation: 'fadeInRight 1s ease-out forwards', // Animation: slide in from RIGHT
  opacity: 0,
  transform: 'translateX(50px)', // Initial offset for fadeInRight
});

// RegisterFormCard: The card containing the form
const RegisterFormCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  padding: theme.spacing(6, 5),
  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
  maxWidth: '480px',
  width: '100%',
  textAlign: 'center',
  animation: 'slideInLeft 1s ease-out forwards', // Animation: slide in from LEFT
  opacity: 0,
  transform: 'translateX(-50px)', // Initial offset for slideInLeft
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4, 3),
  },
}));

// Title: Heading style
const Title = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(2rem, 4vw, 2.8rem)',
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(45deg, #1a237e 30%, #42a5f5 90%)',
  '-webkit-background-clip': 'text',
  '-webkit-text-fill-color': 'transparent',
}));

// StyledTextField: Input field style
const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '& fieldset': {
      borderColor: '#e0e0e0',
    },
    '&:hover fieldset': {
      borderColor: '#c0c0c0',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#007aff',
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#777',
  },
  '& .MuiInputBase-input': {
    padding: '14px 16px',
  },
}));

// RegisterButton: Button style
const RegisterButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: '30px',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(45deg, #007aff 30%, #00c6ff 90%)',
  boxShadow: '0 4px 15px rgba(0, 122, 255, 0.3)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 122, 255, 0.4)',
    background: 'linear-gradient(45deg, #005bb5 30%, #0099e6 90%)',
  },
  color: '#ffffff',
  width: '100%',
  '&.Mui-disabled': {
    background: '#b0d9ff',
    color: '#fff',
    boxShadow: 'none',
  },
}));

// MessageText: For displaying success/error messages
const MessageText = styled(Typography)(({ theme, type }) => ({
  marginTop: theme.spacing(2),
  fontSize: '0.95rem',
  color: type === 'error' ? '#d32f2f' : type === 'success' ? '#2e7d32' : '#555',
  animation: 'fadeIn 0.5s ease-out',
}));

// --- Component Logic ---

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    full_name: '',
    position: '',
    contact_number: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setMessageType('');
    setLoading(true);

    const trimmedForm = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v])
    );

    if (!trimmedForm.position) {
      setMessage('Please select a position.');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost/smarthr_proj/admin_register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trimmedForm),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('Admin registered successfully! Redirecting to login...');
        setMessageType('success');
        setForm({
          username: '',
          password: '',
          full_name: '',
          position: '',
          contact_number: '',
        });
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setMessage('Error: ' + (data.message || 'Unknown error'));
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <FullScreenContainer>
      {/* Left Column for Register Form */}
      <FormColumn>
        <RegisterFormCard>
          <Title variant="h4">Register Admin</Title>
          <Typography variant="body1" sx={{ color: '#777', mb: 4 }}>
            Create a new administrator account
          </Typography>
          <form onSubmit={handleSubmit} autoComplete="off">
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
              autoComplete="new-password"
            />
            <StyledTextField
              fullWidth
              label="Full Name"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              variant="outlined"
              required
              autoComplete="name"
            />
            <StyledTextField
              fullWidth
              select
              label="Position"
              name="position"
              value={form.position}
              onChange={handleChange}
              variant="outlined"
              required
              sx={{ marginBottom: 3 }}
            >
              <MenuItem value="">Select Position</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
            </StyledTextField>
            <StyledTextField
              fullWidth
              label="Contact Number"
              name="contact_number"
              value={form.contact_number}
              onChange={handleChange}
              variant="outlined"
              autoComplete="tel"
              type="tel"
            />
            <RegisterButton type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register Admin'}
            </RegisterButton>
          </form>

          {message && <MessageText type={messageType}>{message}</MessageText>}

          <Typography variant="body2" sx={{ mt: 3, color: '#777' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'none', color: '#007aff', fontWeight: 500 }}>
              Login here
            </Link>
          </Typography>
        </RegisterFormCard>
      </FormColumn>

      {/* Right Column for Illustration (HUGE - takes flex: 2 space) */}
      <IllustrationColumn>
        <IllustrationImage
          src="/images/register-illustration.png" // IMPORTANT: Set a different path for register pic!
          alt="Register Illustration"
        />
      </IllustrationColumn>
    </FullScreenContainer>
  );
}