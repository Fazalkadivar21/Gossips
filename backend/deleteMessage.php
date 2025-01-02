<?php
// Include database connection
include_once 'db_connection.php';

// Function to delete a message by its ID
function deleteMessage($messageId, $userId) {
    global $conn; // Access the connection variable

    // Prepare SQL query to check if the message exists and belongs to the user
    $query = "SELECT sender_id FROM messages WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $messageId);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if the message exists and if the user is the sender
    if ($result->num_rows > 0) {
        $message = $result->fetch_assoc();
        if ($message['sender_id'] == $userId) {
            // Message belongs to the user, delete it
            $deleteQuery = "DELETE FROM messages WHERE id = ?";
            $deleteStmt = $conn->prepare($deleteQuery);
            $deleteStmt->bind_param("i", $messageId);
            if ($deleteStmt->execute()) {
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

