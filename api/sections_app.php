<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

// GET: Fetch all sections, or only those for a specific teacher if teacher_id is provided
if ($method === 'GET') {
    if (isset($_GET['teacher_id'])) {
        $teacher_id = intval($_GET['teacher_id']);
        $result = $conn->query("SELECT * FROM sections WHERE teacher_id = $teacher_id");
        $sections = [];
        while ($row = $result->fetch_assoc()) $sections[] = $row;
        echo json_encode($sections);
        exit();
    }
    echo json_encode([]);
    exit();
}

http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
exit();