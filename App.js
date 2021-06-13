/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, StyleSheet, View, Text, StatusBar} from 'react-native';

// const AnimatedCircle = Animated.createAnimatedComponent(Circle);

import CustomModal from './src/components/CustomModal';
import Result from './src/components/CustomModal/Result';
import SwipableList from './src/components/Examples/SwipableList';
import LightboxExample from './src/components/Examples/LightBox';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TabBar from './src/components/Examples/TabBar';
import Game from './src/routes/Game';

const Stack = createStackNavigator();
const Screens = {
  Home: {
    screen: Game,
    title: 'HOME',
  },
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          options={{title: '🎬 Reanimated 2.x Examples', headerShown: false}}
          getComponent={(props) => Screens.Home.screen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#fff',
//     flex: 1,
//   },

//   scrollView: {
//     backgroundColor: '#dbdbdb',
//   },

//   wrapperParentContainer: {
//     backgroundColor: COLORS.BACKGROUND,
//     width: AVAILABLE_WIDTH,
//     height: AVAILABLE_HEIGHT,
//     borderLeftWidth: SIDE_BORDER_WIDTH,
//     borderRightWidth: SIDE_BORDER_WIDTH,

//     borderColor: '#00FFFF',
//   },

//   playersHandle: {
//     position: 'relative',
//     width: WIDTH,
//     height: HEIGHT / 2,
//   },
//   boldWhite: {
//     fontWeight: 'bold',
//     color: '#fff',
//   },
// });

export default App;
