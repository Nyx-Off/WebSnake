
<?php
// Configuration de la base de données
define('DB_HOST', 'zy16r.myd.infomaniak.com');
define('DB_USER', 'zy16r_system');
define('DB_PASS', 'SamyBensalem@2024');
define('DB_NAME', 'zy16r_snake_game');

// Établir la connexion
try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de connexion']);
    exit;
}

// Headers CORS et sécurité
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
?>
