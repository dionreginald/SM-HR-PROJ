import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import DashboardNavbar from './DashboardNavbar'; // This component is commented out, keeping it that way
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

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
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles'; // Import useTheme here

// Material-UI Icons
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import MacOsTopNavbar from './MacOsTopNavbar';

// --- Styled Components for a modern look (Updated for Dark Mode) ---

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
  marginTop: '90px', // Space for DashboardNavbar
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
  // Dynamic shadow based on theme mode
  boxShadow: theme.palette.mode === 'dark'
    ? `0 8px 20px ${alpha(theme.palette.common.black, 0.4)}`
    : `0 8px 20px rgba(0, 0, 0, 0.08)`,
  // Adapt background color
  backgroundColor: theme.palette.background.paper,
  width: '100%',
  maxWidth: '1400px', // Wider content area
  animation: 'fadeInUp 0.8s ease-out forwards',
  '@keyframes fadeInUp': {
    '0%': { opacity: 0, transform: 'translateY(20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  // Adapt text color
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
  textAlign: 'center',
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
    '&:hover fieldset': { borderColor: theme.palette.primary.main },
    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main, borderWidth: '2px' },
    "& input": {
      color: theme.palette.text.primary, // Ensure input text is readable
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary, // Adapt label color
    "&.Mui-focused": {
      color: theme.palette.primary.main, // Focused label uses primary color
    }
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
    // Dynamic shadow
    boxShadow: theme.palette.mode === 'dark'
      ? `0 4px 10px ${alpha(theme.palette.primary.main, 0.5)}`
      : `0 4px 10px rgba(0, 122, 255, 0.2)`,
  },
}));

// Table specific styles
const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText, // Ensure text is visible in both modes
  fontWeight: 600,
  fontSize: '0.85rem',
  padding: '12px 16px',
  whiteSpace: 'nowrap', // Prevent text wrapping in headers
}));

const StyledTableBodyCell = styled(TableCell)(({ theme }) => ({
  fontSize: '0.8rem',
  padding: '10px 16px',
  // Adapt border color
  borderBottom: `1px solid ${theme.palette.divider}`, // Use theme divider color
  color: theme.palette.text.primary, // Ensure body cell text color adapts
  whiteSpace: 'nowrap', // Prevent text wrapping in data cells
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'background-color 0.2s ease-in-out',
  '&:nth-of-type(odd)': {
    // Light stripe effect, adapts to dark mode
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.grey[900], 0.5)
      : alpha(theme.palette.grey[50], 0.5),
  },
  '&:hover': {
    // Subtle hover effect, adapts to dark mode
    backgroundColor: alpha(theme.palette.primary.light, theme.palette.mode === 'dark' ? 0.05 : 0.1),
  },
}));

export default function ViewPayrolls() {
  const theme = useTheme(); // Access the current theme

  const [payrolls, setPayrolls] = useState([]);
  const [filterPeriod, setFilterPeriod] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const fetchPayrolls = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost/smarthr_proj/get_payrolls.php');

      if (res.data.success) {
        setPayrolls(res.data.payrolls || []);
        setSnackbarMessage('Payrolls loaded successfully.');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('Failed to fetch payrolls: ' + (res.data.message || 'Unknown error'));
        setSnackbarSeverity('error');
        setPayrolls([]);
      }
    } catch (err) {
      console.error('Error fetching payrolls:', err);
      setSnackbarMessage('Error fetching payrolls: ' + (err.response?.data?.message || err.message));
      setSnackbarSeverity('error');
      setPayrolls([]);
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const formatCurrency = (amount) => {
    const parsed = parseFloat(amount);
    return isNaN(parsed)
      ? 'Rs. 0.00'
      : 'Rs. ' + parsed.toLocaleString('en-LK', { minimumFractionDigits: 2 });
  };

  const calculateEPF = (totalSalary) => parseFloat((totalSalary * 0.08).toFixed(2));
  const calculateETF = (totalSalary) => parseFloat((totalSalary * 0.03).toFixed(2));
  const calculateNetSalary = (totalSalary) =>
    parseFloat((totalSalary - calculateEPF(totalSalary) - calculateETF(totalSalary)).toFixed(2));

  const filteredPayrolls = filterPeriod
    ? payrolls.filter((p) => p.pay_period === filterPeriod)
    : payrolls;

  const exportToExcel = () => {
    if (filteredPayrolls.length === 0) {
      setSnackbarMessage('No payroll data available to export.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    const data = filteredPayrolls.map((p) => {
      const total = parseFloat(p.total_salary) || 0;
      const epf = calculateEPF(total);
      const etf = calculateETF(total);
      const net = calculateNetSalary(total);

      return {
        ID: p.id,
        'Employee ID': p.employee_id,
        'Employee Name': p.employee_name || 'N/A',
        'Pay Period': p.pay_period || 'N/A',
        'Basic Hours': p.basic_hours,
        'Hourly Rate': parseFloat(p.hourly_rate).toFixed(2), // Keep as number for Excel calculation
        'Overtime Hours': p.overtime_hours,
        'Overtime Rate': parseFloat(p.overtime_rate).toFixed(2), // Keep as number
        Deductions: parseFloat(p.deductions).toFixed(2), // Keep as number
        'Total Salary': total.toFixed(2), // Keep as number
        'EPF (8%)': epf.toFixed(2), // Keep as number
        'ETF (3%)': etf.toFixed(2), // Keep as number
        'Net Salary': net.toFixed(2), // Keep as number
        'Paid Date': p.paid_date,
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payrolls');
    XLSX.writeFile(wb, `Payrolls_${filterPeriod || 'All'}.xlsx`);

    setSnackbarMessage('Payroll data exported to Excel.');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  const exportToPDF = () => {
    if (filteredPayrolls.length === 0) {
      setSnackbarMessage('No payroll data available to export.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4',
    });

    const marginLeft = 40;
    let startY = 40;

    // Company info
    const companyName = 'Smart HR (Pvt) Ltd.';
    const companyAddress = '123 Corporate Ave, Colombo, Sri Lanka';
    const companyContact = 'Phone: +94 11 234 5678 | Email: info@smarthr.lk';
    const printedDate = new Date().toLocaleString('en-LK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }); // More readable date format

    // --- Header Section ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22); // Larger company name
    doc.setTextColor(30, 30, 30); // Darker text color for heading
    doc.text(companyName, marginLeft, startY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10); // Smaller font for address/contact
    doc.setTextColor(80, 80, 80); // Lighter text color for details
    doc.text(companyAddress, marginLeft, startY + 25);
    doc.text(companyContact, marginLeft, startY + 40);

    // Printed date at top right, aligned with company info
    doc.setFontSize(8);
    doc.setTextColor(150); // Muted color for printed date
    doc.text(`Report Generated: ${printedDate}`, doc.internal.pageSize.getWidth() - marginLeft, startY + 15, {
      align: 'right',
    });

    // Separator line
    doc.setDrawColor(200); // Light grey line
    doc.setLineWidth(0.7); // Slightly thicker line
    doc.line(marginLeft, startY + 60, doc.internal.pageSize.getWidth() - marginLeft, startY + 60);

    // --- Report Title ---
    startY = startY + 85; // Move down after header and line
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50); // Slightly lighter than company name
    doc.text('Detailed Payroll Records', marginLeft, startY);

    // Subtitle if filtered
    if (filterPeriod) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(`For Pay Period: ${filterPeriod}`, marginLeft, startY + 15);
      startY += 15; // Adjust startY for table
    }

    // --- Table Definition ---
    const columns = [
      'ID',
      'Emp. ID',
      'Employee Name',
      'Pay Period',
      'Basic Hrs',
      'Hourly Rate',
      'OT Hrs',
      'OT Rate',
      'Deductions',
      'Gross Salary',
      'EPF (8%)',
      'ETF (3%)',
      'Net Salary',
      'Paid Date',
    ];

    const rows = filteredPayrolls.map((p) => {
      const total = parseFloat(p.total_salary) || 0;
      const epf = calculateEPF(total);
      const etf = calculateETF(total);
      const net = calculateNetSalary(total);

      const fC = formatCurrency; // Helper for currency formatting

      return [
        p.id,
        p.employee_id,
        p.employee_name || 'N/A',
        p.pay_period || 'N/A',
        p.basic_hours,
        fC(p.hourly_rate),
        p.overtime_hours,
        fC(p.overtime_rate),
        fC(p.deductions),
        fC(total),
        fC(epf),
        fC(etf),
        fC(net),
        p.paid_date,
      ];
    });

    autoTable(doc, {
      startY: startY + 25, // Start table after the title/subtitle
      head: [columns],
      body: rows,
      theme: 'grid', // Use 'grid' theme for visible borders
      styles: {
        fontSize: 8,
        cellPadding: 6, // Increased padding for better spacing
        font: 'helvetica',
        textColor: [50, 50, 50], // Darker body text
        valign: 'middle', // Vertically center text
      },
      headStyles: {
        fillColor: [0, 122, 255], // Primary blue for header
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center', // Center align headers
        lineColor: [0, 122, 255], // Match header border color
        lineWidth: 0.5,
      },
      bodyStyles: {
        halign: 'center', // Center align body text
        lineColor: [200, 200, 200], // Light grey borders for body
        lineWidth: 0.2, // Thinner body borders
      },
      alternateRowStyles: { // Subtle row banding
        fillColor: [245, 245, 245], // Very light grey
      },
      margin: { left: marginLeft, right: marginLeft },
      didDrawPage: function (data) {
        // Footer: Page number
        doc.setFontSize(8);
        doc.setTextColor(150); // Muted color
        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          doc.internal.pageSize.getWidth() - marginLeft,
          doc.internal.pageSize.getHeight() - 20, // Position higher from bottom
          { align: 'right' }
        );

        // Footer: Company name (optional, but adds a professional touch)
        doc.text(
            companyName,
            marginLeft,
            doc.internal.pageSize.getHeight() - 20,
            { align: 'left' }
        );
      },
    });

    doc.save(`Payrolls_${filterPeriod || 'All'}.pdf`);
    setSnackbarMessage('Payroll data exported to PDF.');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
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
        <ContentPaper>
          <SectionTitle variant="h4">Payroll Records</SectionTitle>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.secondary' }}>
              <FilterListIcon sx={{ verticalAlign: 'middle', mr: 0.5, color: theme.palette.text.secondary }} /> Filter by Pay Period:
            </Typography>
            <StyledTextField
              type="month"
              id="payPeriodFilter"
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small" // Make input smaller
            />
            {filterPeriod && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setFilterPeriod('')}
                startIcon={<ClearIcon />}
                sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    borderColor: theme.palette.mode === 'dark' ? alpha(theme.palette.secondary.light, 0.5) : undefined, // Adaptive border
                    color: theme.palette.mode === 'dark' ? theme.palette.secondary.light : undefined, // Adaptive text color
                    '&:hover': {
                        borderColor: theme.palette.secondary.main,
                        color: theme.palette.secondary.main,
                        backgroundColor: alpha(theme.palette.secondary.main, theme.palette.mode === 'dark' ? 0.08 : 0.04),
                    }
                }}
              >
                Clear Filter
              </Button>
            )}

            <Box sx={{ ml: 'auto', display: 'flex', gap: 1.5 }}>
              <ActionButton
                variant="contained"
                color="primary"
                onClick={exportToExcel}
                startIcon={<DownloadIcon />}
                disabled={loading || filteredPayrolls.length === 0}
              >
                Download Excel
              </ActionButton>
              <ActionButton
                variant="contained"
                color="primary"
                onClick={exportToPDF}
                startIcon={<DownloadIcon />}
                disabled={loading || filteredPayrolls.length === 0}
              >
                Download PDF
              </ActionButton>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress sx={{ color: theme.palette.primary.main }} />
              <Typography variant="h6" sx={{ ml: 2, color: theme.palette.text.secondary }}>Loading Payrolls...</Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{
                borderRadius: '12px',
                // Adapt shadow and background for table container
                boxShadow: theme.palette.mode === 'dark' ? `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}` : '0 4px 12px rgba(0, 0, 0, 0.05)',
                backgroundColor: theme.palette.background.paper,
            }}>
              <Table sx={{ minWidth: 700 }} aria-label="payroll table">
                <TableHead>
                  <TableRow>
                    <StyledTableHeadCell>ID</StyledTableHeadCell>
                    <StyledTableHeadCell>Employee ID</StyledTableHeadCell>
                    <StyledTableHeadCell>Employee Name</StyledTableHeadCell>
                    <StyledTableHeadCell>Pay Period</StyledTableHeadCell>
                    <StyledTableHeadCell>Basic Hours</StyledTableHeadCell>
                    <StyledTableHeadCell>Hourly Rate</StyledTableHeadCell>
                    <StyledTableHeadCell>Overtime Hours</StyledTableHeadCell>
                    <StyledTableHeadCell>Overtime Rate</StyledTableHeadCell>
                    <StyledTableHeadCell>Deductions</StyledTableHeadCell>
                    <StyledTableHeadCell>Total Salary</StyledTableHeadCell>
                    <StyledTableHeadCell>EPF (8%)</StyledTableHeadCell>
                    <StyledTableHeadCell>ETF (3%)</StyledTableHeadCell>
                    <StyledTableHeadCell>Net Salary</StyledTableHeadCell>
                    <StyledTableHeadCell>Paid Date</StyledTableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPayrolls.length === 0 ? (
                    <TableRow>
                      <StyledTableBodyCell colSpan={14} sx={{ textAlign: 'center', py: 3, color: theme.palette.text.secondary }}>
                        No payroll records found for the selected period.
                      </StyledTableBodyCell>
                    </TableRow>
                  ) : (
                    filteredPayrolls.map((p) => {
                      const total = parseFloat(p.total_salary) || 0;
                      return (
                        <StyledTableRow key={p.id}>
                          <StyledTableBodyCell>{p.id}</StyledTableBodyCell>
                          <StyledTableBodyCell>{p.employee_id}</StyledTableBodyCell>
                          <StyledTableBodyCell>{p.employee_name || 'N/A'}</StyledTableBodyCell>
                          <StyledTableBodyCell>{p.pay_period || 'N/A'}</StyledTableBodyCell>
                          <StyledTableBodyCell>{p.basic_hours}</StyledTableBodyCell>
                          <StyledTableBodyCell>{formatCurrency(p.hourly_rate)}</StyledTableBodyCell>
                          <StyledTableBodyCell>{p.overtime_hours}</StyledTableBodyCell>
                          <StyledTableBodyCell>{formatCurrency(p.overtime_rate)}</StyledTableBodyCell>
                          <StyledTableBodyCell>{formatCurrency(p.deductions)}</StyledTableBodyCell>
                          <StyledTableBodyCell>{formatCurrency(total)}</StyledTableBodyCell>
                          <StyledTableBodyCell>{formatCurrency(calculateEPF(total))}</StyledTableBodyCell>
                          <StyledTableBodyCell>{formatCurrency(calculateETF(total))}</StyledTableBodyCell>
                          <StyledTableBodyCell>{formatCurrency(calculateNetSalary(total))}</StyledTableBodyCell>
                          <StyledTableBodyCell>{p.paid_date}</StyledTableBodyCell>
                        </StyledTableRow>
                      );
                    })
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
            // Adapt Alert background and text color
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