// src/components/AddEmployee.jsx
import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles'; // Import useTheme here
import MacOsTopNavbar from './MacOsTopNavbar';
import FileUploader from './FileUploader';
// import DashboardNavbar from './DashboardNavbar'; // This was imported but not used, uncomment if needed

// --- Styled Components ---

const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  // Adapt background color based on theme palette
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary, // Set default text color for the page
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: '90px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const FormCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  // Dynamic shadow based on theme mode
  boxShadow: theme.palette.mode === 'dark'
    ? `0 8px 20px ${alpha(theme.palette.common.black, 0.4)}`
    : `0 8px 20px rgba(0, 0, 0, 0.08)`,
  // Adapt background color based on theme palette
  backgroundColor: theme.palette.background.paper,
  width: '100%',
  maxWidth: '800px',
  animation: 'fadeInUp 0.8s ease-out forwards',
  '@keyframes fadeInUp': {
    '0%': { opacity: 0, transform: 'translateY(20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
}));

const FormTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  // Adapt text color based on theme palette
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
  textAlign: 'center',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  // Adapt text color based on theme palette
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(2),
  // Adapt border color based on theme palette
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  paddingBottom: theme.spacing(1),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    // Adapt background color for input fields
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.grey[700], 0.3) // Slightly lighter dark grey for inputs
      : alpha(theme.palette.grey[100], 0.7),
    '& fieldset': {
      // Adapt border color
      borderColor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.primary.light, 0.5) // Softer border in dark mode
        : theme.palette.grey[300],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: '2px',
    },
    '& input': {
      // Ensure text in input is readable
      color: theme.palette.text.primary,
    },
  },
  '& .MuiInputLabel-root': {
    // Adapt label color
    color: theme.palette.text.secondary,
    '&.Mui-focused': {
        color: theme.palette.primary.main, // Focused label uses primary color
    }
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5, 3),
  borderRadius: '12px',
  fontWeight: 700,
  // Use theme primary color for background
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText, // Ensures text color contrasts with primary
  '&:hover': {
    backgroundColor: theme.palette.primary.dark, // Darker shade on hover
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
  transition: 'all 0.3s ease-in-out',
}));

const UploadedFileLink = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
  color: theme.palette.text.secondary,
  '& a': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    fontWeight: 500,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

// --- AddEmployee Component ---

export default function AddEmployee() {

  const [form, setForm] = useState({
    full_name: '',
    age: '',
    dob: '',
    address: '',
    email: '',
    phone_number: '',
    password: '',
    profile_pic: '',
    police_check_report: '',
    nic_copy: '',
    cv: '',
    hourly_rate: '',
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (fieldName) => (url) => {
    setForm(prev => ({ ...prev, [fieldName]: url }));
    setSnackbarMessage(`File uploaded for ${fieldName.replace(/_/g, ' ')}.`)
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSnackbarMessage('Adding employee...');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);

    try {
      const res = await axios.post('http://localhost/smarthr_proj/employee_add.php', form, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = res.data;

      if (data.success) {
        setSnackbarMessage('Employee added successfully! 🎉');
        setSnackbarSeverity('success');
        setForm({ // Reset form
          full_name: '',
          age: '',
          dob: '',
          address: '',
          email: '',
          phone_number: '',
          password: '',
          profile_pic: '',
          police_check_report: '',
          nic_copy: '',
          cv: '',
          hourly_rate: '',
        });
      } else {
        setSnackbarMessage('Failed: ' + data.message);
        setSnackbarSeverity('error');
      }
    } catch (error) {
      setSnackbarMessage('Error: ' + (error.response?.data?.message || error.message));
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <PageContainer>
      <MacOsTopNavbar/>
      <MainContent>
        <FormCard elevation={3}>
          <FormTitle variant="h4">Add New Employee</FormTitle>

          <form onSubmit={handleSubmit}>
            <SectionTitle variant="h6">Personal Information</SectionTitle>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Full Name"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <StyledTextField
                  label="Age"
                  name="age"
                  type="number"
                  value={form.age}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <StyledTextField
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  label="Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Phone Number"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>

            <SectionTitle variant="h6">Account & Compensation</SectionTitle>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Hourly Rate (Rs.)"
                  name="hourly_rate"
                  type="number"
                  step="0.01"
                  value={form.hourly_rate}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>

            <SectionTitle variant="h6">Documents Upload</SectionTitle>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FileUploader
                  label="Profile Picture"
                  onUpload={handleFileUpload('profile_pic')}
                />
                {form.profile_pic && (
                  <UploadedFileLink>
                    Uploaded: <a href={form.profile_pic} target="_blank" rel="noopener noreferrer">View Profile Pic</a>
                  </UploadedFileLink>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <FileUploader
                  label="Police Check Report"
                  onUpload={handleFileUpload('police_check_report')}
                />
                {form.police_check_report && (
                  <UploadedFileLink>
                    Uploaded: <a href={form.police_check_report} target="_blank" rel="noopener noreferrer">View Report</a>
                  </UploadedFileLink>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <FileUploader
                  label="NIC Copy"
                  onUpload={handleFileUpload('nic_copy')}
                />
                {form.nic_copy && (
                  <UploadedFileLink>
                    Uploaded: <a href={form.nic_copy} target="_blank" rel="noopener noreferrer">View NIC Copy</a>
                  </UploadedFileLink>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <FileUploader
                  label="CV"
                  onUpload={handleFileUpload('cv')}
                />
                {form.cv && (
                  <UploadedFileLink>
                    Uploaded: <a href={form.cv} target="_blank" rel="noopener noreferrer">View CV</a>
                  </UploadedFileLink>
                )}
              </Grid>
            </Grid>

            <SubmitButton
              type="submit"
              variant="contained"
              fullWidth
            >
              Add Employee
            </SubmitButton>
          </form>
        </FormCard>
      </MainContent>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
}