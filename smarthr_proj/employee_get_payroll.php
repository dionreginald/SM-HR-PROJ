<?php
session_start();
require_once 'db.php'; // Make sure this connects to your database

// Check if the user is logged in and has an employee_id
if (!isset($_SESSION['employee_id'])) {
    echo "You must be logged in to view your payroll.";
    exit;
}

$employee_id = $_SESSION['employee_id']; // Get the logged-in employee's ID from session

// SQL query to fetch payroll details for the logged-in employee
$sql = "SELECT * FROM payrolls WHERE employee_id = ? ORDER BY year DESC, month DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $employee_id);
$stmt->execute();
$result = $stmt->get_result();

// Fetch all payroll records
$payrolls = [];
while ($row = $result->fetch_assoc()) {
    $payrolls[] = $row;
}

$stmt->close();
$conn->close();

// Return payrolls as JSON to use in JavaScript
echo json_encode($payrolls);
?>
