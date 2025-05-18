<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "asdb");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $result = $conn->query("SELECT id, name, email FROM teachers");
    $teachers = [];
    while ($row = $result->fetch_assoc()) $teachers[] = $row;
    echo json_encode($teachers);
    exit();
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $name = $conn->real_escape_string($data['name']);
    $email = $conn->real_escape_string($data['email']);
    $password = password_hash($data['password'], PASSWORD_DEFAULT);
    $conn->query("INSERT INTO teachers (name, email, password) VALUES ('$name', '$email', '$password')");
    echo json_encode(["success" => true, "id" => $conn->insert_id]);
    exit();
}

if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = intval($data['id']);
    $name = $conn->real_escape_string($data['name']);
    $email = $conn->real_escape_string($data['email']);
    $conn->query("UPDATE teachers SET name='$name', email='$email' WHERE id=$id");
    echo json_encode(["success" => true]);
    exit();
}

if ($method === 'DELETE') {
    parse_str(file_get_contents("php://input"), $_DELETE);
    $id = intval($_DELETE['id']);
    $conn->query("DELETE FROM teachers WHERE id=$id");
    echo json_encode(["success" => true]);
    exit();
}
?>