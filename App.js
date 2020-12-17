/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
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
} from 'react-native-reanimated';
import {PanGestureHandler, State} from 'react-native-gesture-handler';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const {width, height} = Dimensions.get('window');
const AVAILABLE_WIDTH = width;
const AVAILABLE_HEIGHT = height;
const SIDE_BORDER_WIDTH = 10;
const WIDTH = width - 2 * SIDE_BORDER_WIDTH;
const HEIGHT = height - 2 * SIDE_BORDER_WIDTH;
const RADIUS = 50;
const STROKE_WIDTH = 2.5;
const FINAL_RADIUS = RADIUS + STROKE_WIDTH;
const FINAL_DIAMETER = 2 * (RADIUS + STROKE_WIDTH);
const VELOCITY_THRESHOLD = 0.5;
const POSITION_THRESHOLD = WIDTH / 2;
const VELOCITY = 100;
const BALL_DIAMETER = (3 * RADIUS) / 3;

const AXIS = {
  X: 'X',
  Y: 'Y',
};

function handleBallInteraction(
  gestureState,
  gestureState2,
  ballTrans,
  playerVelocity,
  // playerPosition,
  // playerPosition1,
  player1Position,
  player2Position,
  axis,
) {
  const start = new Value(0);
  const position = axis === AXIS.X ? ballTrans.x : ballTrans.y;
  const velocity = new Value(0);
  const clock = new Clock();
  const dt = divide(diff(clock), 1000);
  const ballTransX = ballTrans.x;
  const ballTransY = ballTrans.y;

  const playerD = new Value(FINAL_DIAMETER / 2);
  const dx = sub(add(player1Position.transX, playerD), ballTransX);
  const dy = sub(add(player1Position.transY, playerD), ballTransY);

  const dx2 = sub(add(player2Position.transX, playerD), ballTransX);
  const dy2 = sub(add(player2Position.transY, playerD), ballTransY);
  const isPlayer1Collided = new Value(0);
  const isPlayer2Collided = new Value(0);
  const distanceBetweenCenters2 = sqrt(
    add(multiply(dx2, dx2), multiply(dy2, dy2)),
  );
  const distanceBetweenCenters = sqrt(add(multiply(dx, dx), multiply(dy, dy)));
  return cond(
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
                  debug('onBottom', ballPosition.y),
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

    // cond(
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
    // ),
  );
}

function forceBall(dt, position, velocity, isPlayerStatic, mass = 1) {
  const changeInVelocity = new Value(20);
  let acc = new Value(60);
  if (isPlayerStatic) {
    acc = 0;
  }

  return set(velocity, add(velocity, acc));
}

function interaction(gestureState, gestureTranslation, initialOffset, axis) {
  const start = new Value(0);
  const dragging = new Value(0);
  const position = new Value(initialOffset);
  const velocity = new Value(0);
  const clock = new Clock();
  const dt = divide(diff(clock), 1000);
  const axisValue = axis === AXIS.X ? new Value('X') : new Value('Y');
  return [
    cond(
      eq(gestureState, State.ACTIVE),
      [
        // debug('gestureTranslation', gestureTranslation),
        debug('position :', position),
        debug('axis :', axisValue),
        cond(eq(dragging, 0), [set(dragging, 1), set(start, position)]),
        stopClock(clock),
        dt,
        set(position, add(start, gestureTranslation)),
        handleBoundaryCondition(position, axis, FINAL_DIAMETER),

        // debug('gestureVelocity :', gestureVelocity),
        position,
      ],
      [
        set(dragging, 0),
        startClock(clock),
        cond(neq(gestureState, State.UNDETERMINED), [
          // set(velocity, gestureVelocity),
          // force(dt, sub(position, gestureTranslation), velocity, initialOffset),
          // cond(lessThan(abs(velocity), VELOCITY_THRESHOLD), stopClock(clock)),
          // springAnim(dt, position, velocity, initialOffset),
          // damping(dt, velocity),
        ]),
        stopClock(clock),
        // debug('position :', position),
        set(position, add(position, multiply(velocity, dt))),
      ],
    ),
    start,
  ];
}

function handleBoundaryCondition(position, axis, itemDiameter) {
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
          lessThan(position, 0),
          [0],
          cond(
            greaterThan(position, HEIGHT - itemDiameter),
            [HEIGHT - itemDiameter],
            position,
          ),
        ),
      ],
    ),
  );
}

// function force(dt, position, velocity, initialOffset, damping = 12, mass = 1) {
//   // return set(
//   //   velocity,
//   //   cond(
//   //     lessThan(position, initialOffset - 1),
//   //     VELOCITY,
//   //     cond(greaterThan(position, initialOffset), -VELOCITY, 0),
//   //   ),
//   // );

//   // const dx = multiply(1, sub(position, initialOffset));
//   // debug('dx :', dx);
//   const dv = divide(position, multiply(-1, dt, 50));
//   return set(velocity, dv);
// }

// function springAnim(dt, position, velocity, anchor, mass = 1, tension = 300) {
//   const dist = sub(position, anchor);
//   const acc = divide(multiply(-1, tension, dist), mass);
//   // return set(velocity, add(velocity, multiply(dt, acc)));
//   return set(velocity, add(velocity, acc));
// }

function damping(dt, velocity, mass = 1, damping = 0.5) {
  const acc = divide(multiply(-1, damping, velocity), mass);
  return set(velocity, add(velocity, multiply(dt, acc)));
}

const App = () => {
  console.log('width :', WIDTH);
  console.log('Height :', HEIGHT);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  // player 1
  const dragX1 = new Value(0);
  const dragY1 = new Value(0);
  const offsetX1 = WIDTH / 2 - FINAL_DIAMETER / 2;
  const offsetY1 = HEIGHT / 4 - FINAL_DIAMETER / 2;
  const gestureState1 = new Value(State.UNDETERMINED);
  const dragVX = new Value(0);
  const dragVY = new Value(0);

  // player2
  const dragX2 = new Value(0);
  const dragY2 = new Value(0);

  const offsetX2 = WIDTH / 2 - FINAL_DIAMETER / 2;
  const offsetY2 = HEIGHT * 0.75 - FINAL_DIAMETER / 2;
  const gestureState2 = new Value(State.UNDETERMINED);
  const dragVX2 = new Value(0);
  const dragVY2 = new Value(0);

  // Ball
  const ballTransX = new Value(WIDTH / 2);
  const ballTransY = new Value(HEIGHT / 2);
  const ballOffsetX = new Value(WIDTH / 2);
  const ballOffsetY = new Value(HEIGHT / 2);
  const currX = new Value(0);
  const currY = new Value(0);

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

  const p1 = interaction(gestureState1, dragX1, offsetX1, AXIS.X);

  const translateX1 = p1[0];
  const offP1 = p1[1];

  const translateY1 = interaction(gestureState1, dragY1, offsetY1, AXIS.Y)[0];

  const translateX2 = interaction(gestureState2, dragX2, offsetX2, AXIS.X)[0];

  const translateY2 = interaction(gestureState2, dragY2, offsetY2, AXIS.Y)[0];

  // player 1
  const resultX = translateX1;
  const resultY = translateY1;
  const player1Position = {transX: translateX1, transY: translateY1};
  const player1Velocity = {vx: dragVX, vy: dragVY};
  const ballPosition = {x: ballTransX, y: ballTransY};

  // player 2
  const resultX2 = translateX2;
  const resultY2 = translateY2;
  const player2Position = {transX: translateX2, transY: translateY2};
  const player2Velocity = {vx: dragVX2, vy: dragVY2};
  const newBallPosition = {x: ballTransX, y: ballTransY};
  const player1Properties = {
    gestureState: gestureState1,
    velocity: player1Velocity,
    position: player1Position,
  };

  const player2Properties = {
    gestureState: gestureState2,
    velocity: player2Velocity,
    position: player2Position,
  };

  const _ballX = handleBallInteraction(
    gestureState1,
    gestureState2,
    ballPosition,
    player1Velocity,
    // resultX,
    // resultY,
    player1Position,
    player2Position,
    AXIS.X,
  );
  const _ballY = handleBallInteraction(
    gestureState1,
    gestureState2,
    ballPosition,
    player1Velocity,
    // resultY,
    // resultX,
    player1Position,
    player2Position,
    AXIS.Y,
  );

  const startDrag = ([]) => {
    console.log('drag started');
  };
  const stopDrag = ([]) => {
    console.log(' drag stop');
  };

  return (
    <>
      <StatusBar hidden />
      <SafeAreaView style={styles.container}>
        <View style={styles.wrapperParentContainer}>
          <View
            style={{
              width: AVAILABLE_WIDTH,
              height: SIDE_BORDER_WIDTH,
              backgroundColor: '#00FFFF',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: AVAILABLE_WIDTH / 4,
                height: SIDE_BORDER_WIDTH,
                backgroundColor: '#ffe0fe',
              }}></View>
          </View>
          {/* <Animated.Code>
            {() => cond(eq(gestureState1, State.BEGAN), call([], startDrag))}
          </Animated.Code>
          <Animated.Code>
            {() => cond(eq(gestureState1, State.END), call([], stopDrag))}
          </Animated.Code> */}
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
            }}>
            <View
              style={{
                width: AVAILABLE_WIDTH / 4,
                height: SIDE_BORDER_WIDTH,
                backgroundColor: '#ffe0fe',
              }}></View>
          </View>
          <View
            style={{
              zIndex: 999999,
              top: HEIGHT / 2 - 50,
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
              <Text style={{fontSize: 20, color: 'red'}}>{player1Score}</Text>
            </View>
            <View style={{height: 2, backgroundColor: 'orange'}} />
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 20, color: 'blue'}}>{player2Score}</Text>
            </View>
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
