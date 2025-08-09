import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Alert, Box, Typography
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles'; // Import useTheme and alpha
import MacOsTopNavbar from './MacOsTopNavbar';

const API_URL = 'http://localhost/smarthr_proj/events.php';

// --- Styled Components for Dark Mode Compatibility ---

const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default, // Use theme background
  color: theme.palette.text.primary, // Ensure default text color adapts
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  maxWidth: 1000,
  margin: '80px auto 20px', // Adjust margin to account for navbar and center content
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary, // Use primary text color
  marginBottom: theme.spacing(3),
  textAlign: 'center', // Center title
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper, // Use paper background
  boxShadow: theme.palette.mode === 'dark'
    ? `0px 4px 20px ${alpha(theme.palette.common.black, 0.5)}`
    : `0px 4px 20px rgba(0,0,0,0.1)`,
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.palette.mode === 'dark'
    ? `0px 2px 10px ${alpha(theme.palette.common.black, 0.3)}`
    : `0px 2px 10px rgba(0,0,0,0.05)`,
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText, // Text color contrasting with primary background
  fontWeight: 600,
  fontSize: '0.875rem',
}));

const StyledTableBodyCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.primary, // Ensure cell text color adapts
  borderBottom: `1px solid ${theme.palette.divider}`, // Use theme divider color
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.background.paper, 0.7) // Slightly different shade for dark mode odd rows
      : alpha(theme.palette.action.hover, 0.05), // Light stripe for light mode
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.hover, theme.palette.mode === 'dark' ? 0.15 : 0.1), // Hover effect
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.default, 0.5) : theme.palette.background.paper,
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: '2px',
    },
  },
  '& .MuiInputBase-input': {
    color: theme.palette.text.primary,
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  },
}));


export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form, setForm] = useState({
    id: null,
    title: '',
    date: '',
    time: '',
    description: ''
  });

  const theme = useTheme(); // Access the theme object

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to fetch events: ${res.status}`);
      }
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  // Open dialog for Add or Edit
  const handleOpen = (event = null) => {
    if (event) {
      setForm({ ...event });
      setIsEditMode(true);
    } else {
      setForm({ id: null, title: '', date: '', time: '', description: '' });
      setIsEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm({ id: null, title: '', date: '', time: '', description: '' });
    setIsEditMode(false);
  };

  // Form input change
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submit Add or Edit
  const handleSubmit = async () => {
    const method = isEditMode ? 'PUT' : 'POST';
    try {
      const res = await fetch(API_URL, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to ${isEditMode ? 'update' : 'add'} event`);
      }
      await fetchEvents(); // Re-fetch events to update the list
      handleClose();
    } catch (err) {
      alert(err.message || 'Error saving event');
    }
  };

  // Delete event by id
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete event');
      }
      await fetchEvents(); // Re-fetch events to update the list
    } catch (err) {
      alert(err.message || 'Error deleting event');
    }
  };

  return (
    <PageContainer>
      <MacOsTopNavbar />
      <MainContent>
        <SectionTitle variant="h4">Manage Events</SectionTitle>
        {errorMsg && <Alert severity="error" sx={{ mb: 2, bgcolor: alpha(theme.palette.error.main, 0.1), color: theme.palette.error.main }}>{errorMsg}</Alert>}

        <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2 }}>
          Add Event
        </Button>

        {loading ? (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>Loading Events...</Typography>
          </Box>
        ) : (
          <StyledTableContainer component={StyledPaper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell>Title</StyledTableHeadCell>
                  <StyledTableHeadCell>Date</StyledTableHeadCell>
                  <StyledTableHeadCell>Time</StyledTableHeadCell>
                  <StyledTableHeadCell>Description</StyledTableHeadCell>
                  <StyledTableHeadCell>Actions</StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.length === 0 ? (
                  <StyledTableRow>
                    <StyledTableBodyCell colSpan={5} align="center">No events found.</StyledTableBodyCell>
                  </StyledTableRow>
                ) : (
                  events.map((event) => (
                    <StyledTableRow key={event.id}>
                      <StyledTableBodyCell>{event.title}</StyledTableBodyCell>
                      <StyledTableBodyCell>{event.date}</StyledTableBodyCell>
                      <StyledTableBodyCell>{event.time}</StyledTableBodyCell>
                      <StyledTableBodyCell>{event.description}</StyledTableBodyCell>
                      <StyledTableBodyCell>
                        <Button size="small" onClick={() => handleOpen(event)} sx={{ mr: 1 }}>Edit</Button>
                        <Button size="small" color="error" onClick={() => handleDelete(event.id)}>Delete</Button>
                      </StyledTableBodyCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>
        )}

        {/* Add/Edit Event Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary }}>
            {isEditMode ? 'Edit Event' : 'Add Event'}
          </DialogTitle>
          <StyledDialogContent>
            <StyledTextField
              margin="dense"
              label="Title"
              name="title"
              fullWidth
              value={form.title}
              onChange={handleChange}
            />
            <StyledTextField
              margin="dense"
              label="Date"
              name="date"
              type="date"
              fullWidth
              value={form.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <StyledTextField
              margin="dense"
              label="Time"
              name="time"
              type="time"
              fullWidth
              value={form.time}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <StyledTextField
              margin="dense"
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={3}
              value={form.description}
              onChange={handleChange}
            />
          </StyledDialogContent>
          <StyledDialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {isEditMode ? 'Update' : 'Add'}
            </Button>
          </StyledDialogActions>
        </Dialog>
      </MainContent>
    </PageContainer>
  );
}