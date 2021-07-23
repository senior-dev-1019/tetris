import { Rotation } from './types';

export const getRotatedPiece = (
  piece: number[],
  rotation: Rotation
): number[] => {
  const pieceSize = piece.length === 16 ? 4 : 3;
  const newPiece = new Array(piece.length);

  for (let i = 0; i < piece.length; i++) {
    let x = i % pieceSize;
    let y = Math.floor(i / pieceSize);
    switch (rotation) {
      case Rotation.ROTATE_90:
        {
          let temp = x;
          x = pieceSize - 1 - y;
          y = temp;
        }
        break;
      case Rotation.ROTATE_180:
        x = pieceSize - 1 - x;
        y = pieceSize - 1 - y;
        break;
      case Rotation.ROTATE_270:
        {
          let temp = y;
          y = pieceSize - 1 - x;
          x = temp;
        }
        break;
    }

    newPiece[y * pieceSize + x] = piece[i];
  }

  return newPiece;
};

export const detectOverlap = (
  piece: number[],
  pieceX: number,
  pieceY: number,
  board: number[],
  boardWidth: number
): boolean => {
  const pieceSize = piece.length === 16 ? 4 : 3;
  for (let i = 0; i < piece.length; i++) {
    if (piece[i] === 0) {
      continue;
    }

    const x = i % pieceSize;
    const y = Math.floor(i / pieceSize);

    const boardX = pieceX + x;
    const boardY = pieceY + y;

    if (boardY < 0) {
      return false;
    }

    if (
      boardX >= boardWidth ||
      boardX < 0 ||
      boardY >= board.length / boardWidth
    ) {
      return true;
    }

    if (board[boardY * boardWidth + boardX] !== 0) {
      return true;
    }
  }

  return false;
};

export const checkRow = (board: number[], boardWidth: number, rowY: number) => {
  for (let i = 0; i < boardWidth; i++) {
    if (board[rowY * boardWidth + i] === 0) {
      return false;
    }
  }

  return true;
};

export const removeRow = (
  board: number[],
  boardWidth: number,
  rowY: number
) => {
  const newBoard = [...board];

  if (rowY !== 0) {
    for (let i = boardWidth; i < (rowY + 1) * boardWidth; i++) {
      newBoard[i] = board[i - boardWidth];
    }
  }

  for (let i = 0; i < boardWidth; i++) {
    newBoard[i] = 0;
  }

  return newBoard;
};

export function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
}
