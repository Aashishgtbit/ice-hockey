/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {AVAILABLE_WIDTH} from '../../../utils/Constants/appConstants';

const Result = (props) => {
  return (
    <View style={styles.wrapperResultsContainer}>
      <View style={styles.resultContainer}>
        <Text style={{fontSize: 28, fontWeight: 'bold', color: '#00f'}}>
          GAME OVER
        </Text>

        <Text style={{fontSize: 22, fontWeight: 'bold', color: 'orange'}}>
          {props.winnerText}
        </Text>
        <TouchableOpacity onPress={() => props.handleModalClose()}>
          <View style={styles.button}>
            <Text>Play again</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperResultsContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContainer: {
    height: 200,
    width: AVAILABLE_WIDTH - 80,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#DDDDDD',
    padding: 10,

    borderRadius: 10,
  },
});

export default Result;
