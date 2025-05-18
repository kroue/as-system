<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

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
    if (isset($_GET['section_id'])) {
        $section_id = intval($_GET['section_id']);
        $result = $conn->query("SELECT * FROM students WHERE section_id = $section_id");
    } else {
        $result = $conn->query("SELECT * FROM students");
    }
    $students = [];
    while ($row = $result->fetch_assoc()) $students[] = $row;
    echo json_encode($students);
    exit();
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $student_id = $conn->real_escape_string($data['student_id']);
    $full_name = $conn->real_escape_string($data['full_name']);
    $gender = $conn->real_escape_string($data['gender']);
    $course_id = intval($data['course_id']);
    $section_id = intval($data['section_id']);
    $phone_number = $conn->real_escape_string($data['phone_number']);
    $sql = "INSERT INTO students (student_id, full_name, gender, course_id, section_id, phone_number)
            VALUES ('$student_id', '$full_name', '$gender', $course_id, $section_id, '$phone_number')";
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
    $student_id = $conn->real_escape_string($data['student_id']);
    $full_name = $conn->real_escape_string($data['full_name']);
    $gender = $conn->real_escape_string($data['gender']);
    $course_id = intval($data['course_id']);
    $section_id = intval($data['section_id']);
    $phone_number = $conn->real_escape_string($data['phone_number']);
    $sql = "UPDATE students SET student_id='$student_id', full_name='$full_name', gender='$gender', course_id=$course_id, section_id=$section_id, phone_number='$phone_number' WHERE id=$id";
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
    $sql = "DELETE FROM students WHERE id=$id";
    if ($conn->query($sql)) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
    exit();
}

http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
exit();