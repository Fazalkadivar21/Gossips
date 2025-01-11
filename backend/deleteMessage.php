<?php
// Include database connection
include_once 'db_connection.php';

// Function to delete a message by its ID
function deleteMessage($messageId, $userId) {
    global $pdo; // Access the PDO connection variable

    try {
        // Check if the message exists and belongs to the user
        $query = "SELECT sender_id FROM messages WHERE id = :message_id";
        $stmt = $pdo->prepare($query);
        $stmt->execute([':message_id' => $messageId]);
        $message = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($message) {
            if ($message['sender_id'] == $userId) {
                // Message belongs to the user, delete it
                $deleteQuery = "DELETE FROM messages WHERE id = :message_id";
                $deleteStmt = $pdo->prepare($deleteQuery);
                $deleteStmt->execute([':message_id' => $messageId]);

                if ($deleteStmt->rowCount() > 0) {
                    return "Message deleted successfully.";
                } else {
                    return "Failed to delete message.";
                }
            } else {
                return "You can only delete your own messages.";
            }
        } else {
            return "Message not found.";
        }
    } catch (PDOException $e) {
        return "Error: " . $e->getMessage();
    }
}

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the messageId and userId from POST data
    $messageId = $_POST['message_id'];
    $userId = $_POST['user_id'];

    // Call deleteMessage function
    $response = deleteMessage($messageId, $userId);

    // Return response as JSON (for API use)
    header('Content-Type: application/json');
    echo json_encode(['message' => $response]);
}
?>

