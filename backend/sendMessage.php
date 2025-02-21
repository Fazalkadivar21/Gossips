<?php
// Include database connection
include_once 'db_connection.php';

// Function to send a message
function sendMessage($senderId, $receiverId, $message, $type = 'text', $file = null) {
    global $pdo;

    try {
        $fileId = null;
        $filePath = null;

        // Handle file upload if present
        if ($file && $file['error'] === 0) {
            // Create uploads directory if it doesn't exist
            if (!file_exists('uploads')) {
                mkdir('uploads', 0777, true);
            }

            $fileName = uniqid() . '_' . basename($file['name']);
            $uploadPath = 'uploads/' . $fileName;

            if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
                // Insert file record first
                $fileQuery = "INSERT INTO files_shared (uploader_id, file_name, file_type, file_size, file_url) VALUES (:uploaderId, :fileName, :fileType, :fileSize, :fileUrl)";
                
                $fileStmt = $pdo->prepare($fileQuery);
                $fileStmt->execute([
                    ':uploaderId' => $senderId,
                    ':fileName'   => $fileName,
                    ':fileType'   => $file['type'],
                    ':fileSize'   => $file['size'],
                    ':fileUrl'    => $uploadPath
                ]);
            
                // Get the inserted file's ID
                $fileId = $pdo->lastInsertId();
            
                // Now insert into messages with the correct file_id
                $messageQuery = "INSERT INTO messages (sender_id, receiver_id, message, type, file_id, timestamp) VALUES (:senderId, :receiverId, :message, :type, :fileId, NOW())";
            
                $messageStmt = $pdo->prepare($messageQuery);
                $messageStmt->execute([
                    ':senderId'   => $senderId,
                    ':receiverId' => $receiverId,
                    ':message'    => $fileName, 
                    ':type'       => 'file',  
                    ':fileId'     => $fileId  
                ]);
            }
            
        }

        // Insert message
        $query = "INSERT INTO messages (sender_id, receiver_id, message, type, file_id, timestamp) 
                 VALUES (:senderId, :receiverId, :message, :type, :fileId, NOW())";
        $stmt = $pdo->prepare($messageQuery);
        $stmt->execute([
            ':senderId'   => $senderId,
            ':receiverId' => $receiverId,
            ':message'    => $message, 
            ':type'       => 'file',  
            ':fileId'     => $fileId  
        ]);

        $messageId = $pdo->lastInsertId();

        // Return success response with message details
        return [
            'success' => true,
            'message' => 'Message sent successfully',
            'data' => [
                'id' => $messageId,
                'sender_id' => $senderId,
                'receiver_id' => $receiverId,
                'message' => $message,
                'type' => $type,
                'file_path' => $filePath,
                'timestamp' => date('Y-m-d H:i:s')
            ]
        ];
    } catch (PDOException $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ];
    }
}

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $senderId = $_POST['sender_id'];
    $receiverId = $_POST['receiver_id'];
    $message = $_POST['message'];
    $type = $_POST['type'] ?? 'text';
    $file = isset($_FILES['file']) ? $_FILES['file'] : null;

    // Call sendMessage function
    $response = sendMessage($senderId, $receiverId, $message, $type, $file);

    // Return response as JSON
    header('Content-Type: application/json');
    echo json_encode($response);
}
?>