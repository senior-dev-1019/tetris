import './App.scss';

import {
  boardHeight,
  boardWidth,
  boxWidth,
  defaultInterval,
  quickInterval,
  colors,
  animationLength,
  boardTopPadding,
  boardRightPadding,
  canvasPadding,
} from './constants';
import { GameState } from './gameState';

const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

gameCanvas.width =
  (boardWidth + boardRightPadding + canvasPadding * 2) * boxWidth;
gameCanvas.height =
  (boardHeight + boardTopPadding + canvasPadding * 2) * boxWidth;

// Game state
const state = new GameState();

const gameCtx = gameCanvas.getContext('2d');

const resetGameButton = document.getElementById('reset-game');

const getCanvasX = (x: number) => (x + canvasPadding) * boxWidth;
const getCanvasY = (y: number) => (y + canvasPadding) * boxWidth;

document.addEventListener('gesturestart', e => {
  // Disable zoom on mobile Safari.
  e.preventDefault();
});

const draw = () => {
  gameCtx.fillStyle = '#000000';
  gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

  // Draw board.
  for (let i = 0; i < state.board.length; i++) {
    if (state.board[i] === 0) {
      continue;
    }

    gameCtx.globalAlpha = 1;
    gameCtx.fillStyle = colors[state.board[i] - 1];
    const x = i % boardWidth;
    const y = Math.floor(i / boardWidth);

    if (state.animationProgress > 0 && state.animationRows?.includes(y)) {
      gameCtx.globalAlpha = 1 - state.animationProgress / animationLength;
    }

    const canvasX = getCanvasX(x);
    const canvasY = getCanvasY(y + boardTopPadding);
    gameCtx.fillRect(canvasX, canvasY, boxWidth, boxWidth);
  }

  state.animationStep();

  // Draw current piece.
  gameCtx.fillStyle = state.pieceColor;

  const { piece, pieceSize } = state;
  for (let i = 0; i < piece.length; i++) {
    if (piece[i] === 0) {
      continue;
    }

    const x = i % pieceSize;
    const y = Math.floor(i / pieceSize);

    gameCtx.globalAlpha = 1;
    if (state.pieceY + y < 0) {
      gameCtx.globalAlpha = 0.25;
    }

    const canvasX = getCanvasX(state.pieceX + x);
    const canvasY = getCanvasY(state.pieceY + y + boardTopPadding);
    gameCtx.fillRect(canvasX, canvasY, boxWidth, boxWidth);
  }

  gameCtx.globalAlpha = 1;

  // Draw next piece.
  gameCtx.fillStyle = state.nextPieceColor;

  const { nextPiece, nextPieceSize } = state;
  for (let i = 0; i < nextPiece.length; i++) {
    if (nextPiece[i] === 0) {
      continue;
    }

    const offsetX = nextPieceSize === 3 ? 0.5 : 0;
    const offsetY = nextPieceSize === 3 ? 1 : 0;
    const x = (i % nextPieceSize) + offsetX;
    const y = Math.floor(i / nextPieceSize) + offsetY;

    const canvasX = getCanvasX(boardWidth + 1 + x);
    const canvasY = getCanvasY(boardTopPadding + y);
    gameCtx.fillRect(canvasX, canvasY, boxWidth, boxWidth);
  }

  // Draw static elements.
  gameCtx.strokeStyle = '#ffffff';
  gameCtx.strokeRect(
    getCanvasX(0),
    getCanvasY(boardTopPadding),
    getCanvasX(boardWidth) - getCanvasX(0),
    getCanvasY(boardHeight + boardTopPadding) - getCanvasY(boardTopPadding)
  );
  gameCtx.strokeRect(
    getCanvasX(boardWidth + 1),
    getCanvasY(boardTopPadding),
    getCanvasX(boardWidth + 5) - getCanvasX(boardWidth + 1),
    getCanvasY(boardTopPadding + 4) - getCanvasY(boardTopPadding)
  );

  gameCtx.textAlign = 'left';
  gameCtx.fillStyle = '#ffffff';
  gameCtx.font = '20px Arial';
  gameCtx.fillText(
    'Score: ' + state.score,
    getCanvasX(boardWidth + 1),
    getCanvasY(boardTopPadding - 1) - 14
  );
  gameCtx.fillText(
    'Next piece:',
    getCanvasX(boardWidth + 1),
    getCanvasY(boardTopPadding) - 14
  );

  if (state.gameOver) {
    gameCtx.globalAlpha = 0.5;
    gameCtx.fillStyle = '#000000';
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    gameCtx.textAlign = 'center';
    gameCtx.fillStyle = '#ffffff';
    gameCtx.globalAlpha = 1;
    gameCtx.fillText('GAME OVER', gameCanvas.width / 2, gameCanvas.height / 2);
  }

  requestAnimationFrame(draw);
};

let stepInterval = defaultInterval;
let stepTimeout: number;

const step = () => {
  state.step();
  stepTimeout = setTimeout(step, stepInterval);
};

stepTimeout = setTimeout(step, stepInterval);

requestAnimationFrame(draw);

resetGameButton.addEventListener('click', () => {
  resetGameButton.blur();
  state.reset();
});

const startSoftDrop = () => {
  stepInterval = quickInterval;
  clearTimeout(stepTimeout);
  step();
};

const stopSoftDrop = () => {
  stepInterval = defaultInterval;
};

document.addEventListener('keydown', e => {
  e.preventDefault();

  switch (e.key) {
    case ' ':
      state.hardDrop();
      break;
    case 'ArrowDown':
      startSoftDrop();
      break;
    case 'ArrowUp':
      state.rotate();
      break;
    case 'ArrowLeft':
      state.moveX(-1);
      break;
    case 'ArrowRight':
      state.moveX(1);
      break;
  }
});

document.addEventListener('keyup', e => {
  switch (e.key) {
    case 'ArrowDown':
      stopSoftDrop();
      break;
  }
});

// Mobile controls

const upButton = document.getElementById('up');
const leftButton = document.getElementById('left');
const rightButton = document.getElementById('right');
const downButton = document.getElementById('down');
const spaceButton = document.getElementById('space');

upButton.addEventListener('click', () => state.rotate());
leftButton.addEventListener('click', () => state.moveX(-1));
rightButton.addEventListener('click', () => state.moveX(1));
spaceButton.addEventListener('click', () => state.hardDrop());
downButton.addEventListener('mousedown', () => startSoftDrop());
downButton.addEventListener('mouseup', () => stopSoftDrop());
downButton.addEventListener('touchstart', () => startSoftDrop());
downButton.addEventListener('touchend', () => stopSoftDrop());
downButton.addEventListener('touchcancel', () => stopSoftDrop());
