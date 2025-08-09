<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db.php';

$input = json_decode(file_get_contents('php://input'), true);

$sender_id = isset($input['sender_id']) ? intval($input['sender_id']) : null;
$sender_type = isset($input['sender_type']) ? $conn->real_escape_string($input['sender_type']) : null;
$receiver_id = isset($input['receiver_id']) ? intval($input['receiver_id']) : null;
$receiver_type = isset($input['receiver_type']) ? $conn->real_escape_string($input['receiver_type']) : null;
$content = isset($input['content']) ? $conn->real_escape_string($input['content']) : '';

if (!$sender_id || !$receiver_id || !$content || !$sender_type || !$receiver_type) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$sql = "INSERT INTO messages (sender_id, sender_type, receiver_id, receiver_type, message, timestamp, seen) 
        VALUES (?, ?, ?, ?, ?, NOW(), 0)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'SQL prepare error: ' . $conn->error]);
    exit;
}

$stmt->bind_param("issss", $sender_id, $sender_type, $receiver_id, $receiver_type, $content);

if ($stmt->execute()) {
    $inserted_id = $stmt->insert_id;
    echo json_encode([
        'success' => true,
        'message' => [
            'id' => $inserted_id,
            'sender_id' => $sender_id,
            'sender_type' => $sender_type,
            'receiver_id' => $receiver_id,
            'receiver_type' => $receiver_type,
            'content' => $content,
            'timestamp' => date('Y-m-d H:i:s')
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to send message']);
}
?>
