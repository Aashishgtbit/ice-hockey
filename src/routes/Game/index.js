/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useCallback, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ToastAndroid,
  Platform,
} from 'react-native';

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
  PENULTIMATE_SCORE,
} from '../../utils/Constants/appConstants';
import {Boundary} from '../../components/Boundary';
import {withReflection} from '../../utils/customAnimations/withReflection';
import {handleBoundaryCondition} from '../../utils/helper2';
import ScoreBoard from '../../components/ScoreBoard';
import CustomModal from '../../components/CustomModal';
import Result from '../../components/CustomModal/Result';
import AnimatedGoal from '../../components/AnimatedGoal';

import io from 'socket.io-client';

const socket = io('http://192.168.0.103:8001');

const Game = () => {
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [showResult, setShowResultModal] = useState(false);
  const [showGoal, setShowGoal] = useState(false);

  const [connectedUser, setConnectedUser] = useState([]);
  const currentUser = useSharedValue('');

  useEffect(() => {
    if (p1Score === PENULTIMATE_SCORE || p2Score === PENULTIMATE_SCORE) {
      setShowResultModal(true);
    }
  }, [p1Score, p2Score]);

  const handleResultModalClose = useCallback(() => {
    setShowResultModal(false);
    setP1Score(0);
    setP2Score(0);
  }, []);

  const handleShowGoal = useCallback(() => {
    setShowGoal(false);
  }, []);

  const incrementGoal = (player) => {
    if (player === 'Player1') {
      setP1Score(p1Score + 1);
    } else {
      setP2Score(p2Score + 1);
    }
    setShowGoal(true);
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
  const ballX = useSharedValue(WIDTH / 2);
  const ballY = useSharedValue(HEIGHT / 2 + BALL_DIAMETER / 4);
  const ballVx = useSharedValue(0);
  const ballVy = useSharedValue(0);

  useEffect(() => {
    socket.emit('joinRoom', {
      username: 'Aashish',
      roomname: 'IceHockey',
      screenDimension: {width: WIDTH, height: HEIGHT},
    });
    socket.on('message', (data) => {
      if (Platform.OS === 'android') {
        ToastAndroid.show(data.text, ToastAndroid.LONG);
      }
    });

    socket.on('getUsers', (data) => {
      setConnectedUser(data);
    });
    socket.on('positionChangeBall', (data) => {
      if (
        (currentUser.value === 'Player1' &&
          data.lastUserCollided === 'Player2') ||
        (currentUser.value === 'Player2' && data.lastUserCollided === 'Player1')
      ) {
        console.log('received BallPositionData : ', data);
        console.log('currentUser : ', currentUser);
        ballX.value = data.x;
        ballY.value = data.y;
        ballVx.value = data.Vx;
        ballVy.value = data.Vy;
      }
    });
    return () => socket.disconnect();
  }, [
    dragX1,
    dragY1,
    dragX2,
    dragY2,
    isP1Dragging,
    isP2Dragging,
    ballX,
    ballY,
    currentUser,
    ballVx,
    ballVy,
  ]);

  const updateBallCollidedData = (user) => {
    socket.emit('ballCollided', {
      currentUser: user,
    });
  };

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
      console.log('collided with p1');
      isBall1Collided.value = true;
      isBall2Collided.value = false;
      runOnJS(updateBallCollidedData)('Player1');
    } else if (distanceBetweenCentresP2 <= criticalDistance) {
      console.log('collided with p2');
      isBall1Collided.value = false;
      isBall2Collided.value = true;
      runOnJS(updateBallCollidedData)('Player2');
    } else {
      isBall1Collided.value = false;
      isBall2Collided.value = false;
      return false;
    }
    return true;
  }, [
    dragX1.value,
    dragX2.value,
    dragY1.value,
    dragY2.value,
    ballX.value,
    ballY.value,
  ]);

  socket.on('joinMessage', (data) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(data.text, ToastAndroid.LONG);
    }
    currentUser.value = data.currentUser;
  });

  useDerivedValue(() => {
    if (isBallCollided.value) {
      if (isBall1Collided.value) {
        let dx = dragX1.value - ballX.value;
        let dy = dragY1.value - ballY.value;
        const d = Math.sqrt(dx * dx + dy * dy);
        dx /= d;
        dy /= d;
        const v =
          (velocityX1.value - ballVx.value) * dx +
          (velocityY1.value - ballVy.value) * dy;
        if (v < 0) {
          const a = velocityX1.value * dx + velocityY1.value * dy;
          const b = ballVx.value * dx + ballVy.value * dy;
          ballVx.value += (a - b) * dx * 1.5;
          ballVy.value += (a - b) * dy * 1.5;
          ballX.value = withReflection({
            velocity: ballVx.value,
            ballVelocity: isP1Dragging.value ? ballVx : undefined,
            isPlayerMoving: isP1Dragging.value,
            clamp: [SIDE_BORDER_WIDTH, WIDTH - SIDE_BORDER_WIDTH],
          });
          ballY.value = withReflection({
            velocity: ballVy.value,
            ballVelocity: isP1Dragging.value ? ballVy : undefined,
            isPlayerMoving: isP1Dragging.value,
            clamp: [
              2 * SIDE_BORDER_WIDTH,
              AVAILABLE_HEIGHT - 2 * SIDE_BORDER_WIDTH,
            ],
          });
        }
      } else if (isBall2Collided.value) {
        let dx = dragX2.value - ballX.value;
        let dy = dragY2.value - ballY.value;
        const d = Math.sqrt(dx * dx + dy * dy);
        dx /= d;
        dy /= d;
        const v =
          (velocityX2.value - ballVx.value) * dx +
          (velocityY2.value - ballVy.value) * dy;
        if (v < 0) {
          const a = velocityX2.value * dx + velocityY2.value * dy;
          const b = ballVx.value * dx + ballVy.value * dy;

          ballVx.value += (a - b) * dx * 1.5;
          ballVy.value += (a - b) * dy * 1.5;
          ballX.value = withReflection({
            velocity: ballVx.value,
            ballVelocity: isP2Dragging.value ? ballVx : undefined,
            isPlayerMoving: isP2Dragging.value,
            clamp: [SIDE_BORDER_WIDTH, WIDTH - SIDE_BORDER_WIDTH],
          });
          ballY.value = withReflection({
            velocity: ballVy.value,
            ballVelocity: isP2Dragging.value ? ballVy : undefined,
            isPlayerMoving: isP2Dragging.value,
            clamp: [
              2 * SIDE_BORDER_WIDTH,
              AVAILABLE_HEIGHT - 2 * SIDE_BORDER_WIDTH,
            ],
          });
        }
      }
    }
  }, [isBallCollided.value]);

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
      velocityX1.value = 0;
      velocityY1.value = 0;
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
      velocityX2.value = 0;
      velocityY2.value = 0;
    },
  });

  socket.on('positionChangeP1', (pos) => {
    dragX1.value = pos.x;
    dragY1.value = pos.y;
    isP1Dragging.value = true;
  });
  socket.on('positionChangeP2', (pos) => {
    dragX2.value = pos.x;
    dragY2.value = pos.y;
    isP2Dragging.value = true;
  });

  const sendPlayer1DataToSocket = ({x, y}) => {
    if (currentUser.value === 'Player1') {
      socket.emit('positionChangeP1', {x, y});
    }
  };
  const sendPlayer2DataToSocket = ({x, y}) => {
    if (currentUser.value === 'Player2') {
      socket.emit('positionChangeP2', {x, y});
    }
  };
  const sendBallDataToSocket = ({x, y, Vx, Vy}) => {
    socket.emit('positionChangeBall', {x, y, Vx, Vy});
  };

  const player1Style = useAnimatedStyle(() => {
    runOnJS(sendPlayer1DataToSocket)({x: dragX1.value, y: dragY1.value});
    const {playerX, playerY} = handleBoundaryCondition(
      dragX1.value,
      dragY1.value,
      FINAL_DIAMETER / 2,
      HEIGHT / 2,
    );
    dragX1.value = playerX;
    dragY1.value = playerY;

    return {
      transform: [
        {
          translateY: dragY1.value - FINAL_DIAMETER / 2,
        },
        {
          translateX: dragX1.value - FINAL_DIAMETER / 2,
        },
      ],
    };
  }, [dragX1.value, dragY1.value]);
  const player2Style = useAnimatedStyle(() => {
    runOnJS(sendPlayer2DataToSocket)({x: dragX2.value, y: dragY2.value});
    const {playerX, playerY} = handleBoundaryCondition(
      dragX2.value,
      dragY2.value,
      HEIGHT / 2 + FINAL_DIAMETER / 2,
      HEIGHT,
    );
    dragX2.value = playerX;
    dragY2.value = playerY;

    return {
      transform: [
        {
          translateY: dragY2.value - FINAL_DIAMETER / 2,
        },
        {
          translateX: dragX2.value - FINAL_DIAMETER / 2,
        },
      ],
    };
  }, [dragX2.value, dragY2.value]);

  const ballStyle = useAnimatedStyle(() => {
    runOnJS(sendBallDataToSocket)({
      x: ballX.value,
      y: ballY.value,
      Vx: ballVx.value,
      Vy: ballVy.value,
    });

    return {
      transform: [
        {translateX: ballX.value - BALL_DIAMETER / 2},
        {translateY: ballY.value - BALL_DIAMETER / 2},
      ],
    };
  }, [ballX.value, ballY.value]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.wrapperParentContainer}>
          <Boundary />
          <Animated.View style={[styles.ball, ballStyle]} />
          {currentUser.value === 'Player1' || connectedUser.length === 0 ? (
            <PanGestureHandler onGestureEvent={onGestureEvent1}>
              <Animated.View style={[styles.player1, player1Style]}>
                <Text style={styles.boldWhite}>Player1</Text>
              </Animated.View>
            </PanGestureHandler>
          ) : (
            <Animated.View style={[styles.player1, player1Style]}>
              <Text style={styles.boldWhite}>Player1</Text>
            </Animated.View>
          )}

          {currentUser.value === 'Player2' || connectedUser.length === 0 ? (
            <PanGestureHandler onGestureEvent={onGestureEvent2}>
              <Animated.View style={[styles.player2, player2Style]}>
                <Text style={styles.boldWhite}>Player2</Text>
              </Animated.View>
            </PanGestureHandler>
          ) : (
            <Animated.View style={[styles.player2, player2Style]}>
              <Text style={styles.boldWhite}>Player2</Text>
            </Animated.View>
          )}
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
          {showGoal && <AnimatedGoal handleModalClose={handleShowGoal} />}
          <CustomModal
            isOpen={showResult}
            handleModalClose={handleResultModalClose}>
            <Result
              handleModalClose={handleResultModalClose}
              winnerText={p1Score > p2Score ? 'Player1 wins' : 'Player2 wins'}
            />
          </CustomModal>
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
  player1: {
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
  },
  player2: {
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
  },
  ball: {
    width: BALL_DIAMETER,
    height: BALL_DIAMETER,
    borderRadius: BALL_DIAMETER / 2,
    position: 'absolute',
    zIndex: 99999,

    backgroundColor: COLORS.WHITE,
    borderWidth: 2,
    borderColor: COLORS.BALL,
    shadowColor: COLORS.BALL,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});

export default Game;
