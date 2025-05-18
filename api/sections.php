<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "asdb");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $result = $conn->query("SELECT * FROM sections");
    if (!$result) {
        http_response_code(500);
        echo json_encode(["error" => $conn->error]);
        exit();
    }
    $sections = [];
    while ($row = $result->fetch_assoc()) $sections[] = $row;
    echo json_encode($sections);
    exit();
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $name = $conn->real_escape_string($data['name']);
    $course_id = intval($data['course_id']);
    $teacher_id = isset($data['teacher_id']) ? intval($data['teacher_id']) : 'NULL';
    $sql = "INSERT INTO sections (name, course_id, teacher_id) VALUES ('$name', $course_id, $teacher_id)";
    if ($conn->query($sql)) {
        echo json_encode(["success" => true, "id" => $conn->insert_id]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
    exit();
}

if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = intval($data['id']);
    $name = $conn->real_escape_string($data['name']);
    $course_id = intval($data['course_id']);
    $teacher_id = isset($data['teacher_id']) ? intval($data['teacher_id']) : 'NULL';
    $sql = "UPDATE sections SET name='$name', course_id=$course_id, teacher_id=$teacher_id WHERE id=$id";
    if ($conn->query($sql)) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
    exit();
}

if ($method === 'DELETE') {
    parse_str(file_get_contents("php://input"), $_DELETE);
    $id = intval($_DELETE['id']);
    $sql = "DELETE FROM sections WHERE id=$id";
    if ($conn->query($sql)) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
    exit();
}

// If method not handled
http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
exit();
?>