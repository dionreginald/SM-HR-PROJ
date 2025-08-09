<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");  // Adjust if needed for security

$conn = new mysqli('localhost', 'root', '', 'smarthr_proj_db');
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB connection failed']);
    exit;
}

$sql = "SELECT id, full_name, email, dob, phone_number, hourly_rate FROM employees ORDER BY id DESC";
$result = $conn->query($sql);

$employees = [];
while ($row = $result->fetch_assoc()) {
    $employees[] = $row;
}

echo json_encode(['success' => true, 'employees' => $employees]);
$conn->close();
?>
