<?php
// Enable error reporting for development
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS Headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include the database connection script
require 'db.php';

// Get the JSON input from the request body
$payrollData = json_decode(file_get_contents("php://input"), true);

// Initialize an array to hold the results of each payroll record
$results = [];

// Validate that the input is a non-empty array
if (!is_array($payrollData) || empty($payrollData)) {
    echo json_encode(['success' => false, 'message' => 'Invalid input. Expected a non-empty array of payroll data.']);
    exit();
}

// Prepare the INSERT statement once, outside the loop for efficiency
$stmt = $conn->prepare("INSERT INTO payrolls (employee_id, basic_hours, hourly_rate, overtime_hours, overtime_rate, deductions, total_salary, pay_period, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())");

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
    exit();
}

// Bind parameters for the prepared statement
// Note: 'idddddds' corresponds to integer, and seven double/float, and a string
$stmt->bind_param("idddddds", $employeeId, $basicHours, $hourlyRate, $overtimeHours, $overtimeRate, $deductions, $totalSalary, $payPeriod);

// Loop through each payroll record in the submitted array
foreach ($payrollData as $index => $data) {
    // Validate required fields for the current record
    if (
        !isset($data['employee_id']) ||
        !isset($data['basic_hours']) ||
        !isset($data['hourly_rate']) ||
        !isset($data['overtime_hours']) ||
        !isset($data['deductions']) ||
        !isset($data['pay_period'])
    ) {
        $results[] = [
            'success' => false,
            'message' => 'Missing required fields for record ' . ($index + 1),
            'record_index' => $index,
        ];
        continue; // Skip to the next record
    }

    // Validate pay_period format YYYY-MM (basic check)
    if (!preg_match('/^\d{4}-\d{2}$/', $data['pay_period'])) {
        $results[] = [
            'success' => false,
            'message' => 'Invalid pay_period format for record ' . ($index + 1) . '. Expected YYYY-MM',
            'record_index' => $index,
        ];
        continue;
    }

    // Extract and sanitize data safely
    $employeeId = intval($data['employee_id']);
    $basicHours = floatval($data['basic_hours']);
    $hourlyRate = floatval($data['hourly_rate']);
    $overtimeHours = floatval($data['overtime_hours']);
    $deductions = floatval($data['deductions']);
    $payPeriod = $data['pay_period'];

    // For overtime rate, use the same hourly rate if not separately provided
    $overtimeRate = isset($data['overtime_rate']) ? floatval($data['overtime_rate']) : $hourlyRate;

    // Calculate total salary
    $totalSalary = ($basicHours * $hourlyRate) + ($overtimeHours * $overtimeRate) - $deductions;

    // Execute the prepared statement with the current record's data
    if ($stmt->execute()) {
        $results[] = [
            'success' => true,
            'message' => 'Payroll added successfully for employee ' . $employeeId,
            'employee_id' => $employeeId,
            'total_salary' => $totalSalary
        ];
    } else {
        $results[] = [
            'success' => false,
            'message' => 'Database insert failed for employee ' . $employeeId . ': ' . $stmt->error,
            'employee_id' => $employeeId
        ];
    }
}

// Close the statement and database connection after the loop
$stmt->close();
$conn->close();

// Return the full results array as a JSON response
echo json_encode($results);
?>
