<?php
// Enable CORS for all origins and JSON response
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "smarthr_proj_db";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

// Fetch employees data
$sql_employees = "SELECT id, department, full_name, age, dob, address, email, phone_number, profile_pic FROM employees";
$result_employees = $conn->query($sql_employees);

$employees = [];
if ($result_employees && $result_employees->num_rows > 0) {
    while ($row = $result_employees->fetch_assoc()) {
        $employees[] = $row;
    }
}

// Fetch leave requests data
$sql_leaves = "SELECT id, employee_id, status, from_date, to_date, reason FROM leaves";
$result_leaves = $conn->query($sql_leaves);

$leaves = [];
if ($result_leaves && $result_leaves->num_rows > 0) {
    while ($row = $result_leaves->fetch_assoc()) {
        $leaves[] = $row;
    }
}

// Fetch payroll data
$sql_payrolls = "SELECT employee_id, total_salary, overtime_hours, paid_date FROM payrolls";
$result_payrolls = $conn->query($sql_payrolls);

$payrolls = [];
if ($result_payrolls && $result_payrolls->num_rows > 0) {
    while ($row = $result_payrolls->fetch_assoc()) {
        $payrolls[] = $row;
    }
}

// Fetch events data
$sql_events = "SELECT id, title, date FROM events WHERE date >= CURDATE() ORDER BY date ASC";
$result_events = $conn->query($sql_events);

$events = [];
if ($result_events && $result_events->num_rows > 0) {
    while ($row = $result_events->fetch_assoc()) {
        $events[] = $row;
    }
}

// Generate charts data
// Employee Count by Department (for Doughnut Chart)
$employeeCountByDept = [];
foreach ($employees as $employee) {
    $dept = $employee['department'] ?: 'Unknown';
    if (!isset($employeeCountByDept[$dept])) {
        $employeeCountByDept[$dept] = 0;
    }
    $employeeCountByDept[$dept]++;
}
$employeeCountChartData = [
    'labels' => array_keys($employeeCountByDept),
    'data' => array_values($employeeCountByDept),
];

// Overtime Hours by Department (for Bar Chart)
$overtimeByDept = [];
foreach ($payrolls as $payroll) {
    $employee = array_filter($employees, fn($e) => $e['id'] == $payroll['employee_id']);
    $dept = count($employee) > 0 ? $employee[0]['department'] : 'Unknown';
    if (!isset($overtimeByDept[$dept])) {
        $overtimeByDept[$dept] = 0;
    }
    $overtimeByDept[$dept] += (float)$payroll['overtime_hours'];
}
$overtimeChartData = [
    'labels' => array_keys($overtimeByDept),
    'data' => array_values($overtimeByDept),
];

// Monthly Payroll Expenses (for Line Chart)
$payrollExpensesByMonth = [];
foreach ($payrolls as $payroll) {
    $paidMonth = date('M Y', strtotime($payroll['paid_date']));
    if (!isset($payrollExpensesByMonth[$paidMonth])) {
        $payrollExpensesByMonth[$paidMonth] = 0;
    }
    $payrollExpensesByMonth[$paidMonth] += (float)$payroll['total_salary'];
}
ksort($payrollExpensesByMonth);
$payrollExpensesChartData = [
    'labels' => array_keys($payrollExpensesByMonth),
    'data' => array_values($payrollExpensesByMonth),
];

// Prepare final response data
$response = [
    'employees' => $employees,
    'leaves' => $leaves,
    'payrolls' => $payrolls,
    'events' => $events,
    'employeeCountChart' => $employeeCountChartData,
    'overtimeChart' => $overtimeChartData,
    'payrollExpensesChart' => $payrollExpensesChartData,
];

echo json_encode($response);
$conn->close();
?>
