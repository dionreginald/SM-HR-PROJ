<?php
// Headers for CORS and JSON response
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Database connection
$conn = new mysqli('localhost', 'root', '', 'smarthr_proj_db'); // <-- Using smarthr_proj_db as per your file
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB connection failed: ' . $conn->connect_error]);
    exit;
}

// Get the HTTP method
$method = $_SERVER['REQUEST_METHOD'];

// Handle OPTIONS preflight request
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

switch ($method) {

    // Add a new task
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['employee_id'], $data['title'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields: employee_id and title']);
            exit;
        }

        $employee_id = $data['employee_id'];
        $title = $data['title'];
        $description = $data['description'] ?? null; // Use null if empty string or not set
        $due_date = $data['due_date'] ?? null;       // Use null if empty string or not set
        $priority = $data['priority'] ?? 'Normal';
        $status = 'pending'; // New tasks always start as pending

        $stmt = $conn->prepare("INSERT INTO employee_tasks (employee_id, title, description, due_date, priority, status) VALUES (?, ?, ?, ?, ?, ?)");
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
            exit;
        }

        // 'isssss' corresponds to integer, string, string, string, string, string
        $stmt->bind_param("isssss", $employee_id, $title, $description, $due_date, $priority, $status);

        if ($stmt->execute()) {
            http_response_code(201); // 201 Created
            echo json_encode(['message' => 'Task added successfully', 'task_id' => $stmt->insert_id]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $stmt->error]);
        }

        $stmt->close();
        break;

    // Get tasks by employee ID
    case 'GET':
        if (isset($_GET['employee_id'])) {
            $employee_id = intval($_GET['employee_id']);

            // Order by status (pending first), then by due_date (earliest first), then by id (newest first for same due_date)
            $stmt = $conn->prepare("SELECT id, employee_id, title, description, status, due_date, priority, created_at FROM employee_tasks WHERE employee_id = ? ORDER BY FIELD(status, 'pending', 'completed'), due_date ASC, id DESC");
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
                exit;
            }

            $stmt->bind_param("i", $employee_id);
            if ($stmt->execute()) {
                $result = $stmt->get_result();
                $tasks = $result->fetch_all(MYSQLI_ASSOC);
                echo json_encode($tasks);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Database error: ' . $stmt->error]);
            }

            $stmt->close();
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'employee_id is required']);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);

        // Check if it's a simple status toggle or a full task edit
        // A simple status toggle request usually only sends task_id, employee_id, and status
        // A full edit request will send more fields like title, description, etc.
        // We can infer based on the presence of 'status' and other fields.

        if (isset($data['task_id']) && isset($data['employee_id'])) {
            $task_id = $data['task_id'];
            $employee_id = $data['employee_id'];

            if (isset($data['status']) && count($data) === 3) {
                // This is a status toggle request (e.g., from checkbox)
                $new_status = $data['status'];

                $stmt = $conn->prepare("UPDATE employee_tasks SET status = ? WHERE id = ? AND employee_id = ?");
                if (!$stmt) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Prepare failed for status update: ' . $conn->error]);
                    exit;
                }

                $stmt->bind_param("sii", $new_status, $task_id, $employee_id);

                if ($stmt->execute()) {
                    if ($stmt->affected_rows > 0) {
                        echo json_encode(['message' => 'Task status updated successfully']);
                    } else {
                        http_response_code(404);
                        echo json_encode(['error' => 'Task not found or status already set']);
                    }
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Database error during status update: ' . $stmt->error]);
                }
                $stmt->close();
                // Important: Exit after handling the status update to prevent falling through
                exit;
            } else if (isset($data['title'])) {
                // This is a full task edit request (e.g., from the edit modal)
                $title = $data['title'];
                $description = $data['description'] ?? null; // Use null if empty string or not set
                $due_date = $data['due_date'] ?? null;       // Use null if empty string or not set
                $priority = $data['priority'] ?? 'Normal';

                $stmt = $conn->prepare("UPDATE employee_tasks SET title = ?, description = ?, due_date = ?, priority = ? WHERE id = ? AND employee_id = ?");
                if (!$stmt) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Prepare failed for full task update: ' . $conn->error]);
                    exit;
                }

                // "ssssii" for string title, string description, string due_date, string priority, int task_id, int employee_id
                $stmt->bind_param("ssssii", $title, $description, $due_date, $priority, $task_id, $employee_id);

                if ($stmt->execute()) {
                    if ($stmt->affected_rows > 0) {
                        echo json_encode(['message' => 'Task updated successfully']);
                    } else {
                        // If affected_rows is 0, it means the task was not found or no data changed
                        http_response_code(200); // Still 200 OK if the request was valid, just no changes applied
                        echo json_encode(['message' => 'Task found, but no changes were applied (data was identical).']);
                    }
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Database error during full task update: ' . $stmt->error]);
                }
                $stmt->close();
                // Important: Exit after handling the full task update
                exit;
            } else {
                // If task_id and employee_id are present but no 'status' or 'title'
                http_response_code(400);
                echo json_encode(['error' => 'Invalid PUT request. Missing status or title for update.']);
                exit;
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Missing task_id or employee_id for PUT request.']);
            exit;
        }
        break;

    // Delete a task
    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true); // DELETE can also use body now

        if (!isset($data['task_id'], $data['employee_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing task_id or employee_id']);
            exit;
        }

        $task_id = $data['task_id'];
        $employee_id = $data['employee_id'];

        $stmt = $conn->prepare("DELETE FROM employee_tasks WHERE id = ? AND employee_id = ?");
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
            exit;
        }

        $stmt->bind_param("ii", $task_id, $employee_id);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode(['message' => 'Task deleted successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Task not found']);
            }
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $stmt->error]);
        }

        $stmt->close();
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method not allowed']);
        break;
}

$conn->close();
?>