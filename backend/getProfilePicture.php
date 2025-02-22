<?php
include_once 'db_connection.php';

function getProfilePicture($userId) {
    global $pdo;

    try {
        $query = "
            SELECT profile_picture
            FROM users
            WHERE id = :userId
        ";

        $stmt = $pdo->prepare($query);

        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);

        $stmt->execute();

        $profilePicture = $stmt->fetchColumn();
        if ($profilePicture) {
            return "http://localhost:5000/backend/$profilePicture";
        } else {
            echo "Profile picture not found.";
        }
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
    
}
// echo getProfilePicture(3);
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $userId = $_POST['user_id'];

    // Call getLastSeen function
    $response = getProfilePicture($userId);

    // Return response as JSON (for API use)
    header('Content-Type: application/json');
    echo json_encode($response);
}