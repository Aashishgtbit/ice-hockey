/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import {Svg, Rect, Defs, Circle, Stop, LinearGradient} from 'react-native-svg';
import {Constants} from 'react-native-unimodules';
console.log(Constants.systemFonts);

import Animated, {
  cond,
  call,
  lessThan,
  greaterThan,
  sub,
  useValue,
  useCode,
} from 'react-native-reanimated';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import AnimatedGoal from './GoalText';
// const AnimatedCircle = Animated.createAnimatedComponent(Circle);
import {interaction, handleBallInteraction} from './src/utils/helper';
import {
  AVAILABLE_HEIGHT,
  AVAILABLE_WIDTH,
  WIDTH,
  SIDE_BORDER_WIDTH,
  PLAYER,
  HEIGHT,
  BALL_DIAMETER,
  FINAL_DIAMETER,
  AXIS,
  COLORS,
  height,
  PENULTIMATE_SCORE,
} from './src/utils/Constants/appConstants';
import CustomModal from './src/components/CustomModal';
import Result from './src/components/CustomModal/Result';
import {Audio} from 'expo-av';
// import {asset} from 'expo-asset';
const App = () => {
  console.log(WIDTH, HEIGHT);
  const [sound, setSound] = useState();

  async function playSound() {
    console.log('Playing Sound');
    await sound.replayAsync();
  }
  const loadSound = async () => {
    console.log('Loading Sound');
    const {sound} = await Audio.Sound.createAsync(
      require('./src/assets/bathitball.wav'),
    );
    setSound(sound);
  };

  useEffect(() => {
    loadSound();
  }, []);

  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const [scores, setPlayerScores] = useState({p1: 0, p2: 0});
  const [showGoalText, setShowGoalText] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  // player 1
  const dragX1 = useValue(0);
  const dragY1 = useValue(0);
  const offsetX1 = WIDTH / 2 - FINAL_DIAMETER / 2;
  const offsetY1 = HEIGHT / 4 - FINAL_DIAMETER / 2;
  const gestureState1 = useValue(State.UNDETERMINED);
  const dragVX = useValue(0);
  const dragVY = useValue(0);

  // player2
  const dragX2 = useValue(0);
  const dragY2 = useValue(0);

  const offsetX2 = WIDTH / 2 - FINAL_DIAMETER / 2;
  const offsetY2 = HEIGHT * 0.75 - FINAL_DIAMETER / 2;
  const gestureState2 = useValue(State.UNDETERMINED);
  const dragVX2 = useValue(0);
  const dragVY2 = useValue(0);

  // Ball
  const ballTransX = useValue(WIDTH / 2);
  const ballTransY = useValue(HEIGHT / 2);
  const currX = useValue(0);
  const currY = useValue(0);

  const handlResultModalClose = () => {
    setShowResultModal(false);
    setPlayerScores({p1: 0, p2: 0});
  };

  const onGestureEvent1 = Animated.event(
    [
      {
        nativeEvent: {
          translationX: dragX1,
          translationY: dragY1,
          state: gestureState1,
          x: currX,
          y: currY,
          velocityX: dragVX,
          velocityY: dragVY,
        },
      },
    ],
    {useNativeDriver: true},
  );

  const onGestureEvent2 = Animated.event(
    [
      {
        nativeEvent: {
          translationX: dragX2,
          translationY: dragY2,
          state: gestureState2,
          velocityX: dragVX2,
          velocityY: dragVY2,
        },
      },
    ],
    {useNativeDriver: true},
  );

  const p1 = interaction(
    gestureState1,
    dragX1,
    offsetX1,
    AXIS.X,
    PLAYER.PLAYER1,
    playSound,
  );

  const translateX1 = p1[0];

  const translateY1 = interaction(
    gestureState1,
    dragY1,
    offsetY1,
    AXIS.Y,
    PLAYER.PLAYER1,
    playSound,
  )[0];

  const translateX2 = interaction(
    gestureState2,
    dragX2,
    offsetX2,
    AXIS.X,
    PLAYER.PLAYER2,
    playSound,
  )[0];

  const translateY2 = interaction(
    gestureState2,
    dragY2,
    offsetY2,
    AXIS.Y,
    PLAYER.PLAYER2,
    playSound,
  )[0];

  // player 1

  const player1Position = {transX: translateX1, transY: translateY1};
  const player1Velocity = {vx: dragVX, vy: dragVY};
  const ballPosition = {x: ballTransX, y: ballTransY};

  // player 2

  const player2Position = {transX: translateX2, transY: translateY2};

  const _ballX = handleBallInteraction(
    gestureState1,
    gestureState2,
    ballPosition,
    player1Velocity,
    player1Position,
    player2Position,
    AXIS.X,
    playSound,
  );
  const _ballY = handleBallInteraction(
    gestureState1,
    gestureState2,
    ballPosition,
    player1Velocity,
    player1Position,
    player2Position,
    AXIS.Y,
    playSound,
  );
  useCode(
    () =>
      cond(
        lessThan(_ballY, -20),
        call([], () => {
          const b = scores;
          b.p2 = b.p2 + 1;
          playSound();
          setPlayerScores({...b});
        }),
        cond(
          greaterThan(_ballY, HEIGHT + 20),
          call([], () => {
            const b = scores;
            b.p1 = b.p1 + 1;
            playSound();
            setPlayerScores({...b});
          }),
        ),
      ),
    [_ballY],
  );
  useEffect(() => {
    if (scores.p2 > 0 || scores.p1 > 0) {
      if (scores.p2 >= PENULTIMATE_SCORE || scores.p1 >= PENULTIMATE_SCORE) {
        setShowResultModal(true);
      } else {
        // playSound();
        setShowGoalText(true);
        setTimeout(() => {
          setShowGoalText(false);
        }, 1000);
      }
    }
  }, [scores]);
  const {p1: p1Score, p2: p2Score} = scores;

  return (
    <>
      {/* <StatusBar hidden /> */}
      <SafeAreaView style={styles.container}>
        <View style={styles.wrapperParentContainer}>
          {/* <Button title="Play" onPress={playSound} /> */}
          <Svg
            height={AVAILABLE_HEIGHT + 10}
            width={SIDE_BORDER_WIDTH}
            style={{
              position: 'absolute',
              zIndex: 999,
              left: -SIDE_BORDER_WIDTH,
            }}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#FFD080" stopOpacity="1" />
                <Stop offset="1" stopColor="red" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect
              x="0"
              y="0"
              width={SIDE_BORDER_WIDTH}
              height={AVAILABLE_HEIGHT}
              fill="url(#grad)"
            />
          </Svg>

          <Svg
            height={AVAILABLE_HEIGHT + 10}
            width={SIDE_BORDER_WIDTH}
            style={{position: 'absolute', zIndex: 999, left: WIDTH}}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#FFD080" stopOpacity="1" />
                <Stop offset="1" stopColor="red" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect
              x="0"
              y="0"
              width={SIDE_BORDER_WIDTH}
              height={AVAILABLE_HEIGHT}
              fill="url(#grad)"
            />
          </Svg>

          <Svg height="10" width={WIDTH}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="#FFD080" stopOpacity="1" />
                <Stop offset="1" stopColor="red" stopOpacity="1" />
              </LinearGradient>
              <LinearGradient id="revGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="red" stopOpacity="1" />
                <Stop offset="1" stopColor="#FFD080" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect
              x="0"
              y="0"
              width={WIDTH * 0.3}
              height="10"
              fill="url(#grad)"
            />
            <Rect
              x={WIDTH * 0.7}
              y="0"
              width={WIDTH * 0.3}
              height="10"
              fill="url(#revGrad)"
            />
          </Svg>

          <Svg
            height="10"
            width={WIDTH}
            style={{zIndex: 9999, position: 'absolute', top: HEIGHT + 10}}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="red" stopOpacity="1" />
                <Stop offset="1" stopColor="#FFD080" stopOpacity="1" />
              </LinearGradient>
              <LinearGradient id="revGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="1" stopColor="red" stopOpacity="1" />
                <Stop offset="0" stopColor="#FFD080" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect
              x="0"
              y="0"
              width={WIDTH * 0.3}
              height="10"
              fill="url(#grad)"
            />
            <Rect
              x={WIDTH * 0.7}
              y="0"
              width={WIDTH * 0.3}
              height="10"
              fill="url(#revGrad)"
            />
          </Svg>

          <Svg
            height={WIDTH * 0.4}
            width={WIDTH * 0.4}
            style={{
              position: 'absolute',
              zIndex: -1,
              left: WIDTH / 2 - WIDTH * 0.2,
              top: HEIGHT / 2 - WIDTH * 0.2 - 4 + 10,
            }}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#FFD080" stopOpacity="1" />
                <Stop offset="1" stopColor="red" stopOpacity="1" />
              </LinearGradient>
            </Defs>

            <Circle
              cx={WIDTH * 0.2}
              cy={WIDTH * 0.2}
              r={WIDTH * 0.2 - 4}
              stroke="url(#grad)"
              strokeWidth="4"
            />
          </Svg>

          <Svg
            height={WIDTH * 0.4}
            width={WIDTH * 0.8}
            style={{
              position: 'absolute',
              zIndex: -1,
              left: WIDTH / 2 - WIDTH * 0.4,
              // top: HEIGHT / 2 - 90,
            }}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#FFD080" stopOpacity="1" />
                <Stop offset="1" stopColor="red" stopOpacity="1" />
              </LinearGradient>
            </Defs>

            <Circle
              cx={WIDTH * 0.4}
              cy="0"
              r={WIDTH * 0.2}
              stroke="url(#grad)"
              strokeWidth="4"
            />
          </Svg>
          <Svg
            height={WIDTH * 0.4}
            width={WIDTH * 0.8}
            style={{
              position: 'absolute',
              zIndex: -1,
              left: WIDTH / 2 - WIDTH * 0.4,
              top: HEIGHT - WIDTH * 0.4 + 20,
            }}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#FFD080" stopOpacity="1" />
                <Stop offset="1" stopColor="red" stopOpacity="1" />
              </LinearGradient>
            </Defs>

            <Circle
              cx={WIDTH * 0.4}
              cy={WIDTH * 0.4}
              r={WIDTH * 0.2}
              stroke="url(#grad)"
              strokeWidth="4"
            />
          </Svg>
          <Animated.View
            style={{
              width: BALL_DIAMETER,
              height: BALL_DIAMETER,
              borderRadius: BALL_DIAMETER / 2,

              transform: [
                {translateX: sub(_ballX, BALL_DIAMETER / 2)},
                {translateY: sub(_ballY, BALL_DIAMETER / 2)},
              ],
              backgroundColor: COLORS.WHITE,
              zIndex: 9,
              borderWidth: 2,

              borderColor: COLORS.BALL,

              shadowColor: COLORS.BALL,
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.8,
              shadowRadius: 4,
            }}
          />
          <PanGestureHandler
            onGestureEvent={onGestureEvent1}
            onHandlerStateChange={onGestureEvent1}>
            <Animated.View
              style={{
                width: FINAL_DIAMETER,
                height: FINAL_DIAMETER,
                borderRadius: FINAL_DIAMETER / 2,
                transform: [
                  {translateX: translateX1},
                  {
                    translateY: sub(translateY1, BALL_DIAMETER),
                  },
                ],
                backgroundColor: COLORS.PLAYER_1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 4,
                borderColor: COLORS.BALL,
              }}>
              <Text style={styles.boldWhite}>Player1</Text>
            </Animated.View>
          </PanGestureHandler>

          <PanGestureHandler
            onGestureEvent={onGestureEvent2}
            onHandlerStateChange={onGestureEvent2}>
            <Animated.View
              style={{
                width: FINAL_DIAMETER,
                height: FINAL_DIAMETER,
                borderRadius: FINAL_DIAMETER / 2,
                transform: [
                  {translateX: translateX2},
                  {
                    translateY: sub(
                      translateY2,
                      FINAL_DIAMETER + BALL_DIAMETER,
                    ),
                  },
                ],
                backgroundColor: COLORS.PLAYER_2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 4,
                borderColor: COLORS.BALL,
              }}>
              <Text style={styles.boldWhite}>Player2</Text>
            </Animated.View>
          </PanGestureHandler>

          {/* <View
            style={{
              position: 'absolute',
              width: AVAILABLE_WIDTH,
              height: SIDE_BORDER_WIDTH,
              backgroundColor: COLORS.BORDER,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              top: height - SIDE_BORDER_WIDTH - 2,
            }}>
            <View
              style={{
                width: AVAILABLE_WIDTH * 0.4,
                height: SIDE_BORDER_WIDTH,
                backgroundColor: COLORS.BACKGROUND,
                marginRight: 2 * SIDE_BORDER_WIDTH,
              }}
            />
          </View> */}

          <View
            style={{
              zIndex: 999999,
              top: HEIGHT / 2 - 41,
              left: WIDTH - 50,
              height: 100,
              width: 50,
              // backgroundColor: COLORS.BORDER,
              position: 'absolute',
              // opacity: 0.5,
              display: 'flex',
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 24, fontWeight: 'bold', color: 'red'}}>
                {p1Score}
              </Text>
            </View>
            <View style={{height: 2, backgroundColor: 'orange'}} />
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: COLORS.PLAYER_2,
                }}>
                {p2Score}
              </Text>
            </View>
          </View>
          <View
            style={{
              zIndex: -1,
              top: HEIGHT / 2 + 7,
              left: 0,
              height: 4,
              width: WIDTH,
              backgroundColor: 'orange',
              position: 'absolute',
              // opacity: 0.5,
            }}
          />
          {showGoalText && (
            <View
              style={{
                zIndex: 999999,
                height: HEIGHT,
                width: WIDTH,
                position: 'absolute',
                opacity: 1,
              }}>
              <AnimatedGoal />
            </View>
          )}

          {showResultModal && (
            <CustomModal isOpen={true} handleModalClose={handlResultModalClose}>
              <Result
                handleModalClose={handlResultModalClose}
                winnerText={
                  scores.p1 > scores.p2 ? 'Player1 wins' : 'Player2 wins'
                }
              />
            </CustomModal>
          )}
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

export default App;
