import {
  BALL_DIAMETER,
  FINAL_DIAMETER,
  SIDE_BORDER_WIDTH,
  WIDTH,
} from './Constants/appConstants';

export const handleBoundaryCondition = (
  playerX,
  playerY,
  minHeight,
  maxHeight,
) => {
  'worklet';
  if (playerX <= FINAL_DIAMETER / 2) {
    playerX = FINAL_DIAMETER / 2;
  }
  if (playerX >= WIDTH - FINAL_DIAMETER / 2) {
    playerX = WIDTH - FINAL_DIAMETER / 2;
  }

  if (playerY <= minHeight + SIDE_BORDER_WIDTH) {
    playerY = minHeight + SIDE_BORDER_WIDTH;
  }
  if (playerY >= maxHeight - BALL_DIAMETER / 2 - 2 * SIDE_BORDER_WIDTH) {
    playerY = maxHeight - BALL_DIAMETER / 2 - 2 * SIDE_BORDER_WIDTH;
  }
  return {playerX, playerY};
};
