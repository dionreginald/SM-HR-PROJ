<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['username']) || !isset($data['logo_url'])) {
    echo json_encode(['success' => false, 'message' => 'username and logo_url are required']);
    exit();
}

$username = trim($data['username']);
$logo_url = trim($data['logo_url']);

if (empty($username) || empty($logo_url)) {
    echo json_encode(['success' => false, 'message' => 'username and logo_url cannot be empty']);
    exit();
}

$conn = new mysqli('localhost', 'root', '', 'smarthr_proj_db');
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB connection failed: ' . $conn->connect_error]);
    exit();
}

$stmt = $conn->prepare("UPDATE admins SET logo_url = ? WHERE username = ?");
$stmt->bind_param("ss", $logo_url, $username);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Logo updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'No matching user found or logo unchanged']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Update failed: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
