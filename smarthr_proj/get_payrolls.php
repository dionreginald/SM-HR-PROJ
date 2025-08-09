<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php';

// Join payrolls with employees to get employee name
$sql = "
    SELECT 
        p.*, 
        e.full_name AS employee_name 
    FROM payrolls p
    LEFT JOIN employees e ON p.employee_id = e.id
    ORDER BY p.created_at DESC
";

$result = $conn->query($sql);

$payrolls = [];

while ($row = $result->fetch_assoc()) {
    $payrolls[] = $row;
}

echo json_encode([
    "success" => true,
    "payrolls" => $payrolls
]);

$conn->close();
?>
