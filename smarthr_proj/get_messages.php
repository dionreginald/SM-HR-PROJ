<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db.php';

$employee_id = isset($_GET['employee_id']) ? intval($_GET['employee_id']) : null;
$employee_type = 'employee'; // fixed for employee messages
$admin_id = isset($_GET['admin_id']) ? intval($_GET['admin_id']) : null;
$admin_type = 'admin';

if (!$employee_id || !$admin_id) {
    echo json_encode(['success' => false, 'message' => 'Missing required parameters']);
    exit;
}

// Fetch messages between this employee and admin in both directions
$sql = "SELECT * FROM messages 
        WHERE (sender_id = ? AND sender_type = ? AND receiver_id = ? AND receiver_type = ?)
           OR (sender_id = ? AND sender_type = ? AND receiver_id = ? AND receiver_type = ?)
        ORDER BY timestamp ASC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("isisisis", $employee_id, $employee_type, $admin_id, $admin_type, $admin_id, $admin_type, $employee_id, $employee_type);
$stmt->execute();

$result = $stmt->get_result();
$messages = [];

while ($row = $result->fetch_assoc()) {
    $messages[] = $row;
}

echo json_encode(['success' => true, 'messages' => $messages]);
?>
