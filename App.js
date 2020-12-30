/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
} from 'react-native';
import {useWindowDimensions} from 'react-native';

import {Svg, Circle, Rect, Line, Text as SvgText, Path} from 'react-native-svg';
import Animated, {
  Value,
  interpolate,
  Clock,
  event,
  cond,
  eq,
  add,
  set,
  call,
  defined,
  diff,
  multiply,
  lessThan,
  stopClock,
  clockRunning,
  startClock,
  spring,
  divide,
  greaterThan,
  abs,
  debug,
  neq,
  or,
  sub,
  sqrt,
  block,
  not,
  and,
  useValue,
  useCode,
} from 'react-native-reanimated';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import AnimatedGoal from './GoalText';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const {width, height} = Dimensions.get('window');
const AVAILABLE_WIDTH = width;
const AVAILABLE_HEIGHT = height;
const SIDE_BORDER_WIDTH = 10;
const WIDTH = width - 2 * SIDE_BORDER_WIDTH;
const HEIGHT = height - 2 * SIDE_BORDER_WIDTH;
const RADIUS = 40;
const STROKE_WIDTH = 2.5;
const FINAL_RADIUS = RADIUS + STROKE_WIDTH;
const FINAL_DIAMETER = 2 * (RADIUS + STROKE_WIDTH);

const BALL_DIAMETER = (3 * RADIUS) / 4;
const PLAYER = {PLAYER1: 'PLAYER1', PLAYER2: 'PLAYER2'};

const AXIS = {
  X: 'X',
  Y: 'Y',
};

function handleBallInteraction(
  gestureState,
  gestureState2,
  ballTrans,
  playerVelocity,
  player1Position,
  player2Position,
  axis,
) {
  const position = axis === AXIS.X ? ballTrans.x : ballTrans.y;
  const velocity = useValue(0);
  const clock = new Clock();
  const dt = divide(diff(clock), 1000);
  const ballTransX = ballTrans.x;
  const ballTransY = ballTrans.y;

  const playerD = useValue(FINAL_DIAMETER / 2);
  const dx = sub(add(player1Position.transX, playerD), ballTransX);
  const dy = sub(add(player1Position.transY, playerD), ballTransY);

  const dx2 = sub(add(player2Position.transX, playerD), ballTransX);
  const dy2 = sub(add(player2Position.transY, playerD), ballTransY);
  const isPlayer1Collided = useValue(0);
  const isPlayer2Collided = useValue(0);
  const distanceBetweenCenters2 = sqrt(
    add(multiply(dx2, dx2), multiply(dy2, dy2)),
  );
  const distanceBetweenCenters = sqrt(add(multiply(dx, dx), multiply(dy, dy)));

  return cond(
    or(lessThan(ballTrans.y, -20), greaterThan(ballTrans.y, HEIGHT + 20)),
    [
      stopClock(clock),
      set(velocity, 0),
      cond(
        axis === AXIS.X,
        set(position, WIDTH / 2),
        set(position, HEIGHT / 2),
      ),
    ],
    [
      cond(
        or(eq(gestureState, State.ACTIVE), eq(gestureState2, State.ACTIVE)),
        [
          cond(
            or(
              cond(
                and(
                  eq(gestureState, State.ACTIVE),
                  lessThan(
                    distanceBetweenCenters,
                    (FINAL_DIAMETER + BALL_DIAMETER) / 2,
                  ),
                ),
                set(isPlayer1Collided, 1),
                set(isPlayer1Collided, 0),
              ),
              cond(
                and(
                  eq(gestureState2, State.ACTIVE),
                  lessThan(
                    distanceBetweenCenters2,
                    (FINAL_DIAMETER + BALL_DIAMETER) / 2,
                  ),
                ),
                set(isPlayer2Collided, 1),
                set(isPlayer2Collided, 0),
              ),
            ),
            [
              startClock(clock),
              dt,
              cond(
                isPlayer1Collided,
                handleBallCollision(axis, ballTrans, velocity, player1Position),
                handleBallCollision(axis, ballTrans, velocity, player2Position),
              ),

              forceBall(dt, position, velocity, false),

              handleBoundaryReflection(
                position,
                axis,
                BALL_DIAMETER,
                velocity,
                dt,
                ballTrans,
              ),
              damping(dt, velocity),
              set(position, add(position, multiply(velocity, dt))),
            ],
            cond(
              clockRunning(clock),
              [
                cond(
                  or(
                    lessThan(
                      distanceBetweenCenters,
                      (FINAL_DIAMETER + BALL_DIAMETER) / 2,
                    ),
                    lessThan(
                      distanceBetweenCenters2,
                      (FINAL_DIAMETER + BALL_DIAMETER) / 2,
                    ),
                  ),
                  [set(velocity, multiply(-1, velocity))],
                ),

                handleBoundaryReflection(
                  position,
                  axis,
                  BALL_DIAMETER,
                  velocity,
                  dt,
                  ballTrans,
                ),
                damping(dt, velocity),
                set(position, add(position, multiply(velocity, dt))),
              ],
              set(position, add(position, multiply(velocity, dt))),
            ),
          ),
        ],
        [
          cond(
            and(
              clockRunning(clock),
              or(
                lessThan(
                  distanceBetweenCenters,
                  (FINAL_DIAMETER + BALL_DIAMETER) / 2,
                ),
                lessThan(
                  distanceBetweenCenters2,
                  (FINAL_DIAMETER + BALL_DIAMETER) / 2,
                ),
              ),
            ),
            [
              set(velocity, multiply(-1, velocity)),
              damping(dt, velocity),

              set(position, add(position, multiply(velocity, dt))),
            ],
            [velocity],
          ),
          damping(dt, velocity),
          handleBoundaryReflection(
            position,
            axis,
            BALL_DIAMETER,
            velocity,
            dt,
            ballTrans,
          ),
          set(position, add(position, multiply(velocity, dt))),
        ],
      ),
    ],
  );
}

function handleBallCollision(axis, ballPosition, velocity, playerPosition) {
  return set(
    velocity,
    cond(
      axis === AXIS.Y,
      [handleVelocityOnCollision(velocity, playerPosition, ballPosition, axis)],
      [handleVelocityOnCollision(velocity, playerPosition, ballPosition, axis)],
    ),
  );
}

function handleVelocityOnCollision(
  velocity,
  playerPosition,
  ballPosition,
  axis,
) {
  return block(
    cond(
      axis === AXIS.Y,
      [
        cond(
          and(
            greaterThan(
              add(ballPosition.x, BALL_DIAMETER / 2),
              playerPosition.transX,
            ),
          ),
          [
            cond(
              lessThan(ballPosition.y, playerPosition.transY),
              [cond(greaterThan(velocity, 0), [multiply(-10, 60)], velocity)],
              [
                cond(
                  greaterThan(ballPosition.y, playerPosition.transY),
                  multiply(10, 60),
                ),
              ],
            ),
          ],
          [velocity],
        ),
      ],

      cond(
        lessThan(ballPosition.x, playerPosition.transX),
        [multiply(-10, 60)],
        cond(
          greaterThan(
            ballPosition.x,
            add(playerPosition.transX, BALL_DIAMETER / 2),
          ),
          multiply(10, 60),
        ),
      ),
    ),
  );
}

function handleBoundaryReflection(
  position,
  axis,
  itemDiameter,
  velocity,
  dt,
  ballTrans,
) {
  const ballX = ballTrans.x;
  const ballY = ballTrans.y;

  return set(
    velocity,

    cond(
      and(
        lessThan(ballY, itemDiameter / 2),
        greaterThan(ballX, (3 * AVAILABLE_WIDTH) / 10),
        lessThan(ballX, (7 * AVAILABLE_WIDTH) / 10),
      ),
      [velocity],
      [
        cond(
          and(
            greaterThan(ballY, HEIGHT - itemDiameter / 2),
            greaterThan(ballX, (3 * AVAILABLE_WIDTH) / 10),
            lessThan(ballX, (7 * AVAILABLE_WIDTH) / 10),
          ),
          [velocity],
          [
            cond(
              axis === AXIS.X,
              [
                cond(
                  lessThan(ballX, itemDiameter / 2),
                  [multiply(-1, velocity)],
                  cond(
                    greaterThan(ballX, WIDTH - itemDiameter / 2),
                    [multiply(-1, velocity)],
                    velocity,
                  ),
                ),
              ],
              [
                cond(
                  lessThan(ballY, itemDiameter / 2),
                  [multiply(-1, velocity)],
                  cond(
                    greaterThan(ballY, HEIGHT - itemDiameter / 2),
                    [multiply(-1, velocity)],
                    velocity,
                  ),
                ),
              ],
            ),
          ],
        ),
      ],
    ),
  );
}

function forceBall(dt, position, velocity, isPlayerStatic, mass = 1) {
  const changeInVelocity = useValue(20);
  let acc = useValue(60);
  if (isPlayerStatic) {
    acc = 0;
  }

  return set(velocity, add(velocity, acc));
}

function interaction(
  gestureState,
  gestureTranslation,
  initialOffset,
  axis,
  currentActivePlayer,
) {
  const start = useValue(0);
  const dragging = useValue(0);
  const position = useValue(initialOffset);
  const velocity = useValue(0);
  const clock = new Clock();
  const dt = divide(diff(clock), 1000);
  const axisValue = axis === AXIS.X ? useValue('X') : useValue('Y');
  return [
    cond(
      eq(gestureState, State.ACTIVE),
      [
        cond(eq(dragging, 0), [set(dragging, 1), set(start, position)]),
        stopClock(clock),
        dt,
        set(position, add(start, gestureTranslation)),
        handleBoundaryCondition(
          position,
          axis,
          FINAL_DIAMETER,
          currentActivePlayer,
        ),
        position,
      ],
      [
        set(dragging, 0),
        startClock(clock),
        cond(neq(gestureState, State.UNDETERMINED), []),
        stopClock(clock),
        set(position, add(position, multiply(velocity, dt))),
      ],
    ),
    start,
  ];
}

function handleBoundaryCondition(
  position,
  axis,
  itemDiameter,
  currentActivePlayer,
) {
  let playerRange = {
    min: 0,
    max: HEIGHT,
  };
  if (currentActivePlayer === PLAYER.PLAYER1) {
    playerRange.min = 0;
    playerRange.max = HEIGHT / 2 - itemDiameter;
  } else {
    playerRange.min = HEIGHT / 2;
    playerRange.max = HEIGHT - itemDiameter;
  }
  return set(
    position,
    cond(
      axis === AXIS.X,
      [
        cond(
          lessThan(position, 0),
          [0],
          cond(
            greaterThan(position, WIDTH - itemDiameter),
            [WIDTH - itemDiameter],
            position,
          ),
        ),
      ],
      [
        cond(
          lessThan(position, playerRange.min),
          [playerRange.min],
          cond(
            greaterThan(position, playerRange.max),
            [playerRange.max],
            position,
          ),
        ),
      ],
    ),
  );
}

function damping(dt, velocity, mass = 1, damping = 0.5) {
  const acc = divide(multiply(-1, damping, velocity), mass);
  return set(velocity, add(velocity, multiply(dt, acc)));
}

const App = () => {
  const [scores, setPlayerScores] = useState({p1: 0, p2: 0});
  const [showGoalText, setShowGoalText] = useState(false);
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
  );

  const translateX1 = p1[0];

  const translateY1 = interaction(
    gestureState1,
    dragY1,
    offsetY1,
    AXIS.Y,
    PLAYER.PLAYER1,
  )[0];

  const translateX2 = interaction(
    gestureState2,
    dragX2,
    offsetX2,
    AXIS.X,
    PLAYER.PLAYER2,
  )[0];

  const translateY2 = interaction(
    gestureState2,
    dragY2,
    offsetY2,
    AXIS.Y,
    PLAYER.PLAYER2,
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
  );
  const _ballY = handleBallInteraction(
    gestureState1,
    gestureState2,
    ballPosition,
    player1Velocity,
    player1Position,
    player2Position,
    AXIS.Y,
  );
  useCode(
    () =>
      cond(
        lessThan(_ballY, -20),
        call([], () => {
          const b = scores;
          b.p2 = b.p2 + 1;
          setPlayerScores({...b});
        }),
        cond(
          greaterThan(_ballY, HEIGHT + 20),
          call([], () => {
            const b = scores;
            b.p1 = b.p1 + 1;
            setPlayerScores({...b});
          }),
        ),
      ),
    [_ballY],
  );
  useEffect(() => {
    if (scores.p2 > 0 || scores.p1 > 0) {
      setShowGoalText(true);
      setTimeout(() => {
        setShowGoalText(false);
      }, 1000);
    }
  }, [scores]);
  const {p1: p1Score, p2: p2Score} = scores;
  return (
    <>
      {/* <StatusBar hidden /> */}
      <SafeAreaView style={styles.container}>
        <View style={styles.wrapperParentContainer}>
          <View
            style={{
              // position: 'absolute',
              // zIndex: 99999,
              width: AVAILABLE_WIDTH,
              height: SIDE_BORDER_WIDTH,
              backgroundColor: '#00FFFF',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: AVAILABLE_WIDTH * 0.4,
                height: SIDE_BORDER_WIDTH,
                backgroundColor: '#ffe0fe',
                marginRight: 2 * SIDE_BORDER_WIDTH,
              }}
            />
          </View>
          <Svg>
            <AnimatedCircle
              cx={_ballX}
              cy={_ballY}
              r={BALL_DIAMETER / 2}
              fill="blue"
              stroke="blue"
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
                    {translateY: translateY1},
                  ],
                  backgroundColor: '#f00',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 4,
                  borderColor: '#00f',
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
                    {translateY: sub(translateY2, FINAL_DIAMETER)},
                  ],
                  backgroundColor: '#FFA500',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 4,
                  borderColor: '#00f',
                }}>
                <Text style={styles.boldWhite}>Player2</Text>
              </Animated.View>
            </PanGestureHandler>
          </Svg>
          <View
            style={{
              width: AVAILABLE_WIDTH,
              height: SIDE_BORDER_WIDTH,
              backgroundColor: '#00FFFF',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bottom: SIDE_BORDER_WIDTH * 2,
              zIndex: -1,
            }}>
            <View
              style={{
                width: AVAILABLE_WIDTH * 0.4,
                height: SIDE_BORDER_WIDTH,
                backgroundColor: '#ffe0fe',
                marginRight: 2 * SIDE_BORDER_WIDTH,
              }}
            />
          </View>

          <View
            style={{
              zIndex: 999999,
              top: HEIGHT / 2 - 41,
              left: WIDTH - 50,
              height: 100,
              width: 50,
              backgroundColor: 'aqua',
              position: 'absolute',
              opacity: 0.5,
              display: 'flex',
            }}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 20, color: 'red'}}>{p1Score}</Text>
            </View>
            <View style={{height: 2, backgroundColor: 'orange'}} />
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 20, color: 'blue'}}>{p2Score}</Text>
            </View>
          </View>
          <View
            style={{
              zIndex: -1,
              top: HEIGHT / 2 + 7,
              left: 0,
              height: 4,
              width: WIDTH,
              backgroundColor: 'aqua',
              position: 'absolute',
              opacity: 0.5,
            }}></View>
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
    backgroundColor: '#ffe0fe',
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
