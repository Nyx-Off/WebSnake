<?php
// api/secure.php - Gestion des sessions de jeu

require_once 'config.php';

// Récupérer l'action
$action = $_GET['action'] ?? $_POST['action'] ?? null;

if ($action === 'start') {
    // Démarrer une nouvelle partie
    startGameSession();
} elseif ($action === 'save') {
    // Enregistrer le score
    saveScore();
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Action invalide']);
}

/**
 * Démarre une nouvelle session de jeu
 */
function startGameSession() {
    global $pdo;
    
    // Générer un token unique pour cette partie
    $token = bin2hex(random_bytes(32));
    $startTime = time();
    $ipAddress = $_SERVER['REMOTE_ADDR'];
    
    try {
        // Enregistrer la session
        $stmt = $pdo->prepare('
            INSERT INTO game_sessions (token, start_time, ip_address, status)
            VALUES (:token, FROM_UNIXTIME(:start_time), :ip_address, "active")
        ');
        $stmt->execute([
            ':token' => $token,
            ':start_time' => $startTime,
            ':ip_address' => $ipAddress
        ]);
        
        echo json_encode([
            'success' => true,
            'token' => $token,
            'timestamp' => $startTime
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur serveur']);
    }
}

/**
 * Enregistre un score avec validation
 */
function saveScore() {
    global $pdo;
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Vérifier les données
    if (!isset($data['token'], $data['pseudo'], $data['score'], $data['duration'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Données manquantes']);
        return;
    }
    
    $token = $data['token'];
    $pseudo = $data['pseudo'];
    $score = intval($data['score']);
    $duration = intval($data['duration']); // Durée en secondes
    $ipAddress = $_SERVER['REMOTE_ADDR'];
    
    try {
        // Vérifier que la session existe et est active
        $stmt = $pdo->prepare('
            SELECT id, start_time, ip_address, status FROM game_sessions 
            WHERE token = :token AND status = "active"
        ');
        $stmt->execute([':token' => $token]);
        $session = $stmt->fetch();
        
        if (!$session) {
            http_response_code(400);
            echo json_encode(['error' => 'Session invalide ou expirée']);
            return;
        }
        
        // Vérifier que l'IP correspond (anti-replay)
        if ($session['ip_address'] !== $ipAddress) {
            http_response_code(403);
            echo json_encode(['error' => 'IP mismatch']);
            return;
        }
        
        // Vérifier que la durée est cohérente (au moins 2 secondes par point)
        // Un bon joueur fait environ 1 point par 2-3 secondes
        $expectedMinDuration = $score * 2; // Au minimum 2sec par point
        if ($duration < $expectedMinDuration && $score > 0) {
            // Score impossible - trop rapide
            logSuspiciousActivity($session['id'], 'score_too_fast', $score, $duration);
            http_response_code(400);
            echo json_encode(['error' => 'Score invalide']);
            return;
        }
        
        // Vérifier que le score n'est pas trop élevé
        if ($score < 0 || $score > 500) {
            http_response_code(400);
            echo json_encode(['error' => 'Score invalide']);
            return;
        }
        
        // Vérifier qu'on n'a pas 5+ sessions similaires en 1 heure du même IP
        $stmt = $pdo->prepare('
            SELECT COUNT(*) as count FROM game_sessions 
            WHERE ip_address = :ip_address 
            AND start_time > DATE_SUB(NOW(), INTERVAL 1 HOUR)
        ');
        $stmt->execute([':ip_address' => $ipAddress]);
        $recentSessions = $stmt->fetch();
        
        if ($recentSessions['count'] > 20) {
            logSuspiciousActivity($session['id'], 'too_many_sessions', $score, $duration);
            http_response_code(429);
            echo json_encode(['error' => 'Trop de tentatives']);
            return;
        }
        
        // Valider le pseudo
        $pseudo = substr(trim($pseudo), 0, 30);
        if (empty($pseudo) || !preg_match('/^[a-zA-Z0-9_\-\s]{1,30}$/', $pseudo)) {
            $pseudo = 'Anonyme';
        }
        
        // Tout est bon - enregistrer le score
        $pdo->beginTransaction();
        
        // Insérer le score
        $stmt = $pdo->prepare('
            INSERT INTO scores_snake (pseudo, score, duration, game_session_id)
            VALUES (:pseudo, :score, :duration, :session_id)
        ');
        $stmt->execute([
            ':pseudo' => $pseudo,
            ':score' => $score,
            ':duration' => $duration,
            ':session_id' => $session['id']
        ]);
        
        // Marquer la session comme terminée
        $stmt = $pdo->prepare('
            UPDATE game_sessions SET status = "completed" WHERE id = :id
        ');
        $stmt->execute([':id' => $session['id']]);
        
        $pdo->commit();
        
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Erreur serveur']);
    }
}

/**
 * Log les activités suspectes
 */
function logSuspiciousActivity($sessionId, $reason, $score, $duration) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare('
            INSERT INTO suspicious_activities (game_session_id, reason, score, duration)
            VALUES (:session_id, :reason, :score, :duration)
        ');
        $stmt->execute([
            ':session_id' => $sessionId,
            ':reason' => $reason,
            ':score' => $score,
            ':duration' => $duration
        ]);
    } catch (Exception $e) {
        // Silent fail - ne pas bloquer pour logging
    }
}

?>