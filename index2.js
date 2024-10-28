//variables and constants declaration
let inputDirection = { x: 0, y: 0 };
const foodSound = new Audio('./music/food.mp3');
const moveSound = new Audio('./music/move.mp3');
const gameOverSound = new Audio('./music/gameover.mp3');
const backgroundMusic = new Audio('./music/music.mp3');
let score = 0;
let scoreElement = document.querySelector(".score")
let lasPaintTime = 0;
let speed = 6;
let a = 2;
let b = 16;
let snakeArr = [{ x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) }];
let food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
let gameOver = document.querySelector('.game-over');
let pauseVar = 0;
let gameoverFlag = false;
let isPause = false;


//pause game logic
function pauseDialog() {
    return new Promise((resolve) => {
        const pauseBox = document.getElementById("pause-dialog");
        const resumeButton = document.getElementById("resume");
        pauseBox.style.display = "block";
        resumeButton.onclick = function () {
            pauseBox.style.display = "none";
            pauseBtn.textContent = '⏸️';
            resolve();
        };
        window.addEventListener('keydown', (e) => {
        if (e.key == ' ') {
            window.requestAnimationFrame(main);
            start.style.display = 'none';
            if (!isMuted) {
                backgroundMusic.loop = true;
                backgroundMusic.play();
            }
        }

    
        });
    })
}


//logic for starting the game
function start() {
    let start = document.getElementById('start-dialog');
    start.addEventListener('click', () => {
        window.requestAnimationFrame(main);
        start.style.display = 'none';
        if (!isMuted) {
            backgroundMusic.loop = true;
            backgroundMusic.play();
        }
    })
    window.addEventListener('keydown', (e) => {
        if(e.key == ' ') {
            window.requestAnimationFrame(main);
            start.style.display = 'none';
            if (!isMuted) {
                backgroundMusic.loop = true;
                backgroundMusic.play();
            }
        }

    })

}
//calling start function
start();

//triggering pause btn
let pauseBtn = document.getElementById('pause-btn')
pauseBtn.addEventListener('click', () => {
    isPause = !isPause;
  backgroundMusic.pause();
    pauseBtn.textContent = '▶️'
})


//Game main function
async function main(cTime) {
    window.requestAnimationFrame(main);
    if ((cTime - lasPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lasPaintTime = cTime;
    if (isPause) {
        await pauseDialog();
        isPause = !isPause;
        gameEngine();
        if (!isMuted) {
            backgroundMusic.loop = true;
            backgroundMusic.play();
        }
    }
    else {
        gameEngine();
    }
}

//custom dialog box for game over
function showCustomDialog() {
    return new Promise((resolve) => {
        const dialogBox = document.getElementById("restart-dialog");
        const dialogOkButton = document.getElementById("dialog-restart");
        dialogBox.style.display = "block";
        dialogOkButton.onclick = function () {
            dialogBox.style.display = "none";
            resolve();
        };
        window.addEventListener('keydown', (e) => {
            if (e.key == ' ') {
                dialogBox.style.display = 'none';
                resolve();
            }
        });
    });
}

function isCollide() {
    //collision with itself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snakeArr[i].x === snakeArr[0].x && snakeArr[i].y === snakeArr[0].y) {
            return true;
        }
    }
    if (snakeArr[0].x >= 18 || snakeArr[0].x <= 0 || snakeArr[0].y >= 18 || snakeArr[0].y <= 0) {
        return true;
    }
    return false;
}

//reset snake , food , score 
function reset() {
    if (!isMuted) {
        backgroundMusic.loop = true;
        backgroundMusic.play();
    }
    gameoverFlag = false;
    snakeArr = [{ x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) }];
    food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    score = 0;
    scoreElement.innerHTML = `Score: ${score}`
}

//game engine logic
async function gameEngine() {
    // Part 1: Updating the snake array & food
    if (isCollide(snakeArr) && !gameoverFlag) {
        gameoverFlag = true;
        gameOverSound.play()
        backgroundMusic.pause();
        inputDirection = { x: 0, y: 0 };
        await showCustomDialog();
        reset();
    }

    // If snake has eaten the food, increment the score and re-generate the food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score += 1;
        if (score > highScoreval) {
            highScoreval = score;
            localStorage.setItem('highScore', JSON.stringify(highScoreval));
            document.querySelector("#highScore").innerHTML = `HighScore: ${highScoreval} `;
        }
        scoreElement.innerHTML = `Score: ${score}`;
        snakeArr.unshift({ x: snakeArr[0].x + inputDirection.x, y: snakeArr[0].y + inputDirection.y });
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }

    // Logic to move the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDirection.x;
    snakeArr[0].y += inputDirection.y;

    // Part 2: Display the snake and food
    // Display the snake
    let board = document.getElementById("board");
    board.innerHTML = '';
    snakeArr.forEach((elem, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = elem.y;
        snakeElement.style.gridColumnStart = elem.x;
        if (index == 0) {
            snakeElement.classList.add("head");
        } else {
            snakeElement.classList.add("snake-body");
        }
        board.appendChild(snakeElement);
    })

    // Display the food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    board.appendChild(foodElement);
}


// logic for high score
let highScoreval = localStorage.getItem("highScore");
if (highScoreval === null) {
    highScoreval = 0;
    localStorage.setItem('highScore', JSON.stringify(highScoreval));
}
else {
    highScoreval = JSON.parse(highScoreval);
    document.querySelector("#highScore").textContent = `HighScore: ${highScoreval}`;
    localStorage.setItem('highScore', JSON.stringify(highScoreval));
}


//event listen and update input direction
document.querySelector(".move-btn1").addEventListener('click', () => {
    inputDirection.x = 0;
    inputDirection.y = -1;
    moveSound.play();
})
document.querySelector(".move-btn2").addEventListener('click', () => {
    inputDirection.x = 0;
    inputDirection.y = 1;
    moveSound.play();
})
document.querySelector(".move-btn3").addEventListener('click', () => {
    inputDirection.x = -1;
    inputDirection.y = 0;
    moveSound.play();
})
document.querySelector(".move-btn4").addEventListener('click', () => {
    inputDirection.x = 1;
    inputDirection.y = 0;
    moveSound.play();
})

window.addEventListener('keydown', (e) => {
    moveSound.play();
    switch (e.key) {
        case 'ArrowUp':
            inputDirection.x = 0;
            inputDirection.y = -1;
            break;
        case 'ArrowDown':
            inputDirection.x = 0;
            inputDirection.y = 1;
            break;
        case 'ArrowLeft':
            inputDirection.x = -1;
            inputDirection.y = 0;
            break;
        case 'ArrowRight':
            inputDirection.x = 1;
            inputDirection.y = 0;
            break;

        default:
            break;
    }

})

// Background music setup
const volumeBtn = document.getElementById('volume-btn');
var isMuted = false;
volumeBtn.addEventListener('click', () => {
    if (isMuted) {
        backgroundMusic.play();
        volumeBtn.textContent = '🔊';
    } else {
        backgroundMusic.pause();
        volumeBtn.textContent = '🔇';
    }
    isMuted = !isMuted;
});






