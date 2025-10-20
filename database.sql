-- Créer la base de données
CREATE DATABASE IF NOT EXISTS zy16r_snake_game CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE zy16r_snake_game;

-- Table des sessions de jeu
CREATE TABLE IF NOT EXISTS game_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(64) NOT NULL UNIQUE,
    start_time DATETIME NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    status ENUM('active', 'completed', 'abandoned') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_token (token),
    INDEX idx_status (status),
    INDEX idx_ip_date (ip_address, start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des scores (modifiée)
CREATE TABLE IF NOT EXISTS scores_snake (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pseudo VARCHAR(30) NOT NULL,
    score INT NOT NULL,
    duration INT NOT NULL COMMENT 'Durée en secondes',
    game_session_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_session_id) REFERENCES game_sessions(id) ON DELETE CASCADE,
    INDEX idx_score (score DESC),
    INDEX idx_date (created_at DESC),
    INDEX idx_session (game_session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des activités suspectes (pour monitoring)
CREATE TABLE IF NOT EXISTS suspicious_activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    game_session_id INT,
    reason VARCHAR(50) NOT NULL,
    score INT,
    duration INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_session_id) REFERENCES game_sessions(id) ON DELETE CASCADE,
    INDEX idx_reason (reason),
    INDEX idx_date (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

