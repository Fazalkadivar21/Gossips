<?php
// Include database connection
include_once 'db_connection.php';

// Function to load the chat list for a user
function loadChatList($userId) {
    global $conn; // Access the connection variable

    // Prepare SQL query to get distinct conversations for the user
    $query = "
        SELECT 
            IF(sender_id = ?, receiver_id, sender_id) AS other_user_id,
            IF(sender_id = ?, receiver_id, sender_id) AS other_user_username,
            messages.message,
            messages.timestamp,
            users.username AS other_user_username,
            users.profile_picture AS other_user_profile_picture
        FROM messages
        JOIN users ON users.id = IF(sender_id = ?, receiver_id, sender_id)
        WHERE sender_id = ? OR receiver_id = ?
        ORDER BY messages.timestamp DESC
        LIMIT 50
    ";

    // Prepare and bind parameters
    $stmt = $conn->prepare($query);
    $stmt->bind_param("iiiiii", $userId, $userId, $userId, $userId, $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if there are any chats
    if ($result->num_rows > 0) {
        $chats = [];
        
        // Fetch chat data and add it to the response array
        while ($chat = $result->fetch_assoc()) {
            $chats[] = [
                'other_user_id' => $chat['other_user_id'],
                'other_user_username' => $chat['other_user_username'],
                'last_message' => $chat['message'],
                'last_message_time' => $chat['timestamp'],
                'profile_picture' => $chat['other_user_profile_picture']
            ];
        }

        return $chats;
    } else {
        return "No chats found.";
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

