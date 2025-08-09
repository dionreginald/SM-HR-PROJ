import React, { useState } from 'react';
import axios from 'axios';
import MacOsTopNavbar from './MacOsTopNavbar';

// Material-UI Imports
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles'; // <-- Import useTheme and alpha

// Material-UI Icons
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SendIcon from '@mui/icons-material/Send';

// --- Styled Components for a Consistent and Aligned Look ---

const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  // --- FIXED: Use theme.palette for background color ---
  backgroundColor: theme.palette.background.default,
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  marginTop: '90px', // Space below the MacOsTopNavbar
  display: 'flex',
  justifyContent: 'center', // Center the content horizontally
  alignItems: 'flex-start', // Align content to the top of its container
  padding: theme.spacing(3), // Consistent padding around the content
  paddingTop: theme.spacing(8), // Add extra top padding to push it down from the very top
  minHeight: 'calc(100vh - 90px)',
  // --- FIXED: Use theme.palette for background gradient ---
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(to right, ${theme.palette.background.default}, ${alpha(theme.palette.background.default, 0.9)})`
    : `linear-gradient(to right, ${theme.palette.grey[50]}, ${theme.palette.grey[100]})`,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4), // Adjusted for smaller screens
  },
}));

const ContentPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 600,
  width: '100%',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 3,
  // --- FIXED: Use theme.palette for background color and boxShadow ---
  backgroundColor: alpha(theme.palette.background.paper, 0.9), // Use paper background with opacity
  backdropFilter: 'blur(15px)',
  boxShadow: theme.palette.mode === 'dark'
    ? `0 12px 30px ${alpha(theme.palette.common.black, 0.6)}`
    : '0 12px 30px rgba(0,0,0,0.15)',
  animation: 'fadeInUp 0.8s ease-out forwards',
  '@keyframes fadeInUp': {
    "0%": { opacity: 0, transform: "translateY(30px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(3),
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1.5),
  fontSize: '1.8rem',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 1.5,
    // --- FIXED: Ensure TextField background and border colors adapt ---
    backgroundColor: alpha(theme.palette.background.default, 0.7), // Use a slightly transparent default background
    '& fieldset': { borderColor: theme.palette.divider },
    '&:hover fieldset': { borderColor: theme.palette.primary.main },
    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main, borderWidth: '2px' },
  },
  '& .MuiInputBase-input': { // Target the actual input text
    color: theme.palette.text.primary,
  },
  '& .MuiInputLabel-root': { // Target the label
    color: theme.palette.text.secondary,
  },
  marginBottom: theme.spacing(3),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText, // Use contrastText for text on primary background
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.shape.borderRadius * 1.5,
  fontWeight: 'bold',
  textTransform: 'none',
  transition: 'background-color 0.3s ease-in-out, transform 0.2s ease-out, box-shadow 0.2s ease-out',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'translateY(-2px)',
    // --- FIXED: Adjust hover boxShadow for dark mode ---
    boxShadow: theme.palette.mode === 'dark'
      ? `0 6px 15px ${alpha(theme.palette.primary.main, 0.4)}`
      : '0 6px 15px rgba(0,0,0,0.2)',
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

export default function AdminNotificationSender() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const theme = useTheme(); // <-- Access the theme object here

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    setLoading(true);

    if (!title.trim() || !message.trim()) {
      setStatusMsg('Title and message are required.');
      setLoading(false);
      return;
    }

    const payload = {
      title: title.trim(),
      message: message.trim(),
      employee_id: null,
    };

    try {
      const res = await axios.post('http://localhost/smarthr_proj/send_notification.php', payload);
      if (res.data.status === 'success') {
        setStatusMsg('Notification sent successfully!');
        setTitle('');
        setMessage('');
      } else {
        setStatusMsg(res.data.message || 'Failed to send notification.');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      setStatusMsg('Error sending notification. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <MacOsTopNavbar />
      <MainContent>
        <ContentPaper elevation={4}>
          <SectionTitle variant="h5">
            <NotificationsActiveIcon fontSize="inherit" sx={{ mr: 1 }} />
            Send Announcement to All Employees
          </SectionTitle>

          {statusMsg && (
            <Alert
              severity={statusMsg.includes('success') ? 'success' : 'error'}
              sx={{
                mb: 3,
                borderRadius: 2,
                // --- FIXED: Ensure Alert background and text colors also adapt ---
                backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.9) : undefined,
                color: theme.palette.text.primary,
              }}
            >
              {statusMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <StyledTextField
              fullWidth
              label="Title of Announcement"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
            />

            <StyledTextField
              fullWidth
              label="Your Message"
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              multiline
              required
              disabled={loading}
            />

            <StyledButton
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            >
              {loading ? 'Sending...' : 'Send to All Employees'}
            </StyledButton>
          </form>
        </ContentPaper>
      </MainContent>
    </PageContainer>
  );
}