// -------------------------
// SAVE SYSTEM (localStorage)
// -------------------------
let tries = parseInt(localStorage.getItem("tries")) || 0;
let highScore = parseInt(localStorage.getItem("highScore")) || 0;

// SETTINGS STORAGE
let gravity = parseFloat(localStorage.getItem("gravity")) || 0.4;
let jumpStrength = parseFloat(localStorage.getItem("jumpStrength")) || -10;
let spawnRate = parseInt(localStorage.getItem("spawnRate")) || 1000;

// POPUP RULES
function popup() {
    alert("The rules are simple!\nDON'T HIT A CACTUS");
}

// LIGHT/DARK MODE
function lightdark() {
    document.body.classList.toggle("dark-mode");
}

// DISPLAY TRIES & HIGHSCORE
function showTries() { alert("Total Tries: " + tries); }
function showHighscore() { alert("Highscore: " + highScore); }

// SETTINGS PANEL
function openSettings() {
    document.getElementById("settingsModal").style.display = "block";
    document.getElementById("gravityInput").value = gravity;
    document.getElementById("jumpInput").value = jumpStrength;
    document.getElementById("spawnInput").value = spawnRate;
}

function closeSettings() {
    document.getElementById("settingsModal").style.display = "none";
}

function saveSettings() {
    gravity = parseFloat(document.getElementById("gravityInput").value);
    jumpStrength = parseFloat(document.getElementById("jumpInput").value);
    spawnRate = parseInt(document.getElementById("spawnInput").value);

    localStorage.setItem("gravity", gravity);
    localStorage.setItem("jumpStrength", jumpStrength);
    localStorage.setItem("spawnRate", spawnRate);

    clearInterval(spawnInterval);
    spawnInterval = setInterval(placeCactus, spawnRate);

    alert("Settings saved!");
    closeSettings();
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
let dinoImg;

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
let velocityX = -10;
let velocityY = 0;

let gameOver = false;
let score = 0;

let spawnInterval;

// ---------------------------
// LOAD GAME
// ---------------------------
window.onload = function game() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    dinoImg = new Image();
    dinoImg.src = "./img/dino.png";

    cactus1Img = new Image(); cactus1Img.src = "./img/cactus1.png";
    cactus2Img = new Image(); cactus2Img.src = "./img/cactus2.png";
    cactus3Img = new Image(); cactus3Img.src = "./img/cactus3.png";
    Bird1Img = new Image(); Bird1Img.src = "./img/bird1.png";
    Bird2Img = new Image(); Bird2Img.src = "./img/bird2.png";

    requestAnimationFrame(update);

    spawnInterval = setInterval(placeCactus, spawnRate);

    document.addEventListener("keydown", moveDino);
};

// ---------------------------
// UPDATE LOOP
// ---------------------------
function update() {
    requestAnimationFrame(update);
    if (gameOver) return;

    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    dino.y += velocityY;
    if (dino.y > dinoY) dino.y = dinoY;

    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    // CACTUS
    for (let c of cactusArray) {
        c.x += velocityX;
        context.drawImage(c.img, c.x, c.y, c.width, c.height);

        if (detectCollision(dino, c)) endGame();
    }

    // BIRD
    for (let b of BirdArray) {
        b.x += velocityX;
        context.drawImage(b.img, b.x, b.y, b.width, b.height);

        if (detectCollision(dino, b)) endGame();
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

// ---------------------------
// SPAWN OBSTACLES
// ---------------------------
function placeCactus() {
    if (gameOver) return;

    let r = Math.random();

    if (r > 0.90) cactusArray.push({ img: cactus3Img, x: cactusX, y: cactusY, width: cactus3Width, height: cactusHeight });
    else if (r > 0.70) BirdArray.push({ img: Bird2Img, x: BirdX, y: BirdY, width: Bird2Width, height: BirdHeight });
    else if (r > 0.50) BirdArray.push({ img: Bird1Img, x: BirdX, y: BirdY, width: Bird1Width, height: BirdHeight });
    else if (r > 0.30) cactusArray.push({ img: cactus2Img, x: cactusX, y: cactusY, width: cactus2Width, height: cactusHeight });
    else if (r > 0.10) cactusArray.push({ img: cactus1Img, x: cactusX, y: cactusY, width: cactus1Width, height: cactusHeight });

    if (cactusArray.length > 5) cactusArray.shift();
    if (BirdArray.length > 5) BirdArray.shift();
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

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }

    alert("GAME OVER!\nScore: " + score + "\nHighscore: " + highScore + "\nTotal tries: " + tries);

    window.location.reload();
}
