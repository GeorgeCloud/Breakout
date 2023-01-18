/* eslint-disable no-plusplus */
/* eslint-disable eqeqeq */
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const smallBrush = 4;
const mediumBrush = 7;
const largeBrush = 10;

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

const paddleHeight = 10;
const paddleWidth = 60;
let paddleX = (canvasWidth - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

const brickRowCount = 9;
const brickColumnCount = 6;
const brickWidth = 36;
const brickHeight = 10;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let score = 0;
let lives = 3;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

function keyDownHandler(e) {
  if (e.key == 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvasWidth) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            alert('YOU WIN, CONGRATS!');
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, largeBrush, 0, Math.PI * 2);
  ctx.fillStyle = 'pink';
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvasHeight - paddleHeight - 5, paddleWidth, paddleHeight);
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const randomColor = Math.floor(Math.random() * 16777215).toString(16);
      if (bricks[c][r].status == 1) {
        const brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = `#${randomColor}`;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}
function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Lives: ${lives}`, canvasWidth - 65, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  if (x + dx > canvasWidth - largeBrush || x + dx < largeBrush) {
    dx = -dx;
  }

  if (y + dy < largeBrush) {
    dy = -dy;
  } else if (y + dy > canvasHeight - largeBrush) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        alert('GAME OVER');
        document.location.reload();
      } else {
        x = canvasWidth / 2;
        y = canvasHeight - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvasWidth - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed) {
    paddleX = Math.min(paddleX + 7, canvasWidth - paddleWidth);
  } else if (leftPressed) {
    paddleX = Math.max(paddleX - 7, 0);
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

draw();
