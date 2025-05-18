<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "asdb");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $conn->real_escape_string($data['email']);
    $password = $data['password'];

    $result = $conn->query("SELECT * FROM teachers WHERE email='$email' LIMIT 1");
    if ($row = $result->fetch_assoc()) {
        if (password_verify($password, $row['password'])) {
            unset($row['password']);
            echo json_encode(["success" => true, "teacher" => $row]);
        } else {
            echo json_encode(["success" => false, "error" => "Invalid credentials"]);
        }
    }
    exit();
}
?>