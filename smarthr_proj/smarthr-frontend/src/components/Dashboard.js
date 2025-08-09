// src/components/Dashboard.jsx
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
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';

import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined'; // Still useful for the new widget

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
import { Bar, Line } from 'react-chartjs-2';

// Import for the calendar (still needed if you want to keep the calendar modal, but not for "Today's Date" widget)
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import moment from 'moment'; // Make sure this is imported

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

// --- Dashboard Component ---
export default function Dashboard() {
  const theme = useTheme();
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    upcomingPayroll: 0,
    upcomingEventsCount: 0,
    employeeSalaryVarianceChart: { labels: [], data: [] },
    employeeSalaryChart: { labels: [], data: [] },
    leaveTrendsChart: { labels: [], data: [] },
  });

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState('');
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(moment()); // Initialize with current date

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [empRes, leaveRes, payRes, eventsRes] = await Promise.all([
          axios.get('http://localhost/smarthr_proj/dashboard_fetch_employees.php'),
          axios.get('http://localhost/smarthr_proj/dashboard_fetch_leave_requests.php'),
          axios.get('http://localhost/smarthr_proj/dashboard_fetch_payrolls.php'),
          axios.get('http://localhost/smarthr_proj/events.php'),
        ]);

        const employees = empRes.data || [];
        const leaves = leaveRes.data || [];
        const payrolls = payRes.data || [];
        const events = Array.isArray(eventsRes.data) ? eventsRes.data : [];

        const totalEmployees = employees.length;
        const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
        const upcomingPayroll = payrolls.reduce((sum, p) => sum + parseFloat(p.total_salary || 0), 0);

        const today = moment().startOf('day');
        const filteredEvents = events.filter(ev => {
          const eventDate = moment(ev.date).startOf('day');
          return eventDate.isSameOrAfter(today);
        });

        const upcomingEventsCount = filteredEvents.length;

        // -- Salary Variance & Average Salary calculations --
        const salaryByDept = {};
        employees.forEach(emp => {
          const dept = emp.department || 'Unknown';
          const sal = parseFloat(emp.salary || 0);
          if (!salaryByDept[dept]) salaryByDept[dept] = [];
          if (sal > 0) salaryByDept[dept].push(sal);
        });

        const salaryVarianceByDept = {};
        const avgSalaryByDept = {};

        for (const dept in salaryByDept) {
          const salaries = salaryByDept[dept];
          const n = salaries.length;
          if (n === 0) {
            salaryVarianceByDept[dept] = 0;
            avgSalaryByDept[dept] = 0;
          } else {
            const mean = salaries.reduce((a,b) => a + b, 0) / n;
            avgSalaryByDept[dept] = mean;
            const variance = salaries.reduce((a,b) => a + (b - mean) ** 2, 0) / n;
            salaryVarianceByDept[dept] = variance;
          }
        }

        const departments = Object.keys(salaryByDept);

        const employeeSalaryVarianceChart = {
          labels: departments,
          data: departments.map(dept => salaryVarianceByDept[dept]),
        };

        const employeeSalaryChart = {
          labels: departments,
          data: departments.map(dept => avgSalaryByDept[dept]),
        };

        // Monthly leave trends
        const monthlyLeaveCounts = leaves.reduce((acc, leave) => {
          if (leave.request_date) {
            const date = moment(leave.request_date);
            const month = date.format('MMM YYYY');
            acc[month] = (acc[month] || 0) + 1;
          }
          return acc;
        }, {});

        const sortedMonths = Object.keys(monthlyLeaveCounts).sort((a, b) => {
          const dateA = moment(a, 'MMM YYYY');
          const dateB = moment(b, 'MMM YYYY');
          return dateA.diff(dateB);
        });

        const leaveTrendsChart = {
          labels: sortedMonths,
          data: sortedMonths.map(month => monthlyLeaveCounts[month]),
        };

        setDashboardData({
          totalEmployees,
          pendingLeaves,
          upcomingPayroll,
          upcomingEventsCount,
          employeeSalaryVarianceChart,
          employeeSalaryChart,
          leaveTrendsChart,
        });

        setUpcomingEvents(filteredEvents);
        setEventsError('');
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setEventsError('Failed to load upcoming events');
      } finally {
        setEventsLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const adminName = "Admin";

  // Function to close the calendar modal
  const handleCloseCalendarModal = () => {
    setShowCalendarModal(false);
  };

  // Helper function for common chart options that adapt to theme
  const getChartOptions = (titleText) => ({
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: titleText,
        font: { size: 18, weight: 'bold' },
        color: theme.palette.text.primary,
      },
      legend: { display: false },
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

  // Chart Data & Options for Salary Variance Chart
  const employeeSalaryVarianceChartData = {
    labels: dashboardData.employeeSalaryVarianceChart.labels,
    datasets: [
      {
        label: 'Salary Variance',
        data: dashboardData.employeeSalaryVarianceChart.data,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 99, 132, 0.9)' : 'rgba(255, 99, 132, 0.7)',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 99, 132, 1)' : 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const employeeSalaryVarianceOptions = getChartOptions('Employee Salary Variance by Department');

  // Chart Data & Options for Average Salary Chart
  const employeeSalaryChartData = {
    labels: dashboardData.employeeSalaryChart.labels,
    datasets: [
      {
        label: 'Average Salary (Rs.)',
        data: dashboardData.employeeSalaryChart.data,
        fill: false,
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main,
        tension: 0.3,
        pointBackgroundColor: theme.palette.primary.main,
        pointBorderColor: theme.palette.background.paper,
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const employeeSalaryOptions = getChartOptions('Average Employee Salary by Department');
  employeeSalaryOptions.scales.y.beginAtZero = true;
  
  // Format today's date
  const todayFormatted = moment().format('Do [of] MMMM YYYY'); // 'Do' for ordinal, '[of]' to escape 'of' literal

  // Updated Summary Widgets to include Today's Date
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
      value: `Rs. ${dashboardData.upcomingPayroll.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      icon: <AttachMoneyIcon />,
      color: '#4caf50',
    },
    {
      id: 4,
      title: 'Upcoming Events',
      value: dashboardData.upcomingEventsCount.toLocaleString(),
      icon: <CalendarMonthOutlinedIcon />,
      color: '#ff5722',
    },
    // New Widget for Today's Date
    {
      id: 5,
      title: 'Today\'s Date',
      value: todayFormatted,
      icon: <TodayOutlinedIcon />,
      color: '#673ab7', // A new color for this widget, or adjust as desired
    },
  ];

  // Quick Actions (removed "Today's Date" from here)
  const quickActions = [
    { name: 'Add Employee', icon: <PersonAddOutlinedIcon />, path: '/dashboard/add-employee' },
    { name: 'Add Payroll', icon: <PaidOutlined />, path: '/dashboard/add-payroll' },
    { name: 'View Payrolls', icon: <PaidOutlined />, path: '/dashboard/view-payrolls' },
    { name: 'Leave Requests', icon: <EventBusyOutlinedIcon />, path: '/dashboard/leave-requests' },
    { name: 'Notifications', icon: <NotificationsOutlinedIcon />, path: '/dashboard/notifications' },
  ];

  // Chart for Leave Trends
  const leaveTrendsChartData = {
    labels: dashboardData.leaveTrendsChart.labels,
    datasets: [
      {
        label: 'Leave Requests',
        data: dashboardData.leaveTrendsChart.data,
        fill: true,
        backgroundColor: alpha(theme.palette.primary.main, 0.2),
        borderColor: theme.palette.primary.main,
        tension: 0.3,
        pointBackgroundColor: theme.palette.primary.main,
        pointBorderColor: theme.palette.background.paper,
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const leaveTrendsOptions = getChartOptions('Monthly Leave Trends');
  leaveTrendsOptions.scales.y.beginAtZero = true;

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

        {/* Summary Widgets */}
        {/* Adjusted Grid spacing for 5 widgets, 2.4/5=0.48 so need 12/5 = 2.4 or 12/6=2 per item for 5-6 items in a row */}
        <Grid container spacing={3} sx={{ mt: 0 }}>
          {summaryWidgets.map((widget, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={widget.id}> {/* Changed md={3} to md={2.4} for 5 items */}
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
        </Grid>

        {/* Quick Actions Section (no change needed here for the quick actions themselves, as "Today's Date" is removed) */}
        <Box sx={{ mt: 8 }}>
          <DashboardCard sx={{ animationDelay: '0.4s' }}>
            <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 2 }}>Quick Actions</Typography>
            <Grid container spacing={2}>
              {quickActions.map((action) => (
                <Grid item xs={6} sm={4} md={2.4} key={action.name}>
                  {/* Quick actions will always be links now that Today's Date is a widget */}
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
        </Box>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <DashboardCard sx={{ animationDelay: '0.5s' }}>
              <Bar data={employeeSalaryVarianceChartData} options={employeeSalaryVarianceOptions} />
            </DashboardCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <DashboardCard sx={{ animationDelay: '0.6s' }}>
              <Line data={employeeSalaryChartData} options={employeeSalaryOptions} />
            </DashboardCard>
          </Grid>

          <Grid item xs={12}>
            <DashboardCard sx={{ animationDelay: '0.7s' }}>
              <Line data={leaveTrendsChartData} options={leaveTrendsOptions} />
            </DashboardCard>
          </Grid>
        </Grid>

        {/* Upcoming Events Section */}
        <Box sx={{ mt: 5 }}>
          <DashboardCard sx={{ animationDelay: '0.8s' }}>
            <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 3 }}>
              Upcoming Events
            </Typography>
            {eventsLoading ? (
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                Loading events...
              </Typography>
            ) : eventsError ? (
              <Typography variant="body1" sx={{ color: theme.palette.error.main }}>
                {eventsError}
              </Typography>
            ) : upcomingEvents.length === 0 ? (
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                No upcoming events.
              </Typography>
            ) : (
              upcomingEvents.map(event => (
                <EventItem key={event.id || event.date + event.title}>
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
        </Box>
      </MainContent>

      {/* Calendar Modal (still available if you want to reuse it for something else, e.g., an "Open Calendar" button) */}
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