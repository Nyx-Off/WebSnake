
-- Créer la base de données
CREATE DATABASE IF NOT EXISTS zy16r_snake_game CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE zy16r_snake_game;

-- Créer la table des scores
CREATE TABLE IF NOT EXISTS scores_snake (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pseudo VARCHAR(30) NOT NULL,
    score INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_score (score DESC),
    INDEX idx_date (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Quelques données de test (optionnel)
INSERT INTO scores_snake (pseudo, score) VALUES
('Admin', 500),
('Player1', 350),
('Player2', 300),
('Champion', 450);