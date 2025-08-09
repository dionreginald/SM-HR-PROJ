<?php
// Allow requests from frontend or Postman
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// DB config
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "smarthr_proj_db";

// Connect to DB
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB connection failed: ' . $conn->connect_error]);
    exit();
}

// Get employee_id from query param
$employeeId = isset($_GET['id']) ? intval($_GET['id']) : 0;
if ($employeeId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Valid employee ID is required.']);
    exit();
}

// Query employee details
$stmt = $conn->prepare("SELECT 
    id, full_name, age, dob, address, email, phone_number, 
    profile_pic, nic_copy, police_check_report, cv, hourly_rate, created_at 
    FROM employees 
    WHERE id = ? 
    LIMIT 1");

$stmt->bind_param("i", $employeeId);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $employee = $result->fetch_assoc();

    // Base URL for uploaded files — adjust if your uploads folder URL is different
    $base_url = "http://localhost/smarthr_proj/uploads/";

    // Helper function to prepend base URL if not already full URL
    function prepUrl($fieldValue, $base_url) {
        if (!$fieldValue) return null;
        if (strpos($fieldValue, 'http') === 0) return $fieldValue;
        return $base_url . $fieldValue;
    }

    // Add full URLs for file fields
    $employee['profile_pic'] = prepUrl($employee['profile_pic'], $base_url);
    $employee['nic_copy'] = prepUrl($employee['nic_copy'], $base_url);
    $employee['police_check_report'] = prepUrl($employee['police_check_report'], $base_url);
    $employee['cv'] = prepUrl($employee['cv'], $base_url);

    echo json_encode(['success' => true, 'employee' => $employee]);
} else {
    echo json_encode(['success' => false, 'message' => 'Employee not found.']);
}

$stmt->close();
$conn->close();
