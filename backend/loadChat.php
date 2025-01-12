<?php
// Include database connection
include_once 'db_connection.php';

// Function to load messages between two users
function loadChat($userId, $otherUserId, $limit = 50, $offset = 0) {
    global $pdo; // Access the PDO connection variable

    try {
        // Prepare SQL query to get messages between the two users
        $query = "
    SELECT 
        messages.id,
        messages.sender_id,
        messages.receiver_id,
        messages.message,
        messages.type,
        messages.file_id,
        messages.timestamp
    FROM messages
    WHERE (messages.sender_id = :userId AND messages.receiver_id = :otherUserId) 
        OR (messages.sender_id = :otherUserId AND messages.receiver_id = :userId)
    ORDER BY messages.timestamp ASC
    LIMIT :limit OFFSET :offset
";
        // Prepare the statement
        $stmt = $pdo->prepare($query);

        // Bind the parameters
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':otherUserId', $otherUserId, PDO::PARAM_INT);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);

        // Execute the query
        $stmt->execute();

        // Fetch messages
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Check if there are any messages
        if ($messages) {
            return $messages;
        } else {
            return "No messages found.";
        }
    } catch (PDOException $e) {
        return "Error: " . $e->getMessage();
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

