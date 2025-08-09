<?php
// Set CORS and content headers - send on all requests
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request and exit immediately
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database credentials
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "smarthr_proj_db";

// Connect to DB
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed."]);
    exit;
}

// Detect request method
$method = $_SERVER['REQUEST_METHOD'];
parse_str($_SERVER['QUERY_STRING'] ?? '', $query);

switch ($method) {
    case 'GET':
        $result = $conn->query("SELECT * FROM events ORDER BY date ASC");
        $events = [];
        while ($row = $result->fetch_assoc()) {
            $events[] = $row;
        }
        echo json_encode($events);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        $title = $conn->real_escape_string($data->title);
        $date = $conn->real_escape_string($data->date);
        $time = $conn->real_escape_string($data->time);
        $description = $conn->real_escape_string($data->description);

        $sql = "INSERT INTO events (title, date, time, description) VALUES ('$title', '$date', '$time', '$description')";
        if ($conn->query($sql)) {
            echo json_encode(["message" => "Event added successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to add event."]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        $id = intval($data->id);
        $title = $conn->real_escape_string($data->title);
        $date = $conn->real_escape_string($data->date);
        $time = $conn->real_escape_string($data->time);
        $description = $conn->real_escape_string($data->description);

        $sql = "UPDATE events SET title='$title', date='$date', time='$time', description='$description' WHERE id=$id";
        if ($conn->query($sql)) {
            echo json_encode(["message" => "Event updated."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Update failed."]);
        }
        break;

    case 'DELETE':
        $id = intval($query['id'] ?? 0);
        if ($id) {
            $sql = "DELETE FROM events WHERE id=$id";
            if ($conn->query($sql)) {
                echo json_encode(["message" => "Event deleted."]);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Delete failed."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Missing event ID."]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
}
?>
