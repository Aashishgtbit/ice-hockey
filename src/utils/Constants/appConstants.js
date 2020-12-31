import {Dimensions} from 'react-native';

export const {width, height} = Dimensions.get('window');
export const AVAILABLE_WIDTH = width;
export const SIDE_BORDER_WIDTH = 10;
export const AVAILABLE_HEIGHT = height;
export const WIDTH = width - 2 * SIDE_BORDER_WIDTH;
export const HEIGHT = height - 2 * SIDE_BORDER_WIDTH;
export const RADIUS = 40;
export const STROKE_WIDTH = 2.5;
export const FINAL_RADIUS = RADIUS + STROKE_WIDTH;
export const FINAL_DIAMETER = 2 * (RADIUS + STROKE_WIDTH);

export const BALL_DIAMETER = (3 * RADIUS) / 4;
export const PLAYER = {PLAYER1: 'PLAYER1', PLAYER2: 'PLAYER2'};

export const AXIS = {
  X: 'X',
  Y: 'Y',
};
