<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS Headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db.php';

// Get the JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (
    !isset($data['employee_id']) ||
    !isset($data['basic_hours']) ||
    !isset($data['hourly_rate']) ||
    !isset($data['overtime_hours']) ||
    !isset($data['deductions']) ||
    !isset($data['pay_period'])
) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit();
}

// Validate pay_period format YYYY-MM (basic check)
if (!preg_match('/^\d{4}-\d{2}$/', $data['pay_period'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid pay_period format. Expected YYYY-MM']);
    exit();
}

// Extract data safely
$employeeId = intval($data['employee_id']);
$basicHours = floatval($data['basic_hours']);
$hourlyRate = floatval($data['hourly_rate']);
$overtimeHours = floatval($data['overtime_hours']);
$deductions = floatval($data['deductions']);
$payPeriod = $data['pay_period']; // e.g. "2025-07"

// For overtime rate, use the same hourly rate if not separately provided
$overtimeRate = isset($data['overtime_rate']) ? floatval($data['overtime_rate']) : $hourlyRate;

// Calculate total salary
$totalSalary = ($basicHours * $hourlyRate) + ($overtimeHours * $overtimeRate) - $deductions;

// Insert into DB
// Make sure your payrolls table has columns: pay_period VARCHAR(7), created_at DATETIME (or paid_date), etc.
$stmt = $conn->prepare("INSERT INTO payrolls (employee_id, basic_hours, hourly_rate, overtime_hours, overtime_rate, deductions, total_salary, pay_period, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())");

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
    exit();
}

$stmt->bind_param("idddddds", $employeeId, $basicHours, $hourlyRate, $overtimeHours, $overtimeRate, $deductions, $totalSalary, $payPeriod);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Payroll added successfully', 'total_salary' => $totalSalary]);
} else {
    echo json_encode(['success' => false, 'message' => 'Database insert failed: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
