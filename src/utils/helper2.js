import {
  BALL_DIAMETER,
  Ball_MASS,
  FINAL_DIAMETER,
  PLAYER_MASS,
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

/**
 * @params bi: initial ball velocity
 * @params pi: initial player velocity
 */
export const handleBallVelocity = (bi, pi) => {
  'worklet';
  // return bi + 4 * pi;
  // return (-3 * bi) / 4 + ((2 - 4) * pi) / 4;
  console.log('bi: ', bi / 2, 'pi:', pi / 2);
  const finalVelocity =
    ((bi / 2) * (Ball_MASS - PLAYER_MASS) + (2 * PLAYER_MASS * pi) / 2) /
      Ball_MASS +
    PLAYER_MASS;
  console.log('finalVelocity :', finalVelocity);
  return finalVelocity;
};
