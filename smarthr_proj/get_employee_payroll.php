<?php
// Allow requests from your frontend
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  http_response_code(200);
  exit();
}

$conn = new mysqli("localhost", "root", "", "smarthr_proj_db");

$employee_id = $_GET['employee_id'] ?? null;

if (!$employee_id) {
  echo json_encode(['status' => 'error', 'message' => 'Missing employee ID']);
  exit;
}

$sql = "SELECT * FROM payrolls WHERE employee_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $employee_id);
$stmt->execute();
$result = $stmt->get_result();

$payslips = [];
while ($row = $result->fetch_assoc()) {
  $payslips[] = $row;
}

echo json_encode(['status' => 'success', 'data' => $payslips]);

$stmt->close();
$conn->close();
?>
