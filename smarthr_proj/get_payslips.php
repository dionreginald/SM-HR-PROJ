<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

header("Access-Control-Allow-Origin: http://localhost:3000");

// Allow POST method and OPTIONS for preflight
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Allow these headers including Content-Type
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// For preflight requests, respond and exit immediately
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
require 'db.php';

$sql = "
    SELECT 
        p.*, 
        e.full_name AS employee_name, 
        e.email 
    FROM payrolls p
    LEFT JOIN employees e ON p.employee_id = e.id
    ORDER BY p.created_at DESC
";

$result = $conn->query($sql);
$payslips = [];

while ($row = $result->fetch_assoc()) {
    $payslips[] = $row;
}

echo json_encode([
    "success" => true,
    "payslips" => $payslips
]);

$conn->close();
?>
