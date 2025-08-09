<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  http_response_code(200);
  exit();
}

$conn = new mysqli('localhost', 'root', '', 'smarthr_proj_db');
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'DB connection failed']);
  exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$title = $data['title'] ?? null;
$message = $data['message'] ?? null;
$employee_id = $data['employee_id'] ?? null; // null or specific id

if (!$title || !$message) {
  http_response_code(400);
  echo json_encode(['status' => 'error', 'message' => 'Missing title or message']);
  exit();
}

// IMPORTANT: mysqli bind_param doesn't accept null for integers directly,
// so we use a workaround: 
// if $employee_id is null, bind it as NULL using bindValue with types or set to null via statement

// Prepare statement
$stmt = $conn->prepare("INSERT INTO notifications (employee_id, title, message) VALUES (?, ?, ?)");

// For nullable integer, we have to use a variable and tell mysqli to treat null correctly
if ($employee_id === null) {
  // Use 'i' for integer, but bind NULL using bind_param with null passed by reference
  // We can set $null = null and bind that
  $null = null;
  $stmt->bind_param("iss", $null, $title, $message);
} else {
  // Normal integer bind
  $stmt->bind_param("iss", $employee_id, $title, $message);
}

if ($stmt->execute()) {
  echo json_encode(['status' => 'success', 'message' => 'Notification sent']);
} else {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Failed to send notification']);
}

$stmt->close();
$conn->close();
