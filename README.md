# 🐍 Snake Game

Un classique indémodable! Jeu Snake simple et moderne en ligne avec système de scores persévérant.

![Snake Game](https://img.shields.io/badge/HTML5-CSS3-JavaScript-green) ![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Caractéristiques

- 🎮 Gameplay fluide et responsive
- 🏆 Système de classement des meilleurs scores
- ⚡ Difficulté progressive (vitesse augmente tous les 5 points)
- 🌙 Interface dark mode moderne
- 📱 Design responsive (desktop & mobile)
- 🔒 Sécurisé contre XSS et injections SQL
- 💾 Scores persistants en base de données

## 📋 Prérequis

- Serveur web (Apache, Nginx, etc.)
- **PHP 7.4+**
- **MySQL 5.7+**
- Accès FTP/SFTP ou SSH pour déployer

## 🚀 Installation

### 1️⃣ Télécharger les fichiers

```bash
git clone https://github.com/votre-username/snake-game.git
cd snake-game
```

Ou télécharger le ZIP et extraire dans le répertoire de votre serveur web.

### 2️⃣ Créer la base de données

Exécuter le fichier `database.sql` sur votre serveur MySQL:

**Via phpMyAdmin:**
- Créer une nouvelle base de données
- Importer le fichier `database.sql`

**Via ligne de commande:**
```bash
mysql -u root -p < database.sql
```

### 3️⃣ Configurer la connexion

Éditer `api/config.php` avec vos identifiants MySQL:

```php
define('DB_HOST', 'localhost');        // Votre serveur MySQL
define('DB_USER', 'root');             // Votre utilisateur
define('DB_PASS', 'your_password');    // Votre mot de passe
define('DB_NAME', 'zy16r_snake_game'); // Nom de la BD
```

### 4️⃣ Vérifier les permissions

```bash
# Dossiers: 755
chmod -R 755 snake-game/

# Fichiers: 644
find snake-game/ -type f -exec chmod 644 {} \;
```

### 5️⃣ Accéder au jeu

Ouvrir votre navigateur:
```
https://votre-domaine.com/snake-game/
```

## 📁 Structure des fichiers

```
snake-game/
├── index.html           # Page principale
├── style.css            # Styles CSS
├── app.js               # Logique du jeu (JavaScript)
├── database.sql         # Schéma SQL
├── .htaccess            # Sécurité Apache
├── api/
│   ├── config.php       # Configuration DB
│   ├── get.php          # Récupérer top 10 scores
│   └── save.php         # Enregistrer un score
├── README.md            # Ce fichier
└── LICENSE              # Licence MIT
```

## 🎮 Comment jouer

| Action | Touche |
|--------|--------|
| **Haut** | ⬆️ |
| **Bas** | ⬇️ |
| **Gauche** | ⬅️ |
| **Droite** | ➡️ |
| **Démarrer** | Cliquer "Commencer" |
| **Rejouer** | Espace ou "Passer" puis "Commencer" |
| **Enregistrer score** | Entrée (après Game Over) |

**Objectif:** Manger la nourriture (rond jaune) sans toucher les murs ou le corps du serpent!

## 📊 API Endpoints

### GET `/api/get.php`
Récupère les 10 meilleurs scores.

```bash
curl https://votre-domaine.com/snake-game/api/get.php
```

**Réponse:**
```json
[
  {"pseudo": "Champion", "score": 500},
  {"pseudo": "Player1", "score": 350},
  {"pseudo": "Admin", "score": 300}
]
```

## 🔒 Sécurité

Le projet implémente plusieurs mesures de sécurité:

- ✅ **Validation du pseudo** - Contrôle de longueur et caractères autorisés
- ✅ **Validation du score** - Range 0-1000
- ✅ **Requêtes préparées** - Protection contre injections SQL
- ✅ **Échappement HTML** - Protection XSS
- ✅ **Headers de sécurité** - CORS, X-Frame-Options, Content-Type
- ✅ **Fichiers .htaccess** - Désactiver la navigation des répertoires

## 🐛 Dépannage

### Erreur: "Erreur de connexion"

Vérifier:
- Les identifiants dans `api/config.php` sont corrects
- Le serveur MySQL est en cours d'exécution
- La base de données existe (`zy16r_snake_game`)

```bash
mysql -u root -p -e "SHOW DATABASES;"
```

### Les scores ne se chargent pas

Vérifier:
- `api/get.php` répond correctement
```bash
curl https://votre-domaine.com/snake-game/api/get.php
```
- Vérifier la console navigateur (F12) pour les erreurs JavaScript

## 📝 Personnalisation

### Changer les couleurs

Éditer `style.css` - remplacer `#4CAF50` (vert) par votre couleur:

```css
/* Avant */
border: 3px solid #4CAF50;

/* Après (bleu) */
border: 3px solid #2196F3;
```

### Modifier la taille du plateau

Éditer `app.js`:

```javascript
const GRID_SIZE = 20;    // Taille d'une case (pixels)
const BOARD_SIZE = 600;  // Taille du plateau (pixels)
```

### Changer la progression de vitesse

Éditer `app.js` (fonction `increaseSpeed()`):

```javascript
if (score % 5 === 0) {  // Remplacer 5 par votre valeur
    speed++;
    updateDisplay();
    clearInterval(gameLoop);
    gameLoop = setInterval(moveSnake, getGameSpeed());
}
```

### Ajuster la vitesse initiale

Éditer `app.js` (fonction `getGameSpeed()`):

```javascript
// Vitesse: 200ms de base, -15ms par niveau
return Math.max(50, 200 - (speed - 1) * 15);
```



# 🔒 Sécurité - Anti-Triche

Le système de scores est complètement sécurisé contre la triche. Les tentatives de manipulation sont détectées et enregistrées.

## 🛡️ Mesures de sécurité implémentées

### 1. System de token de session

Chaque partie génère un **token unique et aléatoire** de 64 caractères:

```javascript
const token = bin2hex(random_bytes(32)); // Cryptographiquement sûr
```

**Ce que ça empêche:**
- ❌ Réutilisation du même score
- ❌ Redistribution du token à d'autres joueurs
- ❌ Attaques par replay

### 2. Validation du score vs. durée

Le serveur calcule la **durée minimale requise** pour chaque score:

```php
// Minimum 2 secondes par point
$expectedMinDuration = $score * 2;

if ($duration < $expectedMinDuration && $score > 0) {
    // REJETÉ: Score impossible
    logSuspiciousActivity('score_too_fast');
}
```

**Exemples d'attaques bloquées:**
- Score 500 en 10 secondes → ❌ Rejeté
- Score 100 en 15 secondes → ❌ Rejeté (min: 200sec)
- Score 100 en 250 secondes → ✅ Accepté

### 3. Vérification de l'IP address

Le token est lié à une **adresse IP spécifique**:

```php
// L'IP du démarrage
$session['ip_address'] = $_SERVER['REMOTE_ADDR'];

// L'IP de la soumission du score DOIT correspondre
if ($session['ip_address'] !== $_SERVER['REMOTE_ADDR']) {
    // REJETÉ: IP mismatch
}
```

**Ce que ça empêche:**
- ❌ Vendre le token à quelqu'un d'autre
- ❌ Utiliser le même token depuis plusieurs IPs
- ❌ Hacking distribué

### 4. Rate limiting par IP

Maximum **20 sessions par heure** par adresse IP:

```php
$stmt = $pdo->prepare('
    SELECT COUNT(*) as count FROM game_sessions 
    WHERE ip_address = :ip_address 
    AND start_time > DATE_SUB(NOW(), INTERVAL 1 HOUR)
');

if ($recentSessions['count'] > 20) {
    // REJETÉ: Trop de tentatives
    http_response_code(429);
}
```

**Ce que ça empêche:**
- ❌ Spam/Flood de centaines de petits scores
- ❌ Bot automatisé

### 5. Contrôle du score maximum

Les scores sont limitées à **0-500 points**:

```php
if ($score < 0 || $score > 500) {
    throw new Exception('Score invalide');
}
```

### 6. Logging des activités suspectes

Chaque tentative de triche est enregistrée dans la table `suspicious_activities`:

```sql
CREATE TABLE suspicious_activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    game_session_id INT,
    reason VARCHAR(50) NOT NULL,
    score INT,
    duration INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Raisons enregistrées:**
- `score_too_fast` - Score impossible (trop rapide)
- `too_many_sessions` - Trop de tentatives en 1 heure

**Pour monitorer la triche:**
```php
// Vérifier les tentatives suspectes
SELECT * FROM suspicious_activities 
WHERE created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
ORDER BY created_at DESC;
```

## 🚫 Attaques bloquées

| Attaque | Détection | Résultat |
|---------|-----------|----------|
| **cURL/API directe** | Pas de token valide | ❌ Rejeté |
| **Réutilisation de token** | Session déjà utilisée | ❌ Rejeté |
| **Score trop rapide** | 500 points en 5 sec | ❌ Rejeté + Loggé |
| **Autre IP** | Token de IP A, soumission IP B | ❌ Rejeté + Loggé |
| **Flood** | 50 tentatives en 1 heure | ❌ Rejeté (429) |
| **Score négatif** | -1000 points | ❌ Rejeté |
| **Score trop élevé** | 999999 points | ❌ Rejeté |

## 🔑 Flux de sécurité complet

```
1. CLIENT: Clic "Commencer"
   ↓
2. FRONTEND: Appelle api/secure.php?action=start
   ↓
3. BACKEND: Génère token unique
   ↓
4. BACKEND: Enregistre session avec IP + timestamp
   ↓
5. BACKEND: Retourne token au frontend
   ↓
6. FRONTEND: Stocke token en mémoire (pas de localStorage!)
   ↓
7. JEUX COMMENCE: Compte la durée
   ↓
8. GAME OVER: Utilisateur tente d'enregistrer le score
   ↓
9. FRONTEND: Envoie {token, pseudo, score, duration}
   ↓
10. BACKEND: Valide le token
    - Session existe?
    - Session active?
    - IP correspond?
   ↓
11. BACKEND: Valide le score
    - duration >= score * 2?
    - 0 <= score <= 500?
    - Pas trop de sessions/heure?
   ↓
12. BACKEND: Enregistre ou REJETTE + LOG
```

## ⚙️ Configuration de sécurité

### Ajuster la durée minimale

Éditer `api/secure.php` pour modifier la validation:

```php
// Actuellement: 2 secondes par point
$expectedMinDuration = $score * 2;

// Plus strict: 3 secondes par point
$expectedMinDuration = $score * 3;

// Plus permissif: 1.5 secondes par point
$expectedMinDuration = $score * 1.5;
```

### Augmenter le rate limit

```php
// Actuellement: 20 sessions/heure
if ($recentSessions['count'] > 20) {

// Remplacer par:
if ($recentSessions['count'] > 50) {  // 50 sessions/heure
```

### Modifier la limite de score

```php
// Actuellement: 0-500
if ($score < 0 || $score > 500) {

// Remplacer par:
if ($score < 0 || $score > 1000) {  // 0-1000
```

## 📊 Monitoring et analytics

### Vérifier les tentatives échouées

```sql
-- Dernières 24h
SELECT 
    reason,
    COUNT(*) as count,
    AVG(score) as avg_score
FROM suspicious_activities
WHERE created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
GROUP BY reason;
```

### Utilisateurs suspects

```sql
-- IPs avec plus de 10 tentatives échouées
SELECT 
    gs.ip_address,
    COUNT(sa.id) as failed_attempts,
    MAX(sa.created_at) as last_attempt
FROM suspicious_activities sa
JOIN game_sessions gs ON sa.game_session_id = gs.id
WHERE sa.created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY gs.ip_address
HAVING failed_attempts > 10
ORDER BY failed_attempts DESC;
```

### Statistiques des scores

```sql
-- Top scores avec durée vérifiée
SELECT 
    pseudo,
    score,
    duration,
    ROUND(score/duration*60, 2) as points_per_minute,
    created_at
FROM scores_snake
WHERE game_session_id IN (
    SELECT id FROM game_sessions WHERE status = 'completed'
)
ORDER BY score DESC
LIMIT 20;
```

## 🔐 Bonnes pratiques

### Pour les développeurs

1. **Ne jamais faire confiance au client**
   - Toujours valider côté serveur
   - Ne pas se fier aux timestamps du navigateur

2. **Garder le token en mémoire**
   - Pas de localStorage/sessionStorage
   - Token = session unique

3. **Logger aggressivement**
   - Chaque tentative suspecte
   - Analyser les patterns

4. **Faire des audits réguliers**
   ```sql
   -- Top 100 scores
   SELECT * FROM scores_snake 
   ORDER BY score DESC 
   LIMIT 100;
   ```

### Pour les admins

- Vérifier `suspicious_activities` quotidiennement
- Checker les IPs avec beaucoup de sessions
- Analyser les scores anormaux vs durée

## ⚠️ Limitations connues

- **VPN/Proxy** - Plusieurs utilisateurs mêmes IP → peut bloquer à tort
  - Solution: Ajouter whitelist ou authentification

- **Mobile** - IP peut changer = rejet
  - Solution: Ajouter fingerprinting navigateur

- **Bot sophistiqué** - Peut respecter la durée minimale
  - Solution: Ajouter vérification du gameplay (mouvements logiques)


## 🔧 Dépendances

Aucune dépendance externe! Le projet est en **vanilla JavaScript** (pur JS, pas de framework).

## 📄 Licence

MIT License - Libre d'utilisation pour vos projets personnels et commerciaux.

Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Technologies

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** PHP 7.4+
- **Database:** MySQL 5.7+
- **Serveur:** Apache (avec mod_rewrite)

## 🙌 Contributions

Les pull requests sont bienvenues! Pour des changements majeurs, ouvrir d'abord une issue pour discuter.

---

**Bon jeu! 🎮**

Créé avec ❤️ en HTML5, CSS3, JavaScript et PHP
