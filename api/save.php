
<?php
require_once 'config.php';

try {
    // Récupérer les données JSON
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['pseudo']) || !isset($data['score'])) {
        throw new Exception('Données manquantes');
    }
    
    // Validation du pseudo
    $pseudo = substr(trim($data['pseudo']), 0, 30);
    if (empty($pseudo) || !preg_match('/^[a-zA-Z0-9_\-\s]{1,30}$/', $pseudo)) {
                $pseudo = 'Anonyme';
    }
    
    // Validation du score
    $score = intval($data['score']);
    if ($score < 0 || $score > 1000) {
        throw new Exception('Score invalide');
    }
    
    // Insérer le score
    $stmt = $pdo->prepare('
        INSERT INTO scores_snake (pseudo, score) 
        VALUES (:pseudo, :score)
    ');
    $stmt->execute([
        ':pseudo' => $pseudo,
        ':score' => $score
    ]);
    
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
