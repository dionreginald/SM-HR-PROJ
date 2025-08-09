<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
$host = 'localhost';
$db = 'smarthr_proj_db';
$user = 'root';
$pass = ''; // or your password

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit();
}

// Read JSON input
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
    exit();
}

$employee_id = $data['employee_id'] ?? null;
$leave_type = $data['leave_type'] ?? null;
$from_date = $data['from_date'] ?? null;
$to_date = $data['to_date'] ?? null;
$reason = $data['reason'] ?? null;

if (!$employee_id || !$leave_type || !$from_date || !$to_date || !$reason) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit();
}

$stmt = $conn->prepare("INSERT INTO leave_requests (employee_id, leave_type, from_date, to_date, reason) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("issss", $employee_id, $leave_type, $from_date, $to_date, $reason);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Leave request saved']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to save leave request']);
}

$stmt->close();
$conn->close();
