import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
} from 'react-native';
function ScoreBoard() {
  const [scores, setPlayerScores] = useState({p1: 0, p2: 0});
  return (
    <View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 20, color: 'red'}}>{scores.p1}</Text>
      </View>
      <View style={{height: 2, backgroundColor: 'orange'}} />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 20, color: 'blue'}}>{scores.p2}</Text>
      </View>
    </View>
  );
}

export default ScoreBoard;
