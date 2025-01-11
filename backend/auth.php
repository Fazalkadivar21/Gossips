<?php
// Include database connection
include_once 'db_connection.php';

// Function to authenticate user
function authenticateUser($email, $password) {
    global $pdo; // Access the PDO connection variable

    // Validate input
    if (empty($email) || empty($password)) {
        return ["success" => false, "message" => "Email and password are required!"];
    }

    try {
        // Prepare SQL query to fetch user by email
        $query = "SELECT id, username, password_hash, is_online FROM users WHERE email = :email";
        $stmt = $pdo->prepare($query);
        $stmt->execute([':email' => $email]);

        // Check if user exists
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$user) {
            return ["success" => false, "message" => "Invalid email or password!"];
        }

        // Verify password
        if (!password_verify($password, $user['password_hash'])) {
            return ["success" => false, "message" => "Invalid email or password!"];
        }

        // Generate session token
        $token = bin2hex(random_bytes(32)); // Generate a 64-character token
        $userId = $user['id'];

        // Store session token in the database
        $tokenQuery = "INSERT INTO sessions (user_id, token, expires_at) VALUES (:user_id, :token, :expires_at)";
        $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour')); // Token expires in 1 hour
        $tokenStmt = $pdo->prepare($tokenQuery);
        $tokenStmt->execute([
            ':user_id' => $userId,
            ':token' => $token,
            ':expires_at' => $expiresAt
        ]);

        // Update user online status
        $updateStatusQuery = "UPDATE users SET is_online = TRUE, last_active = :last_active WHERE id = :id";
        $lastActive = date('Y-m-d H:i:s');
        $updateStmt = $pdo->prepare($updateStatusQuery);
        $updateStmt->execute([
            ':last_active' => $lastActive,
            ':id' => $userId
        ]);

        // Return success response with token
        return [
            "success" => true,
            "token" => $token,
            "username" => $user['username'],
            "user_id" => $userId
        ];
    } catch (PDOException $e) {
        return ["success" => false, "message" => "Error: " . $e->getMessage()];
    }
}

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get POST data
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Call authenticateUser function
    $response = authenticateUser($email, $password);

    // Return response as JSON (for API use)
    header('Content-Type: application/json');
    echo json_encode($response);
}
?>

