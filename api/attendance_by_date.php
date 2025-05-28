<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "asdb");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([]);
    exit();
}

$section_id = intval($_GET['section_id'] ?? 0);
$date = $conn->real_escape_string($_GET['date'] ?? '');

$sql = "SELECT s.id, s.full_name, 
        COALESCE(a.status, 'Absent') AS status
        FROM students s
        LEFT JOIN attendance a 
            ON a.student_id = s.id AND a.section_id = $section_id AND a.date = '$date'
        WHERE s.section_id = $section_id";

$result = $conn->query($sql);

$students = [];
while ($row = $result->fetch_assoc()) {
    $students[] = $row;
}

echo json_encode($students);
$conn->close();
?>