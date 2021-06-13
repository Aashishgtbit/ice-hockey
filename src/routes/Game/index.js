/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import {Svg, Rect, Defs, Circle, Stop, LinearGradient} from 'react-native-svg';

import Animated, {
  sub,
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
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
  height,
} from '../../utils/Constants/appConstants';
import {Boundary} from '../../components/Boundary';
const Game = () => {
  // console.log(
  //   'WIDTH:',
  //   WIDTH,
  //   'HEIGHT:',
  //   HEIGHT,
  //   'AVAILABLE_WIDTH:',
  //   AVAILABLE_WIDTH,
  //   'AVAILABLE_HEIGHT :',
  //   AVAILABLE_HEIGHT,
  //   'FINAL_DIAMETER:',
  //   FINAL_DIAMETER,
  //   'BALL_DIAMETER:',
  //   BALL_DIAMETER,
  // );

  // player 1
  const dragX1 = useSharedValue(WIDTH / 2);
  const dragY1 = useSharedValue(HEIGHT / 4);
  const velocityX1 = useSharedValue(0);
  const velocityY1 = useSharedValue(0);
  // player2
  const dragX2 = useSharedValue(WIDTH / 2);
  const dragY2 = useSharedValue(HEIGHT * 0.75);

  //ball
  const ballX = useSharedValue(WIDTH / 2);
  const ballY = useSharedValue(HEIGHT / 2 + BALL_DIAMETER / 4);
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
    if (
      distanceBetweenCentresP1 <= criticalDistance ||
      distanceBetweenCentresP2 <= criticalDistance
    ) {
      console.log('ball collided');
      return true;
    }
    return false;
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
    },
  });

  const player1Style = useAnimatedStyle(() => {
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
      {/* <StatusBar hidden /> */}
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
