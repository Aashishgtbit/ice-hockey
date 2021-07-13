import React from 'react';
import {StyleSheet, Text} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useEffect} from 'react/cjs/react.development';
import {HEIGHT, WIDTH} from '../../utils/Constants/appConstants';
const timingConfig = {
  duration: 1000,
};
const AnimatedGoal = (props) => {
  const rotateAngle = useSharedValue('0deg');
  const boxStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withTiming(rotateAngle.value, timingConfig, () => {
            runOnJS(props.handleModalClose)();
          }),
        },
      ],
    };
  });

  useEffect(() => {
    rotateAngle.value = '360deg';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[styles.box, boxStyle]}>
      <Text style={styles.goalText}>GOAL</Text>
    </Animated.View>
  );
};

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
    position: 'absolute',
    zIndex: 999999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: 'red',
  },
});

export default AnimatedGoal;
