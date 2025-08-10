import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Material-UI Imports
import {
    Box,
    Typography,
    Paper,
    TextField,
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';

// Material-UI Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import MacOsTopNavbar from './MacOsTopNavbar';

const API_URL = 'http://localhost/smarthr_proj/events.php';

// --- Styled Components (aligned with the target style) ---

const PageContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
}));

const MainContent = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: '80px', // Adjusted for the navbar
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
        marginTop: '70px',
    },
}));

const ContentPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: '16px',
    boxShadow: theme.palette.mode === 'dark'
        ? `0 8px 30px ${alpha(theme.palette.common.black, 0.5)}`
        : `0 8px 30px rgba(0, 0, 0, 0.1)`,
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    maxWidth: '1200px', // Set a max-width for content
    animation: 'fadeInUp 0.7s ease-out forwards',
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
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: alpha(theme.palette.background.default, 0.5),
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
}));

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: '10px',
    fontWeight: 600,
    textTransform: 'none',
    padding: theme.spacing(1, 2.5),
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
    },
}));

// Table specific styles
const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 600,
    fontSize: '0.875rem',
    padding: '12px 16px',
    whiteSpace: 'nowrap',
}));

const StyledTableBodyCell = styled(TableCell)(({ theme }) => ({
    fontSize: '0.85rem',
    padding: '12px 16px',
    borderBottom: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    transition: 'background-color 0.2s ease-in-out',
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.mode === 'dark'
            ? alpha(theme.palette.grey[900], 0.5)
            : alpha(theme.palette.grey[50], 0.5),
    },
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.light, 0.1),
    },
}));


export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ searchText: '' });
    const [open, setOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [form, setForm] = useState({ id: null, title: '', date: '', time: '', description: '' });
    
    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    const theme = useTheme();

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL);
            if (res.data) {
                setEvents(Array.isArray(res.data) ? res.data : []);
            } else {
                showSnackbar('Failed to load events: Invalid data format.', 'error');
                setEvents([]);
            }
        } catch (err) {
            console.error('Error fetching events:', err);
            showSnackbar(err.response?.data?.message || err.message || 'An unknown error occurred.', 'error');
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

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
    };

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        const method = isEditMode ? 'put' : 'post';
        const url = API_URL;
        
        try {
            const res = await axios[method](url, form, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.data.success) {
                showSnackbar(`Event ${isEditMode ? 'updated' : 'added'} successfully!`, 'success');
                await fetchEvents();
                handleClose();
            } else {
                throw new Error(res.data.message || 'An unknown error occurred');
            }
        } catch (err) {
            console.error('Error saving event:', err);
            showSnackbar(err.response?.data?.message || err.message, 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            const res = await axios.delete(`${API_URL}?id=${id}`);
            if (res.data.success) {
                showSnackbar('Event deleted successfully!', 'success');
                await fetchEvents();
            } else {
                throw new Error(res.data.message || 'Failed to delete event');
            }
        } catch (err) {
            console.error('Error deleting event:', err);
            showSnackbar(err.response?.data?.message || err.message, 'error');
        }
    };

    const filteredEvents = events.filter(event => {
        const search = filter.searchText.toLowerCase();
        return (
            event.title?.toLowerCase().includes(search) ||
            event.description?.toLowerCase().includes(search) ||
            event.date?.toLowerCase().includes(search)
        );
    });

    return (
        <PageContainer>
            <MacOsTopNavbar />
            <MainContent>
                <ContentPaper>
                    <SectionTitle variant="h4">Manage Events</SectionTitle>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                        <StyledTextField
                            label="Search Events"
                            placeholder="Title, description, or date..."
                            value={filter.searchText}
                            onChange={(e) => setFilter({ ...filter, searchText: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                                ),
                            }}
                            size="small"
                            sx={{ width: { xs: '100%', sm: 300 } }}
                        />
                        <ActionButton
                            variant="contained"
                            color="primary"
                            onClick={() => handleOpen()}
                            startIcon={<AddIcon />}
                        >
                            Add New Event
                        </ActionButton>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, flexDirection: 'column', alignItems: 'center' }}>
                            <CircularProgress />
                            <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>Loading Events...</Typography>
                        </Box>
                    ) : (
                        <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: 'none' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableHeadCell>Title</StyledTableHeadCell>
                                        <StyledTableHeadCell>Date</StyledTableHeadCell>
                                        <StyledTableHeadCell>Time</StyledTableHeadCell>
                                        <StyledTableHeadCell sx={{ minWidth: 250 }}>Description</StyledTableHeadCell>
                                        <StyledTableHeadCell align="center">Actions</StyledTableHeadCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredEvents.length === 0 ? (
                                        <StyledTableRow>
                                            <StyledTableBodyCell colSpan={5} align="center">
                                                <Typography color="text.secondary" p={3}>No events found.</Typography>
                                            </StyledTableBodyCell>
                                        </StyledTableRow>
                                    ) : (
                                        filteredEvents.map((event) => (
                                            <StyledTableRow key={event.id}>
                                                <StyledTableBodyCell>{event.title}</StyledTableBodyCell>
                                                <StyledTableBodyCell>{event.date}</StyledTableBodyCell>
                                                <StyledTableBodyCell>{event.time}</StyledTableBodyCell>
                                                <StyledTableBodyCell>{event.description}</StyledTableBodyCell>
                                                <StyledTableBodyCell align="center">
                                                    <IconButton color="primary" onClick={() => handleOpen(event)}><EditIcon /></IconButton>
                                                    <IconButton color="error" onClick={() => handleDelete(event.id)}><DeleteIcon /></IconButton>
                                                </StyledTableBodyCell>
                                            </StyledTableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </ContentPaper>
            </MainContent>

            {/* Add/Edit Event Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ bgcolor: 'background.paper', color: 'text.primary', fontWeight: 'bold' }}>
                    {isEditMode ? 'Edit Event' : 'Add New Event'}
                </DialogTitle>
                <DialogContent sx={{ bgcolor: 'background.paper' }}>
                    <StyledTextField margin="dense" label="Title" name="title" fullWidth value={form.title} onChange={handleChange} />
                    <StyledTextField margin="dense" label="Date" name="date" type="date" fullWidth value={form.date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                    <StyledTextField margin="dense" label="Time" name="time" type="time" fullWidth value={form.time} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                    <StyledTextField margin="dense" label="Description" name="description" fullWidth multiline rows={4} value={form.description} onChange={handleChange} />
                </DialogContent>
                <DialogActions sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <ActionButton onClick={handleSubmit} variant="contained" color="primary">
                        {isEditMode ? 'Update Event' : 'Add Event'}
                    </ActionButton>
                </DialogActions>
            </Dialog>

            {/* Snackbar for Notifications */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%', borderRadius: '8px', boxShadow: 3 }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </PageContainer>
    );
}