<?php
// CORS and headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
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

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON input']);
    exit();
}

$id = $data['id'] ?? null;
$status = $data['status'] ?? null;

// Validate
if (!$id || !$status) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing id or status']);
    exit();
}

if (!is_numeric($id)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid id']);
    exit();
}

$valid_statuses = ['Pending', 'Approved', 'Rejected'];
if (!in_array($status, $valid_statuses)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid status']);
    exit();
}

// Update leave status
$stmt = $conn->prepare("UPDATE leave_requests SET status = ? WHERE id = ?");
$stmt->bind_param("si", $status, $id);

if ($stmt->execute()) {
    // Fetch employee_id
    $empStmt = $conn->prepare("SELECT employee_id FROM leave_requests WHERE id = ?");
    $empStmt->bind_param("i", $id);
    $empStmt->execute();
    $empResult = $empStmt->get_result();
    $employeeRow = $empResult->fetch_assoc();
    $empStmt->close();

    if ($employeeRow) {
        $id_of_employee = $employeeRow['employee_id'];

        // Insert notification
        $notif_stmt = $conn->prepare("INSERT INTO notifications (employee_id, title, message) VALUES (?, ?, ?)");
        $title = "Leave Request " . $status;
        $message = "Your leave request ID $id has been " . strtolower($status) . ".";
        $notif_stmt->bind_param("iss", $id_of_employee, $title, $message);
        $notif_stmt->execute();
        $notif_stmt->close();
    }

    // Check if status was changed
    if ($stmt->affected_rows > 0) {
        echo json_encode(['status' => 'success', 'message' => 'Leave status updated']);
    } else {
        echo json_encode(['status' => 'info', 'message' => 'Leave request already had this status']);
    }
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to update leave status']);
}

$stmt->close();
$conn->close();
