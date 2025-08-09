// src/components/AddPayroll.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
} from "@mui/material";
import { styled, alpha, useTheme } from "@mui/material/styles"; // Import useTheme here

// Icons
import PersonIcon from "@mui/icons-material/Person";
import MoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalculateIcon from '@mui/icons-material/Calculate';
import WorkIcon from '@mui/icons-material/Work';
import MacOsTopNavbar from './MacOsTopNavbar';

// Local Component Import
// import DashboardNavbar from "./DashboardNavbar"; // This was commented out, keeping it that way


// --- Styled Components (Updated for Dark Mode) ---

const PageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  // Adapt background color based on theme palette
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary, // Ensure default text color adapts
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: "90px",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const FormCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "16px",
  // Dynamic shadow based on theme mode
  boxShadow: theme.palette.mode === 'dark'
    ? `0 8px 20px ${alpha(theme.palette.common.black, 0.4)}`
    : `0 8px 20px rgba(0, 0, 0, 0.08)`,
  // Adapt background color
  backgroundColor: theme.palette.background.paper,
  width: "100%",
  maxWidth: "1300px",
  animation: "fadeInUp 0.8s ease-out forwards",
  "@keyframes fadeInUp": {
    "0%": { opacity: 0, transform: "translateY(20px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
  [theme.breakpoints.down("md")]: {
    flexDirection: 'column',
    maxWidth: '95%',
  }
}));

const FormTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  // Adapt text color
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
  textAlign: "center",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    // Adapt background color for input fields
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.grey[700], 0.3)
      : alpha(theme.palette.grey[100], 0.7),
    "& fieldset": {
      // Adapt border color
      borderColor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.primary.light, 0.5)
        : theme.palette.grey[300],
    },
    "&:hover fieldset": { borderColor: theme.palette.primary.main },
    "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main, borderWidth: "2px" },
    "& input": {
      color: theme.palette.text.primary, // Ensure input text is readable
    },
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.text.secondary, // Adapt label color
    "&.Mui-focused": {
      color: theme.palette.primary.main, // Focused label uses primary color
    }
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: "8px",
  // Adapt background color for select fields
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.grey[700], 0.3)
    : alpha(theme.palette.grey[100], 0.7),
  "& .MuiOutlinedInput-notchedOutline": {
    // Adapt border color
    borderColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.primary.light, 0.5)
      : theme.palette.grey[300],
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
    borderWidth: "2px",
  },
  "& .MuiSelect-select": {
    color: theme.palette.text.primary, // Ensure selected text is readable
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.text.secondary, // Adapt label color for select
  },
  "& .MuiSvgIcon-root": {
    color: theme.palette.action.active, // Dropdown arrow color
  },
  marginBottom: theme.spacing(2),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5, 3),
  borderRadius: "12px",
  fontWeight: 700,
  backgroundColor: "#007aff", // Keeping this specific blue, but it can be theme.palette.primary.main
  color: "#ffffff",
  "&:hover": {
    backgroundColor: "#005bb5",
    transform: "translateY(-2px)",
    // Dynamic shadow
    boxShadow: theme.palette.mode === 'dark'
      ? `0 4px 10px ${alpha(theme.palette.primary.main, 0.5)}`
      : `0 4px 10px rgba(0, 122, 255, 0.3)`,
  },
  transition: "all 0.3s ease-in-out",
}));

const EmployeeCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: "12px",
  // Adapt background color and shadow
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.primary.dark, 0.2)
    : alpha(theme.palette.primary.light, 0.08),
  boxShadow: theme.palette.mode === 'dark'
    ? `0 4px 12px ${alpha(theme.palette.common.black, 0.2)}`
    : '0 4px 12px rgba(0, 0, 0, 0.05)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  height: '100%',
}));

const EmployeeAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(7),
  height: theme.spacing(7),
  marginBottom: theme.spacing(1),
  border: `2px solid ${theme.palette.primary.main}`,
  boxShadow: theme.palette.mode === 'dark'
    ? `0 1px 4px ${alpha(theme.palette.common.black, 0.3)}`
    : '0 1px 4px rgba(0, 0, 0, 0.08)',
}));

const EmployeeDetailItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(0.1, 0),
  '& .MuiListItemIcon-root': {
    minWidth: '28px',
    color: theme.palette.primary.main,
  },
  '& .MuiListItemText-primary': {
    fontWeight: 500,
    fontSize: '0.85rem',
    color: theme.palette.text.primary,
  },
  '& .MuiListItemText-secondary': {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
  },
}));

const InfoBar = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1, 1.5),
  marginBottom: theme.spacing(3),
  borderRadius: "10px",
  // Adapt background color and shadow
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.info.dark, 0.3)
    : alpha(theme.palette.info.light, 0.1),
  boxShadow: theme.palette.mode === 'dark'
    ? `0 2px 6px ${alpha(theme.palette.common.black, 0.2)}`
    : "0 2px 6px rgba(0, 0, 0, 0.05)",
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  flexWrap: 'wrap',
  minHeight: '50px',
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: theme.spacing(0.5, 1),
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(0.8),
    color: theme.palette.primary.main,
    fontSize: '1.1rem',
  },
  '& .MuiTypography-root': {
    fontSize: '0.8rem',
    fontWeight: 500,
    color: theme.palette.text.primary,
  }
}));

const AddPayroll = () => {
  const theme = useTheme(); // Access the current theme

  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [basicHours, setBasicHours] = useState("");
  const [overtimeHours, setOvertimeHours] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [deductions, setDeductions] = useState("");
  const [payPeriod, setPayPeriod] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [currentEmployeeDetails, setCurrentEmployeeDetails] = useState(null);

  useEffect(() => {
    setLoadingEmployees(true);
    axios
      .get("http://localhost/smarthr_proj/employee_list.php")
      .then((res) => {
        setLoadingEmployees(false);
        if (res.data.success) {
          setEmployees(res.data.employees);
        } else {
          setSnackbarMessage("Failed to fetch employees: " + res.data.message);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      })
      .catch((err) => {
        setLoadingEmployees(false);
        setSnackbarMessage("Error loading employees: " + (err.response?.data?.message || err.message));
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  }, []);

  useEffect(() => {
    if (selectedId) {
      const selectedEmp = employees.find(
        (emp) => String(emp.id) === String(selectedId)
      );
      if (selectedEmp) {
        setHourlyRate(selectedEmp.hourly_rate || "");
        setCurrentEmployeeDetails(selectedEmp);
      } else {
        setHourlyRate("");
        setCurrentEmployeeDetails(null);
      }
    } else {
      setHourlyRate("");
      setCurrentEmployeeDetails(null);
    }
  }, [selectedId, employees]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setSnackbarMessage("Adding payroll...");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);

    if (!payPeriod) {
      setSnackbarMessage("Please select a Pay Period.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      setLoadingSubmit(false);
      return;
    }
    if (!selectedId) {
      setSnackbarMessage("Please select an Employee.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      setLoadingSubmit(false);
      return;
    }
    if (basicHours === "" || isNaN(Number(basicHours)) || Number(basicHours) < 0) {
      setSnackbarMessage("Please enter valid Basic Hours (a non-negative number).");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      setLoadingSubmit(false);
      return;
    }
    if (isNaN(Number(overtimeHours)) || Number(overtimeHours) < 0) {
      setSnackbarMessage("Please enter valid Overtime Hours (a non-negative number).");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      setLoadingSubmit(false);
      return;
    }
    if (isNaN(Number(deductions)) || Number(deductions) < 0) {
      setSnackbarMessage("Please enter valid Deductions (a non-negative number).");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      setLoadingSubmit(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost/smarthr_proj/create_payroll.php",
        {
          employee_id: Number(selectedId),
          basic_hours: Number(basicHours),
          overtime_hours: Number(overtimeHours || 0),
          hourly_rate: Number(hourlyRate),
          deductions: Number(deductions || 0),
          pay_period: payPeriod,
        }
      );

      if (res.data.success) {
        setSnackbarMessage(
          `Payroll added successfully! Total Salary: Rs. ${parseFloat(res.data.total_salary).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        );
        setSnackbarSeverity("success");
        setSelectedId("");
        setBasicHours("");
        setOvertimeHours("");
        setDeductions("");
        setPayPeriod("");
        setCurrentEmployeeDetails(null);
      } else {
        setSnackbarMessage("Failed to add payroll: " + res.data.message);
        setSnackbarSeverity("error");
      }
    } catch (err) {
      setSnackbarMessage("Network or server error while adding payroll: " + (err.response?.data?.message || err.message));
      setSnackbarSeverity("error");
    } finally {
      setLoadingSubmit(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <PageContainer>
      <MacOsTopNavbar/>
      <MainContent>
        <FormCard>
          <FormTitle variant="h4">Add Employee Payroll</FormTitle>
          <Grid container spacing={4}>
            {/* Left Column: Employee Details Display (Only DOB) */}
            <Grid item xs={12} md={4}>
              <EmployeeCard elevation={0}>
                {currentEmployeeDetails ? (
                  <>
                    {/* The content that appears when an employee is selected */}
                    <EmployeeAvatar>
                      {currentEmployeeDetails.full_name?.charAt(0).toUpperCase()}
                    </EmployeeAvatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                      {currentEmployeeDetails.full_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {currentEmployeeDetails.email}
                    </Typography>
                    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', borderRadius: '8px', overflow: 'hidden' }}>
                      <EmployeeDetailItem>
                        <ListItemIcon><PersonIcon /></ListItemIcon>
                        <ListItemText primary="Employee ID" secondary={currentEmployeeDetails.id} />
                      </EmployeeDetailItem>
                      <EmployeeDetailItem>
                        <ListItemIcon><CalendarMonthIcon /></ListItemIcon>
                        <ListItemText primary="Date of Birth" secondary={currentEmployeeDetails.dob} />
                      </EmployeeDetailItem>
                      <EmployeeDetailItem>
                        <ListItemIcon><MoneyIcon /></ListItemIcon>
                        <ListItemText
                          primary="Hourly Rate"
                          secondary={`Rs. ${parseFloat(currentEmployeeDetails.hourly_rate || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /hr`}
                        />
                      </EmployeeDetailItem>
                      {/* You can add more details here if needed */}
                    </List>
                  </>
                ) : (
                  <Box sx={{ p: 2, color: 'text.secondary', textAlign: 'center' }}>
                    <PersonIcon sx={{ fontSize: 40, mb: 1, color: alpha(theme.palette.primary.main, 0.4) }} /> {/* Adapt icon color */}
                    <Typography variant="subtitle2" color={theme.palette.text.primary}>Select an Employee</Typography>
                    <Typography variant="caption" color={theme.palette.text.secondary}>
                      Their details will appear here.
                    </Typography>
                  </Box>
                )}
              </EmployeeCard>
            </Grid>

            {/* Right Column: Payroll Form (Larger) */}
            <Grid item xs={12} md={8}>
              {currentEmployeeDetails && (
                <InfoBar>
                  <InfoItem>
                    <EmployeeAvatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: '0.8rem' }}>
                        {currentEmployeeDetails.full_name?.charAt(0).toUpperCase()}
                    </EmployeeAvatar>
                    <Typography>{currentEmployeeDetails.full_name}</Typography>
                  </InfoItem>
                  <InfoItem>
                    <WorkIcon />
                    <Typography>ID: {currentEmployeeDetails.id}</Typography>
                  </InfoItem>
                  <InfoItem>
                    <MoneyIcon />
                    <Typography>
                      Rate: Rs. {parseFloat(currentEmployeeDetails.hourly_rate || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /hr
                    </Typography>
                  </InfoItem>
                </InfoBar>
              )}

              <form onSubmit={handleSubmit}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="employee-select-label" sx={{ color: theme.palette.text.secondary }}>Select Employee</InputLabel>
                  <StyledSelect
                    labelId="employee-select-label"
                    value={selectedId}
                    label="Select Employee"
                    onChange={(e) => setSelectedId(e.target.value)}
                    required
                    MenuProps={{ // Apply dark mode styles to the dropdown menu
                      PaperProps: {
                        sx: {
                          backgroundColor: theme.palette.background.paper,
                          boxShadow: theme.palette.mode === 'dark' ? `0 4px 20px ${alpha(theme.palette.common.black, 0.5)}` : '0 4px 20px rgba(0,0,0,0.1)',
                        },
                      },
                      MenuListProps: {
                        sx: {
                          '& .MuiMenuItem-root': {
                            color: theme.palette.text.primary,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.15 : 0.08),
                            },
                          },
                          '& .MuiMenuItem-root.Mui-selected': {
                            backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.25 : 0.15),
                            color: theme.palette.primary.contrastText, // Optional: if you want selected item text to stand out
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.3 : 0.2),
                            },
                          },
                          '& .MuiMenuItem-root.Mui-disabled': {
                            color: theme.palette.text.disabled,
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {loadingEmployees ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1, color: theme.palette.text.secondary }} /> <Typography sx={{ color: theme.palette.text.secondary }}>Loading Employees...</Typography>
                      </MenuItem>
                    ) : employees.length === 0 ? (
                      <MenuItem disabled sx={{ color: theme.palette.text.disabled }}>No employees found.</MenuItem>
                    ) : (
                      employees.map((emp) => (
                        <MenuItem key={emp.id} value={emp.id}>
                          {emp.full_name} ({emp.email})
                        </MenuItem>
                      ))
                    )}
                  </StyledSelect>
                </FormControl>

                <StyledTextField
                  fullWidth
                  label="Pay Period (Month/Year)"
                  type="month"
                  value={payPeriod}
                  onChange={(e) => setPayPeriod(e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                />

                <StyledTextField
                  fullWidth
                  label="Basic Hours"
                  type="number"
                  value={basicHours}
                  onChange={(e) => setBasicHours(e.target.value)}
                  required
                  inputProps={{ min: "0" }}
                />

                <StyledTextField
                  fullWidth
                  label="Overtime Hours"
                  type="number"
                  value={overtimeHours}
                  onChange={(e) => setOvertimeHours(e.target.value)}
                  inputProps={{ min: "0" }}
                />

                <StyledTextField
                  fullWidth
                  label="Hourly Rate (Rs.)"
                  type="number"
                  value={hourlyRate}
                  InputProps={{
                    readOnly: true,
                  }}
                  // Adaptive background for read-only field
                  sx={{ backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.grey[800], 0.5) : alpha(theme.palette.grey[200], 0.5) }}
                />

                <StyledTextField
                  fullWidth
                  label="Deductions (Rs.)"
                  type="number"
                  value={deductions}
                  onChange={(e) => setDeductions(e.target.value)}
                  inputProps={{ min: "0" }}
                />

                <SubmitButton
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loadingSubmit}
                  startIcon={loadingSubmit ? <CircularProgress size={20} color="inherit" /> : <CalculateIcon />}
                >
                  {loadingSubmit ? "Calculating..." : "Add Payroll"}
                </SubmitButton>
              </form>
            </Grid>
          </Grid>
        </FormCard>
      </MainContent>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%", backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }} // Ensure Alert background and text adapt
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default AddPayroll;