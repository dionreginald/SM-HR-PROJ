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
} from "@mui/material";
import { styled, alpha, useTheme } from "@mui/material/styles";

// Icons
import CalculateIcon from '@mui/icons-material/Calculate';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import MacOsTopNavbar from './MacOsTopNavbar';

// --- Styled Components (Wireframe-style, no color changes) ---

const PageContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: "#f4f4f4", // Light gray background
  color: "#333",
});

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
  boxShadow: "0 4px 12px rgba(255, 40, 40, 0.08)",
  backgroundColor: "#fff",
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
  color: "#333",
  marginBottom: theme.spacing(3),
  textAlign: "center",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    "& fieldset": {
      borderColor: "#ddd",
    },
    "&:hover fieldset": { borderColor: "#aaa" },
    "&.Mui-focused fieldset": { borderColor: "#000", borderWidth: "2px" },
    "& input": {
      color: "#333",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#666",
    "&.Mui-focused": {
      color: "#000",
    }
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: "8px",
  backgroundColor: "#f9f9f9",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ddd",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#aaa",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#000",
    borderWidth: "2px",
  },
  "& .MuiSelect-select": {
    color: "#333",
  },
  "& .MuiInputLabel-root": {
    color: "#666",
  },
  "& .MuiSvgIcon-root": {
    color: "#333",
  },
  marginBottom: theme.spacing(2),
}));

const SubmitButton = styled(Button)({
  padding: "12px 24px",
  borderRadius: "12px",
  fontWeight: 700,
  backgroundColor: "#3d3affff",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#000",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  transition: "all 0.3s ease-in-out",
  "&.Mui-disabled": {
    backgroundColor: "#ccc",
    color: "#666",
  }
});

const UploadCSVButton = styled(Button)({
  padding: "12px 24px",
  borderRadius: "12px",
  fontWeight: 700,
  backgroundColor: "#0b00a3ff",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#008cffff",
  },
  transition: "all 0.3s ease-in-out",
  "&.Mui-disabled": {
    backgroundColor: "#ccc",
    color: "#666",
  }
});

const EmployeeDetailsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: "12px",
  backgroundColor: "#f0f0f0",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  [theme.breakpoints.down("sm")]: {
    marginBottom: theme.spacing(2),
  },
}));

const EmployeeDetailsItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px',
  '& .MuiTypography-root': {
    color: '#333',
    marginLeft: '8px',
  },
});

const AddPayroll = () => {
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
  const [loadingBulkSubmit, setLoadingBulkSubmit] = useState(false);

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
  
  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvText = e.target.result;
          const rows = csvText.split('\n').filter(row => row.trim() !== '').slice(1); // Skip header and empty rows
          const payrollData = rows.map((row, index) => {
            const columns = row.split(',');
            // Check for correct number of columns
            if (columns.length !== 7) {
                throw new Error(`Row ${index + 2} has an incorrect number of columns. Expected 7, but found ${columns.length}.`);
            }
            
            // Assuming the CSV columns are in the order: employee_id, admin_id, hourly_rate, pay_period, basic_hours, overtime_hours, deductions
            const employee_id_str = columns[0].trim();
            const pay_period = columns[3].trim();
            const basic_hours_str = columns[4].trim();
            const overtime_hours_str = columns[5].trim() || '0';
            const deductions_str = columns[6].trim() || '0';

            // Check if mandatory fields are present
            if (!employee_id_str || !pay_period || !basic_hours_str) {
              throw new Error(`Row ${index + 2} is missing required data.`);
            }

            // Check if values are valid numbers
            const employee_id = parseInt(employee_id_str, 10);
            const basic_hours = parseFloat(basic_hours_str);
            const overtime_hours = parseFloat(overtime_hours_str);
            const deductions = parseFloat(deductions_str);
            
            if (isNaN(employee_id) || isNaN(basic_hours) || isNaN(overtime_hours) || isNaN(deductions)) {
              throw new Error(`Row ${index + 2} contains invalid numeric data.`);
            }

            return {
              employee_id: employee_id,
              basic_hours: basic_hours,
              overtime_hours: overtime_hours,
              deductions: deductions,
              pay_period: pay_period,
              // The hourly_rate is not directly used in the bulk upload logic, as the server
              // should pull it from the employee_id, but we'll include it for completeness.
              hourly_rate: parseFloat(columns[2].trim()),
            };
          });

          handleBulkSubmit(payrollData);
        } catch (error) {
          setSnackbarMessage("Error parsing CSV file: " + error.message);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleBulkSubmit = async (data) => {
    setLoadingBulkSubmit(true);
    setSnackbarMessage("Adding bulk payroll from CSV...");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);

    try {
      const res = await axios.post(
        "http://localhost/smarthr_proj/bulk_payroll.php",
        data // Sending the array of objects directly
      );

      const responseData = res.data;

      if (Array.isArray(responseData)) {
        // The PHP script returned an array of results, as expected
        const successfulRecords = responseData.filter(r => r.success);
        const failedRecords = responseData.filter(r => !r.success);
        
        let message = `Bulk upload complete: ${successfulRecords.length} successful, ${failedRecords.length} failed.`;
        let severity = "success";

        if (failedRecords.length > 0) {
          // If some or all records failed, adjust the message and severity
          severity = failedRecords.length === responseData.length ? "error" : "warning";
          const firstFailedMessage = failedRecords[0].message;
          message += ` First error: ${firstFailedMessage}`;
        }
        
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        
      } else if (responseData.success === false) {
        // This handles a single error object from the PHP script
        setSnackbarMessage(`Failed to add bulk payroll: ${responseData.message}`);
        setSnackbarSeverity("error");
      } else {
        // Catch-all for an unexpected response format
        setSnackbarMessage("Failed to add bulk payroll: Unexpected server response.");
        setSnackbarSeverity("error");
      }

    } catch (err) {
      setLoadingBulkSubmit(false);
      const errorMessage = err.response?.data?.message || err.message || "An unknown network error occurred.";
      setSnackbarMessage("Network or server error while adding bulk payroll: " + errorMessage);
      setSnackbarSeverity("error");
    } finally {
      setLoadingBulkSubmit(false);
      setSnackbarOpen(true);
    }
  };
  
  const handleDownloadTemplate = () => {
    // Define the headers for the CSV template
    const headers = [
      "employee_id",
      "admin_id",
      "hourly_rate",
      "pay_period",
      "basic_hours",
      "overtime_hours",
      "deductions",
    ];
    
    // Create CSV rows from the fetched employee data, leaving the input fields blank
    const employeeDataRows = employees.map(emp => {
      // Assuming 'id' from employee_list.php is the employee_id
      // 'admin_id' is left blank as it is not in the fetched employee data
      // 'hourly_rate' is included from the fetched data
      return [
        `"${emp.id}"`, // Employee ID
        `""`,        // Admin ID (to be filled)
        `"${emp.hourly_rate}"`, // Hourly Rate
        `""`,        // Pay Period (to be filled)
        `""`,        // Basic Hours (to be filled)
        `""`,        // Overtime Hours (to be filled)
        `""`,        // Deductions (to be filled)
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + employeeDataRows.join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "payroll_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSnackbarMessage("Payroll template with employee details downloaded successfully!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleDownloadSampleData = () => {
    // Define the headers for the CSV file based on the upload logic
    const headers = [
      "employee_id",
      "admin_id",
      "hourly_rate",
      "pay_period",
      "basic_hours",
      "overtime_hours",
      "deductions",
    ];
    
    // Hardcoded sample data based on the user's provided table
    const sampleData = [
      // Format: employee_id, admin_id, hourly_rate, pay_period, basic_hours, overtime_hours, deductions
      [2, 2, 1000.00, "2025-07", 160.00, 10.00, 5000.00],
      [2, 2, 6000.00, "2025-07", 20.00, 10.00, 500.00],
      [2, 2, 6000.00, "2025-07", 50.00, 12.00, 500.00],
      [3, 2, 500.00, "2025-07", 10.00, 2.00, 50.00],
      [3, 0, 500.00, "2025-07", 10.00, 2.00, 5000.00],
      [3, 0, 500.00, "2025-07", 10.00, 2.00, 1000.00],
      [3, 0, 500.00, "2025-12", 500.00, 50.00, 50000.00],
      [5, 1, 1000.00, "2025-07", 160.00, 10.00, 5000.00],
      [6, 1, 1200.00, "2025-07", 160.00, 5.00, 4000.00],
      [7, 1, 1100.00, "2025-07", 160.00, 8.00, 3000.00],
      [8, 1, 1300.00, "2025-07", 160.00, 12.00, 4500.00],
      [6, 0, 1200.00, "2025-06", 25.00, 10.00, 5000.00],
      [9, 0, 900.00, "2025-07", 2.00, 5.00, 500.00],
      [4, 0, 600.00, "2025-01", 24.00, 10.00, 500.00],
      [2, 0, 6000.00, "2025-02", 60.00, 5.00, 900.00],
      [10, 0, 1500.00, "2025-01", 600.00, 50.00, 0.00],
      [3, 0, 500.00, "2025-08", 20.00, 5.00, 6000.00],
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + sampleData.map(row => row.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sample_payroll_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSnackbarMessage("Sample payroll data template downloaded successfully!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
            <FormTitle variant="h4" sx={{ mb: { xs: 2, md: 0 } }}>Add Employee Payroll</FormTitle>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
              {/* New Download Sample Data Button */}
              <Button
                variant="contained"
                onClick={handleDownloadSampleData}
                startIcon={<DownloadIcon />}
                sx={{
                  backgroundColor: '#00a100ff',
                  '&:hover': {
                    backgroundColor: '#000',
                  },
                }}
              >
                Download Sample Data
              </Button>
              {/* CSV Upload Button */}
              <input
                accept=".csv"
                style={{ display: 'none' }}
                id="csv-upload-button"
                type="file"
                onChange={handleCSVUpload}
              />
              <label htmlFor="csv-upload-button">
                <UploadCSVButton
                  component="span"
                  variant="contained"
                  startIcon={loadingBulkSubmit ? <CircularProgress size={20} color="inherit" /> : <UploadFileIcon />}
                  disabled={loadingBulkSubmit}
                >
                  {loadingBulkSubmit ? "Uploading..." : "Upload Bulk Data"}
                </UploadCSVButton>
              </label>
            </Box>
          </Box>
          
          {/* Employee Details Section at the top */}
          <EmployeeDetailsCard>
            <Typography variant="subtitle1" sx={{ color: '#333', marginBottom: '8px', fontWeight: 'bold' }}>
              Select Employee Below
            </Typography>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <EmployeeDetailsItem>
                    <Typography variant="body2" sx={{fontWeight: 'bold'}}>Name:</Typography>
                    <Typography variant="body2">{currentEmployeeDetails ? currentEmployeeDetails.full_name : ""}</Typography>
                  </EmployeeDetailsItem>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <EmployeeDetailsItem>
                    <Typography variant="body2" sx={{fontWeight: 'bold'}}>Employee ID:</Typography>
                    <Typography variant="body2">{currentEmployeeDetails ? currentEmployeeDetails.id : ""}</Typography>
                  </EmployeeDetailsItem>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <EmployeeDetailsItem>
                    <Typography variant="body2" sx={{fontWeight: 'bold'}}>Payrate:</Typography>
                    <Typography variant="body2">{currentEmployeeDetails ? `Rs. ${parseFloat(currentEmployeeDetails.hourly_rate || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ""}</Typography>
                  </EmployeeDetailsItem>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <EmployeeDetailsItem>
                    <Typography variant="body2" sx={{fontWeight: 'bold'}}>Email:</Typography>
                    <Typography variant="body2">{currentEmployeeDetails ? currentEmployeeDetails.email : ""}</Typography>
                  </EmployeeDetailsItem>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <EmployeeDetailsItem>
                    <Typography variant="body2" sx={{fontWeight: 'bold'}}>DOB:</Typography>
                    <Typography variant="body2">{currentEmployeeDetails ? currentEmployeeDetails.dob : ""}</Typography>
                  </EmployeeDetailsItem>
                </Grid>
              </Grid>
            </Box>
          </EmployeeDetailsCard>

          <form onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="employee-select-label" sx={{ color: "#666" }}>Select Employee</InputLabel>
              <StyledSelect
                labelId="employee-select-label"
                value={selectedId}
                label="Select Employee"
                onChange={(e) => setSelectedId(e.target.value)}
                required
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: '#fff',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    },
                  },
                  MenuListProps: {
                    sx: {
                      '& .MuiMenuItem-root': {
                        color: '#333',
                        '&:hover': {
                          backgroundColor: '#f0f0f0',
                        },
                      },
                      '& .MuiMenuItem-root.Mui-selected': {
                        backgroundColor: '#e0e0e0',
                        color: '#333',
                        '&:hover': {
                            backgroundColor: '#d0d0d0',
                        },
                      },
                      '& .MuiMenuItem-root.Mui-disabled': {
                        color: '#ccc',
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
                    <CircularProgress size={20} sx={{ mr: 1, color: "#666" }} /> <Typography sx={{ color: "#666" }}>Loading Employees...</Typography>
                  </MenuItem>
                ) : employees.length === 0 ? (
                  <MenuItem disabled sx={{ color: "#ccc" }}>No employees found.</MenuItem>
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
              label="Hourly Rate"
              type="text"
              value={currentEmployeeDetails ? `Rs. ${parseFloat(hourlyRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "N/A"}
              InputProps={{
                readOnly: true,
              }}
              sx={{ backgroundColor: "#e0e0e0" }}
            />

            <StyledTextField
              fullWidth
              label="Deductions (Rs.)"
              type="number"
              value={deductions}
              onChange={(e) => setDeductions(e.target.value)}
              inputProps={{ min: "0" }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
              {/* Existing Submit Button */}
              <SubmitButton
                type="submit"
                variant="contained"
                fullWidth
                disabled={loadingSubmit}
                startIcon={loadingSubmit ? <CircularProgress size={20} color="inherit" /> : <CalculateIcon />}
              >
                {loadingSubmit ? "Calculating..." : "Add Payroll"}
              </SubmitButton>
            </Box>
          </form>
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
          sx={{ width: "100%", backgroundColor: '#fff', color: '#333333ff' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default AddPayroll;
