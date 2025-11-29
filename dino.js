// -------------------------
// SAVE SYSTEM (localStorage)
// -------------------------
let tries = parseInt(localStorage.getItem("tries")) || 0;
let highScore = parseInt(localStorage.getItem("highScore")) || 0;

// SETTINGS STORAGE
let gravity = parseFloat(localStorage.getItem("gravity")) || 0.4;
let jumpStrength = parseFloat(localStorage.getItem("jumpStrength")) || -10;
let spawnRate = parseInt(localStorage.getItem("spawnRate")) || 1000;
let velocityX = parseInt(localStorage.getItem("obstacleSpeed")) || -10;

// Remove or disable popup() function for rules
function popup() {
    // No operation - rules popup disabled
}

// LIGHT/DARK MODE
function lightdark() {
    document.body.classList.toggle("dark-mode");
    // Save dark mode state
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem('darkMode', 'on');
    } else {
        localStorage.setItem('darkMode', 'off');
    }
}

// Remove or disable modal-related functions
function showTries() {
    pauseGame();
    var tries = localStorage.getItem('tries') || 0;
    var lastTries = JSON.parse(localStorage.getItem('lastTries') || '[]');
    document.getElementById('triesValue').innerHTML =
        'Total tries: ' + tries +
        '<br>Last 10 tries:<br>' +
        (lastTries.length ? lastTries.map((t, i) => (lastTries.length - i) + '. ' + t).reverse().join('<br>') : 'No tries yet.');
    document.getElementById('triesModal').style.display = 'block';
}
function closeTries() {
    document.getElementById('triesModal').style.display = 'none';
    resumeGame();
}
function showHighscore() {
    pauseGame();
    document.getElementById('highscoreValue').textContent = localStorage.getItem('highScore') || 0;
    document.getElementById('highscoreModal').style.display = 'block';
}
function closeHighscore() {
    document.getElementById('highscoreModal').style.display = 'none';
    resumeGame();
}
function openSettings() {
    pauseGame();
    document.getElementById('gravityInput').value = gravity;
    document.getElementById('jumpInput').value = jumpStrength;
    document.getElementById('spawnInput').value = spawnRate;
    document.getElementById('speedInput').value = Math.abs(velocityX);
    document.getElementById('settingsModal').style.display = 'block';
}
function closeSettings() {
    document.getElementById('settingsModal').style.display = 'none';
    resumeGame();
}
function saveSettings() {
    gravity = parseFloat(document.getElementById('gravityInput').value);
    jumpStrength = parseFloat(document.getElementById('jumpInput').value);
    spawnRate = parseInt(document.getElementById('spawnInput').value);
    velocityX = -Math.abs(parseInt(document.getElementById('speedInput').value));
    localStorage.setItem('gravity', gravity);
    localStorage.setItem('jumpStrength', jumpStrength);
    localStorage.setItem('spawnRate', spawnRate);
    localStorage.setItem('obstacleSpeed', velocityX);
    clearInterval(spawnInterval);
    spawnInterval = setInterval(placeCactus, spawnRate);
    closeSettings();
}
function showRules() {
    pauseGame();
    document.getElementById('rulesModal').style.display = 'block';
}
function closeRules() {
    document.getElementById('rulesModal').style.display = 'none';
    resumeGame();
}
function resetSettingsToDefault() {
    gravity = 0.4;
    jumpStrength = -10;
    spawnRate = 1000;
    velocityX = -10;
    document.getElementById('gravityInput').value = gravity;
    document.getElementById('jumpInput').value = jumpStrength;
    document.getElementById('spawnInput').value = spawnRate;
    document.getElementById('speedInput').value = Math.abs(velocityX);
}

// ----------------------------
// GAME LOGIC STARTS HERE
// ----------------------------
let board;
let boardWidth = 1500;
let boardHeight = 500;
let context;

// DINO DATA
let dinoWidth = 90;
let dinoHeight = 95;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg, dinoDuckImg;

let dino = { x: dinoX, y: dinoY, width: dinoWidth, height: dinoHeight };

// CACTUS DATA
let cactusArray = [];
let cactus1Width = 34;
let cactus2Width = 59;
let cactus3Width = 92;
let cactusHeight = 70;
let cactusX = 1500;
let cactusY = boardHeight - cactusHeight;
let cactus1Img, cactus2Img, cactus3Img;

// BIRD DATA
let BirdArray = [];
let Bird1Width = 74;
let Bird2Width = 85;
let BirdHeight = 30;
let BirdX = 1500;
let BirdY = 410;
let Bird1Img, Bird2Img;

// PHYSICS
let velocityY = 0;

let gameOver = false;
let score = 0;

let spawnInterval;

let isDucking = false;
let dinoDuckHeight = 50; // height when ducking

let gamePaused = false;
let animationFrameId;

// ---------------------------
// LOAD GAME
// ---------------------------
window.onload = function game() {
    console.log('Dino game script loaded and window.onload fired');

    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    dinoImg = new Image();
    dinoImg.src = "./img/dino.png";

    dinoDuckImg = new Image();
    dinoDuckImg.src = "./img/dino-duck1.png";

    cactus1Img = new Image(); cactus1Img.src = "./img/cactus1.png";
    cactus2Img = new Image(); cactus2Img.src = "./img/cactus2.png";
    cactus3Img = new Image(); cactus3Img.src = "./img/cactus3.png";
    Bird1Img = new Image(); Bird1Img.src = "./img/bird1.png";
    Bird2Img = new Image(); Bird2Img.src = "./img/bird2.png";

    // Restore dark mode if it was enabled
    if (localStorage.getItem('darkMode') === 'on') {
        document.body.classList.add('dark-mode');
    }

    requestAnimationFrame(update);
    spawnInterval = setInterval(placeCactus, spawnRate);
    document.addEventListener("keydown", moveDino);
    document.addEventListener("keydown", duckDino);
    document.addEventListener("keyup", unduckDino);

    // Attach navbar button handlers
    var triesBtn = document.querySelector('.topnav a:nth-child(2)');
    var highscoreBtn = document.querySelector('.topnav a:nth-child(3)');
    var rulesBtn = document.querySelector('.topnav a:nth-child(4)');
    var settingsBtn = document.querySelector('.topnav a:nth-child(6)');
    if (triesBtn) triesBtn.onclick = showTries;
    if (highscoreBtn) highscoreBtn.onclick = showHighscore;
    if (rulesBtn) rulesBtn.onclick = showRules;
    if (settingsBtn) settingsBtn.onclick = openSettings;

    // Attach restart button event after DOM is loaded
    setTimeout(function() {
        var restartBtn = document.getElementById('restartButton');
        if (restartBtn) {
            restartBtn.onclick = function() {
                hideGameOverOverlay();
                restartGame();
            };
        }
    }, 0);

    // Hide overlay on load
    hideGameOverOverlay();
};

// ---------------------------
// UPDATE LOOP
// ---------------------------
function update() {
    if (gameOver || gamePaused) return;
    animationFrameId = requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    dino.y += velocityY;
    if (dino.y > dinoY) dino.y = dinoY;

    // Ensure hitbox matches ducking state BEFORE collision checks and drawing
    if (isDucking && dino.y === dinoY) {
        dino.height = dinoDuckHeight;
        dino.y = dinoY + (dinoHeight - dinoDuckHeight);
    } else if (!isDucking && dino.y >= dinoY) {
        dino.height = dinoHeight;
        dino.y = dinoY;
    }

    // Draw dino (ducking or not)
    if (isDucking && dino.y === dinoY + (dinoHeight - dinoDuckHeight)) {
        context.drawImage(dinoDuckImg, dino.x, dino.y, dino.width, dino.height);
    } else {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    // CACTUS
    for (let i = cactusArray.length - 1; i >= 0; i--) {
        let c = cactusArray[i];
        c.x += velocityX;
        context.drawImage(c.img, c.x, c.y, c.width, c.height);
        if (detectCollision(dino, c)) endGame();
        // Remove cactus if off screen
        if (c.x + c.width < 0) {
            cactusArray.splice(i, 1);
        }
    }
    // BIRD
    for (let i = BirdArray.length - 1; i >= 0; i--) {
        let b = BirdArray[i];
        b.x += velocityX;
        context.drawImage(b.img, b.x, b.y, b.width, b.height);
        if (detectCollision(dino, b)) endGame();
        // Remove bird if off screen
        if (b.x + b.width < 0) {
            BirdArray.splice(i, 1);
        }
    }

    // SCORE
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);
}

// ---------------------------
// INPUT
// ---------------------------
function moveDino(e) {
    if (gameOver) return;

    if ((e.code === "Space" || e.code === "ArrowUp") && dino.y === dinoY) {
        velocityY = jumpStrength;
    }
}

function duckDino(e) {
    if (e.code === "ArrowDown" && !isDucking && dino.y === dinoY) {
        isDucking = true;
        dino.height = dinoDuckHeight; // ducking height
        dino.y = dinoY + (dinoHeight - dinoDuckHeight); // adjust y so feet stay on ground
    }
}
function unduckDino(e) {
    if (e.code === "ArrowDown" && isDucking) {
        isDucking = false;
        dino.y = dinoY; // restore y
        dino.height = dinoHeight; // restore normal height
    }
}

// ---------------------------
// SPAWN OBSTACLES
// ---------------------------
function placeCactus() {
    if (gameOver) return;
    // Only spawn a cactus if the last cactus is far enough away
    let minCactusGap = 120;
    let canSpawnCactus = true;
    if (cactusArray.length > 0) {
        let lastCactus = cactusArray[cactusArray.length - 1];
        if (lastCactus && Math.abs(cactusX - lastCactus.x) < minCactusGap) {
            canSpawnCactus = false;
        }
    }
    let cactusR = Math.random();
    if (canSpawnCactus) {
        if (cactusR > 0.90) cactusArray.push({ img: cactus3Img, x: cactusX, y: cactusY, width: cactus3Width, height: cactusHeight });
        else if (cactusR > 0.60) cactusArray.push({ img: cactus2Img, x: cactusX, y: cactusY, width: cactus2Width, height: cactusHeight });
        else if (cactusR > 0.30) cactusArray.push({ img: cactus1Img, x: cactusX, y: cactusY, width: cactus1Width, height: cactusHeight });
    }
    // Only spawn a bird if no cactus is within 120px of BirdX
    let canSpawnBird = true;
    for (let c of cactusArray) {
        if (Math.abs(BirdX - c.x) < 120) {
            canSpawnBird = false;
            break;
        }
    }
    let birdR = Math.random();
    if (canSpawnBird) {
        if (birdR > 0.7) BirdArray.push({ img: Bird2Img, x: BirdX, y: getRandomBirdY(), width: Bird2Width, height: BirdHeight });
        else if (birdR > 0.4) BirdArray.push({ img: Bird1Img, x: BirdX, y: getRandomBirdY(), width: Bird1Width, height: BirdHeight });
    }
}

function getRandomBirdY() {
    // Bird can fly between 280 (low) and 410 (high)
    const birdHeights = [280, 330, 380, 410];
    return birdHeights[Math.floor(Math.random() * birdHeights.length)];
}

// ---------------------------
// COLLISION
// ---------------------------
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

// ---------------------------
// GAME OVER
// ---------------------------
function endGame() {
    gameOver = true;
    dinoImg.src = "./img/dino-dead.png";

    tries++;
    localStorage.setItem("tries", tries);

    // Store last 10 tries
    let lastTries = JSON.parse(localStorage.getItem('lastTries') || '[]');
    lastTries.push(score);
    if (lastTries.length > 10) lastTries = lastTries.slice(-10);
    localStorage.setItem('lastTries', JSON.stringify(lastTries));

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }

    setTimeout(showGameOverOverlay, 500);
}

function restartGame() {
    window.location.reload();
}

// Show game over overlay
function showGameOverOverlay() {
    document.getElementById('gameOverOverlay').style.display = 'block';
}

// Hide game over overlay
function hideGameOverOverlay() {
    document.getElementById('gameOverOverlay').style.display = 'none';
}

// Info Box logic
function showInfoBox(content) {
    var infoBox = document.getElementById('infoBox');
    infoBox.innerHTML = content;
    infoBox.classList.add('show');
    // Hide after 3 seconds or on click
    clearTimeout(infoBox.hideTimeout);
    infoBox.hideTimeout = setTimeout(hideInfoBox, 3000);
}
function hideInfoBox() {
    var infoBox = document.getElementById('infoBox');
    infoBox.classList.remove('show');
}

// Pause the game
function pauseGame() {
    gamePaused = true;
}

// Resume the game
function resumeGame() {
    if (!gameOver && gamePaused) {
        gamePaused = false;
        animationFrameId = requestAnimationFrame(update);
    }
}
