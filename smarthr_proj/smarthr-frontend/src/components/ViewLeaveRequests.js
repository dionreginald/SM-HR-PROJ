import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import DashboardNavbar from './DashboardNavbar'; // This was imported but not used, consider removing if not needed.
import MacOsTopNavbar from './MacOsTopNavbar';

// Material-UI Imports
import {
  Box,
  Typography,
  Paper,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles'; // <-- Import useTheme here

// Material-UI Icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ListAltIcon from '@mui/icons-material/ListAlt';

// --- Styled Components (Consistent with other dashboard pages) ---

const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  // --- FIXED: Use theme.palette for background color ---
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary, // Ensure default text color respects theme
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: '90px', // Space for MacOsTopNavbar
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const ContentPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  // --- FIXED: Use theme.palette for boxShadow and backgroundColor ---
  boxShadow: theme.palette.mode === 'dark'
    ? `0 8px 20px ${alpha(theme.palette.common.black, 0.4)}`
    : `0 8px 20px rgba(0, 0, 0, 0.08)`,
  backgroundColor: theme.palette.background.paper,
  width: '100%',
  maxWidth: '1200px',
  animation: 'fadeInUp 0.8s ease-out forwards',
  '@keyframes fadeInUp': {
    "0%": { opacity: 0, transform: "translateY(20px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  // --- FIXED: Use theme.palette for text color ---
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  fontWeight: 600,
  textTransform: 'none',
  padding: theme.spacing(0.8, 2),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-1px)',
    // --- FIXED: Use theme.palette for boxShadow on hover ---
    boxShadow: theme.palette.mode === 'dark'
      ? `0 2px 6px ${alpha(theme.palette.primary.main, 0.3)}`
      : '0 2px 6px rgba(0, 122, 255, 0.15)',
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

// Table specific styles
const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText, // Use contrastText for text on primary background
  fontWeight: 600,
  fontSize: '0.85rem',
  padding: '12px 16px',
  whiteSpace: 'nowrap',
}));

const StyledTableBodyCell = styled(TableCell)(({ theme }) => ({
  fontSize: '0.8rem',
  padding: '10px 16px',
  // --- FIXED: Use theme.palette for border color ---
  borderBottom: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary, // Ensure cell text color adapts
  whiteSpace: 'nowrap',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'background-color 0.2s ease-in-out',
  '&:nth-of-type(odd)': {
    // --- FIXED: Use alpha with theme.palette for striped rows ---
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.grey[900], 0.5) // Darker stripe for dark mode
      : alpha(theme.palette.grey[50], 0.5), // Lighter stripe for light mode
  },
  '&:hover': {
    // --- FIXED: Use alpha with theme.palette for hover effect ---
    backgroundColor: alpha(theme.palette.primary.light, theme.palette.mode === 'dark' ? 0.05 : 0.1),
  },
}));

// Dynamic styling for status text (Pending, Approved, Rejected)
const StatusText = styled(Typography)(({ theme, status }) => ({
  fontWeight: 600,
  textTransform: 'uppercase',
  fontSize: '0.75rem',
  padding: '4px 8px',
  borderRadius: '4px',
  display: 'inline-block',
  backgroundColor:
    status === 'Approved'
      ? alpha(theme.palette.success.main, theme.palette.mode === 'dark' ? 0.3 : 0.15) // Adjust opacity for dark mode
      : status === 'Rejected'
      ? alpha(theme.palette.error.main, theme.palette.mode === 'dark' ? 0.3 : 0.15) // Adjust opacity for dark mode
      : alpha(theme.palette.warning.main, theme.palette.mode === 'dark' ? 0.3 : 0.15), // Default to warning for 'Pending', adjust opacity
  color:
    status === 'Approved'
      ? theme.palette.success.light // Use light/main color for dark mode readability
      : status === 'Rejected'
      ? theme.palette.error.light // Use light/main color for dark mode readability
      : theme.palette.warning.light, // Use light/main color for dark mode readability
}));

export default function ViewLeaveRequests() {
  const [requests, setRequests] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingIds, setLoadingIds] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const theme = useTheme(); // <-- Access the theme object here

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const fetchLeaveRequests = async () => {
    setLoadingInitial(true);
    try {
      const response = await axios.get('http://localhost/smarthr_proj/get_leave_requests.php');
      if (response.data.status === 'success') {
        setRequests(response.data.data || []);
        setSnackbarMessage('Leave requests loaded successfully.');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('Failed to fetch leave requests: ' + (response.data.message || 'Unknown error'));
        setSnackbarSeverity('error');
        setRequests([]);
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      setSnackbarMessage('Error fetching leave requests: ' + (error.response?.data?.message || error.message));
      setSnackbarSeverity('error');
      setRequests([]);
    } finally {
      setLoadingInitial(false);
      setSnackbarOpen(true);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    if (loadingIds.includes(id)) return;

    setLoadingIds((prev) => [...prev, id]);
    setSnackbarMessage(`Updating request ${id} to ${status}...`);
    setSnackbarSeverity('info');
    setSnackbarOpen(true);

    try {
      const response = await axios.post(
        'http://localhost/smarthr_proj/update_leave_status.php',
        { id, status },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.status === 'success') {
        setRequests((prev) =>
          prev.map((req) => (req.id === id ? { ...req, status } : req))
        );
        setSnackbarMessage(`Leave request ${id} set to ${status.toLowerCase()} successfully!`);
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('Failed to update status: ' + (response.data.message || 'Unknown error'));
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setSnackbarMessage('Error updating status: ' + (error.response?.data?.message || error.message));
      setSnackbarSeverity('error');
    } finally {
      setLoadingIds((prev) => prev.filter((loadingId) => loadingId !== id));
      setSnackbarOpen(true);
    }
  };

  return (
    <PageContainer>
      <MacOsTopNavbar/>
      <MainContent>
        <ContentPaper>
          <SectionTitle variant="h4">
            <ListAltIcon fontSize="large" sx={{ color: 'primary.main' }} />
            Leave Requests
          </SectionTitle>

          {loadingInitial ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, flexDirection: 'column', alignItems: 'center' }}>
              <CircularProgress />
              <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>Loading Leave Requests...</Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{
              borderRadius: '12px',
              // --- FIXED: Use theme.palette for boxShadow and background ---
              boxShadow: theme.palette.mode === 'dark' ? `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}` : '0 4px 12px rgba(0, 0, 0, 0.05)',
              backgroundColor: theme.palette.background.paper,
            }}>
              <Table sx={{ minWidth: 650 }} aria-label="leave requests table">
                <TableHead>
                  <TableRow>
                    <StyledTableHeadCell>Request ID</StyledTableHeadCell>
                    <StyledTableHeadCell>Employee ID</StyledTableHeadCell>
                    <StyledTableHeadCell>From Date</StyledTableHeadCell>
                    <StyledTableHeadCell>To Date</StyledTableHeadCell>
                    <StyledTableHeadCell>Reason</StyledTableHeadCell>
                    <StyledTableHeadCell>Current Status</StyledTableHeadCell>
                    <StyledTableHeadCell align="center">Actions</StyledTableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(requests) && requests.length > 0 ? (
                    requests.map((request) => (
                      <StyledTableRow key={request.id}>
                        <StyledTableBodyCell>{request.id}</StyledTableBodyCell>
                        <StyledTableBodyCell>{request.employee_id}</StyledTableBodyCell>
                        <StyledTableBodyCell>{request.from_date}</StyledTableBodyCell>
                        <StyledTableBodyCell>{request.to_date}</StyledTableBodyCell>
                        <StyledTableBodyCell>{request.reason}</StyledTableBodyCell>
                        <StyledTableBodyCell>
                          <StatusText status={request.status}>
                            {request.status}
                          </StatusText>
                        </StyledTableBodyCell>
                        <StyledTableBodyCell align="center">
                          <ActionButton
                            variant="contained"
                            color="success"
                            onClick={() => handleUpdateStatus(request.id, 'Approved')}
                            disabled={loadingIds.includes(request.id)}
                            startIcon={loadingIds.includes(request.id) ? <CircularProgress size={16} color="inherit" /> : <CheckCircleOutlineIcon />}
                            sx={{ mr: 1 }}
                          >
                            {loadingIds.includes(request.id) ? 'Updating...' : 'Approve'}
                          </ActionButton>

                          <ActionButton
                            variant="contained"
                            color="error"
                            onClick={() => handleUpdateStatus(request.id, 'Rejected')}
                            disabled={loadingIds.includes(request.id)}
                            startIcon={loadingIds.includes(request.id) ? <CircularProgress size={16} color="inherit" /> : <CancelOutlinedIcon />}
                          >
                            {loadingIds.includes(request.id) ? 'Updating...' : 'Reject'}
                          </ActionButton>
                        </StyledTableBodyCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <StyledTableBodyCell colSpan={7} sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                        No leave requests found.
                      </StyledTableBodyCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </ContentPaper>
      </MainContent>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{
            width: '100%',
            // --- FIXED: Ensure Snackbar Alert background and text colors also adapt ---
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