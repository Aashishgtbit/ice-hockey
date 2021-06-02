import React from 'react';
import Animated, {EasingNode} from 'react-native-reanimated';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
const {
  set,
  cond,
  startClock,
  stopClock,
  clockRunning,
  block,
  timing,
  debug,
  Value,
  Clock,
  divide,
  concat,
} = Animated;
const {width: WIDTH, height: HEIGHT} = Dimensions.get('window');

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: EasingNode.inOut(EasingNode.quad),
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, debug('stop clock', stopClock(clock))),
    state.position,
  ]);
}
function AnimatedGoal() {
  const trans = runTiming(new Clock(), 0, 360);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.box,
          {
            transform: [
              {
                rotate: concat(divide(trans, 57.2957795786), 'rad'),
              },
            ],
          },
        ]}>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            color: 'red',
            // zIndex: 9999,
          }}>
          GOAL
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: WIDTH,
    height: HEIGHT,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AnimatedGoal;
