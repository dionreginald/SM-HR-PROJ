import React, { useState } from 'react';
import axios from 'axios';

// Material-UI Imports
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';

// Material-UI Icons
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Icon for leave request
import SendIcon from '@mui/icons-material/Send';

// --- Styled Components ---

const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default, // Adapts to dark/light mode
  color: theme.palette.text.primary, // Adapts to dark/light mode
  padding: theme.spacing(3),
  paddingTop: theme.spacing(10), // Space for fixed navbar
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(8),
  },
}));

const MainContentWrapper = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start', // Align to top
  margin: 'auto', // Center the content paper
  maxWidth: 600, // Max width for the form
  width: '100%',
}));

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 3, // More rounded corners
  boxShadow: theme.palette.mode === 'dark'
    ? `0 15px 40px ${alpha(theme.palette.common.black, 0.6)}` // Deeper shadow for dark mode
    : `0 15px 40px rgba(0, 0, 0, 0.1)`, // Subtle shadow for light mode
  backgroundColor: theme.palette.background.paper, // Adapts background
  width: '100%',
  animation: 'fadeInUp 0.8s ease-out forwards',
  '@keyframes fadeInUp': {
    "0%": { opacity: 0, transform: "translateY(20px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
}));

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

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 1.5,
    backgroundColor: alpha(theme.palette.background.paper, 0.7),
    '& fieldset': { borderColor: theme.palette.divider },
    '&:hover fieldset': { borderColor: theme.palette.primary.main },
    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main, borderWidth: '2px' },
  },
  '& .MuiInputBase-input': {
    color: theme.palette.text.primary,
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  },
  marginBottom: theme.spacing(3), // Increased margin for better spacing between fields
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.divider },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main, borderWidth: '2px' },
  '& .MuiSelect-select': {
    color: theme.palette.text.primary,
  },
  '& .MuiSvgIcon-root': { // Dropdown arrow color
    color: theme.palette.text.secondary,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  fontWeight: 600,
  textTransform: 'none',
  padding: theme.spacing(1.5, 3),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? `0 6px 15px ${alpha(theme.palette.primary.main, 0.4)}`
      : `0 6px 15px rgba(0, 122, 255, 0.2)`,
  },
  marginTop: theme.spacing(2),
}));


// --- EmployeeLeaveRequest Component ---

export default function EmployeeLeaveRequest() {
  const employee = JSON.parse(localStorage.getItem('employee'));
  const theme = useTheme();

  const [formData, setFormData] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: '',
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // State to hold validation errors

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for the field being changed
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.leaveType) newErrors.leaveType = 'Leave Type is required.';
    if (!formData.fromDate) newErrors.fromDate = 'From Date is required.';
    if (!formData.toDate) newErrors.toDate = 'To Date is required.';
    if (!formData.reason) newErrors.reason = 'Reason is required.';

    if (formData.fromDate && formData.toDate && new Date(formData.toDate) < new Date(formData.fromDate)) {
      newErrors.toDate = 'To Date cannot be before From Date.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setSnackbarOpen(false); // Close any existing snackbar

    if (!employee?.id) {
      setSnackbarMessage('Employee not logged in. Cannot submit request.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!validateForm()) {
      setSnackbarMessage('Please correct the errors in the form.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost/smarthr_proj/leave-request.php', {
        employee_id: employee.id,
        leave_type: formData.leaveType,
        from_date: formData.fromDate,
        to_date: formData.toDate,
        reason: formData.reason,
      });

      if (response.data.success) {
        setSnackbarMessage('Leave request submitted successfully! ✅');
        setSnackbarSeverity('success');
        setFormData({
          leaveType: '',
          fromDate: '',
          toDate: '',
          reason: '',
        });
      } else {
        setSnackbarMessage(response.data.message || 'Failed to submit leave request.');
        setSnackbarSeverity('error');
      }
    } catch (err) {
      console.error('Leave request submission error:', err);
      setSnackbarMessage('Server error. Please try again later.');
      setSnackbarSeverity('error');
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  return (
    <PageContainer>
      <MainContentWrapper>
        <FormPaper elevation={4}>
          <SectionTitle variant="h5">
            <CalendarTodayIcon fontSize="inherit" /> Request Leave
          </SectionTitle>

          <form onSubmit={handleSubmit}>
            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
              <InputLabel id="leave-type-label">Leave Type</InputLabel>
              <StyledSelect
                labelId="leave-type-label"
                id="leaveType"
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                label="Leave Type"
                disabled={loading}
                error={!!errors.leaveType}
              >
                <MenuItem value="">Select Leave Type</MenuItem>
                <MenuItem value="Casual">Casual</MenuItem>
                <MenuItem value="Medical">Medical</MenuItem>
                <MenuItem value="Emergency">Emergency</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </StyledSelect>
              {errors.leaveType && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.leaveType}
                </Typography>
              )}
            </FormControl>

            <StyledTextField
              fullWidth
              label="From Date"
              name="fromDate"
              type="date"
              value={formData.fromDate}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              disabled={loading}
              error={!!errors.fromDate}
              helperText={errors.fromDate}
            />

            <StyledTextField
              fullWidth
              label="To Date"
              name="toDate"
              type="date"
              value={formData.toDate}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              disabled={loading}
              error={!!errors.toDate}
              helperText={errors.toDate}
            />

            <StyledTextField
              fullWidth
              label="Reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              variant="outlined"
              multiline
              rows={4}
              disabled={loading}
              error={!!errors.reason}
              helperText={errors.reason}
              sx={{ mb: 3 }} // Ensure last text field has appropriate bottom margin
            />

            <StyledButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </StyledButton>
          </form>
        </FormPaper>
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