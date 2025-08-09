<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$conn = new mysqli('localhost', 'root', '', 'smarthr_proj_db');
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB connection failed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$full_name = $data['full_name'] ?? '';
$age = intval($data['age'] ?? 0);
$dob = $data['dob'] ?? '';
$address = $data['address'] ?? '';
$email = $data['email'] ?? '';
$phone_number = $data['phone_number'] ?? '';
$password = $data['password'] ?? '';
$profile_pic = $data['profile_pic'] ?? '';
$police_check_report = $data['police_check_report'] ?? '';
$nic_copy = $data['nic_copy'] ?? '';
$cv = $data['cv'] ?? '';
$hourly_rate = floatval($data['hourly_rate'] ?? 0);

if (!$password) {
    echo json_encode(['success' => false, 'message' => 'Password is required']);
    exit;
}

$password_hash = password_hash($password, PASSWORD_BCRYPT);

$stmt = $conn->prepare("INSERT INTO employees (full_name, age, dob, address, email, phone_number, password_hash, profile_pic, police_check_report, nic_copy, cv, hourly_rate, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
    exit;
}

$stmt->bind_param(
    "sissssssssss",
    $full_name,
    $age,
    $dob,
    $address,
    $email,
    $phone_number,
    $password_hash,
    $profile_pic,
    $police_check_report,
    $nic_copy,
    $cv,
    $hourly_rate
);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Employee added successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to add employee: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
