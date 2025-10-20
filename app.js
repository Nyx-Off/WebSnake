// Sélecteurs DOM
const gameContainer = document.getElementById('gameContainer');
const food = document.getElementById('food');
const scoreDisplay = document.getElementById('score');
const speedDisplay = document.getElementById('speed');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const pseudoModal = document.getElementById('pseudoModal');
const pseudoInput = document.getElementById('pseudoInput');
const scoreBody = document.getElementById('scoreBody');
const startBtn = document.getElementById('startBtn');
const submitBtn = document.getElementById('submitBtn');
const skipBtn = document.getElementById('skipBtn');
const finalScoreDisplay = document.getElementById('finalScore');

// État du jeu
let snake = [];
let foodPos = { x: 0, y: 0 };
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let speed = 1;
let gameActive = false;
let gameLoop = null;

const GRID_SIZE = 20;
const BOARD_SIZE = 600;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    startBtn.addEventListener('click', startGame);
    submitBtn.addEventListener('click', submitScore);
    skipBtn.addEventListener('click', skipScore);
    
    // Écouteur pour le pseudo (Entrée = soumettre)
    pseudoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            submitScore();
            e.preventDefault();
        }
        // On n'empêche rien pour Espace - on laisse juste taper
    });
    
    document.addEventListener('keydown', handleKeyPress);
    loadScoreboard();
});

// Gestion des touches clavier
function handleKeyPress(e) {
    const key = e.key;
    
    // Si le modal pseudo est visible, on ignore les touches (sauf Enter)
    if (pseudoModal.style.display === 'block') {
        return;
    }
    
    // Espace pour rejouer après Game Over
    if (key === ' ' && gameOverScreen.style.display === 'block' && !gameActive) {
        resetGameAndStart();
        e.preventDefault();
        return;
    }
    
    // Contrôles du serpent pendant le jeu
    if (!gameActive) return;
    
    if (key === 'ArrowUp' && direction !== 'down') {
        nextDirection = 'up';
        e.preventDefault();
    } else if (key === 'ArrowDown' && direction !== 'up') {
        nextDirection = 'down';
        e.preventDefault();
    } else if (key === 'ArrowLeft' && direction !== 'right') {
        nextDirection = 'left';
        e.preventDefault();
    } else if (key === 'ArrowRight' && direction !== 'left') {
        nextDirection = 'right';
        e.preventDefault();
    }
}

// Démarrer le jeu
function startGame() {
    initializeGame();
    startScreen.style.display = 'none';
    gameLoop = setInterval(moveSnake, getGameSpeed());
}

// Initialiser l'état du jeu
function initializeGame() {
    // Nettoyer d'abord
    if (gameLoop) clearInterval(gameLoop);
    clearSnake();
    
    // Réinitialiser l'état
    snake = [{ x: 0, y: 0 }];
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    speed = 1;
    gameActive = true;
    
    // Mettre à jour l'affichage
    updateDisplay();
    
    // Créer le serpent initial
    drawSnake();
    
    // Créer la nourriture
    spawnFood();
}

// Rejouer directement (sans écran de démarrage)
function resetGameAndStart() {
    gameOverScreen.style.display = 'none';
    pseudoModal.style.display = 'none';
    initializeGame();
    gameLoop = setInterval(moveSnake, getGameSpeed());
}

// Dessiner le serpent
function drawSnake() {
    clearSnake();
    snake.forEach((segment, index) => {
        createSnakePart(segment.x, segment.y, index === 0);
    });
}

// Créer une partie du serpent
function createSnakePart(x, y, isHead = false) {
    const part = document.createElement('div');
    part.className = 'snake-part';
    if (isHead) part.classList.add('head');
    part.style.left = x + 'px';
    part.style.top = y + 'px';
    gameContainer.appendChild(part);
}

// Nettoyer le serpent du DOM
function clearSnake() {
    const parts = gameContainer.querySelectorAll('.snake-part');
    parts.forEach(part => part.remove());
}

// Spawner la nourriture
function spawnFood() {
    let x, y, onSnake;
    
    do {
        x = Math.floor(Math.random() * (BOARD_SIZE / GRID_SIZE)) * GRID_SIZE;
        y = Math.floor(Math.random() * (BOARD_SIZE / GRID_SIZE)) * GRID_SIZE;
        onSnake = snake.some(s => s.x === x && s.y === y);
    } while (onSnake);
    
    foodPos = { x, y };
    food.style.left = x + 'px';
    food.style.top = y + 'px';
}

// Déplacer le serpent
function moveSnake() {
    if (!gameActive) return;
    
    direction = nextDirection;
    const head = { ...snake[0] };
    
    // Calculer la nouvelle position de la tête
    switch (direction) {
        case 'up':
            head.y -= GRID_SIZE;
            break;
        case 'down':
            head.y += GRID_SIZE;
            break;
        case 'left':
            head.x -= GRID_SIZE;
            break;
        case 'right':
            head.x += GRID_SIZE;
            break;
    }
    
    // Collision avec les murs
    if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
        endGame();
        return;
    }
    
    // Collision avec le corps
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
        endGame();
        return;
    }
    
    // Ajouter la nouvelle tête
    snake.unshift(head);
    
    // Manger la nourriture
    if (head.x === foodPos.x && head.y === foodPos.y) {
        score++;
        updateDisplay();
        spawnFood();
        increaseSpeed();
    } else {
        // Retirer la queue
        snake.pop();
    }
    
    // Redessiner
    drawSnake();
}

// Augmenter la vitesse
function increaseSpeed() {
    if (score % 5 === 0) {
        speed++;
        updateDisplay();
        clearInterval(gameLoop);
        gameLoop = setInterval(moveSnake, getGameSpeed());
    }
}

// Calculer la vitesse du jeu
function getGameSpeed() {
    return Math.max(50, 200 - (speed - 1) * 15);
}

// Terminer le jeu
function endGame() {
    gameActive = false;
    if (gameLoop) clearInterval(gameLoop);
    
    finalScoreDisplay.textContent = 'Score: ' + score;
    gameOverScreen.style.display = 'block';
    pseudoModal.style.display = 'block';
    pseudoInput.focus();
}

// Réinitialiser le jeu (retour à l'écran de démarrage)
function resetGame() {
    gameOverScreen.style.display = 'none';
    pseudoModal.style.display = 'none';
    startScreen.style.display = 'block';
    clearSnake();
    if (gameLoop) clearInterval(gameLoop);
    gameActive = false;
}

// Mettre à jour l'affichage
function updateDisplay() {
    scoreDisplay.textContent = 'Score: ' + score;
    speedDisplay.textContent = 'Vitesse: ' + speed;
}

// Soumettre le score
async function submitScore() {
    const pseudo = pseudoInput.value.trim() || 'Anonyme';
    pseudoInput.value = '';
    
    try {
        const response = await fetch('api/save.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pseudo: pseudo,
                score: score
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            pseudoModal.style.display = 'none';
            loadScoreboard();
        } else {
            alert('Erreur: ' + data.error);
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'enregistrement du score');
    }
}

// Sauter l'enregistrement
function skipScore() {
    pseudoModal.style.display = 'none';
    gameOverScreen.style.display = 'none';
}

// Charger le tableau des scores
async function loadScoreboard() {
    try {
        const response = await fetch('api/get.php');
        const scores = await response.json();
        
        scoreBody.innerHTML = '';
        
        if (scores.length === 0) {
            scoreBody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #999;">Aucun score</td></tr>';
            return;
        }
        
        scores.forEach((entry, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${escapeHtml(entry.pseudo)}</td>
                <td>${entry.score}</td>
            `;
            scoreBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erreur lors du chargement du tableau:', error);
        scoreBody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #999;">Erreur de chargement</td></tr>';
    }
}

// Échapper les caractères HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}