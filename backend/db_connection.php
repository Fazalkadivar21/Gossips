 <?php
// Allow from any origin (you can restrict this to specific origins)
header("Access-Control-Allow-Origin: *");

// Allow specific HTTP methods (you can customize these if needed)
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Allow specific headers (you can add or modify headers here)
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Allow credentials (if you're sending cookies or credentials with requests)
// header("Access-Control-Allow-Credentials: true");

// Handle preflight requests (OPTIONS request)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;  // Preflight request, just exit without further processing
}


$dsn = 'mysql:host=localhost;dbname=justchat;charset=utf8mb4';
$username = 'root';
$password = 'h!arch21';

try {
    // Create a new PDO instance
    $pdo = new PDO($dsn, $username, $password);

    // Set error mode to exception for better debugging
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    /*echo "Connected successfully to the database using PDO!";*/
} catch (PDOException $e) {
    // Catch and display connection error
    echo "Connection failed: " . $e->getMessage();
}
?>

