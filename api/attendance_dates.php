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

$sql = "SELECT DISTINCT date FROM attendance WHERE section_id = $section_id ORDER BY date DESC";
$result = $conn->query($sql);

$dates = [];
while ($row = $result->fetch_assoc()) {
    $dates[] = $row['date'];
}

echo json_encode($dates);
$conn->close();
?>