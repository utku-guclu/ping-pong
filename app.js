var canvas;
var canvasContext;

let ballX = 400;
let ballY = 250;
let ballSpeedX = 10;
let ballSpeedY = 4;

let paddle1Y = 250;
let paddle1X = 10;

let paddle2Y = 250;

let player1Score = 0;
let player2Score = 0;

let showingWinScreen = false;

const WINNING_SCORE = 3;
const PADDLE_THICKNESS = 20;
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
  if (paddle2Y > -PADDLE_HEIGHT / 2 && event.key === "ArrowUp") {
    paddle2Y -= 20;
  } else if (
    paddle2Y < canvas.height - PADDLE_HEIGHT / 2 &&
    event.key === "ArrowDown"
  ) {
    paddle2Y += 20;
  }
}

function handleMouseClick(event) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

window.onload = function () {
  render();
};

function ballReset() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }

  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function computerMovement() {
  const paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
  if (paddle2YCenter < ballY - 35) {
    paddle2Y += 6;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= 6;
  }
}

function moveEverything() {
  if (showingWinScreen) {
    return;
  }
  computerMovement();
  // move the ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  // change direction
  // check horizontal move
  if (ballX < paddle1X + PADDLE_THICKNESS) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      const deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player2Score++; // must be BEFORE ballReset()
      ballReset();
    }
  }
  if (ballX > canvas.width - PADDLE_THICKNESS * 2) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      const deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player1Score++; // must be BEFORE ballReset()
      ballReset();
    }
  }
  // check vertical move
  if (ballY > canvas.height || ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawNet() {
  for (let i = 5; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i + 5, 2, 20, "white");
  }
}

function drawEverything() {
  // clear board
  colorRect(0, 0, canvas.width, canvas.height, "black");

  if (showingWinScreen) {
    canvasContext.fillStyle = "white";
    if (player1Score >= WINNING_SCORE) {
      canvasContext.fillText("Left Player Won!", 350, 200);
    } else if (player2Score >= WINNING_SCORE) {
      canvasContext.fillText("Right Player Won!", 350, 200);
    }

    canvasContext.fillText("click to continue", 350, 500);
    return;
  }
  // draw net
  drawNet();

  // player paddle
  colorRect(paddle1X, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");
  // cpu paddle
  colorRect(
    canvas.width - PADDLE_THICKNESS - paddle1X,
    paddle2Y,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT,
    "white"
  );

  // ball
  colorCircle(ballX, ballY, 10, "white");
  // score
  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width - 100, 100);
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

  canvas.addEventListener("mousedown", handleMouseClick);

  // move paddle1
  canvas.addEventListener("mousemove", (e) => {
    const mousePos = calculateMousePos(e);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });
  // move paddle2 -
  // window.addEventListener("keydown", (e) => {
  //   movePaddle(e);
  // });
};
