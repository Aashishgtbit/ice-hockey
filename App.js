/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

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

export default App;
