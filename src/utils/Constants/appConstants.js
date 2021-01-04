import {Dimensions, Platform} from 'react-native';

export const {width, height} = Dimensions.get('window');
export const AVAILABLE_WIDTH = width;
export const SIDE_BORDER_WIDTH = 10;
const iosBottomMargin = 80;
export const AVAILABLE_HEIGHT =
  Platform.OS === 'ios' ? height - iosBottomMargin : height;
export const WIDTH = width - 2 * SIDE_BORDER_WIDTH;
const platformHeight =
  Platform.OS === 'ios' ? height - iosBottomMargin : height;
export const HEIGHT =
  Platform.OS === 'ios'
    ? platformHeight - 2 * SIDE_BORDER_WIDTH
    : platformHeight - 2 * SIDE_BORDER_WIDTH;

export const RADIUS = 40;
export const STROKE_WIDTH = 2.5;
export const FINAL_RADIUS = RADIUS + STROKE_WIDTH;
export const FINAL_DIAMETER = 2 * (RADIUS + STROKE_WIDTH);
export const PENULTIMATE_SCORE = 7;

export const BALL_DIAMETER = (3 * RADIUS) / 4;
export const PLAYER = {PLAYER1: 'PLAYER1', PLAYER2: 'PLAYER2'};

export const AXIS = {
  X: 'X',
  Y: 'Y',
};

export const COLORS = {
  BORDER: '#00FFFF',
  BACKGROUND: '#000',
  PLAYER_1: '#f00',
  PLAYER_2: '#00f',
  BALL: '#FFA500',
  BLUE: '#00f',
  WHITE: '#fff',
  RED: '#f00',
  ORANGE: '#FFA500',
};
