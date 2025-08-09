<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli('localhost', 'root', '', 'smarthr_proj_db');
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

// Required fields check
if (empty($data['username']) || empty($data['password']) || empty($data['full_name']) || empty($data['position'])) {
    echo json_encode(['success' => false, 'message' => 'Username, password, full name, and position are required']);
    exit;
}

$username = $data['username'];
$password = $data['password'];
$full_name = $data['full_name'];
$position = $data['position'];
$email = $data['email'] ?? '';
$phone = $data['phone'] ?? '';

// Check if username already exists
$stmtCheck = $conn->prepare("SELECT id FROM admins WHERE username = ? LIMIT 1");
$stmtCheck->bind_param("s", $username);
$stmtCheck->execute();
$stmtCheck->store_result();
if ($stmtCheck->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Username already exists']);
    $stmtCheck->close();
    $conn->close();
    exit;
}
$stmtCheck->close();

// Hash password securely
$hashed_password = password_hash($password, PASSWORD_BCRYPT);

// Prepare insert statement
$stmt = $conn->prepare("INSERT INTO admins (username, password, full_name, position, email, phone) VALUES (?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
    $conn->close();
    exit;
}

$stmt->bind_param("ssssss", $username, $hashed_password, $full_name, $position, $email, $phone);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Admin registered successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
