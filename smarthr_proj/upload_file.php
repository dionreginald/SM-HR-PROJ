<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Directory to store uploaded files
$uploadDir = __DIR__ . '/uploads/';

// Create directory if not exists
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if (!isset($_FILES['file'])) {
    echo json_encode(['success' => false, 'message' => 'No file uploaded']);
    exit();
}

$file = $_FILES['file'];
if ($file['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'Upload error code: ' . $file['error']]);
    exit();
}

// Sanitize filename
$filename = basename($file['name']);
$filename = preg_replace("/[^A-Za-z0-9_\-\.]/", '_', $filename);
$targetFile = $uploadDir . time() . "_" . $filename;

// Move uploaded file to uploads directory
if (move_uploaded_file($file['tmp_name'], $targetFile)) {
    // Return accessible URL (adjust BASE_URL accordingly)
    $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http")
               . "://{$_SERVER['HTTP_HOST']}/smarthr_proj/uploads/";
    $fileUrl = $baseUrl . basename($targetFile);

    echo json_encode(['success' => true, 'url' => $fileUrl]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to move uploaded file']);
}
