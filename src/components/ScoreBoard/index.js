/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';
function ScoreBoard(props) {
  return (
    <View style={{height: '100%', width: '100%'}}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: 16,
        }}>
        <Text style={{fontSize: 24, color: 'red'}}>{props.scores.p1}</Text>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: 16,
        }}>
        <Text style={{fontSize: 24, color: 'blue'}}>{props.scores.p2}</Text>
      </View>
    </View>
  );
}

export default ScoreBoard;
