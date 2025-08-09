<?php
// Set CORS and content headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Connect to database
$conn = new mysqli('localhost', 'root', '', 'smarthr_proj_db');
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit();
}

// Read and decode JSON input
$data = json_decode(file_get_contents("php://input"), true);
$employee_id = $data['employee_id'] ?? null;

if (!$employee_id || !is_numeric($employee_id)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid or missing employee_id']);
    exit();
}

// Prepare SQL: update personal and global notifications
$sql = "UPDATE notifications SET is_read = TRUE WHERE employee_id = ? OR employee_id IS NULL";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $employee_id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Notifications marked as read']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to update notifications']);
}

$stmt->close();
$conn->close();
?>
