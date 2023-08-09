let canvas;
let canvasContext;
let ballX = 50;
let ballY = 50;
let ballSpeedX = 15;
let ballSpeedY = 4;

let paddle1Y = 250;
let paddle1X = 0;

let paddle2Y = 250;
let paddle2X = 790;

const PADDLE_HEIGHT = 100;

function calculateMousePos(event) {
  const root = document.documentElement;
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left - root.scrollLeft;
  const mouseY = event.clientY - rect.top - root.scrollTop;

  return {
    x: mouseX,
    y: mouseY,
  };
}

function movePaddle(event) {
  console.log(paddle2Y, PADDLE_HEIGHT)
  if (paddle2Y > -PADDLE_HEIGHT / 2 && event.key === "ArrowUp") {
    paddle2Y -= 20;
  } else if (paddle2Y < canvas.height - PADDLE_HEIGHT / 2 && event.key === "ArrowDown") {
    paddle2Y += 20;
  }
}

window.onload = function () {
  render();
};

function moveEverything() {
  // move the ball
  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;
  // change direction
  if (ballX > canvas.width || ballX < 0) {
    ballSpeedX = -ballSpeedX;
  }
  if (ballY > canvas.height || ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawEverything() {
  colorRect(0, 0, canvas.width, canvas.height, "black");

  // paddles
  colorRect(paddle1X, paddle1Y, 10, PADDLE_HEIGHT, "white");
  colorRect(paddle2X, paddle2Y, 10, PADDLE_HEIGHT, "white");

  // ball
  colorCircle(ballX, ballY, 10, "white");
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

const render = () => {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  const framesPerSecond = 30;

  console.log("Arcade Dominator!");

  setInterval(() => {
    drawEverything();
    moveEverything();
  }, 1000 / framesPerSecond);

  // move paddle1
  canvas.addEventListener("mousemove", (e) => {
    const mousePos = calculateMousePos(e);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });
  // move paddle2
  window.addEventListener("keydown", (e) => {
    movePaddle(e);
  });
};
