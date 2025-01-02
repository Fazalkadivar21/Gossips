<?php
// Include database connection
include_once 'db_connection.php';

// Function to load messages between two users
function loadChat($userId, $otherUserId, $limit = 50, $offset = 0) {
    global $conn; // Access the connection variable

    // Prepare SQL query to get messages between the two users
    $query = "
        SELECT 
            messages.id,
            messages.sender_id,
            messages.receiver_id,
            messages.message,
            messages.type,
            messages.file_id,
            messages.timestamp,
            files_shared.file_path
        FROM messages
        LEFT JOIN files_shared ON messages.file_id = files_shared.id
        WHERE (messages.sender_id = ? AND messages.receiver_id = ?) 
            OR (messages.sender_id = ? AND messages.receiver_id = ?)
        ORDER BY messages.timestamp ASC
        LIMIT ? OFFSET ?
    ";

    // Prepare and bind parameters
    $stmt = $conn->prepare($query);
    $stmt->bind_param("iiiiii", $userId, $otherUserId, $otherUserId, $userId, $limit, $offset);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if there are any messages
    if ($result->num_rows > 0) {
        $messages = [];
        
        // Fetch message data and add it to the response array
        while ($message = $result->fetch_assoc()) {
            $messages[] = [
                'id' => $message['id'],
                'sender_id' => $message['sender_id'],
                'receiver_id' => $message['receiver_id'],
                'message' => $message['message'],
                'type' => $message['type'],
                'file_id' => $message['file_id'],
                'timestamp' => $message['timestamp'],
                'file_path' => $message['file_path']
            ];
        }

        return $messages;
    } else {
        return "No messages found.";
    }
}

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the userId and otherUserId from POST data
    $userId = $_POST['user_id'];
    $otherUserId = $_POST['other_user_id'];
    $limit = isset($_POST['limit']) ? $_POST['limit'] : 50; // Default limit
    $offset = isset($_POST['offset']) ? $_POST['offset'] : 0; // Default offset

    // Call loadChat function
    $response = loadChat($userId, $otherUserId, $limit, $offset);

    // Return response as JSON (for API use)
    header('Content-Type: application/json');
    echo json_encode($response);
}
?>

