<?php
// Allow requests from frontend
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database config
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "smarthr_proj_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]);
    exit();
}

// Get and sanitize username from query parameters
$adminUsername = isset($_GET['username']) ? trim($_GET['username']) : '';

if (empty($adminUsername)) {
    echo json_encode([
        'success' => false,
        'message' => 'Username parameter is required.'
    ]);
    exit();
}

// Use prepared statement to prevent SQL injection
$stmt = $conn->prepare("SELECT company_name, registration_number, address, contact_number, logo_url 
                        FROM admins 
                        WHERE username = ? 
                        LIMIT 1");
$stmt->bind_param("s", $adminUsername);
$stmt->execute();
$result = $stmt->get_result();

// Handle response
if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode([
        'success' => true,
        'company_name' => $row['company_name'],
        'registration_number' => $row['registration_number'],
        'address' => $row['address'],
        'contact_number' => $row['contact_number'],
        'logo_url' => $row['logo_url']
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'No admin/company info found for user: ' . htmlspecialchars($adminUsername)
    ]);
}

// Clean up
$stmt->close();
$conn->close();
