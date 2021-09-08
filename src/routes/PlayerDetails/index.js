import React from 'react';
import {Screens} from '../../../App';
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native';
import BackgroundGradient from '../../components/BackGroundGradient';

const PlayerDetails = ({navigation}) => {
  return (
    <View style={styles.wrapperDetails}>
      <BackgroundGradient />
      <View style={styles.options}>
        <TouchableHighlight
          style={styles.card}
          onPress={() => navigation.push(Screens.PlayerRoom.title)}>
          <Text style={styles.optionsText}>Play with Friends</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.card, styles.mt10]}
          onPress={() => navigation.push('Home')}>
          <Text style={styles.optionsText}>Pass N Play</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperDetails: {
    flex: 1,
  },
  options: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    minWidth: '70%',
    height: '20%',
    backgroundColor: '#2a2a72',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  optionsText: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  mt10: {
    marginTop: 8,
  },
});

export default PlayerDetails;
