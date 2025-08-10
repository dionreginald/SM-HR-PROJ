import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import dayjs from 'dayjs';

// Material-UI Imports
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery,
  TextField,
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';

// Material-UI Icons
import DownloadIcon from '@mui/icons-material/Download';

// Date Picker Imports
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// --- Styled Components ---

const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  padding: theme.spacing(3),
  maxWidth: 900,
  margin: '20px auto',
  borderRadius: theme.shape.borderRadius,
  boxShadow:
    theme.palette.mode === 'dark'
      ? `0 4px 20px ${alpha(theme.palette.common.black, 0.4)}`
      : `0 4px 20px rgba(0, 0, 0, 0.05)`,

  // Responsive padding for mobile
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
  textAlign: 'center',
  fontSize: '1.8rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
    marginBottom: theme.spacing(2),
  },
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  fontSize: '0.85rem',
  padding: '12px 16px',
  whiteSpace: 'nowrap',
  [theme.breakpoints.down('sm')]: {
    padding: '8px 10px',
    fontSize: '0.75rem',
  },
}));

const StyledTableBodyCell = styled(TableCell)(({ theme }) => ({
  fontSize: '0.8rem',
  padding: '10px 16px',
  borderBottom: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  whiteSpace: 'nowrap',
  [theme.breakpoints.down('sm')]: {
    padding: '6px 10px',
    fontSize: '0.7rem',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'background-color 0.2s ease-in-out',
  '&:nth-of-type(odd)': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.grey[900], 0.5)
        : alpha(theme.palette.grey[50], 0.5),
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, theme.palette.mode === 'dark' ? 0.05 : 0.1),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  fontWeight: 600,
  textTransform: 'none',
  padding: theme.spacing(1, 2.5),
  transition: 'all 0.3s ease-in-out',
  whiteSpace: 'nowrap',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow:
      theme.palette.mode === 'dark'
        ? `0 4px 10px ${alpha(theme.palette.primary.main, 0.5)}`
        : `0 4px 10px rgba(0, 122, 255, 0.2)`,
  },

  // Full width on mobile for easier tap
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: theme.spacing(1),
    fontSize: '0.85rem',
  },
}));

export default function EmployeePayslips() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);

  const employee = JSON.parse(localStorage.getItem('employee'));
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!employee?.id) {
      setSnackbarMessage('Employee not logged in.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    const fetchPayrolls = async () => {
      try {
        const res = await axios.get(`http://localhost/smarthr_proj/get_employee_payroll.php?employee_id=${employee.id}`);
        if (res.data.status === 'success') {
          setPayrolls(res.data.data);
          setSnackbarMessage('Payroll records loaded successfully.');
          setSnackbarSeverity('success');
        } else {
          setSnackbarMessage('No payroll records found.');
          setSnackbarSeverity('info');
        }
      } catch (error) {
        console.error('Error fetching payrolls:', error);
        setSnackbarMessage('Error fetching payrolls. Please try again later.');
        setSnackbarSeverity('error');
      } finally {
        setLoading(false);
        setSnackbarOpen(true);
      }
    };

    fetchPayrolls();
  }, [employee]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
    }).format(parseFloat(value) || 0);

  const calculateEPF = (total) => parseFloat((total * 0.08).toFixed(2));
  const calculateETF = (total) => parseFloat((total * 0.03).toFixed(2));
  const calculateNetSalary = (total) =>
    parseFloat((total - calculateEPF(total) - calculateETF(total)).toFixed(2));

  const generatePayslipPDF = (p) => {
    const doc = new jsPDF();
    const marginLeft = 14;
    let currentY = 20;

    // Company Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Smart HR (Pvt) Ltd.', marginLeft, currentY);
    currentY += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('123 Corporate Ave, Colombo, Sri Lanka', marginLeft, currentY);
    currentY += 6;
    doc.text('Phone: +94 11 234 5678', marginLeft, currentY);
    currentY += 6;
    doc.text('Email: info@smarthr.lk', marginLeft, currentY);

    currentY += 15;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Employee Payslip', marginLeft, currentY);
    currentY += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Employee Name: ${p.employee_name || employee.name}`, marginLeft, currentY);
    currentY += 6;
    doc.text(`Employee ID: ${p.employee_id}`, marginLeft, currentY);
    currentY += 6;
    doc.text(`Pay Period: ${p.pay_period}`, marginLeft, currentY);
    currentY += 6;
    doc.text(`Paid Date: ${p.paid_date}`, marginLeft, currentY);

    const totalSalary = parseFloat(p.total_salary || 0);
    const epf = calculateEPF(totalSalary);
    const etf = calculateETF(totalSalary);
    const net = calculateNetSalary(totalSalary);

    currentY += 15;

    const tableRows = [
      ['Basic Hours', p.basic_hours || 0],
      ['Hourly Rate', formatCurrency(p.hourly_rate)],
      ['Overtime Hours', p.overtime_hours || 0],
      ['Overtime Rate', formatCurrency(p.overtime_rate)],
      ['Gross Salary', formatCurrency(totalSalary)],
      ['Deductions', formatCurrency(p.deductions)],
      ['EPF (8%)', formatCurrency(epf)],
      ['ETF (3%)', formatCurrency(etf)],
      ['Net Salary', formatCurrency(net)],
    ];

    autoTable(doc, {
      startY: currentY,
      head: [['Description', 'Amount']],
      body: tableRows,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 4, textColor: [30, 30, 30] },
      headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'right' },
      },
      didDrawPage: function (data) {
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Generated on: ${new Date().toLocaleString('en-LK')}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      },
    });

    doc.setFontSize(10);
    doc.text('Thank you for your hard work!', marginLeft, doc.lastAutoTable.finalY + 10);

    doc.save(`Payslip_${p.employee_id}_${p.pay_period}.pdf`);
    setSnackbarMessage('Payslip PDF generated successfully.');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Filter payrolls based on the selected date range
  const filteredPayrolls = payrolls.filter(p => {
    const paidDate = dayjs(p.paid_date);
    const isAfterStart = !startDateFilter || paidDate.isAfter(dayjs(startDateFilter).subtract(1, 'day'));
    const isBeforeEnd = !endDateFilter || paidDate.isBefore(dayjs(endDateFilter).add(1, 'day'));
    return isAfterStart && isBeforeEnd;
  });

  return (
    <PageContainer>
      <SectionTitle variant="h4">Your Payroll Records</SectionTitle>

      {/* Date Picker Filter */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
          <DatePicker
            label="Start Date"
            value={startDateFilter}
            onChange={(newValue) => setStartDateFilter(newValue)}
            slotProps={{ textField: { fullWidth: true } }}
          />
          <DatePicker
            label="End Date"
            value={endDateFilter}
            onChange={(newValue) => setEndDateFilter(newValue)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Box>
      </LocalizationProvider>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress sx={{ color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ ml: 2, color: theme.palette.text.secondary }}>
            Loading payrolls...
          </Typography>
        </Box>
      ) : (
        <>
          {filteredPayrolls.length === 0 && (
            <Typography variant="body1" sx={{ textAlign: 'center', mt: 2, color: theme.palette.text.secondary }}>
              No payroll records found for your employee ID or the selected date range.
            </Typography>
          )}

          {filteredPayrolls.length > 0 && (
            <>
              {isMobile ? (
                // Mobile: Card/List View
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {filteredPayrolls.map((p) => (
                    <Paper
                      key={p.id}
                      elevation={2}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper,
                        boxShadow:
                          theme.palette.mode === 'dark'
                            ? `0 2px 10px ${alpha(theme.palette.common.black, 0.7)}`
                            : '0 2px 10px rgba(0,0,0,0.1)',
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        Pay Period: {p.pay_period}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Salary: {formatCurrency(p.total_salary)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Paid Date: {p.paid_date}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<DownloadIcon />}
                        onClick={() => generatePayslipPDF(p)}
                      >
                        Download Payslip
                      </Button>
                    </Paper>
                  ))}
                </Box>
              ) : (
                // Desktop: Full Table
                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: '12px',
                    boxShadow:
                      theme.palette.mode === 'dark'
                        ? `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}`
                        : '0 4px 12px rgba(0, 0, 0, 0.05)',
                    backgroundColor: theme.palette.background.paper,
                    overflowX: 'auto',
                  }}
                >
                  <Table sx={{ minWidth: 650 }} aria-label="employee payrolls table" size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableHeadCell>Pay Period</StyledTableHeadCell>
                        <StyledTableHeadCell>Total Salary</StyledTableHeadCell>
                        <StyledTableHeadCell>Paid Date</StyledTableHeadCell>
                        <StyledTableHeadCell>Action</StyledTableHeadCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredPayrolls.map((p) => (
                        <StyledTableRow key={p.id}>
                          <StyledTableBodyCell>{p.pay_period}</StyledTableBodyCell>
                          <StyledTableBodyCell>{formatCurrency(p.total_salary)}</StyledTableBodyCell>
                          <StyledTableBodyCell>{p.paid_date}</StyledTableBodyCell>
                          <StyledTableBodyCell>
                            <StyledButton
                              variant="contained"
                              color="primary"
                              onClick={() => generatePayslipPDF(p)}
                              startIcon={<DownloadIcon />}
                              size="small"
                            >
                              Download Payslip
                            </StyledButton>
                          </StyledTableBodyCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
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