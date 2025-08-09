<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS headers to allow your React frontend (running on localhost:3000) to access this API
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db.php';
require 'vendor/autoload.php'; // Make sure PHPMailer is installed with Composer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Read JSON input from React
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'Missing employee ID']);
    exit;
}

$employeeId = intval($data['id']);

// Fetch employee email and full name from DB
$stmt = $conn->prepare("SELECT email, full_name FROM employees WHERE id = ?");
$stmt->bind_param("i", $employeeId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Employee not found']);
    exit;
}

$employee = $result->fetch_assoc();
$to = $employee['email'];
$name = $employee['full_name'];
$username = $to; // Username is the email address

// Generate a secure temporary password (8 characters)
$tempPassword = bin2hex(random_bytes(4)); // 8 hex chars

// Hash the temp password before storing
$hashedTempPassword = password_hash($tempPassword, PASSWORD_DEFAULT);

// Save hashed password in DB
$updateStmt = $conn->prepare("UPDATE employees SET password_hash = ? WHERE id = ?");
$updateStmt->bind_param("si", $hashedTempPassword, $employeeId);
$updateStmt->execute();
$updateStmt->close();

// Prepare and send the email
$mail = new PHPMailer(true);

try {
    // SMTP config
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'projectsmarthr@gmail.com'; // Your Gmail address
    $mail->Password   = 'tjzj ojte axyc cvlk';       // App password (NOT your Gmail login password)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // Sender and recipient
    $mail->setFrom('projectsmarthr@gmail.com', 'SmartHR Admin');
    $mail->addAddress($to, $name);

    // Email content
    $mail->isHTML(true);
    $mail->Subject = 'Welcome to SmartHR - Your Access Credentials';

    $mail->Body = "
    <div style='font-family: \"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif; color: #1C1C1E; line-height: 1.5; background-color: #F8F8F8; padding: 30px 0;'>
        <div style='max-width: 600px; margin: auto; background-color: #FFFFFF; border-radius: 15px; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08); overflow: hidden;'>

            <div style='background: linear-gradient(to right, #4CAF50, #66BB6A); padding: 25px 30px; text-align: center; border-bottom: 1px solid #E0E0E0;'>
                <h1 style='color: #FFFFFF; margin: 0; font-size: 28px; font-weight: 600;'>Welcome to SmartHR, {$name}!</h1>
                <p style='color: #E6F0F8; font-size: 16px; margin-top: 8px; opacity: 0.9;'>Your journey with us begins now.</p>
            </div>

            <div style='padding: 30px;'>
                <p style='font-size: 17px; color: #3A3A3C;'>We're absolutely thrilled to have you join our team and embark on this new journey with us. At SmartHR, we're dedicated to creating a supportive and dynamic environment, and we're excited to see the contributions you'll bring.</p>

                <p style='font-size: 17px; color: #3A3A3C;'>To help you get started, here are your essential login credentials for the SmartHR Employee Portal:</p>

                <table style='width: 100%; border-collapse: separate; border-spacing: 0; margin: 30px 0; background-color: #FDFDFD; border-radius: 10px; overflow: hidden; border: 1px solid #E5E5EA;'>
                    <tr>
                        <td style='padding: 15px 20px; font-weight: 500; background-color: #F5F5F7; width: 40%; color: #636366; border-right: 1px solid #E5E5EA; border-bottom: 1px solid #E5E5EA;'>Username (Email):</td>
                        <td style='padding: 15px 20px; background-color: #FFFFFF; word-break: break-all; color: #4CAF50; font-weight: 600; border-bottom: 1px solid #E5E5EA;'><strong>{$username}</strong></td>
                    </tr>
                    <tr>
                        <td style='padding: 15px 20px; font-weight: 500; background-color: #F5F5F7; color: #636366; border-right: 1px solid #E5E5EA;'>Temporary Password:</td>
                        <td style='padding: 15px 20px; background-color: #FFFFFF; word-break: break-all; color: #E53935; font-weight: 600;'><strong>{$tempPassword}</strong></td>
                    </tr>
                </table>

                <p style='text-align: center; margin-top: 40px;'>
                    <a href='http://localhost:3000/employee-login'
                      style='display: inline-block; padding: 15px 30px; background: linear-gradient(to top, #4CAF50, #81C784); color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 17px; transition: all 0.2s ease-in-out; box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);'>
                        Log In to SmartHR Employee Portal
                    </a>
                </p>

                <p style='font-size: 15px; color: #8E8E93; text-align: center; margin-top: 30px;'>
                    For enhanced security, we recommend you change your password after your first login. You can easily do this by navigating to your <strong>Profile</strong> section within the portal.
                </p>

                <p style='margin-top: 30px; font-size: 16px; color: #3A3A3C;'>Should you need any assistance or have questions as you settle in, please don't hesitate to reach out. We're here to support you every step of the way!</p>
            </div>

            <div style='background-color: #F5F5F7; padding: 25px 30px; text-align: center; border-top: 1px solid #EFEFF4;'>
                <p style='margin: 0; font-size: 14px; color: #8E8E93;'>Best regards,<br>The SmartHR Team</p>
                <p style='margin-top: 15px; font-size: 13px;'>
                    <a href='https://yourcompany.com/privacy' style='color: #4CAF50; text-decoration: none; margin: 0 8px;'>Privacy Policy</a> |
                    <a href='https://yourcompany.com/support' style='color: #4CAF50; text-decoration: none; margin: 0 8px;'>Support</a>
                </p>
            </div>

        </div>
    </div>
    ";

    $mail->send();

    echo json_encode(['success' => true, 'message' => 'Access credentials sent successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => "Mailer Error: {$mail->ErrorInfo}"]);
}
