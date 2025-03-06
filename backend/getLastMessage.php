<?php
// Include database connection
include_once 'db_connection.php';

// Function to get the last message between two users
function getLastMessage($senderId, $receiverId) {
    global $pdo; // Access the PDO connection variable

    try {
        // SQL query to get the last message between the two users
        $query = "
            SELECT message
            FROM messages
            WHERE (sender_id = :senderId AND receiver_id = :receiverId)
               OR (sender_id = :receiverId AND receiver_id = :senderId)
            ORDER BY timestamp DESC
            LIMIT 1
        ";

        // Prepare the statement
        $stmt = $pdo->prepare($query);

        // Bind parameters
        $stmt->bindParam(':senderId', $senderId, PDO::PARAM_INT);
        $stmt->bindParam(':receiverId', $receiverId, PDO::PARAM_INT);

        // Execute the query
        $stmt->execute();

        // Fetch the last message
        $message = $stmt->fetch(PDO::FETCH_ASSOC);

        // Check if a message was found
        if ($message) {
            return $message['message']; // Return the message text
        } else {
            return null; // No messages found
        }
    } catch (PDOException $e) {
        // Return error message if something goes wrong
        return "Error: " . $e->getMessage();
    }
}

// Check if the request is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get sender_id and receiver_id from the POST data
    $senderId = $_POST['sender_id'];
    $receiverId = $_POST['receiver_id'];
// 
    // Call the function to get the last message
    $lastMessage = getLastMessage($senderId, $receiverId);
// 
    // Return response as JSON (for API use)
    header('Content-Type: application/json');
    echo json_encode($lastMessage);
}
?>
