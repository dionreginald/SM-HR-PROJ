<?php
// Allow requests from your frontend
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Connect to database
$conn = new mysqli('localhost', 'root', '', 'smarthr_proj_db');
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit();
}

// Validate employee_id from GET
$employee_id = isset($_GET['employee_id']) && is_numeric($_GET['employee_id']) ? intval($_GET['employee_id']) : null;
if ($employee_id === null) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing or invalid employee_id']);
    exit();
}

// Prepare SQL to fetch both personal and global notifications
$sql = "SELECT id, title, message, is_read, created_at 
        FROM notifications 
        WHERE (employee_id = ? OR employee_id IS NULL) 
        ORDER BY created_at DESC";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to prepare SQL statement']);
    exit();
}

$stmt->bind_param("i", $employee_id);
$stmt->execute();

$result = $stmt->get_result();
$notifications = $result->fetch_all(MYSQLI_ASSOC);

// Return JSON response
echo json_encode([
    'status' => 'success',
    'data' => $notifications
], JSON_UNESCAPED_UNICODE);

$stmt->close();
$conn->close();
?>
