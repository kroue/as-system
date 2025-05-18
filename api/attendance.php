<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS, GET");
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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $student_id = intval($data['student_id']);
    $section_id = intval($data['section_id']);
    $date = $conn->real_escape_string($data['date']);
    $status = $conn->real_escape_string($data['status']);
    $sql = "INSERT INTO attendance (student_id, section_id, date, status)
            VALUES ($student_id, $section_id, '$date', '$status')
            ON DUPLICATE KEY UPDATE status='$status'";
    if ($conn->query($sql)) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $student_id = isset($_GET['student_id']) ? intval($_GET['student_id']) : 0;
    $section_id = isset($_GET['section_id']) ? intval($_GET['section_id']) : 0;
    $where = [];
    if ($student_id) $where[] = "student_id = $student_id";
    if ($section_id) $where[] = "section_id = $section_id";
    $whereSql = $where ? "WHERE " . implode(" AND ", $where) : "";
    $result = $conn->query("SELECT date, status FROM attendance $whereSql ORDER BY date DESC");
    $records = [];
    while ($row = $result->fetch_assoc()) $records[] = $row;
    echo json_encode($records);
    exit();
}