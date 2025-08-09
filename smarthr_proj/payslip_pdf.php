<?php
require 'db.php';
require 'fpdf/fpdf.php';

$payrollId = isset($_GET['payroll_id']) ? intval($_GET['payroll_id']) : 0;

if ($payrollId === 0) {
    die("Invalid payroll ID");
}

// Fetch payroll + employee data
$sql = "
    SELECT 
        e.first_name,
        e.last_name,
        e.email,
        p.basic_hours,
        p.hourly_rate,
        p.overtime_hours,
        p.overtime_rate,
        p.deductions,
        p.total_salary,
        p.pay_period,
        p.paid_date
    FROM payrolls p
    JOIN employees e ON p.employee_id = e.id
    WHERE p.id = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $payrollId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("Payroll not found.");
}

$data = $result->fetch_assoc();

// Calculations
$basicPay = $data['basic_hours'] * $data['hourly_rate'];
$overtimePay = $data['overtime_hours'] * $data['overtime_rate'];
$netPay = $data['total_salary'];

// Generate PDF
$pdf = new FPDF();
$pdf->AddPage();
$pdf->SetFont('Arial', 'B', 16);

$pdf->Cell(0, 10, 'Employee Payslip', 0, 1, 'C');
$pdf->SetFont('Arial', '', 12);

$pdf->Ln(5);
$pdf->Cell(0, 10, "Name: " . $data['first_name'] . " " . $data['last_name'], 0, 1);
$pdf->Cell(0, 10, "Email: " . $data['email'], 0, 1);
$pdf->Cell(0, 10, "Pay Period: " . $data['pay_period'], 0, 1);
$pdf->Cell(0, 10, "Paid Date: " . $data['paid_date'], 0, 1);

$pdf->Ln(5);
$pdf->Cell(0, 10, "Basic Hours: " . $data['basic_hours'], 0, 1);
$pdf->Cell(0, 10, "Hourly Rate: Rs. " . number_format($data['hourly_rate'], 2), 0, 1);
$pdf->Cell(0, 10, "Basic Pay: Rs. " . number_format($basicPay, 2), 0, 1);

$pdf->Ln(2);
$pdf->Cell(0, 10, "Overtime Hours: " . $data['overtime_hours'], 0, 1);
$pdf->Cell(0, 10, "Overtime Rate: Rs. " . number_format($data['overtime_rate'], 2), 0, 1);
$pdf->Cell(0, 10, "Overtime Pay: Rs. " . number_format($overtimePay, 2), 0, 1);

$pdf->Ln(2);
$pdf->Cell(0, 10, "Deductions: Rs. " . number_format($data['deductions'], 2), 0, 1);

$pdf->SetFont('Arial', 'B', 12);
$pdf->Ln(3);
$pdf->Cell(0, 10, "Net Pay: Rs. " . number_format($netPay, 2), 0, 1);

$pdf->Output('I', 'payslip_' . $payrollId . '.pdf');
