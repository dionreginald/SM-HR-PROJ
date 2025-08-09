<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['email'], $input['oldPassword'], $input['newPassword'])) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

$email = $input['email'];
$oldPassword = $input['oldPassword'];
$newPassword = $input['newPassword'];

$conn = new mysqli("localhost", "root", "", "smarthr_proj_db");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$stmt = $conn->prepare("SELECT password_hash FROM employees WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows !== 1) {
    echo json_encode(["success" => false, "message" => "Employee not found"]);
    exit;
}

$user = $result->fetch_assoc();

if (!password_verify($oldPassword, $user['password_hash'])) {
    echo json_encode(["success" => false, "message" => "Old password is incorrect"]);
    exit;
}

$newHash = password_hash($newPassword, PASSWORD_DEFAULT);

$updateStmt = $conn->prepare("UPDATE employees SET password_hash = ? WHERE email = ?");
$updateStmt->bind_param("ss", $newHash, $email);

if ($updateStmt->execute()) {
    echo json_encode(["success" => true, "message" => "Password updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to update password"]);
}
