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
import PlayerDetails from './src/routes/PlayerDetails';
import PlayerRoom from './src/routes/PlayerRoom';
import {socket, SocketContext} from './src/context/socket';

const Stack = createStackNavigator();
export const Screens = {
  Home: {
    screen: Game,
    title: 'HOME',
  },
  PlayerDetails: {
    screen: PlayerDetails,
    title: 'Details',
  },
  PlayerRoom: {
    screen: PlayerRoom,
    title: 'Player Room',
  },
};

const App = () => {
  return (
    <SocketContext.Provider value={socket}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Details"
            options={{title: 'IceHockey'}}
            getComponent={(props) => Screens.PlayerDetails.screen}
          />
          <Stack.Screen
            name={Screens.PlayerRoom.title}
            options={{title: 'IceHockey'}}
            getComponent={(props) => Screens.PlayerRoom.screen}
          />
          <Stack.Screen
            name="Home"
            options={{title: '🎬 Reanimated 2.x Examples', headerShown: false}}
            getComponent={(props) => Screens.Home.screen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SocketContext.Provider>
  );
};

export default App;
