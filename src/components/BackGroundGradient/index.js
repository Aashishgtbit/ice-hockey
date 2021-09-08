import React from 'react';
import {StyleSheet} from 'react-native';
import {Svg, Rect, Defs, Stop, LinearGradient} from 'react-native-svg';
import {
  AVAILABLE_HEIGHT,
  AVAILABLE_WIDTH,
} from '../../utils/Constants/appConstants';

export const BackgroundGradient = () => {
  return (
    <Svg
      height={AVAILABLE_HEIGHT}
      width={AVAILABLE_WIDTH}
      style={styles.wrapperBackGround}>
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#2a2a72" stopOpacity="1" />
          <Stop offset="1" stopColor="#009ffd" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Rect
        x="0"
        y="0"
        width={AVAILABLE_WIDTH}
        height={AVAILABLE_HEIGHT}
        fill="url(#grad)"
      />
    </Svg>
  );
};

const styles = StyleSheet.create({
  wrapperBackGround: {
    position: 'absolute',
    zIndex: -1,
  },
});

export default BackgroundGradient;
