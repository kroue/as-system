<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "asdb"); // <-- Use your real credentials
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

$result = $conn->query("SELECT 
    (SELECT COUNT(*) FROM courses) AS courses,
    (SELECT COUNT(*) FROM sections) AS sections,
    (SELECT COUNT(*) FROM teachers) AS teachers,
    (SELECT COUNT(*) FROM students) AS students
");
if ($row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo json_encode(["courses"=>0,"sections"=>0,"teachers"=>0,"students"=>0]);
}
$conn->close();
?>