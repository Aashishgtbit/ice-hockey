import Animated, {
  Clock,
  cond,
  eq,
  add,
  set,
  diff,
  multiply,
  lessThan,
  stopClock,
  clockRunning,
  startClock,
  divide,
  greaterThan,
  neq,
  or,
  sub,
  sqrt,
  block,
  and,
  Value,
  call,
} from 'react-native-reanimated';
import {State} from 'react-native-gesture-handler';
import {
  AXIS,
  AVAILABLE_WIDTH,
  FINAL_DIAMETER,
  BALL_DIAMETER,
  HEIGHT,
  PLAYER,
  SIDE_BORDER_WIDTH,
  WIDTH,
  height,
} from './Constants/appConstants';

export const handleBallInteraction = (
  gestureState,
  gestureState2,
  ballTrans,
  playerVelocity,
  player1Position,
  player2Position,
  axis,
  playSound,
) => {
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
                playSound,
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
                  playSound,
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
            playSound,
          ),
          set(position, add(position, multiply(velocity, dt))),
        ],
      ),
    ],
  );
};

export function handleBallCollision(
  axis,
  ballPosition,
  velocity,
  playerPosition,
) {
  return set(
    velocity,
    cond(
      axis === AXIS.Y,
      [handleVelocityOnCollision(velocity, playerPosition, ballPosition, axis)],
      [handleVelocityOnCollision(velocity, playerPosition, ballPosition, axis)],
    ),
  );
}

export function handleVelocityOnCollision(
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
        [
          cond(
            greaterThan(
              ballPosition.x,
              add(playerPosition.transX, BALL_DIAMETER / 2),
            ),
            multiply(10, 60),
            [velocity],
          ),
        ],
      ),
    ),
  );
}

export function handleBoundaryReflection(
  position,
  axis,
  itemDiameter,
  velocity,
  dt,
  ballTrans,
  playSound,
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
                  [call([], playSound), multiply(-1, velocity)],
                  cond(
                    greaterThan(ballX, WIDTH - itemDiameter / 2),
                    [call([], playSound), multiply(-1, velocity)],
                    velocity,
                  ),
                ),
              ],
              [
                cond(
                  lessThan(ballY, itemDiameter / 2),
                  [call([], playSound), multiply(-1, velocity)],
                  cond(
                    greaterThan(ballY, HEIGHT - itemDiameter / 2),
                    [call([], playSound), multiply(-1, velocity)],
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

export function forceBall(dt, position, velocity, isPlayerStatic, mass = 1) {
  const changeInVelocity = new Value(20);
  let acc = new Value(60);
  if (isPlayerStatic) {
    acc = 0;
  }

  return set(velocity, add(velocity, acc));
}

export function interaction(
  gestureState,
  gestureTranslation,
  initialOffset,
  axis,
  currentActivePlayer,
  playsound,
) {
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

export function handleBoundaryCondition(
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

export function damping(dt, velocity, mass = 1, damping = 0.5) {
  const acc = divide(multiply(-1, damping, velocity), mass);
  return set(velocity, add(velocity, multiply(dt, acc)));
}
