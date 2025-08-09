<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli('localhost', 'root', '', 'smarthr_proj_db');
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'DB connection failed']));
}

$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['id']);
$current_password = $data['current_password'] ?? '';
$new_password = $data['new_password'] ?? '';

if (!$id || !$current_password || !$new_password) {
    echo json_encode(['success' => false, 'message' => 'Missing parameters']);
    exit;
}

// Fetch current hashed password
$sql = "SELECT password FROM admins WHERE id=$id LIMIT 1";
$result = $conn->query($sql);

if ($result && $result->num_rows === 1) {
    $row = $result->fetch_assoc();
    $hashed_password = $row['password'];

    if (password_verify($current_password, $hashed_password)) {
        // Current password is correct, update with new hash
        $new_hash = password_hash($new_password, PASSWORD_DEFAULT);
        $update_sql = "UPDATE admins SET password='$new_hash' WHERE id=$id";
        if ($conn->query($update_sql)) {
            echo json_encode(['success' => true, 'message' => 'Password updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update password']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Admin not found']);
}

$conn->close();
?>
