
<?php
require_once 'config.php';

try {
    // Récupérer les 10 meilleurs scores
    $stmt = $pdo->prepare('
        SELECT pseudo, score 
        FROM scores_snake 
        ORDER BY score DESC 
        LIMIT 10
    ');
    $stmt->execute();
    $scores = $stmt->fetchAll();
    
    echo json_encode($scores);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur']);
}
?>
