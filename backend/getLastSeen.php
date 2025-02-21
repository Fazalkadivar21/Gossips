<?php
include_once 'db_connection.php';

// Function to get the last seen timestamp for a user
function getLastSeen($userId) {
    global $pdo; // Access the PDO connection variable

    try {
        // Prepare SQL query to get the last seen timestamp for the user
        $query = "
            SELECT updated_at
            FROM users
            WHERE id = :userId
        ";

        // Prepare the statement
        $stmt = $pdo->prepare($query);

        // Bind the userId parameter
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);

        // Execute the query
        $stmt->execute();

        // Fetch the last seen timestamp
        $lastSeen = $stmt->fetchColumn();

        // Check if the last seen timestamp exists
        if ($lastSeen) {
            return $lastSeen;
        } else {
            return "Last seen not found.";
        }
    } catch (PDOException $e) {
        return "Error: " . $e->getMessage();
    }
}

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the userId from POST data
    $userId = $_POST['user_id'];

    // Call getLastSeen function
    $response = getLastSeen($userId);

    // Return response as JSON (for API use)
    header('Content-Type: application/json');
    echo json_encode($response);
}
?>