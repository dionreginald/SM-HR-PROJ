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
$full_name = $conn->real_escape_string($data['full_name'] ?? '');
$age = intval($data['age'] ?? 0);
$dob = $conn->real_escape_string($data['dob'] ?? '');
$address = $conn->real_escape_string($data['address'] ?? '');
$email = $conn->real_escape_string($data['email'] ?? '');
$phone_number = $conn->real_escape_string($data['phone_number'] ?? '');
$profile_pic = $conn->real_escape_string($data['profile_pic'] ?? '');
$police_check_report = $conn->real_escape_string($data['police_check_report'] ?? '');
$nic_copy = $conn->real_escape_string($data['nic_copy'] ?? '');
$cv = $conn->real_escape_string($data['cv'] ?? '');
$hourly_rate = floatval($data['hourly_rate'] ?? 0);

if (empty($full_name) || empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Full name and email are required']);
    exit;
}

// Check if email already exists
$checkSql = "SELECT id FROM employees WHERE email='$email'";
$checkRes = $conn->query($checkSql);
if ($checkRes && $checkRes->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Employee with this email already exists']);
    exit;
}

$sql = "INSERT INTO employees (full_name, age, dob, address, email, phone_number, profile_pic, police_check_report, nic_copy, cv, hourly_rate)
        VALUES ('$full_name', $age, '$dob', '$address', '$email', '$phone_number', '$profile_pic', '$police_check_report', '$nic_copy', '$cv', $hourly_rate)";

if ($conn->query($sql)) {
    echo json_encode(['success' => true, 'message' => 'Employee added successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to add employee']);
}

$conn->close();
