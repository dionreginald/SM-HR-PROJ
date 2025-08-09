<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load DB connection
require 'db.php';

// Load Composer autoload for FPDF
require __DIR__ . '/vendor/autoload.php';

// Read input
$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['pay_period'])) {
    echo json_encode(['success' => false, 'message' => 'Missing pay_period']);
    exit;
}

$payPeriod = $data['pay_period'];

// Fetch payrolls joined with employees
$stmt = $conn->prepare("
    SELECT p.*, e.full_name AS employee_name, e.id AS employee_id 
    FROM payrolls p
    JOIN employees e ON p.employee_id = e.id
    WHERE p.pay_period = ?
");
$stmt->bind_param("s", $payPeriod);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'No payrolls found for this pay period']);
    exit;
}

// Create payslips directory if not exists
$payslipDir = __DIR__ . '/payslips/';
if (!file_exists($payslipDir)) {
    mkdir($payslipDir, 0777, true);
}

$payslipFiles = [];

while ($row = $result->fetch_assoc()) {
    $pdf = new Fpdf();
    $pdf->AddPage();
    $pdf->SetFont('Arial', 'B', 16);
    $pdf->Cell(0, 10, 'Smart HR Ltd', 0, 1);
    $pdf->SetFont('Arial', '', 12);
    $pdf->Cell(0, 10, '123 Main St, Colombo', 0, 1);
    $pdf->Cell(0, 10, 'Contact: 1234567890', 0, 1);

    $pdf->Ln(10);
    $pdf->SetFont('Arial', 'B', 14);
    $pdf->Cell(0, 10, "Payslip for {$row['employee_name']}", 0, 1);

    $pdf->SetFont('Arial', '', 12);
    $pdf->Cell(0, 8, "Employee ID: {$row['employee_id']}", 0, 1);
    $pdf->Cell(0, 8, "Pay Period: {$row['pay_period']}", 0, 1);
    $pdf->Cell(0, 8, "Paid Date: {$row['paid_date']}", 0, 1);

    $pdf->Ln(10);

    // Calculations
    $totalSalary = floatval($row['total_salary']);
    $epf = $totalSalary * 0.08;
    $etf = $totalSalary * 0.03;
    $netSalary = $totalSalary - $epf - $etf;

    // Table headers
    $pdf->SetFont('Arial', 'B', 12);
    $pdf->Cell(80, 10, 'Description', 1);
    $pdf->Cell(50, 10, 'Amount', 1, 1);

    $pdf->SetFont('Arial', '', 12);
    $pdf->Cell(80, 8, 'Basic Hours', 1);
    $pdf->Cell(50, 8, $row['basic_hours'], 1, 1);

    $pdf->Cell(80, 8, 'Hourly Rate', 1);
    $pdf->Cell(50, 8, "Rs. " . number_format($row['hourly_rate'], 2), 1, 1);

    $pdf->Cell(80, 8, 'Overtime Hours', 1);
    $pdf->Cell(50, 8, $row['overtime_hours'], 1, 1);

    $pdf->Cell(80, 8, 'Overtime Rate', 1);
    $pdf->Cell(50, 8, "Rs. " . number_format($row['overtime_rate'], 2), 1, 1);

    $pdf->Cell(80, 8, 'Deductions', 1);
    $pdf->Cell(50, 8, "Rs. " . number_format($row['deductions'], 2), 1, 1);

    $pdf->Cell(80, 8, 'Total Salary', 1);
    $pdf->Cell(50, 8, "Rs. " . number_format($totalSalary, 2), 1, 1);

    $pdf->Cell(80, 8, 'EPF (8%)', 1);
    $pdf->Cell(50, 8, "Rs. " . number_format($epf, 2), 1, 1);

    $pdf->Cell(80, 8, 'ETF (3%)', 1);
    $pdf->Cell(50, 8, "Rs. " . number_format($etf, 2), 1, 1);

    $pdf->Cell(80, 8, 'Net Salary', 1);
    $pdf->Cell(50, 8, "Rs. " . number_format($netSalary, 2), 1, 1);

    $pdf->Ln(10);
    $pdf->Cell(0, 10, 'Thank you for your hard work!', 0, 1);

    // Save file
    $filename = "{$row['employee_id']}_{$payPeriod}.pdf";
    $filepath = $payslipDir . $filename;
    $pdf->Output('F', $filepath);

    $payslipFiles[] = [
        'employee_id' => $row['employee_id'],
        'filename' => $filename,
        'url' => "http://localhost/smarthr_proj/payslips/{$filename}"
    ];
}

// Final response
echo json_encode([
    'success' => true,
    'message' => 'Payslips generated',
    'files' => $payslipFiles
]);
