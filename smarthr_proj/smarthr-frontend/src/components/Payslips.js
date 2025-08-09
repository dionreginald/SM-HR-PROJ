import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// import DashboardNavbar from './DashboardNavbar'; // This was imported but not used, consider removing if not needed.

// Material-UI Imports
import {
  Box,
  Typography,
  Paper,
  // Grid, // Grid is imported but not used, removed for cleaner code
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
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles'; // <-- Import useTheme here

// Material-UI Icons
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email'; // For bulk send
import SearchIcon from '@mui/icons-material/Search'; // For search text field
import MacOsTopNavbar from './MacOsTopNavbar';

// --- Styled Components ---

const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  // --- FIXED: Use theme.palette for background color ---
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary, // Ensure default text color respects theme
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: '90px', // Space for MacOsTopNavbar
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const ContentPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  // --- FIXED: Use theme.palette for boxShadow and backgroundColor ---
  boxShadow: theme.palette.mode === 'dark'
    ? `0 8px 20px ${alpha(theme.palette.common.black, 0.4)}`
    : `0 8px 20px rgba(0, 0, 0, 0.08)`,
  backgroundColor: theme.palette.background.paper,
  width: '100%',
  maxWidth: '1400px', // Wider content area
  animation: 'fadeInUp 0.8s ease-out forwards',
  '@keyframes fadeInUp': {
    "0%": { opacity: 0, transform: "translateY(20px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  // --- FIXED: Use theme.palette for text color ---
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
  textAlign: 'center',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    // --- FIXED: Use alpha with theme.palette for background and border ---
    backgroundColor: alpha(theme.palette.background.paper, 0.7), // Use paper background with opacity
    '& fieldset': { borderColor: theme.palette.divider }, // Use theme divider for border
    '&:hover fieldset': { borderColor: theme.palette.primary.main },
    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main, borderWidth: '2px' },
  },
  '& .MuiInputBase-input': { // Target the input element itself for text color
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
    // --- FIXED: Use theme.palette for boxShadow ---
    boxShadow: theme.palette.mode === 'dark'
      ? `0 4px 10px ${alpha(theme.palette.primary.main, 0.4)}`
      : `0 4px 10px rgba(0, 122, 255, 0.2)`,
  },
}));

// Table specific styles
const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText, // Use contrastText for text on primary background
  fontWeight: 600,
  fontSize: '0.85rem',
  padding: '12px 16px',
  whiteSpace: 'nowrap',
}));

const StyledTableBodyCell = styled(TableCell)(({ theme }) => ({
  fontSize: '0.8rem',
  padding: '10px 16px',
  // --- FIXED: Use theme.palette for border color ---
  borderBottom: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary, // Ensure cell text color adapts
  whiteSpace: 'nowrap',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'background-color 0.2s ease-in-out',
  '&:nth-of-type(odd)': {
    // --- FIXED: Use alpha with theme.palette for striped rows ---
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.grey[900], 0.5) // Darker stripe for dark mode
      : alpha(theme.palette.grey[50], 0.5), // Lighter stripe for light mode
  },
  '&:hover': {
    // --- FIXED: Use alpha with theme.palette for hover effect ---
    backgroundColor: alpha(theme.palette.primary.light, theme.palette.mode === 'dark' ? 0.05 : 0.1),
  },
}));

// --- jsPDF RoundRect Polyfill (FIXED - no changes needed here, it's correct) ---
if (!jsPDF.API.roundRect) {
  jsPDF.API.roundRect = function(x, y, w, h, rx, ry, style) {
    rx = Math.max(0, Math.min(rx || 0, Math.abs(w) / 2));
    ry = Math.max(0, Math.min(ry || 0, Math.abs(h) / 2));

    const lx = x + w;
    const ly = y + h;
    const k = 0.5522847498;

    this.moveTo(x + rx, y);
    this.lineTo(lx - rx, y);
    if (rx !== 0 || ry !== 0) {
      this.curveTo(lx - rx + rx * k, y, lx, y + ry - ry * k, lx, y + ry);
    }
    this.lineTo(lx, ly - ry);
    if (rx !== 0 || ry !== 0) {
      this.curveTo(lx, ly - ry + ry * k, lx - rx + rx * k, ly, lx - rx, ly);
    }
    this.lineTo(x + rx, ly);
    if (rx !== 0 || ry !== 0) {
      this.curveTo(x + rx - rx * k, ly, x, ly - ry + ry * k, x, ly - ry);
    }
    this.lineTo(x, y + ry);
    if (rx !== 0 || ry !== 0) {
      this.curveTo(x, y + ry - ry * k, x + rx - rx * k, y, x + rx, y);
    }
    
    if (style === 'S') {
      this.stroke();
    } else if (style === 'F') {
      this.fill();
    } else if (style === 'DF' || style === 'FD') {
      this.fillAndStroke();
    }
    return this;
  };
}

export default function Payslips() {
  const [payrolls, setPayrolls] = useState([]);
  const [filter, setFilter] = useState({ payPeriod: '', searchText: '' });
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const theme = useTheme(); // <-- Access the theme object here

  useEffect(() => {
    fetchPayslips();
  }, []);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const fetchPayslips = async () => {
    setLoading(true);
    try {
      const adminId = parseInt(localStorage.getItem('admin_id')) || 1;
      const res = await axios.post('http://localhost/smarthr_proj/get_payslips.php', {
        admin_id: adminId,
      });

      if (res.data?.success && Array.isArray(res.data.payslips)) {
        setPayrolls(res.data.payslips);
        setSnackbarMessage('Payslips loaded successfully.');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('Failed to fetch payslips: ' + (res.data.message || 'Unknown error'));
        setSnackbarSeverity('error');
        setPayrolls([]);
      }
    } catch (error) {
      console.error('Error fetching payslips:', error);
      setSnackbarMessage('Error fetching payslips: ' + (error.response?.data?.message || error.message));
      setSnackbarSeverity('error');
      setPayrolls([]);
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const filteredPayrolls = payrolls.filter(p => {
    const matchesPeriod = filter.payPeriod ? p.pay_period === filter.payPeriod : true;
    const search = filter.searchText.toLowerCase();

    const name = p.employee_name?.toLowerCase() || '';
    const idStr = String(p.employee_id || '');
    const salaryStr = String(parseFloat(p.total_salary || 0).toFixed(2));

    const matchesSearch =
      name.includes(search) || idStr.includes(search) || salaryStr.includes(search);

    return matchesPeriod && matchesSearch;
  });

  const formatCurrency = amount => {
    const val = parseFloat(amount);
    return isNaN(val) ? 'Rs. ' + (0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'Rs. ' + val.toLocaleString('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const calculateEPF = total => parseFloat((total * 0.08).toFixed(2));
  const calculateETF = total => parseFloat((total * 0.03).toFixed(2));
  const calculateNetSalary = total => parseFloat((total - calculateEPF(total) - calculateETF(total)).toFixed(2));

  const generatePayslipPDF = p => {
    try {
      const doc = new jsPDF({
        unit: 'pt',
        format: 'a4',
        orientation: 'portrait'
      });

      const marginLeft = 40;
      let currentY = 40;
      const pageWidth = doc.internal.pageSize.getWidth();

      // Company Info
      const companyName = 'Smart HR (Pvt) Ltd.';
      const companyAddress = '123 Corporate Ave, Colombo, Sri Lanka';
      const companyContact = 'Phone: +94 11 234 5678 | Email: info@smarthr.lk';
      const currentDateTime = new Date().toLocaleString('en-LK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'shortOffset'
      });

      // --- Header Section ---
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(26);
      doc.setTextColor(0, 122, 255);
      doc.text(companyName, marginLeft, currentY);

      currentY += 2;
      doc.setDrawColor(0, 122, 255);
      doc.setLineWidth(1.5);
      doc.line(marginLeft, currentY, marginLeft + 250, currentY);

      currentY += 20;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(companyAddress, marginLeft, currentY);
      doc.text(companyContact, marginLeft, currentY + 12);

      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generated: ${currentDateTime}`, pageWidth - marginLeft, currentY + 6, { align: 'right' });
      currentY += 30;

      // --- Payslip Title ---
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(30, 30, 30);
      doc.text('PAYSLIP', pageWidth / 2, currentY, { align: 'center' });
      currentY += 25;

      // --- Employee & Pay Period Details ---
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.roundRect(marginLeft, currentY, pageWidth - (2 * marginLeft), 90, 8, 8, 'S');

      const detailsX = marginLeft + 20;
      const detailsCol2X = pageWidth / 2 + 10;
      const detailsLineHeight = 18;

      currentY += 15;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(50, 50, 50);
      doc.text('Employee Name:', detailsX, currentY);
      doc.text('Employee ID:', detailsX, currentY + detailsLineHeight);
      doc.text('Pay Period:', detailsCol2X, currentY);
      doc.text('Paid Date:', detailsCol2X, currentY + detailsLineHeight);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(p.employee_name || 'N/A', detailsX + 80, currentY);
      doc.text(String(p.employee_id || 'N/A'), detailsX + 80, currentY + detailsLineHeight);
      doc.text(p.pay_period || 'N/A', detailsCol2X + 60, currentY);
      doc.text(p.paid_date || 'N/A', detailsCol2X + 60, currentY + detailsLineHeight);

      currentY += 90 + 20;

      // --- Earnings & Deductions Table ---
      const totalSalary = parseFloat(p.total_salary || 0);
      const basicPay = parseFloat(p.basic_hours || 0) * parseFloat(p.hourly_rate || 0);
      const overtimePay = parseFloat(p.overtime_hours || 0) * parseFloat(p.overtime_rate || 0);
      const deductionsDisplay = parseFloat(p.deductions || 0);

      const tableData = [
        [{ content: 'Earnings', colSpan: 2, styles: { fontStyle: 'bold', fillColor: [240, 240, 240], textColor: [50,50,50] } }],
        ['Basic Pay', formatCurrency(basicPay)],
        ['Overtime Pay', formatCurrency(overtimePay)],
        [{ content: 'Gross Salary', styles: { fontStyle: 'bold' } }, { content: formatCurrency(totalSalary), styles: { fontStyle: 'bold' } }],

        [{ content: 'Deductions', colSpan: 2, styles: { fontStyle: 'bold', fillColor: [240, 240, 240], textColor: [50,50,50] } }],
        ['Other Deductions', formatCurrency(deductionsDisplay)],
        ['EPF (8%)', formatCurrency(calculateEPF(totalSalary))],
        ['ETF (3%)', formatCurrency(calculateETF(totalSalary))],
      ];

      autoTable(doc, {
        startY: currentY,
        head: [],
        body: tableData,
        theme: 'plain',
        styles: {
          fontSize: 9,
          cellPadding: 8,
          font: 'helvetica',
          textColor: [80, 80, 80],
          lineColor: [220, 220, 220],
          lineWidth: 0.2,
        },
        columnStyles: {
          0: { halign: 'left', fontStyle: 'bold' },
          1: { halign: 'right' },
        },
        didParseCell: function(data) {
          const sectionHeaderRowIndices = [0, 3, 4];
          if (sectionHeaderRowIndices.includes(data.row.index)) {
            data.cell.styles.lineWidth = { bottom: 0.8 };
            data.cell.styles.lineColor = { bottom: [180, 180, 180] };
          }
          if (data.row.index === 4) {
              data.cell.styles.lineWidth = { top: 0.8 };
              data.cell.styles.lineColor = { top: [180, 180, 180] };
          }
        },
        margin: { left: marginLeft, right: marginLeft },
      });

      currentY = doc.lastAutoTable.finalY + 20;

      // --- Net Salary Highlight ---
      const net = calculateNetSalary(totalSalary);
      doc.setFillColor(0, 122, 255);
      const rectWidth = 200;
      doc.roundRect(pageWidth - marginLeft - rectWidth, currentY, rectWidth, 50, 10, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text('Net Salary Payable', pageWidth - marginLeft - rectWidth + 10, currentY + 18);
      doc.setFontSize(22);
      doc.text(formatCurrency(net), pageWidth - marginLeft - 10, currentY + 38, { align: 'right' });
      currentY += 50 + 30;

      // --- Footer ---
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text('Thank you for your hard work and dedication!', pageWidth / 2, currentY, { align: 'center' });
      currentY += 15;
      doc.setFontSize(8);
      doc.text('This is a computer generated payslip, no signature is required.', pageWidth / 2, currentY, { align: 'center' });

      doc.save(`Payslip_${p.employee_id || 'UNKNOWN'}_${p.pay_period || 'UNKNOWN'}.pdf`);
      setSnackbarMessage(`Payslip for ${p.employee_name || 'employee'} downloaded successfully.`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

    } catch (error) {
      console.error('Error generating PDF:', error);
      setSnackbarMessage('Failed to generate payslip PDF: ' + error.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const sendPayslips = async () => {
    if (!selectedPeriod) {
      setSnackbarMessage('Please select a pay period to send payslips.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    setSnackbarMessage('Sending payslips for ' + selectedPeriod + '...');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);

    try {
      const res = await axios.post('http://localhost/smarthr_proj/send_payslips.php', {
        pay_period: selectedPeriod,
      });

      if (res.data.success) {
        setSnackbarMessage('Payslips sent successfully!');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('Failed to send payslips: ' + (res.data.message || 'Unknown error'));
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Error sending payslips: ' + (error.response?.data?.message || error.message));
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const sendSinglePayslip = async (p) => {
    setSnackbarMessage(`Sending payslip to ${p.employee_name}...`);
    setSnackbarSeverity('info');
    setSnackbarOpen(true);

    try {
      const res = await axios.post('http://localhost/smarthr_proj/send_single_payslip.php', {
        employee_id: p.employee_id,
        pay_period: p.pay_period,
      });

      if (res.data.success) {
        setSnackbarMessage(`Payslip sent to ${p.employee_name}`);
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage(`Failed to send payslip to ${p.employee_name}: ${res.data.message || 'Unknown error'}`);
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage(`Error sending payslip to ${p.employee_name}: ` + (error.response?.data?.message || error.message));
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  return (
    <PageContainer>
      <MacOsTopNavbar/>
      <MainContent>
        <ContentPaper>
          <SectionTitle variant="h4">Employee Payslips</SectionTitle>

          {/* Filter and Bulk Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                <FilterListIcon sx={{ mr: 0.5 }} /> Filters:
              </Typography>
              <StyledTextField
                type="month"
                id="payPeriodFilter"
                label="Filter by Pay Period"
                value={filter.payPeriod}
                onChange={(e) => setFilter({ ...filter, payPeriod: e.target.value })}
                InputLabelProps={{ shrink: true }}
                size="small"
                sx={{ width: 150 }}
              />
              <StyledTextField
                type="text"
                id="search"
                label="Search Employee/Amount"
                placeholder="Name, ID, or Amount"
                value={filter.searchText}
                onChange={(e) => setFilter({ ...filter, searchText: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                  ),
                }}
                size="small"
                sx={{ width: 200 }}
              />
              {(filter.payPeriod || filter.searchText) && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setFilter({ payPeriod: '', searchText: '' })}
                  startIcon={<ClearIcon />}
                  sx={{ borderRadius: '8px', textTransform: 'none' }}
                >
                  Clear Filters
                </Button>
              )}
            </Box>

            {/* Bulk Send Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ mr: 0.5 }} /> Bulk Actions:
              </Typography>
              <StyledTextField
                type="month"
                id="sendPeriod"
                label="Select Period for Bulk Send"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                sx={{ width: 180 }}
              />
              <ActionButton
                variant="contained"
                color="primary"
                onClick={sendPayslips}
                startIcon={<SendIcon />}
                disabled={!selectedPeriod || loading || filteredPayrolls.length === 0}
              >
                Send All Payslips for Period
              </ActionButton>
            </Box>
          </Box>

          {/* Payslips Table */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, flexDirection: 'column', alignItems: 'center' }}>
              <CircularProgress />
              <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>Loading Payslips...</Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{
              borderRadius: '12px',
              // --- FIXED: Use theme.palette for boxShadow and background ---
              boxShadow: theme.palette.mode === 'dark' ? `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}` : '0 4px 12px rgba(0, 0, 0, 0.05)',
              backgroundColor: theme.palette.background.paper,
            }}>
              <Table sx={{ minWidth: 700 }} aria-label="payslips table">
                <TableHead>
                  <TableRow>
                    <StyledTableHeadCell>ID</StyledTableHeadCell>
                    <StyledTableHeadCell>Employee Name</StyledTableHeadCell>
                    <StyledTableHeadCell>Employee ID</StyledTableHeadCell>
                    <StyledTableHeadCell>Pay Period</StyledTableHeadCell>
                    <StyledTableHeadCell>Total Salary</StyledTableHeadCell>
                    <StyledTableHeadCell>Paid Date</StyledTableHeadCell>
                    <StyledTableHeadCell sx={{ textAlign: 'center' }}>Actions</StyledTableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPayrolls.length === 0 ? (
                    <TableRow>
                      <StyledTableBodyCell colSpan={7} sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                        No payslip records found matching your filters.
                      </StyledTableBodyCell>
                    </TableRow>
                  ) : (
                    filteredPayrolls.map(p => (
                      <StyledTableRow key={p.id}>
                        <StyledTableBodyCell>{p.id}</StyledTableBodyCell>
                        <StyledTableBodyCell>{p.employee_name}</StyledTableBodyCell>
                        <StyledTableBodyCell>{p.employee_id}</StyledTableBodyCell>
                        <StyledTableBodyCell>{p.pay_period}</StyledTableBodyCell>
                        <StyledTableBodyCell>{formatCurrency(p.total_salary)}</StyledTableBodyCell>
                        <StyledTableBodyCell>{p.paid_date}</StyledTableBodyCell>
                        <StyledTableBodyCell sx={{ textAlign: 'center' }}>
                          <ActionButton
                            variant="outlined"
                            size="small"
                            onClick={() => generatePayslipPDF(p)}
                            startIcon={<VisibilityIcon />}
                            sx={{ mr: 1, px: 1.5 }}
                          >
                            View
                          </ActionButton>
                          <ActionButton
                            variant="contained"
                            size="small"
                            onClick={() => sendSinglePayslip(p)}
                            startIcon={<SendIcon />}
                            sx={{ px: 1.5 }}
                          >
                            Send
                          </ActionButton>
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
            // --- FIXED: Ensure Snackbar Alert background and text colors also adapt ---
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