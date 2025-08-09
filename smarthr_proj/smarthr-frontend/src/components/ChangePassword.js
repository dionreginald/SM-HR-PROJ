import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Material-UI Imports
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

// --- Styled Components ---

const ChangePasswordContainer = styled(Box)(({ theme }) => ({
  // Removed max-width and margin:auto as it's now intended to be placed within EmployeeProfile's Grid
  padding: theme.spacing(3),
  // Removed border and border-radius from here as the parent (ProfilePaper) already has it.
  // If this component is used standalone, you might add a Paper wrapper.
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 1.5,
    backgroundColor: alpha(theme.palette.background.paper, 0.7), // Semi-transparent to blend with paper
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
  marginBottom: theme.spacing(2),
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


// --- ChangePassword Component ---

export default function ChangePassword({ email: employeeEmail }) { // Accept email as a prop
  const theme = useTheme();

  const [form, setForm] = useState({
    email: employeeEmail || '', // Initialize with prop email
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading] = useState(false); // No initial email fetch needed if prop is used
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info'); // 'success', 'error', 'warning', 'info'

  // Update form email if employeeEmail prop changes
  useEffect(() => {
    if (employeeEmail) {
      setForm((f) => ({ ...f, email: employeeEmail }));
    }
  }, [employeeEmail]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setSnackbarOpen(false); // Close any existing snackbar

    if (!form.email) {
      setSnackbarMessage('Email not available. Please ensure you are logged in correctly.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLoadingSubmit(false);
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setSnackbarMessage("New passwords don't match.");
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      setLoadingSubmit(false);
      return;
    }

    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      setSnackbarMessage('All password fields are required.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      setLoadingSubmit(false);
      return;
    }
    
    // Basic password strength check (optional, but good practice)
    if (form.newPassword.length < 8) {
      setSnackbarMessage('New password must be at least 8 characters long.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      setLoadingSubmit(false);
      return;
    }


    try {
      const response = await axios.post('http://localhost/smarthr_proj/change_password.php', {
        email: form.email,
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      if (response.data.success) {
        setSnackbarMessage('Password updated successfully! ✅');
        setSnackbarSeverity('success');
        setForm((f) => ({ ...f, oldPassword: '', newPassword: '', confirmPassword: '' })); // Clear fields on success
      } else {
        setSnackbarMessage(response.data.message || 'Failed to update password. Please check your old password.');
        setSnackbarSeverity('error');
      }
    } catch (err) {
      console.error('Change password error:', err);
      setSnackbarMessage('Server error. Please try again later.');
      setSnackbarSeverity('error');
    } finally {
      setLoadingSubmit(false);
      setSnackbarOpen(true);
    }
  };

  // If email is being fetched internally (though we're now passing it as a prop)
  // this loading state would be relevant. Keeping it for robustness.
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <CircularProgress size={30} sx={{ color: theme.palette.primary.main }} />
        <Typography variant="body1" sx={{ ml: 2, color: theme.palette.text.secondary }}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <ChangePasswordContainer>
      <form onSubmit={handleSubmit}>
        <StyledTextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={form.email}
          disabled // Email should typically not be editable here
          variant="outlined"
          InputLabelProps={{ shrink: true }} // Ensures label is always "shrunk" for disabled input
          sx={{ mb: 2 }}
        />

        <StyledTextField
          fullWidth
          label="Old Password"
          name="oldPassword"
          type="password"
          value={form.oldPassword}
          onChange={handleChange}
          required
          variant="outlined"
          sx={{ mb: 2 }}
        />

        <StyledTextField
          fullWidth
          label="New Password"
          name="newPassword"
          type="password"
          value={form.newPassword}
          onChange={handleChange}
          required
          variant="outlined"
          sx={{ mb: 2 }}
        />

        <StyledTextField
          fullWidth
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          variant="outlined"
          sx={{ mb: 3 }}
        />

        <StyledButton
          type="submit"
          variant="contained"
          color="secondary" // Use secondary color for password buttons or primary
          fullWidth
          disabled={loadingSubmit}
          startIcon={loadingSubmit ? <CircularProgress size={20} color="inherit" /> : <VpnKeyIcon />}
        >
          {loadingSubmit ? 'Changing Password...' : 'Update Password'}
        </StyledButton>
      </form>

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
    </ChangePasswordContainer>
  );
}