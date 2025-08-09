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

$id = intval($data['id'] ?? 0);
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

$sql = "UPDATE employees SET
    full_name='$full_name',
    age=$age,
    dob='$dob',
    address='$address',
    email='$email',
    phone_number='$phone_number',
    profile_pic='$profile_pic',
    police_check_report='$police_check_report',
    nic_copy='$nic_copy',
    cv='$cv',
    hourly_rate=$hourly_rate
    WHERE id=$id";

if ($conn->query($sql)) {
    echo json_encode(['success' => true, 'message' => 'Employee updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Update failed']);
}

$conn->close();
