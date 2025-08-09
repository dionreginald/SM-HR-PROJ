<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$password = "";
$dbname = "smarthr_proj_db";

$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

$id = $_POST['id'] ?? '';
if (empty($id)) {
    echo json_encode(["success" => false, "message" => "Invalid or missing employee ID"]);
    exit();
}

// Validate employee ID is numeric
$id = (int) $id;
if ($id <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid employee ID format"]);
    exit();
}

// Prepare fields to update
$fields = [];
$params = [];
$returnedFiles = [];

// Text fields
$fieldsMap = ['full_name', 'age', 'dob', 'address', 'email', 'phone_number'];

foreach ($fieldsMap as $field) {
    if (!empty($_POST[$field])) {
        $fields[] = "$field = ?";
        $params[] = $_POST[$field];
    }
}

// File fields
$uploadDir = 'uploads/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$fileFields = ['profile_pic', 'nic_copy', 'police_check', 'cv'];

foreach ($fileFields as $fileField) {
    if (isset($_FILES[$fileField]) && $_FILES[$fileField]['error'] === UPLOAD_ERR_OK) {
        $tmpName = $_FILES[$fileField]['tmp_name'];
        $fileName = basename($_FILES[$fileField]['name']);
        $fileExt = pathinfo($fileName, PATHINFO_EXTENSION);
        $uniqueName = uniqid($fileField . '_', true) . '.' . $fileExt;
        $targetPath = $uploadDir . $uniqueName;

        if (move_uploaded_file($tmpName, $targetPath)) {
            $fields[] = "$fileField = ?";
            $params[] = $uniqueName;
            $returnedFiles[$fileField] = $uniqueName;
        } else {
            echo json_encode(["success" => false, "message" => "Failed to upload $fileField"]);
            exit();
        }
    }
}

if (empty($fields)) {
    echo json_encode(["success" => false, "message" => "No data provided to update"]);
    exit();
}

// Build the SQL query
$sql = "UPDATE employees SET " . implode(', ', $fields) . " WHERE id = ?";
$params[] = $id;

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
    exit();
}

$types = str_repeat('s', count($params) - 1) . 'i';
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Employee profile updated successfully",
        "uploaded_files" => $returnedFiles
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Update failed",
        "error" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>
