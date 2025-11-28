//Start
function popup() {
    alert("                                    The rules are simple! \n                                              DON'T \n                                                HIT \n                                                  A \n                                             CACTUS")
}


//Light/Dark

function lightdark() {
    var element = document.body;
    element.classList.toggle("dark-mode");

}

//board stuff

let board;
let boardWidth = 1500;
let boardHeight = 500;
let context;

//dino

let dinoWidth = 90;
let dinoHeight = 95;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
}

//cactus

let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 59;
let cactus3Width = 92;

let cactusHeight = 70;
let cactusX = 1500;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//birds

let BirdArray = [];

let Bird1Width = 74;
let Bird2Width = 85;

let BirdHeight = 30;
let BirdX = 1500;
let BirdY = 410;

let Bird1Img;
let Bird2Img;

//physics

let velocityX = -10;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function game() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    dinoImg = new Image();
    dinoImg.src = "./img/dino.png";
    dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }
    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";

    Bird1Img = new Image();
    Bird1Img.src = "./img/bird1.png";

    Bird2Img = new Image();
    Bird2Img.src = "./img/bird2.png";

    requestAnimationFrame(update);
    setInterval(placeCactus,1000);
    document.addEventListener("keydown", moveDino);
}


function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);


    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY);
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);


    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "./img/dino-dead.png";
            gameOverImg = new Image();
            gameOverImg.src = "./img/game-over.png";
            gameOverImg.onload = function () {
                context.drawImage(gameOverImg, 550, 150);
            }
            resetImg = new Image();
            resetImg.src = "./img/reset.png";
            resetImg.onload = function () {
                context.drawImage(resetImg, 700, 200);
            }
            //onclick=window.location.reload();
        }
    }
    for (let i = 0; i < BirdArray.length; i++) {
        let Bird = BirdArray[i];
        Bird.x += velocityX;
        context.drawImage(Bird.img, Bird.x, Bird.y, Bird.width, Bird.height);

        if (detectCollision(dino, Bird)) {
            gameOver = true;
            dinoImg.src = "./img/dino-dead.png";
            gameOverImg = new Image();
            gameOverImg.src = "./img/game-over.png";
            gameOverImg.onload = function () {
                context.drawImage(gameOverImg, 550, 150);
            }
            resetImg = new Image();
            resetImg.src = "./img/reset.png";
            resetImg.onload = function () {
                context.drawImage(resetImg, 700, 200);
            }
        }
    }

    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);
}

function moveDino(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {

        velocityY = -10;
    }
    else if (e.code == "ArrowDown" && dino.y == dinoY) {

        velocityY = 10;
        dinoImg = dino-duck1.png;
    }
    else{

    }

}

function placeCactus() {
    if (gameOver) {
        return;
    }


    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }
    let Bird = {
        img: null,
        x: BirdX,
        y: BirdY,
        width: null,
        height: BirdHeight
    }

    let placeChance = Math.random();

    if (placeChance > .90) {
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    } else if (placeChance > .70) {
        Bird.img = Bird2Img;
        Bird.width = Bird2Width;
        BirdArray.push(Bird);
    }    
    else if (placeChance > .50) {
        Bird.img = Bird1Img;
        Bird.width = Bird1Width;
        BirdArray.push(Bird);
    }
    else if (placeChance > .30) {
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeChance > .10) {
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }
    if (BirdArray.length > 5) {
        BirdArray.shift();
    }
}

    if (cactusArray.length > 5) {
        cactusArray.shift();
    }


   
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;

}

