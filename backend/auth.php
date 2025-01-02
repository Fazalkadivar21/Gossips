<?php
// Include database connection
include_once 'db_connection.php';

// Function to authenticate user
function authenticateUser($email, $password) {
    global $conn; // Access the connection variable

    // Validate input
    if (empty($email) || empty($password)) {
        return "Email and password are required!";
    }

    // Prepare SQL query to fetch user by email
    $query = "SELECT id, username, password_hash, is_online FROM users WHERE email = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if user exists
    if ($result->num_rows === 0) {
        return "Invalid email or password!";
    }

    // Fetch user data
    $user = $result->fetch_assoc();

    // Verify password
    if (!password_verify($password, $user['password_hash'])) {
        return "Invalid email or password!";
    }

    // Generate session token
    $token = bin2hex(random_bytes(32)); // Generate a 64-character token
    $userId = $user['id'];

    // Store session token in the database
    $tokenQuery = "INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)";
    $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour')); // Token expires in 1 hour
    $stmt = $conn->prepare($tokenQuery);
    $stmt->bind_param("sss", $userId, $token, $expiresAt);

    if ($stmt->execute()) {
        // Update user online status
        $updateStatusQuery = "UPDATE users SET is_online = TRUE, last_active = ? WHERE id = ?";
        $lastActive = date('Y-m-d H:i:s');
        $stmt = $conn->prepare($updateStatusQuery);
        $stmt->bind_param("si", $lastActive, $userId);
        $stmt->execute();

        // Return success response with token
        return [
            "success" => true,
            "token" => $token,
            "username" => $user['username'],
            "user_id" => $userId
        ];
    } else {
        return "Error generating session!";
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

