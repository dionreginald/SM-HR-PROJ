// src/components/ViewEmployees.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import MacOsTopNavbar from './MacOsTopNavbar';

// Material-UI Imports
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Modal,
  Fade,
  Backdrop,
  IconButton,
  Snackbar,
  Alert,
  Grid,
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles'; // Import useTheme here

// Icon Imports
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArticleIcon from '@mui/icons-material/Article';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import SendIcon from '@mui/icons-material/Send';


// Local Component Import
// import DashboardNavbar from './DashboardNavbar'; // This was imported but not used, uncomment if needed


// --- Styled Components ---

const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  // Adapt background color based on theme palette
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary, // Ensure default text color adapts
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: '90px',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const ContentHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3, 4),
  borderRadius: '16px',
  // Dynamic shadow based on theme mode
  boxShadow: theme.palette.mode === 'dark'
    ? `0 8px 20px ${alpha(theme.palette.common.black, 0.4)}`
    : `0 8px 20px rgba(0, 0, 0, 0.08)`,
  // Adapt background color
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

const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    width: '100%',
    '& > *': {
      width: '100%',
    },
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    // Adapt background color for input fields
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.grey[700], 0.3)
      : alpha(theme.palette.grey[100], 0.7),
    '& fieldset': {
      // Adapt border color
      borderColor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.primary.light, 0.5)
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
      color: theme.palette.text.primary, // Ensure input text is readable
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary, // Adapt label color
    '&.Mui-focused': {
      color: theme.palette.primary.main, // Focused label uses primary color
    }
  },
}));


const ExportButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  borderRadius: '8px',
  fontWeight: 600,
  textTransform: 'none',
  '&:not(:last-of-type)': {
    marginRight: theme.spacing(1.5),
  },
  // Dynamic button colors for export buttons
  // Note: For specific colors like '#4CAF50', you might keep them static
  // or define them in your theme's palette as custom colors if they are used often.
  // For now, I'll keep them as is for these specific buttons, but the text color will adapt.
  color: theme.palette.primary.contrastText, // Ensure text is readable
}));


const TableCard = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  // Dynamic shadow
  boxShadow: theme.palette.mode === 'dark'
    ? `0 8px 20px ${alpha(theme.palette.common.black, 0.4)}`
    : `0 8px 20px rgba(0, 0, 0, 0.08)`,
  // Adapt background color
  backgroundColor: theme.palette.background.paper,
  overflow: 'hidden',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: 'calc(100vh - 350px)',
  overflowY: 'auto',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  // Adapt background color and text color for table header
  backgroundColor: alpha(theme.palette.primary.main, 0.15), // Slightly more opaque for dark mode legibility
  '& .MuiTableCell-root': {
    fontWeight: 700,
    color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
    padding: '16px',
    borderBottom: `1px solid ${theme.palette.divider}`, // Subtle border for header cells
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    // Adapt alternate row background color
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.grey[900], 0.4)
      : alpha(theme.palette.grey[100], 0.5),
  },
  '&:hover': {
    // Adapt hover background color
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.primary.main, 0.2)
      : alpha(theme.palette.primary.light, 0.1),
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: '12px 16px',
  // Adapt text color for table cells
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`, // Subtle border for body cells
}));

const ActionButton = styled(Button)(({ theme, bgcolor }) => ({
  minWidth: 'auto',
  padding: theme.spacing(0.8, 1.5),
  borderRadius: '8px',
  fontWeight: 600,
  textTransform: 'none',
  color: 'white',
  // Use the provided bgcolor for background, but adjust hover
  backgroundColor: bgcolor,
  '&:hover': {
    backgroundColor: alpha(bgcolor, 0.8),
  },
  '& + &': {
    marginLeft: theme.spacing(1),
  },
}));

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  // Adapt background color and shadow
  backgroundColor: theme.palette.background.paper,
  borderRadius: '16px',
  boxShadow: theme.palette.mode === 'dark'
    ? `0 4px 10px ${alpha(theme.palette.common.black, 0.3)}`
    : `0 4px 10px rgba(0, 0, 0, 0.05)`,
  gap: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
  },
}));

const PaginationButton = styled(Button)(({ theme }) => ({
  minWidth: 'auto',
  padding: theme.spacing(1, 2),
  borderRadius: '8px',
  fontWeight: 600,
  textTransform: 'none',
  // Adapt background and text color
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.grey[700], 0.5)
    : theme.palette.grey[200],
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.grey[600], 0.6)
      : theme.palette.grey[300],
  },
  '&.Mui-disabled': {
    opacity: 0.6,
    color: theme.palette.text.disabled, // Ensure disabled text color adapts
  },
}));

const ModalContent = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // Adapt background and shadow
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.palette.mode === 'dark'
    ? `0 12px 28px ${alpha(theme.palette.common.black, 0.6)}`
    : `0 12px 28px rgba(0, 0, 0, 0.2)`,
  borderRadius: '20px',
  padding: theme.spacing(4),
  maxWidth: 700,
  width: '90%',
  maxHeight: '90vh',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  outline: 'none',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    maxWidth: '95%',
  },
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  // Adapt border color
  borderBottom: `1px solid ${theme.palette.divider}`,
  paddingBottom: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '& .MuiTypography-root': {
    color: theme.palette.text.primary, // Ensure modal title adapts
  },
  '& .MuiIconButton-root': {
    color: theme.palette.text.secondary, // Close icon color
  }
}));

const DetailsText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  color: theme.palette.text.secondary,
  '& b': {
    color: theme.palette.text.primary, // Bold text should be primary color
  },
  '& a': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    fontWeight: 500,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

const SendLinkButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.2, 2.5),
  borderRadius: '10px',
  fontWeight: 600,
  backgroundColor: '#007aff', // Keeping this specific blue, but it can be theme.palette.primary.main
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#005bb5',
  },
  '&.Mui-disabled': {
    backgroundColor: alpha('#007aff', 0.5),
    color: '#ffffff',
  },
  transition: 'all 0.3s ease-in-out',
}));


export default function ViewEmployees() {
  const theme = useTheme(); // Access the current theme

  const [employees, setEmployees] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 8;

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost/smarthr_proj/employee_list.php')
      .then(response => {
        setLoading(false);
        if (response.data.success) {
          setEmployees(response.data.employees);
        } else {
          setSnackbarMessage('Failed to fetch employees: ' + response.data.message);
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      })
      .catch(error => {
        setLoading(false);
        setSnackbarMessage('Error fetching employees: ' + (error.response?.data?.message || error.message));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setLoading(true);
      axios.get(`http://localhost/smarthr_proj/employee_delete.php?id=${id}`)
        .then(response => {
          setLoading(false);
          if (response.data.success) {
            setSnackbarMessage('Employee deleted successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setEmployees(prev => prev.filter(emp => emp.id !== id));
          } else {
            setSnackbarMessage('Failed to delete employee: ' + response.data.message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
          }
        })
        .catch(error => {
          setLoading(false);
          setSnackbarMessage('Error deleting employee: ' + (error.response?.data?.message || error.message));
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        });
    }
  };

  const handleView = (id) => {
    setLoading(true);
    axios.get(`http://localhost/smarthr_proj/employee_get.php?id=${id}`)
      .then(response => {
        setLoading(false);
        if (response.data.success) {
          setSelectedEmployee(response.data.employee);
        } else {
          setSnackbarMessage('Failed to fetch employee details: ' + response.data.message);
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      })
      .catch(error => {
        setLoading(false);
        setSnackbarMessage('Error fetching employee details: ' + (error.response?.data?.message || error.message));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const closeModal = () => setSelectedEmployee(null);

  const filteredEmployees = employees.filter(emp =>
    emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.phone_number && emp.phone_number.includes(searchTerm))
  );

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  // Export to CSV function
  const exportToCSV = (data) => {
    const csvRows = [];

    const headers = [
      'ID', 'Full Name', 'Email', 'DOB', 'Phone', 'Address', 'Age', 'Hourly Rate'
    ];
    csvRows.push(headers.join(','));

    data.forEach(emp => {
      const row = [
        emp.id ?? '',
        `"${(emp.full_name || '').replace(/"/g, '""')}"`,
        emp.email ?? '',
        emp.dob ?? '',
        emp.phone_number ?? '',
        `"${(emp.address || '').replace(/"/g, '""')}"`,
        emp.age ?? '',
        emp.hourly_rate ?? ''
      ];
      csvRows.push(row.join(','));
    });

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    const printedDate = new Date().toLocaleString();

    // Company info
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Smart HR (Pvt) Ltd.', 14, 20);

    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text('123 Corporate Ave, Colombo, Sri Lanka', 14, 28);
    doc.text('Phone: +94 11 234 5678', 14, 35);
    doc.text('Email: info@smarthr.lk', 14, 42);

    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Printed: ${printedDate}`, 196, 20, { align: 'right' });

    doc.setTextColor(0);
    doc.setLineWidth(0.5);
    doc.line(14, 48, 196, 48);

    // Title for the table
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Employee List', 14, 58);

    const columns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'Full Name', dataKey: 'full_name' },
      { header: 'Email', dataKey: 'email' },
      { header: 'DOB', dataKey: 'dob' },
      { header: 'Phone', dataKey: 'phone_number' },
      { header: 'Address', dataKey: 'address' },
      { header: 'Age', dataKey: 'age' },
      { header: 'Hourly Rate', dataKey: 'hourly_rate' },
    ];

    const rows = filteredEmployees.map(emp => ({
      id: emp.id ?? '',
      full_name: emp.full_name ?? '',
      email: emp.email ?? '',
      dob: emp.dob ?? '',
      phone_number: emp.phone_number ?? '',
      address: emp.address ?? '',
      age: emp.age ?? '',
      hourly_rate: emp.hourly_rate ?? '',
    }));

    autoTable(doc, {
      startY: 65,
      head: [columns.map(col => col.header)],
      body: rows.map(row => columns.map(col => row[col.dataKey])),
      styles: { fontSize: 9, cellPadding: 2, overflow: 'linebreak' },
      headStyles: {
        fillColor: [0, 122, 255],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: { fillColor: [247, 247, 247] },
      margin: { left: 14, right: 14 },
      columnStyles: {
        address: { cellWidth: 35 },
        full_name: { cellWidth: 30 },
      },
      didParseCell: function (data) {
        if (data.column.dataKey === 'hourly_rate' && typeof data.cell.text[0] === 'string') {
          data.cell.text[0] = `Rs. ${parseFloat(data.cell.text[0]).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
        }
      },
    });

    doc.save('employees.pdf');
  };

  const handleSendAccessLink = async (employeeId) => {
    setLoading(true);
    setSnackbarMessage('Sending access link...');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);

    try {
      const res = await axios.post('http://localhost/smarthr_proj/send_credentials.php', { id: employeeId }, {
        headers: { 'Content-Type': 'application/json' },
      });
      const data = res.data;
      if (data.success) {
        setSnackbarMessage('Access link sent successfully! ✅');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('Error sending access link: ' + (data.message || 'Unknown error') + ' ❌');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      setSnackbarMessage('Network error sending access link: ' + (error.response?.data?.message || error.message) + ' ❌');
      setSnackbarSeverity('error');
    } finally {
      setLoading(false);
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
        <ContentHeader>
          <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.text.primary }}> {/* Adapt text color */}
            All Employees
          </Typography>
          <Box>
            <ExportButton
              variant="contained"
              sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#45a049' } }}
              startIcon={<ArticleIcon />}
              onClick={() => exportToCSV(filteredEmployees)}
            >
              CSV
            </ExportButton>
            <ExportButton
              variant="contained"
              sx={{ backgroundColor: '#DC3545', '&:hover': { backgroundColor: '#c8232c' } }}
              startIcon={<PictureAsPdfIcon />}
              onClick={exportToPDF}
            >
              PDF
            </ExportButton>
          </Box>
        </ContentHeader>

        <SearchContainer>
          <StyledTextField
            fullWidth
            label="Search employees by name, email, or phone..."
            variant="outlined"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: theme.palette.action.active, mr: 1 }} />
              ),
            }}
          />
        </SearchContainer>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress color="primary" size={50} />
            <Typography variant="h6" sx={{ ml: 2, color: theme.palette.text.secondary }}>Loading Employees...</Typography> {/* Adapt text color */}
          </Box>
        )}

        {!loading && (
          <>
            <TableCard>
              <StyledTableContainer>
                <Table stickyHeader aria-label="employee table">
                  <StyledTableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Full Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>DOB</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </StyledTableHead>
                  <TableBody>
                    {currentEmployees.length === 0 ? (
                      <TableRow>
                        <StyledTableCell colSpan={6} align="center">
                          <Typography variant="h6" color="text.secondary" sx={{ py: 3 }}>
                            No employees found matching your search.
                          </Typography>
                        </StyledTableCell>
                      </TableRow>
                    ) : (
                      currentEmployees.map(emp => (
                        <StyledTableRow key={emp.id}>
                          <StyledTableCell>{emp.id}</StyledTableCell>
                          <StyledTableCell>{emp.full_name}</StyledTableCell>
                          <StyledTableCell>{emp.email}</StyledTableCell>
                          <StyledTableCell>{emp.dob}</StyledTableCell>
                          <StyledTableCell>{emp.phone_number}</StyledTableCell>
                          <StyledTableCell align="center">
                            <ActionButton
                              bgcolor="#007aff"
                              startIcon={<VisibilityIcon />}
                              onClick={() => handleView(emp.id)}
                            >
                              View
                            </ActionButton>
                            <ActionButton
                              bgcolor="#ffc107"
                              startIcon={<EditIcon />}
                              onClick={() => window.location.href = `/dashboard/edit-employee/${emp.id}`}
                            >
                              Edit
                            </ActionButton>
                            <ActionButton
                              bgcolor="#dc3545"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDelete(emp.id)}
                            >
                              Delete
                            </ActionButton>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            </TableCard>

            <PaginationContainer>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                Page {currentPage} of {totalPages}
              </Typography>
              <PaginationButton
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </PaginationButton>
              <PaginationButton
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </PaginationButton>
            </PaginationContainer>
          </>
        )}

        {/* 👁️ Employee Details Modal */}
        <Modal
          aria-labelledby="employee-details-modal-title"
          aria-describedby="employee-details-modal-description"
          open={!!selectedEmployee}
          onClose={closeModal}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{ backdrop: { timeout: 500 } }}
        >
          <Fade in={!!selectedEmployee}>
            <ModalContent>
              <ModalHeader>
                <Typography variant="h5" id="employee-details-modal-title" sx={{ fontWeight: 700, color: theme.palette.text.primary }}> {/* Adapt title color */}
                  Employee Details
                </Typography>
                <IconButton onClick={closeModal} aria-label="close">
                  <CloseIcon sx={{ color: theme.palette.text.secondary }}/> {/* Adapt icon color */}
                </IconButton>
              </ModalHeader>
              {selectedEmployee && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      {selectedEmployee.profile_pic ? (
                        <img
                          src={selectedEmployee.profile_pic}
                          alt="Profile"
                          style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: `3px solid ${theme.palette.primary.main}`, // Adapt border color
                            marginBottom: '10px',
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            // Adapt placeholder background and text color
                            backgroundColor: alpha(theme.palette.primary.main, 0.2),
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: theme.palette.primary.main,
                            fontSize: '4rem',
                            fontWeight: 'bold',
                            mx: 'auto',
                            mb: '10px',
                          }}
                        >
                          {selectedEmployee.full_name ? selectedEmployee.full_name.charAt(0).toUpperCase() : '?'}
                        </Box>
                      )}
                      <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}> {/* Adapt text color */}
                        {selectedEmployee.full_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedEmployee.email}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <DetailsText><b>Age:</b> {selectedEmployee.age}</DetailsText>
                    <DetailsText><b>Date of Birth:</b> {selectedEmployee.dob}</DetailsText>
                    <DetailsText><b>Address:</b> {selectedEmployee.address}</DetailsText>
                    <DetailsText><b>Phone Number:</b> {selectedEmployee.phone_number}</DetailsText>
                    <DetailsText><b>Hourly Rate:</b> Rs. {parseFloat(selectedEmployee.hourly_rate).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</DetailsText>
                    <DetailsText>
                      <b>CV:</b> {selectedEmployee.cv ? <a href={selectedEmployee.cv} target="_blank" rel="noopener noreferrer">View CV</a> : 'N/A'}
                    </DetailsText>
                    <DetailsText>
                      <b>NIC Copy:</b> {selectedEmployee.nic_copy ? <a href={selectedEmployee.nic_copy} target="_blank" rel="noopener noreferrer">View NIC</a> : 'N/A'}
                    </DetailsText>
                    <DetailsText>
                      <b>Police Check:</b> {selectedEmployee.police_check_report ? <a href={selectedEmployee.police_check_report} target="_blank" rel="noopener noreferrer">View Report</a> : 'N/A'}
                    </DetailsText>
                    <SendLinkButton
                      onClick={() => handleSendAccessLink(selectedEmployee.id)}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    >
                      {loading ? 'Sending...' : 'Send Access Link'}
                    </SendLinkButton>
                  </Grid>
                </Grid>
              )}
            </ModalContent>
          </Fade>
        </Modal>

        {/* Snackbar for messages */}
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

      </MainContent>
    </PageContainer>
  );
}