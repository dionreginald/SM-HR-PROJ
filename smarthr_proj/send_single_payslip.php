<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db.php';
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Read input
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['pay_period']) || !isset($data['employee_id'])) {
    echo json_encode(['success' => false, 'message' => 'Missing pay_period or employee_id']);
    exit;
}

$payPeriod = $data['pay_period'];
$employeeId = intval($data['employee_id']);

$stmt = $conn->prepare("
    SELECT p.*, e.email, e.full_name 
    FROM payrolls p
    JOIN employees e ON p.employee_id = e.id
    WHERE p.pay_period = ? AND p.employee_id = ?
    LIMIT 1
");
$stmt->bind_param("si", $payPeriod, $employeeId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Payroll record not found']);
    exit;
}

$row = $result->fetch_assoc();

// Calculations
$basicHours   = floatval($row['basic_hours']);
$hourlyRate   = floatval($row['hourly_rate']);
$overtimeHours= floatval($row['overtime_hours']);
$overtimeRate = floatval($row['overtime_rate']);
$deductions   = floatval($row['deductions']);
$totalSalary  = floatval($row['total_salary']);

$basicPay   = $basicHours * $hourlyRate;
$overtimePay= $overtimeHours * $overtimeRate;
$epf        = $totalSalary * 0.08;
$etf        = $totalSalary * 0.03;
$netSalary  = $totalSalary - $deductions - $epf - $etf;

// Escaped values
$fullName     = htmlspecialchars($row['full_name']);
$email        = $row['email'];
$paidDate     = htmlspecialchars($row['paid_date']);
$employeeId   = htmlspecialchars($row['employee_id']);
$payPeriodEsc = htmlspecialchars($payPeriod);

$basicHoursFmt   = number_format($basicHours, 2);
$hourlyRateFmt   = number_format($hourlyRate, 2);
$overtimeHoursFmt= number_format($overtimeHours, 2);
$overtimeRateFmt = number_format($overtimeRate, 2);
$basicPayFmt     = number_format($basicPay, 2);
$overtimePayFmt  = number_format($overtimePay, 2);
$totalSalaryFmt  = number_format($totalSalary, 2);
$deductionsFmt   = number_format($deductions, 2);
$epfFmt          = number_format($epf, 2);
$etfFmt          = number_format($etf, 2);
$netSalaryFmt    = number_format($netSalary, 2);

try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'projectsmarthr@gmail.com';
    $mail->Password   = 'tjzj ojte axyc cvlk'; // App Password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom('projectsmarthr@gmail.com', 'SmartHR');
    $mail->addAddress($email, $fullName);

    $mail->isHTML(true);
    $mail->Subject = "Your Payslip for {$payPeriodEsc} from Smart HR";

    $emailBody = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; }
        .container { max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        h2 { color: #007AFF; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
        .total { font-weight: bold; background-color: #e6f7ff; }
        .net { background-color: #28a745; color: #fff; font-size: 16px; font-weight: bold; }
        .footer { text-align: center; font-size: 12px; color: #888; margin-top: 40px; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Hello {$fullName},</h2>
        <p>Your payslip for <strong>{$payPeriodEsc}</strong> is ready.</p>

        <table>
            <tr><th colspan="2">Employee Details</th></tr>
            <tr><td>Employee ID</td><td>{$employeeId}</td></tr>
            <tr><td>Paid Date</td><td>{$paidDate}</td></tr>
        </table>

        <table>
            <tr><th colspan="2">Earnings</th></tr>
            <tr><td>Basic Pay ({$basicHoursFmt} hrs @ Rs. {$hourlyRateFmt}/hr)</td><td>Rs. {$basicPayFmt}</td></tr>
            <tr><td>Overtime Pay ({$overtimeHoursFmt} hrs @ Rs. {$overtimeRateFmt}/hr)</td><td>Rs. {$overtimePayFmt}</td></tr>
            <tr class="total"><td>Total Gross Salary</td><td>Rs. {$totalSalaryFmt}</td></tr>
        </table>

        <table>
            <tr><th colspan="2">Deductions</th></tr>
            <tr><td>Other Deductions</td><td>Rs. {$deductionsFmt}</td></tr>
            <tr><td>EPF (8%)</td><td>Rs. {$epfFmt}</td></tr>
            <tr><td>ETF (3%)</td><td>Rs. {$etfFmt}</td></tr>
        </table>

        <table>
            <tr class="net"><td>Net Salary Payable</td><td>Rs. {$netSalaryFmt}</td></tr>
        </table>

        <p>For any queries, contact us at <a href="mailto:info@smarthr.lk">info@smarthr.lk</a>.</p>

        <div class="footer">
            &copy; {date('Y')} Smart HR (Pvt) Ltd. All rights reserved.<br>
            123 Corporate Ave, Colombo, Sri Lanka<br>
            Phone: +94 11 234 5678
        </div>
    </div>
</body>
</html>
HTML;

    $mail->Body = $emailBody;
    $mail->send();

    echo json_encode(['success' => true, 'message' => 'Payslip email sent successfully.']);

} catch (Exception $e) {
    error_log("Mailer Error: " . $mail->ErrorInfo);
    echo json_encode(['success' => false, 'message' => 'Email sending failed.']);
}

$stmt->close();
$conn->close();
?>
