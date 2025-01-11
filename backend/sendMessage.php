<?php
// Include database connection
include_once 'db_connection.php';

// Function to send a message
function sendMessage($senderId, $receiverId, $content, $type = 'text', $fileId = null) {
    global $pdo; // Access the PDO connection variable

    try {
        // Prepare SQL query to insert the new message
        $query = "INSERT INTO messages (sender_id, receiver_id, message, type, file_id, timestamp, is_read) 
                  VALUES (:senderId, :receiverId, :content, :type, :fileId, NOW(), 0)";

        // Prepare the statement
        $stmt = $pdo->prepare($query);

        // Bind parameters
        $stmt->bindParam(':senderId', $senderId, PDO::PARAM_INT);
        $stmt->bindParam(':receiverId', $receiverId, PDO::PARAM_INT);
        $stmt->bindParam(':content', $content, PDO::PARAM_STR);
        $stmt->bindParam(':type', $type, PDO::PARAM_STR);
        $stmt->bindParam(':fileId', $fileId, PDO::PARAM_INT);

        // Execute the query
        if ($stmt->execute()) {
            return "Message sent successfully.";
        } else {
            return "Failed to send message.";
        }
    } catch (PDOException $e) {
        // Return the error message
        return "Error: " . $e->getMessage();
    }
}

// Check if the request method is POST (to send data)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get data from the POST request
    $senderId = $_POST['sender_id'];
    $receiverId = $_POST['receiver_id'];
    $content = $_POST['content'];
    $type = $_POST['type']; // 'text', 'media', 'file'
    $fileId = isset($_POST['file_id']) ? $_POST['file_id'] : null; // For file/media messages

    // Call sendMessage function
    $response = sendMessage($senderId, $receiverId, $content, $type, $fileId);

    // Return the response as JSON (for API use)
    header('Content-Type: application/json');
    echo json_encode(['message' => $response]);
}
?>

