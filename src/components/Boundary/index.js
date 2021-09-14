import React from 'react';
import {StyleSheet} from 'react-native';
import {Svg, Rect, Defs, Circle, Stop, LinearGradient} from 'react-native-svg';
import {
  WIDTH,
  AVAILABLE_HEIGHT,
  SIDE_BORDER_WIDTH,
  HEIGHT,
} from '../../utils/Constants/appConstants';
export function Boundary() {
  return (
    <>
      <Svg
        height={AVAILABLE_HEIGHT + 10}
        width={SIDE_BORDER_WIDTH}
        style={styles.leftBoundary}>
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
        style={styles.rightBoundary}>
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
      <Svg height={4} width={WIDTH} style={styles.centerLine}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#FFD080" stopOpacity="1" />
            <Stop offset="1" stopColor="red" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width={WIDTH} height={4} fill="url(#grad)" />
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
        <Rect x="0" y="0" width={WIDTH * 0.3} height="10" fill="url(#grad)" />
        <Rect
          x={WIDTH * 0.7}
          y="0"
          width={WIDTH * 0.3}
          height="10"
          fill="url(#revGrad)"
        />
      </Svg>

      <Svg height="10" width={WIDTH} style={styles.bottomBoundary}>
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
        <Rect x="0" y="0" width={WIDTH * 0.3} height="10" fill="url(#grad)" />
        <Rect
          x={WIDTH * 0.7}
          y="0"
          width={WIDTH * 0.3}
          height="10"
          fill="url(#revGrad)"
        />
      </Svg>

      <Svg height={WIDTH * 0.4} width={WIDTH * 0.4} style={styles.centerCircle}>
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

      <Svg height={WIDTH * 0.4} width={WIDTH * 0.8} style={styles.goalTop}>
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
      <Svg height={WIDTH * 0.4} width={WIDTH * 0.8} style={styles.goalBottom}>
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
    </>
  );
}

const styles = StyleSheet.create({
  leftBoundary: {
    position: 'absolute',
    zIndex: 999,
    left: -SIDE_BORDER_WIDTH,
  },
  rightBoundary: {
    position: 'absolute',
    zIndex: 999,
    left: WIDTH,
  },
  centerLine: {
    position: 'absolute',
    zIndex: 999,
    left: 0,
    top: HEIGHT / 2 + 5,
  },
  bottomBoundary: {
    zIndex: 9999,
    position: 'absolute',
    top: HEIGHT + 10,
  },
  centerCircle: {
    position: 'absolute',
    zIndex: -1,
    left: WIDTH / 2 - WIDTH * 0.2,
    top: HEIGHT / 2 - WIDTH * 0.2 - 4 + 10,
  },
  goalTop: {
    position: 'absolute',
    zIndex: -1,
    left: WIDTH / 2 - WIDTH * 0.4,
  },
  goalBottom: {
    position: 'absolute',
    zIndex: -1,
    left: WIDTH / 2 - WIDTH * 0.4,
    top: HEIGHT - WIDTH * 0.4 + 20,
  },
});
