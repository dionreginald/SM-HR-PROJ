// src/pages/EmployeeNotificationsList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Material-UI Imports
import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  Avatar,
  Paper,
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';

// Material-UI Icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsIcon from '@mui/icons-material/Notifications';

// --- Styled Components ---

const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  padding: theme.spacing(3),
  paddingTop: theme.spacing(10),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(8),
  },
}));

const MainContentWrapper = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  margin: 'auto',
  maxWidth: 800,
  width: '100%',
}));

const NotificationCardContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5), // Space between notification cards
  animation: 'fadeInUp 0.8s ease-out forwards',
  '@keyframes fadeInUp': {
    "0%": { opacity: 0, transform: "translateY(20px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
}));

const NotificationCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.shape.borderRadius * 2, // Rounded corners for card style
  backgroundColor: alpha(theme.palette.background.paper, 0.9), // Slightly transparent for a modern feel
  display: 'flex',
  alignItems: 'flex-start',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  boxShadow: `0 4px 10px ${alpha(theme.palette.common.black, 0.1)}`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 6px 15px ${alpha(theme.palette.common.black, 0.15)}`,
  },
}));

const ContentBox = styled(Box)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
});

const NotificationHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.5),
}));

const NotificationAvatar = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  marginRight: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: '1rem',
  fontWeight: 600,
}));

const NotificationTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  fontSize: '1.05rem',
  lineHeight: 1.3,
  display: 'flex',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem',
    verticalAlign: 'middle',
    marginRight: theme.spacing(1),
  },
}));

const NotificationMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.9rem',
  whiteSpace: 'normal',
}));

const NotificationTimestamp = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  marginLeft: 'auto', // Push to the right
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

// Add this missing styled component
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));

// --- EmployeeNotificationsList Component ---

export default function EmployeeNotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');

  const employee = JSON.parse(localStorage.getItem('employee'));
  const theme = useTheme();

  const getNotificationIcon = (title) => {
    const lowerTitle = String(title).toLowerCase();
    if (lowerTitle.includes('approved') || lowerTitle.includes('success')) {
      return <CheckCircleOutlineIcon fontSize="inherit" sx={{ color: theme.palette.success.main }} />;
    }
    if (lowerTitle.includes('rejected') || lowerTitle.includes('error') || lowerTitle.includes('failed')) {
      return <ErrorOutlineIcon fontSize="inherit" sx={{ color: theme.palette.error.main }} />;
    }
    return <InfoOutlinedIcon fontSize="inherit" sx={{ color: theme.palette.info.main }} />;
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string' || name.trim() === '') return 'HR';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const fetchNotifications = async () => {
    if (!employee?.id) {
      setSnackbarMessage('Employee not logged in. Cannot fetch notifications.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`http://localhost/smarthr_proj/get_notifications.php?employee_id=${employee.id}`);
      if (res.data.status === 'success') {
        setNotifications(res.data.data);
        if (res.data.data.length === 0) {
          setSnackbarMessage('No notifications to show.');
          setSnackbarSeverity('info');
          setSnackbarOpen(true);
        }
      } else {
        setSnackbarMessage('Failed to load notifications: ' + (res.data.message || 'Unknown error.'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setSnackbarMessage('Network or server error loading notifications.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee?.id]);

  return (
    <PageContainer>
      <MainContentWrapper>
        <Box sx={{ width: '100%' }}>
          <SectionTitle variant="h5">
            <NotificationsIcon fontSize="inherit" /> Your Notifications
          </SectionTitle>
          <Divider sx={{ mb: 3 }} />

          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200 }}>
              <CircularProgress size={40} sx={{ color: theme.palette.primary.main }} />
              <Typography variant="body1" sx={{ mt: 2, color: theme.palette.text.secondary }}>
                Loading notifications...
              </Typography>
            </Box>
          ) : (
            notifications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="h6" color="text.secondary">
                  No notifications to show.
                </Typography>
                <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                  Your notification list is currently empty.
                </Typography>
              </Box>
            ) : (
              <NotificationCardContainer>
                {notifications.map(n => (
                  <NotificationCard key={n.id}>
                    <NotificationAvatar src={n.sender_avatar_url}>
                      {getInitials(n.sender_name || 'HR')}
                    </NotificationAvatar>
                    <ContentBox>
                      <NotificationHeader>
                        <NotificationTitle variant="body1" component="span">
                          {getNotificationIcon(n.title)} {n.title}
                        </NotificationTitle>
                        <NotificationTimestamp variant="caption" component="span">
                          <AccessTimeIcon fontSize="inherit" /> {new Date(n.created_at).toLocaleString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                          })}
                        </NotificationTimestamp>
                      </NotificationHeader>
                      <NotificationMessage variant="body2" component="span">
                        {n.message}
                      </NotificationMessage>
                    </ContentBox>
                  </NotificationCard>
                ))}
              </NotificationCardContainer>
            )
          )}
        </Box>
      </MainContentWrapper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{
            width: '100%',
            backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.9) : undefined,
            color: theme.palette.text.primary,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
}