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

$host = "localhost";
$username = "root";
$password = "";
$database = "justChat";
$port = 3306;

// Create connection
$conn = mysqli_connect($host, $username, $password,$database,$port);

// Check connection
/*if ($conn->connect_error) {*/
/*    die("Connection failed: " . $conn->connect_error);*/
/*}*/
/**/
/*echo "Connected successfully";*/
?> 
