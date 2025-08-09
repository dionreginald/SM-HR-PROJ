<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$conn = new mysqli('localhost', 'root', '', 'smarthr_proj_db');
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB connection failed']);
    exit;
}

$id = intval($_GET['id'] ?? 0);
if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid ID']);
    exit;
}

$sql = "DELETE FROM employees WHERE id = $id";
if ($conn->query($sql)) {
    echo json_encode(['success' => true, 'message' => 'Deleted successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Delete failed']);
}
$conn->close();
