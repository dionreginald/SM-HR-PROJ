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

$sql = "SELECT id, employee_id, basic_hours, hourly_rate, overtime_hours, overtime_rate, deductions, total_salary, created_at, paid_date, pay_period FROM payrolls";
$result = $conn->query($sql);

$payrolls = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $payrolls[] = $row;
    }
}

echo json_encode($payrolls);
$conn->close();
?>
