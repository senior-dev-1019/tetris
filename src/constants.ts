export const boxWidth = 40;
export const boardWidth = 10;
export const boardHeight = 20;
export const defaultInterval = 500;
export const quickInterval = 100;
export const animationLength = 30;
export const canvasPadding = 1;
export const boardTopPadding = 4;
export const boardRightPadding = 5;

export const tetrominos = [
  // I
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
  // J
  [1, 0, 0, 1, 1, 1, 0, 0, 0],
  // L
  [0, 0, 1, 1, 1, 1, 0, 0, 0],
  // O
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  // S
  [0, 1, 1, 1, 1, 0, 0, 0, 0],
  // Z
  [1, 1, 0, 0, 1, 1, 0, 0, 0],
  // T
  [0, 1, 0, 1, 1, 1, 0, 0, 0],
];
export const tPieceIndex = tetrominos.length - 1;

export const colors = ['#e0f0ea', '#95adbe', '#574f7d', '#503a65', '#3c2a4d'];
