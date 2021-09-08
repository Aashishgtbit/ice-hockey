import React, {useCallback, useState} from 'react';

import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  TextInput,
  Share,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackgroundGradient from '../../components/BackGroundGradient';
import {HEIGHT} from '../../utils/Constants/appConstants';
const PlayerRoom = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [roomId, setRoomId] = useState('');
  const onChangeRoomId = useCallback((id) => {
    setRoomId(id);
  }, []);
  const handleActiveTab = useCallback((index) => {
    setActiveTabIndex(index);
  }, []);

  const onShare = useCallback(async () => {
    try {
      const result = await Share.share({
        message: 'Welcome to ice-hockey. Please use 12345678 to join the room',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      // alert(error.message);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.wrapperPlayerRoom}>
          <BackgroundGradient />
          <View style={styles.createJoinTabs}>
            <TouchableHighlight
              style={[
                styles.tab,
                styles.tab1,
                activeTabIndex === 0 && styles.activeTab,
              ]}
              onPress={() => handleActiveTab(0)}>
              <Text style={[styles.tabText]}>Create</Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={[
                styles.tab,
                styles.tab2,
                activeTabIndex === 1 && styles.activeTab,
              ]}
              onPress={() => handleActiveTab(1)}>
              <Text style={[styles.tabText]}>Join</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.tabContent}>
            {activeTabIndex === 0 ? (
              <View style={styles.createWrapper}>
                <View style={styles.wrapperCode}>
                  <Text style={styles.codeText}>12345678</Text>
                </View>
                <View style={styles.joinBtnWrapper}>
                  <TouchableHighlight style={styles.joinBtn} onPress={onShare}>
                    <Text style={styles.btnText}> Share</Text>
                  </TouchableHighlight>
                </View>
              </View>
            ) : (
              <View style={styles.joinRoom}>
                <View style={styles.joinRoomTop}>
                  <Text style={styles.titleText}>Enter Private Code</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      onChangeText={onChangeRoomId}
                      value={roomId}
                      placeholder="Enter private code here"
                      keyboardType="ascii-capable"
                    />
                  </View>
                </View>
                <View style={styles.joinBtnWrapper}>
                  <TouchableHighlight style={styles.joinBtn}>
                    <Text style={styles.btnText}> Join Room</Text>
                  </TouchableHighlight>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: HEIGHT,
  },
  scrollView: {
    flex: 1,
  },
  wrapperPlayerRoom: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  createJoinTabs: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    width: '80%',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderBottomWidth: 0,
    borderWidth: 4,
    borderColor: 'transparent',
  },
  tab1: {},
  tab2: {},
  tabText: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: 'bold',
  },
  activeTabText: {},
  activeTab: {
    borderColor: '#FFD700',
    borderBottomColor: 'transparent',
    borderBottomWidth: 0,
    borderWidth: 4,
  },
  tabContent: {
    width: '80%',
    height: '50%',
    minHeight: 400,
    borderWidth: 4,
    borderColor: '#FFD700',
  },
  joinRoom: {
    flex: 2,
    width: '100%',
    alignItems: 'center',
  },
  joinRoomTop: {
    width: '100%',
    padding: '8%',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    textTransform: 'uppercase',
  },
  inputWrapper: {
    marginTop: 20,
    padding: 2,
    backgroundColor: 'white',
    width: '100%',
  },
  input: {
    borderWidth: 2,
    minHeight: 32,
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'white',
    borderStyle: 'dashed',
    borderColor: 'purple',
    textAlign: 'center',
    borderRadius: 1,
  },
  joinBtnWrapper: {
    flex: 1,
    width: '100%',
    top: 20,
    alignItems: 'center',
  },
  joinBtn: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#2a2a72',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFD700',
    borderRadius: 20,
  },
  btnText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },

  createWrapper: {
    flex: 2,
    width: '100%',
    alignItems: 'center',
  },
  wrapperCode: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  codeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default PlayerRoom;
