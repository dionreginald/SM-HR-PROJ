<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$db = 'smarthr_proj_db';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit();
}

// Optionally, get employee_id filter from query string
$employee_id = isset($_GET['employee_id']) ? intval($_GET['employee_id']) : null;

if ($employee_id) {
    $stmt = $conn->prepare("SELECT * FROM leave_requests WHERE employee_id = ? ORDER BY id DESC");
    $stmt->bind_param("i", $employee_id);
} else {
    $stmt = $conn->prepare("SELECT * FROM leave_requests ORDER BY id DESC");
}

$sql = "SELECT lr.*, e.name as employee_name 
        FROM leave_requests lr 
        JOIN employees e ON lr.employee_id = e.id 
        ORDER BY lr.id DESC";


$stmt->execute();
$result = $stmt->get_result();

$leaveRequests = [];

while ($row = $result->fetch_assoc()) {
    $leaveRequests[] = $row;
}

echo json_encode(['status' => 'success', 'data' => $leaveRequests]);

$stmt->close();
$conn->close();
