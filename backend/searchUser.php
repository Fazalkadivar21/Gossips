<?php
// Include database connection
include_once 'db_connection.php';

// Function to search users
function searchUsers($query, $currentUserId) {
    global $pdo; // Use the PDO connection

    // Prepare SQL query to search users
    $searchQuery = "
        SELECT 
            id,
            username,
            profile_picture,
            is_online,
            last_active
        FROM users
        WHERE 
            id != :current_user_id AND
            username LIKE :search_term
        LIMIT 20
    ";

    // Add wildcard to search query
    $searchTerm = "%$query%";

    try {
        // Prepare the statement
        $stmt = $pdo->prepare($searchQuery);

        // Bind the parameters
        $stmt->bindParam(':current_user_id', $currentUserId, PDO::PARAM_INT);
        $stmt->bindParam(':search_term', $searchTerm, PDO::PARAM_STR);

        // Execute the query
        $stmt->execute();

        // Fetch results
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Return users if found, else return empty array
        return $users;

    } catch (PDOException $e) {
        // Handle exception (e.g., log it)
        return [];
    }
}

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $query = $_POST['query'];
    $currentUserId = $_POST['user_id'];

    // Call searchUsers function
    $response = searchUsers($query, $currentUserId);

    // Return response as JSON
    header('Content-Type: application/json');
    echo json_encode($response);
}
?>

