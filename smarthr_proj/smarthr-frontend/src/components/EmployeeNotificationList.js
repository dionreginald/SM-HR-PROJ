// src/pages/EmployeeNotificationsList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Material-UI Imports
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  Avatar,
  // Button, // Removed as Mark All Read button is no longer needed
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';

// Material-UI Icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import DoneAllIcon from '@mui/icons-material/DoneAll'; // Removed as Mark All Read button icon is no longer needed

// --- Styled Components (simplified for all-notifications display) ---

const PageContainer = styled(Box)(({ theme }) => ({
  maxWidth: 800,
  margin: '40px auto',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.palette.mode === 'dark'
    ? `0 10px 30px ${alpha(theme.palette.common.black, 0.4)}`
    : `0 10px 30px rgba(0, 0, 0, 0.1)`,
  [theme.breakpoints.down('sm')]: {
    margin: '20px 10px',
    padding: theme.spacing(2),
  },
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(2),
}));

// Simplified NotificationListItem - no more 'isRead' prop for background color
const NotificationListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  transition: 'background-color 0.3s ease',
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const NotificationAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  marginRight: theme.spacing(1.5),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: '0.9rem',
  fontWeight: 600,
}));

// Simplified NotificationTitle - no more 'isRead' prop for text color/opacity
const NotificationTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  fontSize: '0.95rem',
  lineHeight: 1.3,
  display: 'flex',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
    verticalAlign: 'middle',
    marginRight: theme.spacing(0.5),
  }
}));

// Simplified NotificationMessage - no more 'isRead' prop for text color/opacity
const NotificationMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.85rem',
  marginTop: theme.spacing(0.5),
  whiteSpace: 'normal',
}));

// Simplified NotificationTimestamp - no more 'isRead' prop for text color/opacity
const NotificationTimestamp = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

// MarkAllReadButton is removed as per requirements

export default function EmployeeNotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');

  const employee = JSON.parse(localStorage.getItem('employee'));
  const theme = useTheme(); // theme is still useful for other styled components

  const getNotificationIcon = (title) => {
    const lowerTitle = String(title).toLowerCase();
    if (lowerTitle.includes('approved') || lowerTitle.includes('success')) {
      return <CheckCircleOutlineIcon fontSize="inherit" color="success" />;
    }
    if (lowerTitle.includes('rejected') || lowerTitle.includes('error') || lowerTitle.includes('failed')) {
      return <ErrorOutlineIcon fontSize="inherit" color="error" />;
    }
    return <InfoOutlinedIcon fontSize="inherit" color="info" />;
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string' || name.trim() === '') return 'HR';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Simplified fetch function - no marking as read
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
        // No need for is_read or is_archived mapping if not used for logic/display
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
      console.error('Error fetching notifications:', error); // Simplified log message
      setSnackbarMessage('Network or server error loading notifications. Please check console.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(); // Only fetch, no mark as read logic
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee?.id]); // Re-run when employee ID changes

  // We now simply use the 'notifications' state directly, no filtering for active/archived
  // unless you explicitly want to add a filter later.
  const displayNotifications = notifications;

  return (
    <PageContainer>
      <HeaderBox>
        <Typography variant="h4" fontWeight={600} color="text.primary">
          All Notifications
        </Typography>
        {/* MarkAllReadButton is removed */}
      </HeaderBox>
      <Divider sx={{ mb: 2 }} />

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200 }}>
          <CircularProgress size={40} sx={{ color: theme.palette.primary.main }} />
          <Typography variant="body1" sx={{ mt: 2, color: theme.palette.text.secondary }}>
            Loading notifications...
          </Typography>
        </Box>
      ) : (
        displayNotifications.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" color="text.secondary">
              No notifications to show.
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
              Your notification list is currently empty.
            </Typography>
          </Box>
        ) : (
          <List>
            {displayNotifications.map(n => (
              <NotificationListItem key={n.id}> {/* Removed isRead prop */}
                <NotificationAvatar src={n.sender_avatar_url}>
                  {getInitials(n.sender_name || 'HR')}
                </NotificationAvatar>
                <ListItemText
                  primary={
                    <NotificationTitle variant="body1" component="span">
                      {getNotificationIcon(n.title)} {n.title}
                    </NotificationTitle>
                  }
                  secondary={
                    <>
                      <NotificationMessage variant="body2" component="span">
                        {n.message}
                      </NotificationMessage>
                      <NotificationTimestamp variant="caption" component="span">
                        <AccessTimeIcon fontSize="inherit" /> {new Date(n.created_at).toLocaleString()}
                      </NotificationTimestamp>
                    </>
                  }
                />

              </NotificationListItem>
            ))}
          </List>
        )
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
}