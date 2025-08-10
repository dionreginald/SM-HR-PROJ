import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import MacOsTopNavbar from './MacOsTopNavbar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; 

// --- Styled Components for the new, iPhone-like GUI ---

const ProfileContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#F5F5F7', // Lighter background, like iOS settings
  color: theme.palette.text.primary,
}));

const ProfileMainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: '90px',
  overflowY: 'auto',
  maxHeight: 'calc(100vh - 90px)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

// The main card is now a single, larger component
const ProfileContentCard = styled(Box)(({ theme }) => ({
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    marginBottom: theme.spacing(4),
}));

// Styled for the header section
const ProfileHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(4, 4, 2, 4),
  borderBottom: `1px solid #E0E0E0`,
}));

// Styled for the main form/info sections
const ProfileSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
}));

// This is the new style for the iOS-like list
const InfoList = styled(Box)(({ theme }) => ({
    backgroundColor: '#FAFAFC', // Slightly different background for the list group
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #EFEFF4', // Subtle border around the group
}));

const InfoItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1.5, 2),
    borderBottom: `1px solid #EFEFF4`,
    '&:last-child': {
      borderBottom: 'none',
    },
  }));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    backgroundColor: '#FAFAFC',
    '&:hover fieldset': {
      borderColor: '#B0B0B5',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#007AFF',
      borderWidth: '2px',
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '10px',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: 'none',
    '&:hover': {
      boxShadow: 'none',
    },
}));

export default function Profile() {
  const theme = useTheme();
  const adminData = JSON.parse(localStorage.getItem('admin'));

  const [currentInfo, setCurrentInfo] = useState({
    username: '',
    full_name: '',
    position: '',
    email: '',
    phone: '',
  });

  const [form, setForm] = useState({
    full_name: '',
    position: '',
    email: '',
    phone: '',
  });

  const [passForm, setPassForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [message, setMessage] = useState('');
  const [passMessage, setPassMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    if (!adminData?.id) {
      setLoading(false);
      setMessage('Admin ID not found.');
      return;
    }

    const fetchAdminProfile = async () => {
      try {
        const res = await axios.get(`http://localhost/smarthr_proj/admin_get_profile.php?id=${adminData.id}`);
        const data = res.data;

        if (data.success) {
          const admin = data.admin;
          setCurrentInfo({
            username: admin.username || 'Not set',
            full_name: admin.full_name || 'Not set',
            position: admin.position || 'Not set',
            email: admin.email || 'Not set',
            phone: admin.phone || 'Not set',
          });
        } else {
          setMessage('Failed to fetch admin info.');
        }
      } catch (error) {
        console.error('Error fetching admin info:', error);
        setMessage('Error fetching admin info.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [adminData]);

  // Profile form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Updating...');

    try {
      const res = await axios.post('http://localhost/smarthr_proj/admin_update_profile.php', {
        id: adminData.id,
        ...form,
      });
      const data = res.data;

      if (data.success) {
        setMessage('Profile updated successfully ✅');
        setCurrentInfo(prev => ({
          ...prev,
          full_name: form.full_name.trim() !== '' ? form.full_name : prev.full_name,
          position: form.position.trim() !== '' ? form.position : prev.position,
          email: form.email.trim() !== '' ? form.email : prev.email,
          phone: form.phone.trim() !== '' ? form.phone : prev.phone,
        }));
        setForm({ full_name: '', position: '', email: '', phone: '' });
      } else {
        setMessage(data.message || 'Failed to update ❌');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile ❌');
    }
  };

  // Password change handlers
  const handlePassChange = (e) => {
    const { name, value } = e.target;
    setPassForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePassSubmit = async (e) => {
    e.preventDefault();

    if (passForm.new_password !== passForm.confirm_password) {
      setPassMessage('New passwords do not match');
      return;
    }

    setPassLoading(true);
    setPassMessage('');

    try {
      const res = await axios.post('http://localhost/smarthr_proj/admin_change_password.php', {
        id: adminData.id,
        current_password: passForm.current_password,
        new_password: passForm.new_password,
      });
      const data = res.data;
      setPassMessage(data.message || 'Password update response received.');
      if(data.success) {
        setPassForm({ current_password: '', new_password: '', confirm_password: '' });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setPassMessage('Error updating password.');
    } finally {
      setPassLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ProfileContainer>
      <MacOsTopNavbar />
      <ProfileMainContent>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={8}>
            <ProfileContentCard>
              <ProfileHeader>
                <AccountCircleIcon sx={{ fontSize: '4rem', mr: 2, color: '#007AFF' }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    Profile Settings
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                    Manage your personal information and password.
                  </Typography>
                </Box>
              </ProfileHeader>

              {/* Current Details Section */}
              <ProfileSection>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InfoOutlinedIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Current Details</Typography>
                </Box>
                
                <InfoList>
                    <InfoItem>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Username</Typography>
                        <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>{currentInfo.username}</Typography>
                    </InfoItem>
                    <InfoItem>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Full Name</Typography>
                        <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>{currentInfo.full_name}</Typography>
                    </InfoItem>
                    <InfoItem>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Position</Typography>
                        <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>{currentInfo.position}</Typography>
                    </InfoItem>
                    <InfoItem>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Email</Typography>
                        <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>{currentInfo.email}</Typography>
                    </InfoItem>
                    <InfoItem>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Phone</Typography>
                        <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>{currentInfo.phone}</Typography>
                    </InfoItem>
                </InfoList>
              </ProfileSection>

              <Divider sx={{ my: 4 }} />

              {/* Update Info Section */}
              <ProfileSection>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Update Information</Typography>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Full Name"
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                        variant="outlined"
                        placeholder={currentInfo.full_name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Position"
                        name="position"
                        value={form.position}
                        onChange={handleChange}
                        variant="outlined"
                        placeholder={currentInfo.position}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        variant="outlined"
                        placeholder={currentInfo.email}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        variant="outlined"
                        placeholder={currentInfo.phone}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledButton type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Update Profile
                      </StyledButton>
                    </Grid>
                  </Grid>
                </form>
              </ProfileSection>
              
              <Divider sx={{ my: 4 }} />
              
              {/* Change Password Section */}
              <ProfileSection>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <VpnKeyIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Change Password</Typography>
                </Box>
                <form onSubmit={handlePassSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Current Password"
                        type="password"
                        name="current_password"
                        value={passForm.current_password}
                        onChange={handlePassChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="New Password"
                        type="password"
                        name="new_password"
                        value={passForm.new_password}
                        onChange={handlePassChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Confirm New Password"
                        type="password"
                        name="confirm_password"
                        value={passForm.confirm_password}
                        onChange={handlePassChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledButton 
                        type="submit" 
                        variant="contained" 
                        color="secondary" 
                        sx={{ mt: 2 }}
                        disabled={passLoading}
                      >
                        {passLoading ? <CircularProgress size={24} color="inherit" /> : 'Change Password'}
                      </StyledButton>
                    </Grid>
                  </Grid>
                </form>
              </ProfileSection>
            </ProfileContentCard>
          </Grid>
        </Grid>
      </ProfileMainContent>

      {/* Snackbar for messages */}
      <Snackbar open={!!message} autoHideDuration={6000} onClose={() => setMessage('')}>
        <Alert onClose={() => setMessage('')} severity={message.includes('successfully') ? 'success' : 'error'} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      <Snackbar open={!!passMessage} autoHideDuration={6000} onClose={() => setPassMessage('')}>
        <Alert onClose={() => setPassMessage('')} severity={passMessage.includes('successfully') ? 'success' : 'error'} sx={{ width: '100%' }}>
          {passMessage}
        </Alert>
      </Snackbar>
    </ProfileContainer>
  );
}