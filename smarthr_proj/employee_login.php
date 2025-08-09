<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Read raw input and decode JSON
$input = json_decode(file_get_contents('php://input'), true);

// Check for valid input
if (!$input || !isset($input['email']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Missing email or password"
    ]);
    exit();
}

$email = trim($input['email']);
$password = $input['password'];

// Connect to the database
$conn = new mysqli("localhost", "root", "", "smarthr_proj_db");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit();
}

// Prepare and execute query
$stmt = $conn->prepare("SELECT * FROM employees WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows !== 1) {
    http_response_code(404);
    echo json_encode([
        "success" => false,
        "message" => "Employee not found"
    ]);
    $stmt->close();
    $conn->close();
    exit();
}

$user = $result->fetch_assoc();

// Verify password
if (!password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Incorrect password"
    ]);
    $stmt->close();
    $conn->close();
    exit();
}

// Remove sensitive data
unset($user['password_hash']);

// Return success with user data
echo json_encode([
    "success" => true,
    "message" => "Login successful",
    "user" => $user
]);

$stmt->close();
$conn->close();
