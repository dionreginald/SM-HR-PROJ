<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "smarthr_proj_db";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}
