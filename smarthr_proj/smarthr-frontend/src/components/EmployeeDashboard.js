import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from 'axios';

// Material-UI Imports
import {
    Typography,
    Box,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Avatar,
    Checkbox,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { styled, useTheme, alpha } from "@mui/material/styles"; // Import 'alpha' here

// Material-UI Icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PublicIcon from '@mui/icons-material/Public';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ChecklistIcon from '@mui/icons-material/Checklist';
import AddTaskIcon from '@mui/icons-material/AddTask';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// --- Styled Components ---

const DashboardContentWrapper = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(4),
    // Use theme.palette.background.default for the main background
    backgroundColor: theme.palette.background.default,
    minHeight: 'calc(100vh - 64px)',
    overflowX: 'hidden',
    display: 'flex',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
    },
}));

const MainContentArea = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    paddingRight: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
        paddingRight: 0,
    },
}));

const RightSidebar = styled(Box)(({ theme }) => ({
    width: '350px',
    minWidth: '300px',
    flexShrink: 0,
    marginLeft: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
        width: '100%',
        marginLeft: 0,
        marginTop: theme.spacing(4),
    },
}));

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 3,
    // Adjust boxShadow for dark mode if needed, usually making it lighter or using alpha
    // Using theme.shadows ensures consistency, but you can explicitly define color
    boxShadow: theme.palette.mode === 'light' ? theme.shadows[6] : `0px 3px 5px ${alpha(theme.palette.common.black, 0.4)}`,
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper, // Ensure card background uses paper color
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: theme.palette.mode === 'light' ? theme.shadows[10] : `0px 6px 10px ${alpha(theme.palette.common.black, 0.6)}`,
    },
}));

const CardHeaderStyled = styled(CardHeader)(({ theme }) => ({
    padding: theme.spacing(2, 3),
    backgroundColor: theme.palette.background.paper, // Explicitly use paper background
    borderBottom: `1px solid ${theme.palette.divider}`, // Use theme divider
    '& .MuiCardHeader-title': {
        fontWeight: 700,
        fontSize: '1.25rem',
        color: theme.palette.primary.main, // Primary color adapts
    },
    '& .MuiCardHeader-subheader': {
        fontSize: '0.9rem',
        color: theme.palette.text.secondary, // Secondary text color adapts
    },
}));

const FeatureCardContent = styled(CardContent)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: theme.spacing(4),
    '& .MuiSvgIcon-root': {
        fontSize: '3.5rem',
        color: theme.palette.primary.light, // Primary light adapts
        marginBottom: theme.spacing(2),
    },
    '& .MuiTypography-h6': {
        fontWeight: 600,
        marginBottom: theme.spacing(1),
        color: theme.palette.text.primary, // Ensure headers adapt
    },
    '& .MuiButton-root': {
        marginTop: theme.spacing(2),
        borderRadius: theme.shape.borderRadius * 2,
        padding: theme.spacing(1.2, 3),
    },
}));

const ActivityListItem = styled(ListItem)(({ theme }) => ({
    padding: theme.spacing(1.5, 2),
    '&:hover': {
        backgroundColor: theme.palette.action.hover, // Action hover adapts
    },
}));

const IosCircularProgress = styled(Box)(({ theme }) => ({
    position: 'relative',
    display: 'inline-flex',
    marginRight: theme.spacing(2),
    '& .MuiCircularProgress-root': {
        color: theme.palette.success.main, // Success color adapts
        transition: 'stroke-dashoffset 0.5s ease-in-out',
    },
}));

const IosCircularProgressText = styled(Box)(({ theme }) => ({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.text.primary, // Primary text color adapts
    fontWeight: 600,
    fontSize: '0.9rem',
}));

// --- Main Component ---

export default function EmployeeDashboard() {
    const navigate = useNavigate();
    const theme = useTheme(); // Use the theme hook
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileName, setProfileName] = useState('');
    const [profilePicUrl, setProfilePicUrl] = useState('');
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [employeeTasks, setEmployeeTasks] = useState([]);
    const [taskCompletionPercentage, setTaskCompletionPercentage] = useState(0);

    // State for Add/Edit Task Modal
    const [openTaskModal, setOpenTaskModal] = useState(false);
    const [currentTask, setCurrentTask] = useState({
        id: null,
        title: '',
        description: '',
        due_date: '',
        priority: 'Normal',
    });
    const [isEditMode, setIsEditMode] = useState(false);

    // --- Task Management Functions ---

    const fetchEmployeeTasks = useCallback(async (employeeId) => {
        try {
            const res = await axios.get(`http://localhost/smarthr_proj/employee_tasks.php?employee_id=${employeeId}`);
            if (Array.isArray(res.data)) {
                const sortedTasks = res.data.sort((a, b) => {
                    if (a.status === 'pending' && b.status === 'completed') return -1;
                    if (a.status === 'completed' && b.status === 'pending') return 1;

                    const dateA = a.due_date ? new Date(a.due_date) : null;
                    const dateB = b.due_date ? new Date(b.due_date) : null;

                    if (dateA && dateB) {
                        return dateA.getTime() - dateB.getTime();
                    }
                    if (dateA) return -1;
                    if (dateB) return 1;

                    return a.id - b.id;
                });
                setEmployeeTasks(sortedTasks);
                calculateTaskCompletion(sortedTasks);
            } else {
                console.error('Failed to fetch tasks:', res.data.message || 'Unknown error', res.data);
                setEmployeeTasks([]);
            }
        } catch (err) {
            console.error('Error fetching employee tasks:', err);
            setEmployeeTasks([]);
        }
    }, []);

    const calculateTaskCompletion = (tasks) => {
        if (tasks.length === 0) {
            setTaskCompletionPercentage(0);
            return;
        }
        const completedTasks = tasks.filter(task => task.status === 'completed').length;
        const percentage = (completedTasks / tasks.length) * 100;
        setTaskCompletionPercentage(Math.round(percentage));
    };

    const handleToggleTaskCompletion = async (taskId, currentStatus) => {
        if (!employee || !employee.id) {
            console.error("Employee ID is not available to toggle task.");
            alert("Employee data not loaded. Cannot toggle task status.");
            return;
        }

        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        try {
            const res = await axios.put(`http://localhost/smarthr_proj/employee_tasks.php`, {
                task_id: taskId,
                employee_id: employee.id,
                status: newStatus,
            });
            if (res.data.message) {
                setEmployeeTasks(prevTasks => {
                    const updatedTasks = prevTasks.map(task =>
                        task.id === taskId ? { ...task, status: newStatus } : task
                    ).sort((a, b) => {
                        if (a.status === 'pending' && b.status === 'completed') return -1;
                        if (a.status === 'completed' && b.status === 'pending') return 1;

                        const dateA = a.due_date ? new Date(a.due_date) : null;
                        const dateB = b.due_date ? new Date(b.due_date) : null;

                        if (dateA && dateB) {
                            return dateA.getTime() - dateB.getTime();
                        }
                        if (dateA) return -1;
                        if (dateB) return 1;

                        return a.id - b.id;
                    });
                    calculateTaskCompletion(updatedTasks);
                    return updatedTasks;
                });
            } else {
                console.error('Failed to update task status:', res.data.error || 'Unknown error');
                alert(`Failed to update task status: ${res.data.error || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('Error updating task status:', err);
            alert('An error occurred while updating task status.');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm("Are you sure you want to delete this task?")) {
            return;
        }
        if (!employee || !employee.id) {
            console.error("Employee ID is not available to delete task.");
            alert("Employee data not loaded. Cannot delete task.");
            return;
        }
        try {
            const res = await axios.delete(`http://localhost/smarthr_proj/employee_tasks.php`, {
                data: {
                    task_id: taskId,
                    employee_id: employee.id,
                }
            });
            if (res.data.message) {
                alert("Task deleted successfully!");
                setEmployeeTasks(prevTasks => {
                    const filteredTasks = prevTasks.filter(task => task.id !== taskId);
                    calculateTaskCompletion(filteredTasks);
                    return filteredTasks;
                });
            } else {
                console.error('Failed to delete task:', res.data.error || 'Unknown error');
                alert(`Failed to delete task: ${res.data.error || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('Error deleting task:', err);
            alert('An error occurred while deleting the task.');
        }
    };

    const handleOpenAddTaskModal = () => {
        setIsEditMode(false);
        setCurrentTask({ id: null, title: '', description: '', due_date: '', priority: 'Normal' });
        setOpenTaskModal(true);
    };

    const handleCloseTaskModal = () => {
        setOpenTaskModal(false);
    };

    const handleTaskFormChange = (e) => {
        const { name, value } = e.target;
        setCurrentTask(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveTask = async () => {
        if (!employee || !employee.id) {
            alert("Employee data not loaded. Cannot save task.");
            return;
        }

        if (!currentTask.title.trim()) {
            alert("Task title cannot be empty.");
            return;
        }

        try {
            if (isEditMode) {
                const res = await axios.put(`http://localhost/smarthr_proj/employee_tasks.php`, {
                    task_id: currentTask.id,
                    employee_id: employee.id,
                    title: currentTask.title,
                    description: currentTask.description,
                    due_date: currentTask.due_date === '' ? null : currentTask.due_date,
                    priority: currentTask.priority,
                });
                if (res.data.message) {
                    alert("Task updated successfully!");
                    fetchEmployeeTasks(employee.id);
                    handleCloseTaskModal();
                } else {
                    alert(`Failed to update task: ${res.data.error || 'Unknown error'}`);
                }
            } else {
                const res = await axios.post(`http://localhost/smarthr_proj/employee_tasks.php`, {
                    employee_id: employee.id,
                    title: currentTask.title,
                    description: currentTask.description,
                    due_date: currentTask.due_date === '' ? null : currentTask.due_date,
                    priority: currentTask.priority,
                });
                if (res.data.message) {
                    alert("Task added successfully!");
                    fetchEmployeeTasks(employee.id);
                    handleCloseTaskModal();
                } else {
                    alert(`Failed to add task: ${res.data.error || 'Unknown error'}`);
                }
            }
        } catch (err) {
            console.error('Error saving task:', err);
            alert('An error occurred while saving the task.');
        }
    };

    const handleOpenEditTaskModal = (task) => {
        setIsEditMode(true);
        const formattedDueDate = task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '';

        setCurrentTask({
            id: task.id,
            title: task.title,
            description: task.description || '',
            due_date: formattedDueDate,
            priority: task.priority || 'Normal',
        });
        setOpenTaskModal(true);
    };


    useEffect(() => {
        const storedEmployee = localStorage.getItem("employee");
        if (!storedEmployee) {
            navigate("/employee-login");
            return;
        }

        const parsedEmployee = JSON.parse(storedEmployee);
        setEmployee(parsedEmployee);

        const fetchData = async () => {
            let isProfileFetched = false;
            let isEventsFetched = false;
            let isTasksFetched = false;

            if (parsedEmployee?.id) {
                try {
                    const res = await axios.get(`http://localhost/smarthr_proj/get_employee_profile.php?id=${parsedEmployee.id}`);
                    if (res.data.success && res.data.employee) {
                        const fetchedEmployeeData = res.data.employee;
                        setProfileName(fetchedEmployeeData.full_name || parsedEmployee.email.split('@')[0]);
                        let picUrl = '';
                        if (fetchedEmployeeData.profile_pic) {
                            if (fetchedEmployeeData.profile_pic.startsWith('http')) {
                                picUrl = fetchedEmployeeData.profile_pic;
                            } else {
                                picUrl = `http://localhost/smarthr_proj/uploads/${fetchedEmployeeData.profile_pic}`;
                            }
                        }
                        setProfilePicUrl(picUrl);
                    } else {
                        console.warn('Failed to fetch profile data:', res.data.message || 'Unknown error');
                        setProfileName(parsedEmployee.full_name || parsedEmployee.email.split('@')[0] || 'Employee');
                    }
                } catch (err) {
                    console.error('Error fetching employee profile for dashboard:', err);
                    setProfileName(parsedEmployee.full_name || parsedEmployee.email.split('@')[0] || 'Employee');
                } finally {
                    isProfileFetched = true;
                }

                await fetchEmployeeTasks(parsedEmployee.id);
                isTasksFetched = true;

            } else {
                console.warn('No employee ID found for dashboard profile/tasks fetch.');
                setProfileName(parsedEmployee.full_name || parsedEmployee.email.split('@')[0] || 'Employee');
                isProfileFetched = true;
                isTasksFetched = true;
            }

            try {
                const eventsRes = await axios.get(`http://localhost/smarthr_proj/events.php`);
                if (eventsRes.data && Array.isArray(eventsRes.data.events)) {
                    const sortedEvents = eventsRes.data.events.sort((a, b) => new Date(a.date) - new Date(b.date));
                    setUpcomingEvents(sortedEvents);
                } else if (eventsRes.data && Array.isArray(eventsRes.data)) {
                    const sortedEvents = eventsRes.data.sort((a, b) => new Date(a.date) - new Date(b.date));
                    setUpcomingEvents(sortedEvents);
                } else {
                    console.warn('Events API did not return expected array:', eventsRes.data);
                    setUpcomingEvents([]);
                }
            } catch (err) {
                console.error('Error fetching events:', err);
                setUpcomingEvents([]);
            } finally {
                isEventsFetched = true;
            }

            if (isProfileFetched && isEventsFetched && isTasksFetched) {
                setLoading(false);
            }
        };

        fetchData();

    }, [navigate, employee?.id, fetchEmployeeTasks]);


    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                flexDirection: 'column',
                // Use theme colors for loading screen
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
            }}>
                <CircularProgress sx={{ mb: 2, color: theme.palette.primary.main }} />
                <Typography variant="h6">Loading your SmartHR Dashboard...</Typography>
            </Box>
        );
    }

    return (
        <DashboardContentWrapper>
            {/* Main content area (Left Section) */}
            <MainContentArea>
                <Box sx={{ my: 4, textAlign: { xs: 'center', md: 'left' }, display: 'flex', alignItems: 'center', flexDirection: { xs: 'column', md: 'row' } }}>
                    {profilePicUrl ? (
                        <Avatar
                            src={profilePicUrl}
                            alt={profileName}
                            sx={{ width: 80, height: 80, mr: { xs: 0, md: 3 }, mb: { xs: 2, md: 0 }, boxShadow: theme.shadows[3] }}
                        />
                    ) : (
                        <Avatar sx={{ width: 80, height: 80, mr: { xs: 0, md: 3 }, mb: { xs: 2, md: 0 }, bgcolor: theme.palette.primary.light, fontSize: '3rem' }}>
                            {profileName.charAt(0).toUpperCase()}
                        </Avatar>
                    )}
                    <Box>
                        {/* Use palette.text.primary instead of primary.dark for universal text color */}
                        <Typography variant="h4" gutterBottom fontWeight={700} color="text.primary">
                            Hello, {profileName}!
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Welcome back to your SmartHR hub.
                        </Typography>
                    </Box>
                </Box>

                {/* Feature Cards */}
                <Grid container spacing={4} sx={{ mb: 5 }}>
                    {/* Profile Card */}
                    <Grid item xs={12} sm={6} lg={4}>
                        <StyledCard>
                            <FeatureCardContent>
                                <AccountCircleIcon />
                                <Typography variant="h6">Your Profile</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Keep your personal details and information up-to-date.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    endIcon={<ArrowForwardIcon />}
                                    component={RouterLink}
                                    to="/employee-profile"
                                >
                                    Manage Profile
                                </Button>
                            </FeatureCardContent>
                        </StyledCard>
                    </Grid>

                    {/* Payslips Card */}
                    <Grid item xs={12} sm={6} lg={4}>
                        <StyledCard>
                            <FeatureCardContent>
                                <AttachMoneyIcon />
                                <Typography variant="h6">Payslips & Payroll</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Access your latest payslips and payroll details.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    endIcon={<ArrowForwardIcon />}
                                    component={RouterLink}
                                    to="/employee-payslips"
                                >
                                    View Payslips
                                </Button>
                            </FeatureCardContent>
                        </StyledCard>
                    </Grid>

                    {/* Leave Request Card */}
                    <Grid item xs={12} sm={6} lg={4}>
                        <StyledCard>
                            <FeatureCardContent>
                                <BeachAccessIcon />
                                <Typography variant="h6">Request Leave</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Submit new leave requests or check existing ones.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    endIcon={<ArrowForwardIcon />}
                                    component={RouterLink}
                                    to="/employee-leave-request"
                                >
                                    Apply for Leave
                                </Button>
                            </FeatureCardContent>
                        </StyledCard>
                    </Grid>
                </Grid>

                {/* Recent Activity / HR News / Upcoming Events */}
                <Grid container spacing={4}>
                    <Grid item xs={12} lg={6}>
                        <StyledCard>
                            <CardHeaderStyled
                                title="Recent Activity"
                                subheader="Stay informed with the latest updates from SmartHR."
                                avatar={<NotificationsIcon color="action" />} // "action" color might not adapt well, consider "info" or "secondary"
                            />
                            <CardContent>
                                <List disablePadding>
                                    <ActivityListItem disablePadding>
                                        <ListItemText
                                            primary={<Typography color="text.primary">Your last leave request was approved.</Typography>}
                                            secondary={<Typography color="text.secondary">2 hours ago - Human Resources</Typography>}
                                        />
                                    </ActivityListItem>
                                    <Divider component="li" />
                                    <ActivityListItem disablePadding>
                                        <ListItemText
                                            primary={<Typography color="text.primary">New company policies uploaded to documents section.</Typography>}
                                            secondary={<Typography color="text.secondary">Yesterday - Company Announcements</Typography>}
                                        />
                                    </ActivityListItem>
                                    <Divider component="li" />
                                    <ActivityListItem disablePadding>
                                        <ListItemText
                                            primary={<Typography color="text.primary">Performance review scheduled for next week.</Typography>}
                                            secondary={<Typography color="text.secondary">3 days ago - Your Manager</Typography>}
                                        />
                                    </ActivityListItem>
                                </List>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    <Button sx={{ borderRadius: theme.shape.borderRadius * 2 }} component={RouterLink} to="/employee-notifications" endIcon={<ArrowForwardIcon />}>
                                        View All Notifications
                                    </Button>
                                </Box>
                            </CardContent>
                        </StyledCard>
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <StyledCard>
                            <CardHeaderStyled
                                title="HR News & Insights"
                                subheader="Stay updated with the latest in HR trends and company news."
                                avatar={<PublicIcon color="success" />}
                            />
                            <CardContent>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Explore articles, insights, and important announcements from the HR world and our company.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="success"
                                    endIcon={<ArrowForwardIcon />}
                                    href="https://www.shrm.org/topics-tools/news"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ borderRadius: theme.shape.borderRadius * 2 }}
                                >
                                    Visit HR News Site
                                </Button>
                            </CardContent>
                        </StyledCard>
                    </Grid>

                    <Grid item xs={12}>
                        <StyledCard>
                            <CardHeaderStyled
                                title="Upcoming Events"
                                subheader="Don't miss out on important dates!"
                                avatar={<EventNoteIcon color="info" />}
                            />
                            <CardContent>
                                <Box sx={{
                                    maxHeight: 200,
                                    overflowY: 'auto',
                                    pr: 1,
                                    // Make scrollbar visible/styled in dark mode if needed
                                    // You might need to target ::-webkit-scrollbar in global styles
                                }}>
                                    <List disablePadding>
                                        {upcomingEvents.length > 0 ? (
                                            upcomingEvents.map((event, index) => (
                                                <React.Fragment key={event.id || index}>
                                                    <ActivityListItem disablePadding>
                                                        <ListItemText
                                                            primary={<Typography color="text.primary">{event.title || 'No Title'}</Typography>}
                                                            secondary={<Typography color="text.secondary">{`${event.date || 'No Date'} - ${event.time || 'No Time'}`}</Typography>}
                                                        />
                                                    </ActivityListItem>
                                                    {index < upcomingEvents.length - 1 && <Divider component="li" />}
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                                                No upcoming events to display.
                                            </Typography>
                                        )}
                                    </List>
                                </Box>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                </Grid>
            </MainContentArea>

            {/* Right Sidebar - Employee To-Do List */}
            <RightSidebar>
                <StyledCard>
                    <CardHeaderStyled
                        title="Your To-Do List"
                        subheader="Keep track of your tasks."
                        avatar={<ChecklistIcon color="primary" />}
                    />
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <IosCircularProgress>
                                <CircularProgress
                                    variant="determinate"
                                    value={taskCompletionPercentage}
                                    size={50}
                                    thickness={5}
                                />
                                <IosCircularProgressText>
                                    <Typography variant="caption" component="div">
                                        {`${taskCompletionPercentage}%`}
                                    </Typography>
                                </IosCircularProgressText>
                            </IosCircularProgress>
                            <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }} color="text.primary">
                                Tasks Completed
                            </Typography>
                        </Box>
                        <Box sx={{
                            maxHeight: 400,
                            overflowY: 'auto',
                            pr: 1,
                        }}>
                            <List disablePadding>
                                {employeeTasks.length > 0 ? (
                                    employeeTasks.map((task) => (
                                        <React.Fragment key={task.id}>
                                            <ListItem
                                                secondaryAction={
                                                    <Box>
                                                        <IconButton edge="end" aria-label="edit" onClick={() => handleOpenEditTaskModal(task)} size="small"
                                                            sx={{ color: theme.palette.text.secondary }} // Adjust icon color
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(task.id)} size="small"
                                                            sx={{ color: theme.palette.error.main }} // Error color for delete
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                }
                                                disablePadding
                                            >
                                                <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={task.status === 'completed'}
                                                        tabIndex={-1}
                                                        disableRipple
                                                        onChange={() => handleToggleTaskCompletion(task.id, task.status)}
                                                        sx={{ color: theme.palette.primary.main, '&.Mui-checked': { color: theme.palette.success.main } }} // Checkbox color
                                                    />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Typography
                                                            color="text.primary" // Ensure text color adapts
                                                            sx={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}
                                                        >
                                                            {task.title}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <>
                                                            <Typography component="span" variant="body2" color="text.secondary"> {/* Secondary text color */}
                                                                {task.due_date ? `Due: ${task.due_date}` : 'No due date'}
                                                            </Typography>
                                                            {task.priority && (
                                                                <Typography component="span" variant="body2" color="text.secondary">
                                                                    {` | Priority: `}
                                                                    <Typography component="span" variant="body2"
                                                                        sx={{
                                                                            color: task.priority === 'High' ? theme.palette.error.main :
                                                                                task.priority === 'Low' ? theme.palette.info.main :
                                                                                    theme.palette.warning.main, // Different color for priority
                                                                            fontWeight: 600,
                                                                        }}
                                                                    >
                                                                        {task.priority}
                                                                    </Typography>
                                                                </Typography>
                                                            )}
                                                        </>
                                                    }
                                                />
                                            </ListItem>
                                            <Divider component="li" />
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                                        No tasks added yet. Click "Add New Task" to get started!
                                    </Typography>
                                )}
                            </List>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddTaskIcon />}
                                onClick={handleOpenAddTaskModal}
                                sx={{ borderRadius: theme.shape.borderRadius * 2, px: 3 }}
                            >
                                Add New Task
                            </Button>
                        </Box>
                    </CardContent>
                </StyledCard>
            </RightSidebar>

            {/* Add/Edit Task Modal */}
            <Dialog open={openTaskModal} onClose={handleCloseTaskModal} fullWidth maxWidth="sm"
                PaperProps={{
                    sx: {
                        backgroundColor: theme.palette.background.paper, // Modal background
                        color: theme.palette.text.primary, // Modal text color
                    }
                }}
            >
                <DialogTitle sx={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}>
                    {isEditMode ? 'Edit Task' : 'Add New Task'}
                </DialogTitle>
                <DialogContent dividers sx={{ backgroundColor: theme.palette.background.default }}> {/* Use default for content area */}
                    <TextField
                        autoFocus
                        margin="dense"
                        name="title"
                        label="Task Title"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentTask.title}
                        onChange={handleTaskFormChange}
                        required
                        sx={{ mb: 2 }}
                        InputLabelProps={{ style: { color: theme.palette.text.secondary } }} // Label color
                        InputProps={{ style: { color: theme.palette.text.primary } }} // Input text color
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description (Optional)"
                        type="text"
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        value={currentTask.description}
                        onChange={handleTaskFormChange}
                        sx={{ mb: 2 }}
                        InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
                        InputProps={{ style: { color: theme.palette.text.primary } }}
                    />
                    <TextField
                        margin="dense"
                        name="due_date"
                        label="Due Date (Optional)"
                        type="date"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true, style: { color: theme.palette.text.secondary } }}
                        InputProps={{ style: { color: theme.palette.text.primary } }}
                        value={currentTask.due_date}
                        onChange={handleTaskFormChange}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth margin="dense" variant="outlined">
                        <InputLabel sx={{ color: theme.palette.text.secondary }}>Priority</InputLabel>
                        <Select
                            name="priority"
                            value={currentTask.priority}
                            label="Priority"
                            onChange={handleTaskFormChange}
                            sx={{ color: theme.palette.text.primary, '.MuiOutlinedInput-notchedOutline': { borderColor: alpha(theme.palette.text.primary, 0.23) } }} // Selector text and border
                        >
                            <MenuItem value="Low" sx={{ color: theme.palette.text.primary, backgroundColor: theme.palette.background.paper }}>Low</MenuItem>
                            <MenuItem value="Normal" sx={{ color: theme.palette.text.primary, backgroundColor: theme.palette.background.paper }}>Normal</MenuItem>
                            <MenuItem value="High" sx={{ color: theme.palette.text.primary, backgroundColor: theme.palette.background.paper }}>High</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: theme.palette.background.paper }}> {/* Dialog actions background */}
                    <Button onClick={handleCloseTaskModal} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveTask} color="primary" variant="contained">
                        {isEditMode ? 'Save Changes' : 'Add Task'}
                    </Button>
                </DialogActions>
            </Dialog>

        </DashboardContentWrapper>
    );
}