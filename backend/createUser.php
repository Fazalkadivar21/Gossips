<?php
// Include database connection
include_once 'db_connection.php';

// Function to handle user creation
function createUser($username, $email, $password, $profilePicture) {
    global $pdo; // Access the PDO connection variable

    // Validate input
    if (empty($username) || empty($email) || empty($password)) {
        return json_encode(["status" => "error", "message" => "All fields are required!"]);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return json_encode(["status" => "error", "message" => "Invalid email format!"]);
    }

    try {
        // Check if the username or email already exists
        $checkQuery = "SELECT * FROM users WHERE username = :username OR email = :email";
        $stmt = $pdo->prepare($checkQuery);
        $stmt->execute(['username' => $username, 'email' => $email]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (count($result) > 0) {
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
                        VALUES (:username, :email, :password, :profile_picture, :is_online, :last_active)";
        $stmt = $pdo->prepare($insertQuery);

        // Prepare parameters
        $params = [
            ':username' => $username,
            ':email' => $email,
            ':password' => $hashedPassword,
            ':profile_picture' => $filePath,
            ':is_online' => 0, // Default online status is false
            ':last_active' => date('Y-m-d H:i:s'), // Default last active timestamp
        ];

        if ($stmt->execute($params)) {
            return json_encode(["status" => "success", "message" => "User created successfully!"]);
        } else {
            return json_encode(["status" => "error", "message" => "Error inserting data into database."]);
        }
    } catch (PDOException $e) {
        // Handle PDO exceptions
        return json_encode(["status" => "error", "message" => "Error: " . $e->getMessage()]);
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

