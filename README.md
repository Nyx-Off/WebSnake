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
