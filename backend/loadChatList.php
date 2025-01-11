<?php
// Include database connection
include_once 'db_connection.php';

// Function to load the chat list for a user
function loadChatList($userId) {
    global $pdo; // Access the PDO connection variable

    try {
        // Prepare SQL query to get distinct conversations for the user
        $query = "
            SELECT 
                IF(sender_id = :userId, receiver_id, sender_id) AS other_user_id,
                IF(sender_id = :userId, receiver_id, sender_id) AS other_user_username,
                messages.message,
                messages.timestamp,
                users.username AS other_user_username,
                users.profile_picture AS other_user_profile_picture
            FROM messages
            JOIN users ON users.id = IF(sender_id = :userId, receiver_id, sender_id)
            WHERE sender_id = :userId OR receiver_id = :userId
            ORDER BY messages.timestamp DESC
            LIMIT 50
        ";

        // Prepare the statement
        $stmt = $pdo->prepare($query);

        // Bind the userId parameter
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);

        // Execute the query
        $stmt->execute();

        // Fetch chats
        $chats = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Check if there are any chats
        if ($chats) {
            return $chats;
        } else {
            return "No chats found.";
        }
    } catch (PDOException $e) {
        return "Error: " . $e->getMessage();
    }
}

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the userId from POST data
    $userId = $_POST['user_id'];

    // Call loadChatList function
    $response = loadChatList($userId);

    // Return response as JSON (for API use)
    header('Content-Type: application/json');
    echo json_encode($response);
}
?>

