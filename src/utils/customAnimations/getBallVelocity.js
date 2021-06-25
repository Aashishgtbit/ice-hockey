import {Platform} from 'react-native';
import {defineAnimation} from 'react-native-reanimated';
import {MAX_ALLOWED_VELOCITY} from '../Constants/appConstants';
export function getBallVelocity(userConfig, callback) {
  'worklet';

  return defineAnimation(0, () => {
    'worklet';
    const config = {
      deceleration: 0.998,
      velocityFactor: Platform.OS !== 'web' ? 1 : 1000,
    };
    if (userConfig) {
      Object.keys(userConfig).forEach((key) => (config[key] = userConfig[key]));
    }

    const VELOCITY_EPS = Platform.OS !== 'web' ? 1 : 1 / 20;
    const SLOPE_FACTOR = 0.005;

    function decay(animation, now) {
      const {startTimestamp, velocity} = animation;

      let v =
        velocity *
        Math.exp(
          -(1 - config.deceleration) * (now - startTimestamp) * SLOPE_FACTOR,
        );
      if (Math.abs(v) > MAX_ALLOWED_VELOCITY) {
        v = v > 0 ? MAX_ALLOWED_VELOCITY : -MAX_ALLOWED_VELOCITY;
      }
      animation.current = v;
      animation.velocity = v;
      animation.lastTimestamp = now;

      if (config.clamp) {
        if (animation.current <= config.clamp[0]) {
          animation.velocity = -1 * v;
        } else if (animation.current >= config.clamp[1]) {
          animation.velocity = -1 * v;
        }
      }
      if (Math.abs(v) < VELOCITY_EPS) {
        return true;
      }
    }

    function validateConfig() {
      if (config.clamp) {
        if (Array.isArray(config.clamp)) {
          if (config.clamp.length !== 2) {
            console.error(
              `clamp array must contain 2 items but is given ${config.clamp.length}`,
            );
          }
        } else {
          console.error(
            `config.clamp must be an array but is ${typeof config.clamp}`,
          );
        }
      }
      if (config.velocityFactor <= 0) {
        console.error(
          `config.velocityFactor must be greather then 0 but is ${config.velocityFactor}`,
        );
      }
    }

    function onStart(animation, value, now) {
      animation.current = value;
      animation.lastTimestamp = now;
      animation.startTimestamp = now;
      animation.initialVelocity = config.velocity;
      validateConfig();
    }

    return {
      onFrame: decay,
      onStart,
      velocity: config.velocity || 0,
      callback,
    };
  });
}
