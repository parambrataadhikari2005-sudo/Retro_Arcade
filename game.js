const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

let score = 0;

// Paddle properties
const paddle = {
    width: 100,
    height: 15,
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    speed: 8,
    dx: 0
};

// Ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    radius: 8,
    speed: 5,
    dx: 4,
    dy: -4
};

// Brick setup
const brickRowCount = 5;
const brickColumnCount = 9;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 35;

// Initialize Bricks Array
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Keyboard Listeners
document.addEventListener("keydown", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") paddle.dx = paddle.speed;
    if (e.key === "Left" || e.key === "ArrowLeft") paddle.dx = -paddle.speed;
});

document.addEventListener("keyup", (e) => {
    if (["ArrowRight", "ArrowLeft", "Right", "Left"].includes(e.key)) paddle.dx = 0;
});

// Mouse tracking option
document.addEventListener("mousemove", (e) => {
    const relativeX = e.clientX - canvas.getBoundingClientRect().left;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.width / 2;
    }
});

// Math: Collision Tracking
function detectCollisions() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                // Check if ball bounding circle overlaps brick bounding box
                if (ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight) {
                    ball.dy = -ball.dy; // Reverse vertical ball vector
                    b.status = 0;       // Break brick
                    score += 10;
                    scoreDisplay.innerText = score;

                    // Win Condition check
                    if (score === brickRowCount * brickColumnCount * 10) {
                        alert("YOU WIN, ARCADE CHAMPION!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// Drawing Functions
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = "#ff00ff";
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#00ffff";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = `hsl(${c * 40}, 100%, 50%)`; // Rainbow arcade colors
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Core Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Step 1: Clear Screen
    
    drawBricks();
    drawPaddle();
    drawBall();
    detectCollisions();

    // Move Paddle & boundary check
    paddle.x += paddle.dx;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;

    // Ball Wall Collision (Left/Right)
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }
    // Ball Ceiling Collision
    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } 
    // Ball Bottom Check (Paddle hit or Game Over)
    else if (ball.y + ball.dy > canvas.height - ball.radius) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            // Calculate relative offset to add steering control depending on where it hits the paddle
            let collidePoint = ball.x - (paddle.x + paddle.width / 2);
            collidePoint = collidePoint / (paddle.width / 2);
            ball.dx = collidePoint * ball.speed;
            ball.dy = -ball.speed;
        } else {
            alert("GAME OVER");
            document.location.reload();
            return;
        }
    }

    // Update ball coordinates
    ball.x += ball.dx;
    ball.y += ball.dy;

    requestAnimationFrame(gameLoop); // Schedules next frame execution
}

// Kick off the loop
gameLoop();