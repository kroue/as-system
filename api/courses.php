<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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
    $result = $conn->query("SELECT * FROM courses");
    $courses = [];
    while ($row = $result->fetch_assoc()) $courses[] = $row;
    echo json_encode($courses);
    exit();
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $name = $conn->real_escape_string($data['name']);
    $conn->query("INSERT INTO courses (name) VALUES ('$name')");
    echo json_encode(["success" => true, "id" => $conn->insert_id]);
    exit();
}

if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = intval($data['id']);
    $name = $conn->real_escape_string($data['name']);
    $conn->query("UPDATE courses SET name='$name' WHERE id=$id");
    echo json_encode(["success" => true]);
    exit();
}

if ($method === 'DELETE') {
    parse_str(file_get_contents("php://input"), $_DELETE);
    $id = intval($_DELETE['id']);
    $conn->query("DELETE FROM courses WHERE id=$id");
    echo json_encode(["success" => true]);
    exit();
}
?>