import React, { useEffect, useState, useRef,useCallback } from 'react';
import axios from 'axios';
import ChangePassword from './ChangePassword';

// Material-UI Imports
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Avatar,
  useMediaQuery // Import useMediaQuery for responsive top value
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';

// Material-UI Icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import KeyIcon from '@mui/icons-material/Key';

// --- Styled Components (Mostly carried over, with new additions for sticky layout) ---

const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  padding: theme.spacing(3),
  // No paddingTop here, as MainContentWrapper will handle it relative to fixed navbar
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const MainContentWrapper = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'center',
  // Use a fixed padding-top to account for the fixed navbar
  paddingTop: theme.spacing(10), // Adjust this value to match your actual navbar height + desired spacing
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(8), // Adjust for smaller navbar height on small screens
  },
  margin: 'auto',
  maxWidth: 1200,
  width: '100%',
  // Important: If you want the content itself to scroll *within* the layout,
  // ensure there's no fixed height on this wrapper.
}));


const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: theme.palette.mode === 'dark'
    ? `0 15px 40px ${alpha(theme.palette.common.black, 0.6)}`
    : `0 15px 40px rgba(0, 0, 0, 0.1)`,
  backgroundColor: theme.palette.background.paper,
  width: '100%',
  animation: 'fadeInUp 0.8s ease-out forwards',
  '@keyframes fadeInUp': {
    "0%": { opacity: 0, transform: "translateY(20px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
  // Ensure that the Grid items within can control their own scrolling
  display: 'flex', // This makes the inner Grid behave correctly
}));

// NEW: Sticky Container for the left profile details
const StickyContainer = styled(Box)(({ theme, topOffset }) => ({
  position: 'sticky', // Makes the element stick
  top: topOffset,    // The offset from the top of the viewport
  alignSelf: 'flex-start', // Important for sticky to work correctly within a flex parent (Grid item)
  paddingRight: theme.spacing(3), // Add some padding on the right for separation
  // borderRight: `1px solid ${theme.palette.divider}`, // Optional: a visual separator
  [theme.breakpoints.down('md')]: {
    position: 'static', // Disable sticky on smaller screens
    paddingRight: 0,
    borderRight: 'none',
    marginBottom: theme.spacing(4), // Add space when stacked vertically
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

const ProfilePicContainer = styled(Box)(({ theme }) => ({
  width: 180,
  height: 180,
  borderRadius: '50%',
  border: `3px solid ${theme.palette.primary.main}`,
  padding: theme.spacing(0.5),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  boxShadow: theme.palette.mode === 'dark'
    ? `0 0 15px ${alpha(theme.palette.primary.main, 0.5)}`
    : `0 0 10px ${alpha(theme.palette.primary.main, 0.3)}`,
  marginBottom: theme.spacing(3),
  flexShrink: 0,
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  '& .MuiAvatar-img': {
    objectFit: 'cover',
  },
  '&.MuiAvatar-root': {
    backgroundColor: theme.palette.action.selected,
    color: theme.palette.text.secondary,
    fontSize: '5rem',
  }
}));

const InfoBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.default, 0.5)
    : alpha(theme.palette.grey[50], 0.5),
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.palette.mode === 'dark'
    ? `inset 0 0 8px ${alpha(theme.palette.common.black, 0.3)}`
    : `inset 0 0 5px rgba(0,0,0,0.05)`,
}));

const InfoText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  color: theme.palette.text.secondary,
  '& strong': {
    color: theme.palette.text.primary,
    fontWeight: 600,
  },
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

const FileInputWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  '& .MuiInputBase-root': {
    flexGrow: 1,
  },
}));

const ChangePasswordContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(5),
  paddingTop: theme.spacing(4),
  borderTop: `1px solid ${theme.palette.divider}`,
}));


export default function EmployeeProfile() {
  const employee = JSON.parse(localStorage.getItem('employee'));
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Check for small screens

  // Calculate the top offset for sticky positioning based on navbar height
  // (Navbar height is 70px for md+ and 60px for sm-)
  const stickyTopOffset = isSmallScreen ? theme.spacing(8) : theme.spacing(10); // Matches paddingTop of MainContentWrapper

  const [currentInfo, setCurrentInfo] = useState(null);
  const [form, setForm] = useState({
    full_name: '',
    age: '',
    dob: '',
    address: '',
    email: '',
    phone_number: '',
    profile_pic: null,
    nic_copy: null,
    police_check: null,
    cv: null,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const profilePicInputRef = useRef(null);
  const nicCopyInputRef = useRef(null);
  const policeCheckInputRef = useRef(null);
  const cvInputRef = useRef(null);

  const getProfilePicUrl = () => {
    if (!currentInfo?.profile_pic) return null;
    if (currentInfo.profile_pic.startsWith('http')) return currentInfo.profile_pic;
    return `http://localhost/smarthr_proj/uploads/${currentInfo.profile_pic}`;
  };

  const fetchProfile = useCallback(() => {
  if (!employee?.id) {
    setSnackbarMessage('No logged-in employee found. Please log in.');
    setSnackbarSeverity('warning');
    setSnackbarOpen(true);
    setLoadingInitial(false);
    return;
  }

  axios
    .get(`http://localhost/smarthr_proj/get_employee_profile.php?id=${employee.id}`)
    .then((res) => {
      if (res.data.success) {
        setCurrentInfo(res.data.employee);
        setForm({
          full_name: res.data.employee.full_name || '',
          age: res.data.employee.age || '',
          dob: res.data.employee.dob || '',
          address: res.data.employee.address || '',
          email: res.data.employee.email || '',
          phone_number: res.data.employee.phone_number || '',
          profile_pic: null,
          nic_copy: null,
          police_check: null,
          cv: null,
        });
        setSnackbarMessage('Profile loaded successfully.');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('Failed to fetch profile: ' + (res.data.message || 'Unknown error'));
        setSnackbarSeverity('error');
      }
      setLoadingInitial(false);
      setSnackbarOpen(true);
    })
    .catch((err) => {
      console.error('Error fetching profile:', err);
      setSnackbarMessage('Error fetching profile. Please try again later.');
      setSnackbarSeverity('error');
      setLoadingInitial(false);
      setSnackbarOpen(true);
    });
}, [employee?.id]);  // Only changes if employee ID changes


  useEffect(() => {
    fetchProfile();
  }, [employee?.id, fetchProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setSnackbarOpen(false);

    if (!employee?.id) {
      setSnackbarMessage('Employee not logged in.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      setLoadingSubmit(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('id', employee.id);

      Object.entries(form).forEach(([key, val]) => {
        if (typeof val === 'string' && val.trim() !== '' && currentInfo?.[key] !== val) {
          formData.append(key, val);
        } else if (val instanceof File) {
          formData.append(key, val);
        }
      });

      if (Array.from(formData.keys()).length <= 1) {
        setSnackbarMessage('No changes detected to update.');
        setSnackbarSeverity('info');
        setSnackbarOpen(true);
        setLoadingSubmit(false);
        return;
      }

      const res = await axios.post(
        'http://localhost/smarthr_proj/update_employee_profile.php',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (res.data.success) {
        setSnackbarMessage('Profile updated successfully! ✅');
        setSnackbarSeverity('success');
        if (profilePicInputRef.current) profilePicInputRef.current.value = '';
        if (nicCopyInputRef.current) nicCopyInputRef.current.value = '';
        if (policeCheckInputRef.current) policeCheckInputRef.current.value = '';
        if (cvInputRef.current) cvInputRef.current.value = '';
        fetchProfile();
      } else {
        setSnackbarMessage(res.data.message || 'Failed to update ❌');
        setSnackbarSeverity('error');
      }
    } catch (err) {
      console.error('Error during profile update:', err);
      setSnackbarMessage('Server error while updating profile. Please try again.');
      setSnackbarSeverity('error');
    } finally {
      setLoadingSubmit(false);
      setSnackbarOpen(true);
    }
  };

  if (loadingInitial) {
    return (
      <PageContainer sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
        <Typography variant="h6" sx={{ ml: 2, color: theme.palette.text.secondary }}>Loading profile...</Typography>
      </PageContainer>
    );
  }

  if (!employee?.id) {
    return (
      <PageContainer sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Alert severity="error">No logged-in employee found. Please log in.</Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <MainContentWrapper>
        <ProfilePaper elevation={4}>
          <Grid container spacing={4}>
            {/* Left Column: Read-only Profile Info (Sticky) */}
            <Grid item xs={12} md={5}>
              <StickyContainer topOffset={stickyTopOffset}>
                <SectionTitle variant="h5">
                  <AccountCircleIcon fontSize="inherit" /> Current Profile
                </SectionTitle>

                {currentInfo ? (
                  <>
                    <ProfilePicContainer>
                      <ProfileAvatar src={getProfilePicUrl()} alt="Profile Picture">
                        {!currentInfo.profile_pic && <AccountCircleIcon />}
                      </ProfileAvatar>
                    </ProfilePicContainer>

                    <InfoBox>
                      <InfoText variant="body1"><strong>Full Name:</strong> {currentInfo.full_name || 'N/A'}</InfoText>
                      <InfoText variant="body1"><strong>Age:</strong> {currentInfo.age || 'N/A'}</InfoText>
                      <InfoText variant="body1"><strong>Date of Birth:</strong> {currentInfo.dob || 'N/A'}</InfoText>
                      <InfoText variant="body1"><strong>Address:</strong> {currentInfo.address || 'N/A'}</InfoText>
                      <InfoText variant="body1"><strong>Email:</strong> {currentInfo.email || 'N/A'}</InfoText>
                      <InfoText variant="body1"><strong>Phone:</strong> {currentInfo.phone_number || 'N/A'}</InfoText>
                    </InfoBox>
                  </>
                ) : (
                  <Typography variant="body1" color="text.secondary">No profile data available.</Typography>
                )}
              </StickyContainer>
            </Grid>

            {/* Right Column: Update Form + Change Password (Scrollable) */}
            <Grid item xs={12} md={7}>
              <SectionTitle variant="h5">
                <EditIcon fontSize="inherit" /> Update Profile
              </SectionTitle>

              <form onSubmit={handleSubmit}>
                <StyledTextField
                  fullWidth
                  label="Full Name"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleInputChange}
                  variant="outlined"
                  disabled={loadingSubmit}
                />
                <StyledTextField
                  fullWidth
                  label="Age"
                  name="age"
                  type="number"
                  value={form.age}
                  onChange={handleInputChange}
                  variant="outlined"
                  disabled={loadingSubmit}
                />
                <StyledTextField
                  fullWidth
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  disabled={loadingSubmit}
                />
                <StyledTextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={form.address}
                  onChange={handleInputChange}
                  variant="outlined"
                  multiline
                  rows={2}
                  disabled={loadingSubmit}
                />
                <StyledTextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  disabled={loadingSubmit}
                />
                <StyledTextField
                  fullWidth
                  label="Phone Number"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleInputChange}
                  variant="outlined"
                  disabled={loadingSubmit}
                />

                {/* File Uploads */}
                <Typography variant="subtitle1" sx={{ color: 'text.primary', mt: 2, mb: 1 }}>Upload Documents:</Typography>
                <FileInputWrapper>
                  <StyledTextField
                    label="Profile Picture"
                    variant="outlined"
                    size="small"
                    value={form.profile_pic ? form.profile_pic.name : ''}
                    InputProps={{ readOnly: true }}
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<FileUploadIcon />}
                    disabled={loadingSubmit}
                  >
                    Choose File
                    <input type="file" name="profile_pic" hidden onChange={handleFileChange} ref={profilePicInputRef} />
                  </Button>
                </FileInputWrapper>

                <FileInputWrapper>
                  <StyledTextField
                    label="NIC Copy"
                    variant="outlined"
                    size="small"
                    value={form.nic_copy ? form.nic_copy.name : ''}
                    InputProps={{ readOnly: true }}
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<FileUploadIcon />}
                    disabled={loadingSubmit}
                  >
                    Choose File
                    <input type="file" name="nic_copy" hidden onChange={handleFileChange} ref={nicCopyInputRef} />
                  </Button>
                </FileInputWrapper>

                <FileInputWrapper>
                  <StyledTextField
                    label="Police Check Report"
                    variant="outlined"
                    size="small"
                    value={form.police_check ? form.police_check.name : ''}
                    InputProps={{ readOnly: true }}
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<FileUploadIcon />}
                    disabled={loadingSubmit}
                  >
                    Choose File
                    <input type="file" name="police_check" hidden onChange={handleFileChange} ref={policeCheckInputRef} />
                  </Button>
                </FileInputWrapper>

                <FileInputWrapper>
                  <StyledTextField
                    label="CV"
                    variant="outlined"
                    size="small"
                    value={form.cv ? form.cv.name : ''}
                    InputProps={{ readOnly: true }}
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<FileUploadIcon />}
                    disabled={loadingSubmit}
                  >
                    Choose File
                    <input type="file" name="cv" hidden onChange={handleFileChange} ref={cvInputRef} />
                  </Button>
                </FileInputWrapper>

                <StyledButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loadingSubmit}
                  startIcon={loadingSubmit ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                >
                  {loadingSubmit ? 'Updating...' : 'Update Profile'}
                </StyledButton>
              </form>

              {/* Change Password Section */}
              <ChangePasswordContainer>
                <SectionTitle variant="h5">
                  <KeyIcon fontSize="inherit" /> Change Password
                </SectionTitle>
                <ChangePassword email={currentInfo?.email} />
              </ChangePasswordContainer>
            </Grid>
          </Grid>
        </ProfilePaper>
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