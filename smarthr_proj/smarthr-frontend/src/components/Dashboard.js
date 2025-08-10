import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogContent,
  CircularProgress,
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';

import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';

import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import PaidOutlined from '@mui/icons-material/PaidOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';

import MacOsTopNavbar from './MacOsTopNavbar';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import moment from 'moment';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

// --- Styled Components Adapted for Theme ---

const DashboardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: '90px',
  overflowY: 'auto',
  maxHeight: 'calc(100vh - 90px)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const DashboardContentHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3, 4),
  borderRadius: '16px',
  boxShadow: `0 8px 20px ${alpha(theme.palette.text.primary, 0.08)}`,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(2.5, 3),
  },
}));

const DashboardCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  boxShadow: `0 8px 20px ${alpha(theme.palette.text.primary, 0.08)}`,
  backgroundColor: theme.palette.background.paper,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  animation: 'fadeInScale 0.6s ease-out forwards',
  position: 'relative',
}));

const WidgetContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '10px',
});

const WidgetIconWrapper = styled(Box)(({ theme, color }) => ({
  backgroundColor: alpha(color, 0.1),
  borderRadius: '50%',
  padding: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& .MuiSvgIcon-root': {
    color: color,
    fontSize: '2.2rem',
  },
}));

const QuickActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '12px',
  flexDirection: 'column',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  color: theme.palette.text.secondary,
  transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out',
  '& .MuiSvgIcon-root': {
    fontSize: '2.5rem',
    marginBottom: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  '&:hover': {
    transform: 'translateY(-3px)',
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    color: theme.palette.primary.main,
  },
}));

const EventItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  borderRadius: '8px',
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  '&:last-child': {
    marginBottom: 0,
  },
}));

// --- New UpcomingEvents component ---
const UpcomingEvents = ({ events, loading, error }) => {
  const theme = useTheme();

  return (
    <DashboardCard sx={{ animationDelay: '0.8s' }}>
      <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 3 }}>
        Upcoming Events
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
          <CircularProgress size={24} />
        </Box>
      ) : error ? (
        <Typography variant="body1" sx={{ color: theme.palette.error.main }}>
          {error}
        </Typography>
      ) : events.length === 0 ? (
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
          No upcoming events.
        </Typography>
      ) : (
        events.map(event => (
          <EventItem key={event.id || `${event.date}-${event.title}`}>
            <CalendarMonthOutlinedIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                {event.title}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {moment(event.date).format('MMM D, YYYY')}
              </Typography>
            </Box>
          </EventItem>
        ))
      )}
    </DashboardCard>
  );
};

// --- Dashboard Component ---
export default function Dashboard() {
  const theme = useTheme();
  const adminData = JSON.parse(localStorage.getItem('admin'));

  const [adminName, setAdminName] = useState("Admin");

  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    upcomingPayroll: 0,
    upcomingEventsCount: 0,
    employeeCountChart: { labels: [], data: [] },
    overtimeChart: { labels: [], data: [] },
    payrollExpensesChart: { labels: [], data: [] },
  });

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState('');
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(moment());

  // Function to fetch data from the unified dashboard endpoint
  const fetchDashboardData = async () => {
    try {
      const res = await axios.get('http://localhost/smarthr_proj/dashboard_fetch_data.php');
      const data = res.data;

      const employees = data.employees || [];
      const leaves = data.leaves || [];
      const payrolls = data.payrolls || [];
      const events = data.events || [];

      // Process the data for the dashboard
      const totalEmployees = employees.length;
      const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
      const upcomingPayroll = payrolls.reduce((sum, p) => sum + parseFloat(p.total_salary || 0), 0);

      const today = moment().startOf('day');
      const filteredEvents = events.filter(ev => {
        const eventDate = moment(ev.date).startOf('day');
        return eventDate.isSameOrAfter(today);
      });
      const upcomingEventsCount = filteredEvents.length;

      // Charts data
      const employeeCountChart = data.employeeCountChart || { labels: [], data: [] };
      const overtimeChart = data.overtimeChart || { labels: [], data: [] };
      const payrollExpensesChart = data.payrollExpensesChart || { labels: [], data: [] };

      setDashboardData({
        totalEmployees,
        pendingLeaves,
        upcomingPayroll,
        upcomingEventsCount,
        employeeCountChart,
        overtimeChart,
        payrollExpensesChart,
      });

      setUpcomingEvents(filteredEvents);
      setEventsError('');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setEventsError('Failed to load dashboard data.');
    } finally {
      setEventsLoading(false);
    }
  };

  // Function to fetch upcoming events specifically from events.php
  const fetchUpcomingEvents = async () => {
    setEventsLoading(true);
    try {
      // Use the provided events.php endpoint
      const res = await axios.get('http://localhost/smarthr_proj/events.php');
      const events = res.data;

      // Filter events to only show upcoming ones
      const today = moment().startOf('day');
      const filteredEvents = events.filter(ev => {
        // Ensure date is valid and format is consistent
        if (ev.date && ev.date !== '0000-00-00') {
          const eventDate = moment(ev.date).startOf('day');
          return eventDate.isSameOrAfter(today);
        }
        return false;
      }).sort((a, b) => moment(a.date).diff(moment(b.date))); // Sort by date

      setUpcomingEvents(filteredEvents);
      setDashboardData(prevData => ({ ...prevData, upcomingEventsCount: filteredEvents.length }));
      setEventsError('');
    } catch (error) {
      console.error('Error fetching events:', error);
      setEventsError('Failed to load upcoming events.');
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    // This effect handles fetching all dashboard data except events
    const fetchCoreDashboardData = async () => {
      try {
        const res = await axios.get('http://localhost/smarthr_proj/dashboard_fetch_data.php');
        const data = res.data;
        // ... (existing processing logic) ...
        const employees = data.employees || [];
        const leaves = data.leaves || [];
        const payrolls = data.payrolls || [];
        
        const totalEmployees = employees.length;
        const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
        const upcomingPayroll = payrolls.reduce((sum, p) => sum + parseFloat(p.total_salary || 0), 0);
        
        const employeeCountChart = data.employeeCountChart || { labels: [], data: [] };
        const overtimeChart = data.overtimeChart || { labels: [], data: [] };
        const payrollExpensesChart = data.payrollExpensesChart || { labels: [], data: [] };
        
        setDashboardData({
          totalEmployees,
          pendingLeaves,
          upcomingPayroll,
          upcomingEventsCount: 0, // This will be updated by the other effect
          employeeCountChart,
          overtimeChart,
          payrollExpensesChart,
        });

      } catch (error) {
        console.error('Error fetching core dashboard data:', error);
      }
    };

    fetchCoreDashboardData();
    fetchUpcomingEvents(); // Call the dedicated events fetch function
  }, []);

  // Effect to fetch admin's full name
  useEffect(() => {
    if (adminData?.id) {
      const fetchAdminName = async () => {
        try {
          const res = await axios.get(`http://localhost/smarthr_proj/admin_get_profile.php?id=${adminData.id}`);
          if (res.data.success) {
            setAdminName(res.data.admin.full_name || adminData.full_name || "Admin");
          } else {
            console.error("Failed to fetch admin profile:", res.data.message);
            setAdminName(adminData.full_name || "Admin");
          }
        } catch (error) {
          console.error("Error fetching admin profile:", error);
          setAdminName(adminData.full_name || "Admin");
        }
      };
      fetchAdminName();
    }
  }, [adminData]);


  const handleCloseCalendarModal = () => {
    setShowCalendarModal(false);
  };

  const getChartOptions = (titleText, showLegend = false) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: titleText,
        font: { size: 18, weight: 'bold' },
        color: theme.palette.text.primary,
      },
      legend: {
        display: showLegend,
        position: 'bottom',
        labels: {
          color: theme.palette.text.secondary,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 10,
        boxPadding: 5,
        titleColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : '#fff',
        bodyColor: theme.palette.mode === 'dark' ? theme.palette.text.secondary : '#eee',
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: theme.palette.text.secondary },
      },
      y: {
        grid: { color: alpha(theme.palette.text.primary, 0.1) },
        ticks: { color: theme.palette.text.secondary, precision: 0 },
      },
    },
  });

  const employeeCountChartData = {
    labels: dashboardData.employeeCountChart.labels,
    datasets: [
      {
        label: 'Employee Count',
        data: dashboardData.employeeCountChart.data,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
      },
    ],
  };
  const employeeCountOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Employee Distribution by Department',
        font: { size: 18, weight: 'bold' },
        color: theme.palette.text.primary,
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: { color: theme.palette.text.secondary },
      },
    },
  };

  const overtimeChartData = {
    labels: dashboardData.overtimeChart.labels,
    datasets: [
      {
        label: 'Total Overtime Hours',
        data: dashboardData.overtimeChart.data,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };
  const overtimeOptions = getChartOptions('Total Overtime Hours by Department');
  overtimeOptions.scales.y.beginAtZero = true;

  const payrollExpensesChartData = {
    labels: dashboardData.payrollExpensesChart.labels,
    datasets: [
      {
        label: 'Total Payroll (Rs.)',
        data: dashboardData.payrollExpensesChart.data,
        fill: true,
        backgroundColor: alpha(theme.palette.success.main, 0.2),
        borderColor: theme.palette.success.main,
        tension: 0.3,
        pointBackgroundColor: theme.palette.success.main,
        pointBorderColor: theme.palette.background.paper,
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };
  const payrollExpensesOptions = getChartOptions('Monthly Payroll Expenses');
  payrollExpensesOptions.scales.y.beginAtZero = true;
  
  const todayFormatted = moment().format('Do [of] MMMM YYYY');

  const summaryWidgets = [
    {
      id: 1,
      title: 'Total Employees',
      value: dashboardData.totalEmployees.toLocaleString(),
      icon: <PeopleOutlineIcon />,
      color: '#007aff',
    },
    {
      id: 2,
      title: 'Pending Leave Requests',
      value: dashboardData.pendingLeaves.toLocaleString(),
      icon: <EventNoteIcon />,
      color: '#ffc107',
    },
    {
      id: 3,
      title: 'Upcoming Payroll',
      value: `Rs. ${dashboardData.upcomingPayroll.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}.00`,
      icon: <AttachMoneyIcon />,
      color: '#4caf50',
    },
    {
      id: 5,
      title: 'Today\'s Date',
      value: todayFormatted,
      icon: <TodayOutlinedIcon />,
      color: '#673ab7',
    },
  ];

  const quickActions = [
    { name: 'Add Employee', icon: <PersonAddOutlinedIcon />, path: '/dashboard/add-employee' },
    { name: 'Add Payroll', icon: <PaidOutlined />, path: '/dashboard/add-payroll' },
    { name: 'View Payrolls', icon: <PaidOutlined />, path: '/dashboard/view-payrolls' },
    { name: 'Leave Requests', icon: <EventBusyOutlinedIcon />, path: '/dashboard/leave-requests' },
    { name: 'Notifications', icon: <NotificationsOutlinedIcon />, path: '/dashboard/notifications' },
  ];

  return (
    <DashboardContainer>
      <MacOsTopNavbar />

      <MainContent>
        <DashboardContentHeader>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
              Welcome, {adminName}!
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
              Here's an overview of your HR operations.
            </Typography>
          </Box>
        </DashboardContentHeader>

        <Grid container spacing={3}>
          {summaryWidgets.map((widget, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={widget.id}>
              <DashboardCard sx={{ animationDelay: `${0.1 * index}s` }}>
                <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, fontWeight: 500, mb: 1 }}>
                  {widget.title}
                </Typography>
                <WidgetContent>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                    {widget.value}
                  </Typography>
                  <WidgetIconWrapper color={widget.color}>
                    {widget.icon}
                  </WidgetIconWrapper>
                </WidgetContent>
              </DashboardCard>
            </Grid>
          ))}

          <Grid item xs={12}>
            <DashboardCard sx={{ animationDelay: '0.4s' }}>
              <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 2 }}>Quick Actions</Typography>
              <Grid container spacing={2}>
                {quickActions.map((action) => (
                  <Grid item xs={6} sm={4} md={2.4} key={action.name}>
                    <QuickActionButton
                      variant="outlined"
                      fullWidth
                      component={Link}
                      to={action.path}
                      sx={{
                        flexDirection: 'column',
                        py: 3,
                        borderColor: alpha(theme.palette.text.primary, 0.2),
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        },
                        '& .MuiSvgIcon-root': { fontSize: '2.5rem', mb: 1 },
                        fontWeight: 600,
                      }}
                    >
                      {action.icon}
                      {action.name}
                    </QuickActionButton>
                  </Grid>
                ))}
              </Grid>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <DashboardCard sx={{ animationDelay: '0.5s' }}>
              <Doughnut data={employeeCountChartData} options={employeeCountOptions} />
            </DashboardCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <DashboardCard sx={{ animationDelay: '0.6s' }}>
              <Bar data={overtimeChartData} options={overtimeOptions} />
            </DashboardCard>
          </Grid>

          <Grid item xs={12}>
            <DashboardCard sx={{ animationDelay: '0.7s' }}>
              <Line data={payrollExpensesChartData} options={payrollExpensesOptions} />
            </DashboardCard>
          </Grid>

          <Grid item xs={12}>
            <UpcomingEvents events={upcomingEvents} loading={eventsLoading} error={eventsError} />
          </Grid>
        </Grid>
      </MainContent>

      <Dialog open={showCalendarModal} onClose={handleCloseCalendarModal} maxWidth="sm" fullWidth>
        <DialogContent sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '16px', p: 3 }}>
          <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 2 }}>
            Select a Date
          </Typography>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DateCalendar
              value={selectedCalendarDate}
              onChange={(newValue) => setSelectedCalendarDate(newValue)}
              sx={{
                width: '100%',
                maxHeight: '400px',
                overflow: 'hidden',
                '& .MuiPickersDay-root': {
                  color: theme.palette.text.primary,
                },
                '& .MuiPickersCalendarHeader-root': {
                  color: theme.palette.text.primary,
                },
                '& .MuiPickersArrowSwitcher-root .MuiSvgIcon-root': {
                  color: theme.palette.text.primary,
                },
                '& .MuiDayCalendar-weekDayLabel': {
                  color: theme.palette.text.secondary,
                },
                '& .MuiPickersDay-today': {
                  borderColor: theme.palette.primary.main,
                },
                '& .MuiPickersDay-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                },
              }}
            />
          </LocalizationProvider>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleCloseCalendarModal} color="primary" variant="contained">
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </DashboardContainer>
  );
}