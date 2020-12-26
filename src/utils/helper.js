// import Animated, {
//   Value,
//   interpolate,
//   Clock,
//   event,
//   cond,
//   eq,
//   add,
//   set,
//   call,
//   defined,
//   diff,
//   multiply,
//   lessThan,
//   stopClock,
//   clockRunning,
//   startClock,
//   spring,
//   divide,
//   greaterThan,
//   abs,
//   debug,
//   neq,
//   or,
//   sub,
//   sqrt,
//   block,
//   not,
//   and,
// } from 'react-native-reanimated';

// function handleBallInteraction(
//   gestureState,
//   gestureState2,
//   ballTrans,
//   playerVelocity,
//   // playerPosition,
//   // playerPosition1,
//   player1Position,
//   player2Position,
//   axis,
// ) {
//   const start = new Value(0);
//   const position = axis === AXIS.X ? ballTrans.x : ballTrans.y;
//   const velocity = new Value(0);
//   const clock = new Clock();
//   const dt = divide(diff(clock), 1000);
//   // const pX = axis == AXIS.X ? playerPosition : playerPosition1;
//   // const pY = axis === AXIS.Y ? playerPosition : playerPosition1;

//   const ballTransX = ballTrans.x;
//   const ballTransY = ballTrans.y;

//   const playerD = new Value(FINAL_DIAMETER / 2);
//   const dx = sub(add(player1Position.transX, playerD), ballTransX);
//   const dy = sub(add(player1Position.transY, playerD), ballTransY);

//   const dx2 = sub(add(player2Position.transX, playerD), ballTransX);
//   const dy2 = sub(add(player2Position.transY, playerD), ballTransY);

//   const distanceBetweenCenters2 = sqrt(
//     add(multiply(dx2, dx2), multiply(dy2, dy2)),
//   );
//   const distanceBetweenCenters = sqrt(add(multiply(dx, dx), multiply(dy, dy)));
//   return cond(
//     or(eq(gestureState, State.ACTIVE), eq(gestureState2, State.ACTIVE)),
//     [
//       cond(
//         or(
//           and(
//             eq(gestureState, State.ACTIVE),
//             lessThan(
//               distanceBetweenCenters,
//               (FINAL_DIAMETER + BALL_DIAMETER) / 2,
//             ),
//           ),
//           and(
//             eq(gestureState2, State.ACTIVE),
//             lessThan(
//               distanceBetweenCenters2,
//               (FINAL_DIAMETER + BALL_DIAMETER) / 2,
//             ),
//           ),
//         ),
//         [
//           startClock(clock),
//           dt,
//           forceBall(dt, position, velocity, false),

//           handleBoundaryReflection(position, axis, BALL_DIAMETER, velocity, dt),
//           damping(dt, velocity),
//           set(position, add(position, multiply(velocity, dt))),
//         ],
//         cond(
//           clockRunning(clock),
//           [
//             handleBoundaryReflection(
//               position,
//               axis,
//               BALL_DIAMETER,
//               velocity,
//               dt,
//             ),
//             damping(dt, velocity),
//             set(position, add(position, multiply(velocity, dt))),
//             debug('no overlap', position),
//           ],
//           set(position, add(position, multiply(velocity, dt))),
//         ),
//       ),
//     ],
//     [
//       cond(
//         and(
//           clockRunning(clock),
//           or(
//             lessThan(
//               distanceBetweenCenters,
//               (FINAL_DIAMETER + BALL_DIAMETER) / 2,
//             ),
//             lessThan(
//               distanceBetweenCenters2,
//               (FINAL_DIAMETER + BALL_DIAMETER) / 2,
//             ),
//           ),
//         ),
//         [
//           set(velocity, multiply(-1, velocity)),
//           damping(dt, velocity),

//           set(position, add(position, multiply(velocity, dt))),
//           debug('position', position),
//         ],
//         [velocity],
//       ),
//       damping(dt, velocity),
//       handleBoundaryReflection(position, axis, BALL_DIAMETER, velocity, dt),
//       set(position, add(position, multiply(velocity, dt))),
//     ],
//   );
// }
// function handleBoundaryReflection(position, axis, itemDiameter, velocity, dt) {
//   return set(
//     velocity,
//     cond(
//       axis === AXIS.X,
//       [
//         cond(
//           lessThan(position, itemDiameter / 2),
//           [
//             // forceBall(dt, position, multiply(-1, velocity)),
//             // add(position, multiply(velocity, dt)),
//             multiply(-1, velocity),
//           ],
//           cond(
//             greaterThan(position, WIDTH - itemDiameter / 2),
//             [
//               // forceBall(dt, position, multiply(-1, velocitsy)),
//               // add(position, multiply(velocity, dt)),
//               multiply(-1, velocity),
//             ],
//             velocity,
//           ),
//         ),
//       ],
//       [
//         cond(
//           lessThan(position, itemDiameter / 2),
//           [
//             // forceBall(dt, position, multiply(-1, velocity)),
//             // add(position, multiply(velocity, dt)),
//             multiply(-1, velocity),
//           ],
//           cond(
//             greaterThan(position, HEIGHT - itemDiameter / 2),
//             [
//               // forceBall(dt, position, multiply(-1, velocity)),
//               // add(position, multiply(velocity, dt)),
//               multiply(-1, velocity),
//             ],
//             velocity,
//           ),
//         ),
//       ],
//     ),
//   );
// }
