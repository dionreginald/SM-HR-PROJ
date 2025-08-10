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

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

// Initialize response array
$response = [];

// --- Fetch all employees ---
$employees = [];
$sql_employees = "SELECT * FROM employees";
$result_employees = $conn->query($sql_employees);
if ($result_employees && $result_employees->num_rows > 0) {
    while ($row = $result_employees->fetch_assoc()) {
        $employees[] = $row;
    }
}
$response['employees'] = $employees;

// --- Fetch all leave requests ---
$leaves = [];
$sql_leaves = "SELECT * FROM leave_requests";
$result_leaves = $conn->query($sql_leaves);
if ($result_leaves && $result_leaves->num_rows > 0) {
    while ($row = $result_leaves->fetch_assoc()) {
        $leaves[] = $row;
    }
}
$response['leaves'] = $leaves;

// --- Fetch all payrolls ---
$payrolls = [];
$sql_payrolls = "SELECT * FROM payrolls";
$result_payrolls = $conn->query($sql_payrolls);
if ($result_payrolls && $result_payrolls->num_rows > 0) {
    while ($row = $result_payrolls->fetch_assoc()) {
        $payrolls[] = $row;
    }
}
$response['payrolls'] = $payrolls;

// --- Fetch upcoming events ---
$events = [];
$sql_events = "SELECT * FROM events WHERE date >= CURDATE() ORDER BY date ASC LIMIT 10";
$result_events = $conn->query($sql_events);
if ($result_events && $result_events->num_rows > 0) {
    while ($row = $result_events->fetch_assoc()) {
        $events[] = $row;
    }
}
$response['events'] = $events;

// --- Chart Data ---

// Employee Count by Department (Doughnut)
$employeeCountByDept = [];
$sql_employees_dept = "SELECT department FROM employees";
$result_employees_dept = $conn->query($sql_employees_dept);
if ($result_employees_dept && $result_employees_dept->num_rows > 0) {
    while ($row = $result_employees_dept->fetch_assoc()) {
        $department = $row['department'] ?: 'Unknown';
        if (!isset($employeeCountByDept[$department])) {
            $employeeCountByDept[$department] = 0;
        }
        $employeeCountByDept[$department]++;
    }
}
$response['employeeCountChart'] = [
    'labels' => array_keys($employeeCountByDept),
    'data' => array_values($employeeCountByDept),
];

// Overtime Hours by Department (Bar Chart)
$overtimeByDept = [];
$sql_overtime = "SELECT employees.department, payrolls.overtime_hours 
                 FROM payrolls 
                 JOIN employees ON payrolls.employee_id = employees.id";
$result_overtime = $conn->query($sql_overtime);
if ($result_overtime && $result_overtime->num_rows > 0) {
    while ($row = $result_overtime->fetch_assoc()) {
        $department = $row['department'] ?: 'Unknown';
        $overtime_hours = floatval($row['overtime_hours']);
        if (!isset($overtimeByDept[$department])) {
            $overtimeByDept[$department] = 0;
        }
        $overtimeByDept[$department] += $overtime_hours;
    }
}
$response['overtimeChart'] = [
    'labels' => array_keys($overtimeByDept),
    'data' => array_values($overtimeByDept),
];

// Payroll Expenses by Month (Line Chart)
$payrollExpensesByMonth = [];
$labels = [];
$data = [];

// Last 6 months labels
for ($i = 5; $i >= 0; $i--) {
    $month_year = date('Y-m', strtotime("-$i months"));
    $month_name = date('M Y', strtotime("-$i months"));
    $labels[] = $month_name;
    $payrollExpensesByMonth[$month_year] = 0;
}

$sql_payrolls_date = "SELECT total_salary, paid_date FROM payrolls";
$result_payrolls_date = $conn->query($sql_payrolls_date);
if ($result_payrolls_date && $result_payrolls_date->num_rows > 0) {
    while ($row = $result_payrolls_date->fetch_assoc()) {
        $total_salary = floatval($row['total_salary']);
        $paid_date = $row['paid_date'];
        $month_year = date('Y-m', strtotime($paid_date));

        if (isset($payrollExpensesByMonth[$month_year])) {
            $payrollExpensesByMonth[$month_year] += $total_salary;
        }
    }
}

foreach ($payrollExpensesByMonth as $total) {
    $data[] = $total;
}

$response['payrollExpensesChart'] = [
    'labels' => $labels,
    'data' => $data,
];

// Close connection
$conn->close();

// Return the combined response JSON
echo json_encode($response);
