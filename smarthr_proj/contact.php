<?php
// Set headers for CORS and JSON response
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); // Allows requests from any origin
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow POST and OPTIONS methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow Content-Type and Authorization headers

// Handle pre-flight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection details (from your provided code)
$servername = "localhost";
$username = "root";
$password = ""; // Your WAMP MySQL root password (often empty by default)
$dbname = "smarthr_proj_db";

// Create database connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    // Log error for debugging, but don't expose sensitive info to client
    error_log("Database connection failed: " . $conn->connect_error);
    echo json_encode(['success' => false, 'message' => 'Database connection failed. Please try again later.']);
    exit;
}

// Get JSON input from the request body
$data = json_decode(file_get_contents('php://input'), true);

// Sanitize and validate input
$name = $conn->real_escape_string($data['name'] ?? '');
$email = $conn->real_escape_string($data['email'] ?? '');
$subject = $conn->real_escape_string($data['subject'] ?? '');
$message = $conn->real_escape_string($data['message'] ?? '');

// Basic validation
if (empty($name) || empty($email) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Name, email, and message are required fields.']);
    exit;
}

// Optional: More robust email validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
    exit;
}

// Prepare SQL statement to prevent SQL injection (using prepared statements is better for security, but for simplicity, I'm using real_escape_string as in your example)
$sql = "INSERT INTO contact_messages (name, email, subject, message)
        VALUES ('$name', '$email', '$subject', '$message')";

// Execute the query
if ($conn->query($sql)) {
    echo json_encode(['success' => true, 'message' => 'Your message has been sent successfully!']);
} else {
    // Log error for debugging
    error_log("Error inserting contact message: " . $conn->error);
    echo json_encode(['success' => false, 'message' => 'Failed to send your message. Please try again.']);
}

// Close the database connection
$conn->close();
?>