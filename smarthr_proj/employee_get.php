<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$conn = new mysqli('localhost', 'root', '', 'smarthr_proj_db');
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'DB connection failed']));
}

$id = intval($_GET['id'] ?? 0);
if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid ID']);
    exit;
}

$sql = "SELECT * FROM employees WHERE id=$id LIMIT 1";
$result = $conn->query($sql);

if ($result && $result->num_rows === 1) {
    $employee = $result->fetch_assoc();

    // Add full URL to profile_pic if available
    $baseURL = 'http://localhost/uploads/';
    if (!empty($employee['profile_pic'])) {
        $employee['profile_pic_url'] = $baseURL . $employee['profile_pic'];
    } else {
        $employee['profile_pic_url'] = null;
    }

    echo json_encode(['success' => true, 'employee' => $employee]);
} else {
    echo json_encode(['success' => false, 'message' => 'Employee not found']);
}

$conn->close();
