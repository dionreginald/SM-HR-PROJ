<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS headers (adjust your frontend URL accordingly)
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db.php';
require 'vendor/autoload.php'; // PHPMailer autoload

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Read JSON input from request body
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['pay_period'])) {
    echo json_encode(['success' => false, 'message' => 'Missing pay_period']);
    exit;
}

$payPeriod = $data['pay_period'];

// Fetch payrolls and employee info for the specified pay period
$stmt = $conn->prepare("
    SELECT p.*, e.email, e.full_name 
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

$successCount = 0;
$failCount = 0;
$failures = [];

while ($row = $result->fetch_assoc()) {
    $mail = new PHPMailer(true);

    try {
        // SMTP configuration
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'projectsmarthr@gmail.com'; // Your Gmail address
        $mail->Password   = 'tjzj ojte axyc cvlk';      // Your Gmail app password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // Sender and recipient settings
        $mail->setFrom('projectsmarthr@gmail.com', 'SmartHR Admin');
        $mail->addAddress($row['email'], $row['full_name']);

        // Email content
        $mail->isHTML(true);
        $mail->Subject = "Payslip for {$payPeriod}";

        // Calculate EPF, ETF, and Net Salary
        $totalSalary = floatval($row['total_salary']);
        $epf = $totalSalary * 0.08;
        $etf = $totalSalary * 0.03;
        $netSalary = $totalSalary - $epf - $etf;

        $body = "
            <div style='font-family: Arial, sans-serif; color: #333;'>
                <h2 style='color: #2E86C1;'>Dear {$row['full_name']},</h2>
                <p>Please find below your payslip details for the pay period: <strong>{$payPeriod}</strong>.</p>
                <table style='border-collapse: collapse; width: 100%;'>
                    <tr><td style='border: 1px solid #ddd; padding: 8px;'>Basic Hours</td><td style='border: 1px solid #ddd; padding: 8px;'>{$row['basic_hours']}</td></tr>
                    <tr><td style='border: 1px solid #ddd; padding: 8px;'>Hourly Rate</td><td style='border: 1px solid #ddd; padding: 8px;'>Rs. ".number_format($row['hourly_rate'], 2)."</td></tr>
                    <tr><td style='border: 1px solid #ddd; padding: 8px;'>Overtime Hours</td><td style='border: 1px solid #ddd; padding: 8px;'>{$row['overtime_hours']}</td></tr>
                    <tr><td style='border: 1px solid #ddd; padding: 8px;'>Overtime Rate</td><td style='border: 1px solid #ddd; padding: 8px;'>Rs. ".number_format($row['overtime_rate'], 2)."</td></tr>
                    <tr><td style='border: 1px solid #ddd; padding: 8px;'>Deductions</td><td style='border: 1px solid #ddd; padding: 8px;'>Rs. ".number_format($row['deductions'], 2)."</td></tr>
                    <tr><td style='border: 1px solid #ddd; padding: 8px;'>Total Salary</td><td style='border: 1px solid #ddd; padding: 8px;'>Rs. ".number_format($totalSalary, 2)."</td></tr>
                    <tr><td style='border: 1px solid #ddd; padding: 8px;'>EPF (8%)</td><td style='border: 1px solid #ddd; padding: 8px;'>Rs. ".number_format($epf, 2)."</td></tr>
                    <tr><td style='border: 1px solid #ddd; padding: 8px;'>ETF (3%)</td><td style='border: 1px solid #ddd; padding: 8px;'>Rs. ".number_format($etf, 2)."</td></tr>
                    <tr><td style='border: 1px solid #ddd; padding: 8px;'>Net Salary</td><td style='border: 1px solid #ddd; padding: 8px;'>Rs. ".number_format($netSalary, 2)."</td></tr>
                </table>
                <p>Thank you for your hard work!</p>
                <br>
                <p>Best regards,<br><em>SmartHR Team</em></p>
            </div>
        ";

        $mail->Body = $body;

        $mail->send();
        $successCount++;
    } catch (Exception $e) {
        $failCount++;
        $failures[] = [
            'employee' => $row['full_name'],
            'email' => $row['email'],
            'error' => $mail->ErrorInfo
        ];
    }
}

// Return JSON response summarizing sending results
echo json_encode([
    'success' => $failCount === 0,
    'sent' => $successCount,
    'failed' => $failCount,
    'failures' => $failures
]);
