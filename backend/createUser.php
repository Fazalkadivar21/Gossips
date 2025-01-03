<?php
// Include database connection
include_once 'db_connection.php';

// Function to handle user creation
function createUser($username, $email, $password, $profilePicture) {
    global $conn; // Access the connection variable

    // Validate input
    if (empty($username) || empty($email) || empty($password)) {
        return json_encode(["status" => "error", "message" => "All fields are required!"]);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return json_encode(["status" => "error", "message" => "Invalid email format!"]);
    }

    // Check if the username or email already exists
    $checkQuery = "SELECT * FROM users WHERE username = ? OR email = ?";
    $stmt = $conn->prepare($checkQuery);
    $stmt->bind_param("ss", $username, $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        return json_encode(["status" => "error", "message" => "Username or email already exists!"]);
    }

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Handle profile picture upload
    $filePath = null;
    if ($profilePicture['error'] === 0) {
        $allowedTypes = ['image/jpeg', 'image/png'];
        $maxSize = 5 * 1024 * 1024; // 5MB

        // Validate file type and size
        if (!in_array($profilePicture['type'], $allowedTypes)) {
            return json_encode(["status" => "error", "message" => "Invalid file type!"]);
        }
        if ($profilePicture['size'] > $maxSize) {
            return json_encode(["status" => "error", "message" => "File size exceeds 5MB!"]);
        }

        // Generate unique filename and save the file
        $fileName = uniqid() . '_' . basename($profilePicture['name']);
        $filePath = 'uploads/' . $fileName;

        if (!move_uploaded_file($profilePicture['tmp_name'], $filePath)) {
            return json_encode(["status" => "error", "message" => "Error uploading the profile picture."]);
        }
    }

    // Insert user into database
    $insertQuery = "INSERT INTO users (username, email, password_hash, profile_picture, is_online, last_active)
                    VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($insertQuery);
    $isOnline = false; // Default online status is false
    $lastActive = date('Y-m-d H:i:s'); // Default last active timestamp

    $stmt->bind_param("ssssss", $username, $email, $hashedPassword, $filePath, $isOnline, $lastActive);

    if ($stmt->execute()) {
        return json_encode(["status" => "success", "message" => "User created successfully!"]);
    } else {
        return json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
    }
}

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get POST data
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $profilePicture = $_FILES['profile_picture'];

    // Call createUser function
    $response = createUser($username, $email, $password, $profilePicture);

    // Return JSON response
    header('Content-Type: application/json');
    echo $response;
}
?>

