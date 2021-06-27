/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';

import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';

import {
  AVAILABLE_HEIGHT,
  AVAILABLE_WIDTH,
  WIDTH,
  SIDE_BORDER_WIDTH,
  HEIGHT,
  BALL_DIAMETER,
  FINAL_DIAMETER,
  COLORS,
} from '../../utils/Constants/appConstants';
import {Boundary} from '../../components/Boundary';
import {withReflection} from '../../utils/customAnimations/withReflection';
import {getBallVelocity} from '../../utils/customAnimations/getBallVelocity';
import {handleBoundaryCondition} from '../../utils/helper2';
import ScoreBoard from '../../components/ScoreBoard';
import {useState} from 'react';
const Game = () => {
  console.log('MaxHeight', HEIGHT - SIDE_BORDER_WIDTH);
  console.log('MaxWidth :', WIDTH - SIDE_BORDER_WIDTH);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);

  const incrementGoal = (player) => {
    if (player === 'Player1') {
      setP1Score(p1Score + 1);
    } else {
      setP2Score(p2Score + 1);
    }
  };
  // player 1
  const dragX1 = useSharedValue(WIDTH / 2);
  const dragY1 = useSharedValue(HEIGHT / 4);
  const velocityX1 = useSharedValue(0);
  const velocityY1 = useSharedValue(0);
  const isP1Dragging = useSharedValue(false);
  const isBall1Collided = useSharedValue(false);
  // player2
  const dragX2 = useSharedValue(WIDTH / 2);
  const dragY2 = useSharedValue(HEIGHT * 0.75);
  const velocityX2 = useSharedValue(0);
  const velocityY2 = useSharedValue(0);
  const isP2Dragging = useSharedValue(false);
  const isBall2Collided = useSharedValue(false);
  //ball
  const ballX = useDerivedValue(() => WIDTH / 2);
  const ballY = useDerivedValue(() => HEIGHT / 2 + BALL_DIAMETER / 4);
  const ballVx = useSharedValue(0);
  const ballVy = useSharedValue(0);

  const isBallCollided = useDerivedValue(() => {
    const distanceBetweenCentresP1 = Math.sqrt(
      (dragX1.value - ballX.value) * (dragX1.value - ballX.value) +
        (dragY1.value - ballY.value) * (dragY1.value - ballY.value),
    );
    const distanceBetweenCentresP2 = Math.sqrt(
      (dragX2.value - ballX.value) * (dragX2.value - ballX.value) +
        (dragY2.value - ballY.value) * (dragY2.value - ballY.value),
    );
    const criticalDistance = (FINAL_DIAMETER + BALL_DIAMETER) / 2;

    if (distanceBetweenCentresP1 <= criticalDistance) {
      isBall1Collided.value = true;
      isBall2Collided.value = false;
    } else if (distanceBetweenCentresP2 <= criticalDistance) {
      isBall1Collided.value = false;
      isBall2Collided.value = true;
    } else {
      isBall1Collided.value = false;
      isBall2Collided.value = false;
      return false;
    }
    return true;
  });

  useDerivedValue(() => {
    if (isBallCollided.value) {
      ballX.value = withReflection({
        velocity:
          isP1Dragging.value && isBall1Collided.value
            ? velocityX1.value * 5
            : isP2Dragging.value && isBall2Collided.value
            ? velocityX2.value * 5
            : ballVx.value,
        clamp: [SIDE_BORDER_WIDTH, WIDTH - SIDE_BORDER_WIDTH],
      });

      ballY.value = withReflection({
        velocity:
          isP1Dragging.value && isBall1Collided.value
            ? velocityY1.value * 5
            : isP2Dragging.value && isBall2Collided.value
            ? velocityY2.value * 5
            : ballVy.value,
        clamp: [
          2 * SIDE_BORDER_WIDTH,
          AVAILABLE_HEIGHT - 2 * SIDE_BORDER_WIDTH,
        ],
      });

      if (isBall1Collided.value && isP1Dragging.value) {
        ballVx.value = getBallVelocity({
          velocity: velocityX1.value * 5,
          clamp: [SIDE_BORDER_WIDTH, WIDTH - SIDE_BORDER_WIDTH],
        });
        ballVy.value = getBallVelocity({
          velocity: velocityY1.value * 5,
          clamp: [
            2 * SIDE_BORDER_WIDTH,
            AVAILABLE_HEIGHT - 2 * SIDE_BORDER_WIDTH,
          ],
        });
      }
      if (isBall2Collided.value && isP2Dragging.value) {
        ballVx.value = getBallVelocity({
          velocity: velocityX2.value * 2,
          clamp: [SIDE_BORDER_WIDTH, WIDTH - SIDE_BORDER_WIDTH],
        });
        ballVy.value = getBallVelocity({
          velocity: velocityY2.value * 2,
          clamp: [
            2 * SIDE_BORDER_WIDTH,
            AVAILABLE_HEIGHT - 2 * SIDE_BORDER_WIDTH,
          ],
        });
      }
    }
  });

  const resetBallParameters = () => {
    'worklet';

    // ball parameters
    ballX.value = WIDTH / 2;
    ballY.value = HEIGHT / 2;
    ballVx.value = 0;
    ballVy.value = 0;
  };

  useDerivedValue(() => {
    if (ballY.value <= SIDE_BORDER_WIDTH + BALL_DIAMETER / 2) {
      if (ballX.value > WIDTH * 0.3 && ballX.value < WIDTH * 0.7) {
        runOnJS(incrementGoal)('Player2');
        resetBallParameters();
      }
    }
    if (ballY.value >= HEIGHT - SIDE_BORDER_WIDTH) {
      if (ballX.value > WIDTH * 0.3 && ballX.value < WIDTH * 0.7) {
        runOnJS(incrementGoal)('Player1');
        resetBallParameters();
      }
    }
  });

  const onGestureEvent1 = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.startX = dragX1.value;
      ctx.startY = dragY1.value;
    },
    onActive: (event, ctx) => {
      dragX1.value = ctx.startX + event.translationX;
      dragY1.value = ctx.startY + event.translationY;
      velocityX1.value = event.velocityX;
      velocityY1.value = event.velocityY;
      isP1Dragging.value = true;
    },
    onEnd: (event, ctx) => {
      isP1Dragging.value = false;
    },
  });
  const onGestureEvent2 = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.startX = dragX2.value;
      ctx.startY = dragY2.value;
    },
    onActive: (event, ctx) => {
      dragX2.value = ctx.startX + event.translationX;
      dragY2.value = ctx.startY + event.translationY;
      velocityX2.value = event.velocityX;
      velocityY2.value = event.velocityY;
      isP2Dragging.value = true;
    },
    onEnd: (event, ctx) => {
      isP2Dragging.value = false;
    },
  });

  const player1Style = useAnimatedStyle(() => {
    const {playerX, playerY} = handleBoundaryCondition(
      dragX1.value,
      dragY1.value,
      FINAL_DIAMETER / 2,
      HEIGHT / 2,
    );
    dragX1.value = playerX;
    dragY1.value = playerY;
    return {
      width: FINAL_DIAMETER,
      height: FINAL_DIAMETER,
      borderRadius: FINAL_DIAMETER / 2,
      backgroundColor: COLORS.PLAYER_1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 4,
      borderColor: COLORS.BALL,
      position: 'absolute',
      zIndex: 99999,
      transform: [
        {
          translateY: dragY1.value - FINAL_DIAMETER / 2,
        },
        {
          translateX: dragX1.value - FINAL_DIAMETER / 2,
        },
      ],
    };
  });
  const player2Style = useAnimatedStyle(() => {
    const {playerX, playerY} = handleBoundaryCondition(
      dragX2.value,
      dragY2.value,
      HEIGHT / 2 + FINAL_DIAMETER / 2,
      HEIGHT,
    );
    dragX2.value = playerX;
    dragY2.value = playerY;

    return {
      width: FINAL_DIAMETER,
      height: FINAL_DIAMETER,
      borderRadius: FINAL_DIAMETER / 2,
      backgroundColor: COLORS.PLAYER_2,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 4,
      borderColor: COLORS.BALL,
      position: 'absolute',
      zIndex: 99999,
      transform: [
        {
          translateY: dragY2.value - FINAL_DIAMETER / 2,
        },
        {
          translateX: dragX2.value - FINAL_DIAMETER / 2,
        },
      ],
    };
  });

  const ballStyle = useAnimatedStyle(() => {
    return {
      width: BALL_DIAMETER,
      height: BALL_DIAMETER,
      borderRadius: BALL_DIAMETER / 2,
      position: 'absolute',
      zIndex: 99999,
      transform: [
        {translateX: ballX.value - BALL_DIAMETER / 2},
        {translateY: ballY.value - BALL_DIAMETER / 2},
      ],
      backgroundColor: COLORS.WHITE,
      borderWidth: 2,

      borderColor: COLORS.BALL,

      shadowColor: COLORS.BALL,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.8,
      shadowRadius: 4,
    };
  });

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.wrapperParentContainer}>
          <Boundary />
          <Animated.View style={ballStyle} />
          <PanGestureHandler onGestureEvent={onGestureEvent1}>
            <Animated.View style={player1Style}>
              <Text style={styles.boldWhite}>Player1</Text>
            </Animated.View>
          </PanGestureHandler>
          <PanGestureHandler onGestureEvent={onGestureEvent2}>
            <Animated.View style={player2Style}>
              <Text style={styles.boldWhite}>Player2</Text>
            </Animated.View>
          </PanGestureHandler>
          <View
            style={{
              transform: [
                {translateX: WIDTH - 40},
                {translateY: HEIGHT / 2 - 19},
              ],
              width: 40,
              height: 50,
              borderRadius: BALL_DIAMETER / 2,
              position: 'absolute',
              zIndex: 99999,
            }}>
            <ScoreBoard scores={{p1: p1Score, p2: p2Score}} />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },

  scrollView: {
    backgroundColor: '#dbdbdb',
  },

  wrapperParentContainer: {
    backgroundColor: COLORS.BACKGROUND,
    width: AVAILABLE_WIDTH,
    height: AVAILABLE_HEIGHT,
    borderLeftWidth: SIDE_BORDER_WIDTH,
    borderRightWidth: SIDE_BORDER_WIDTH,
    position: 'relative',
    borderColor: '#00FFFF',
  },

  playersHandle: {
    position: 'relative',
    width: WIDTH,
    height: HEIGHT / 2,
  },
  boldWhite: {
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Game;
