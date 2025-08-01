import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const GameControls = ({onPlayCards, onPass, canPlay, selectedCount}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          styles.passButton,
          !canPlay && styles.disabledButton,
        ]}
        onPress={onPass}
        disabled={!canPlay}
      >
        <Text style={[
          styles.buttonText,
          !canPlay && styles.disabledText,
        ]}>
          过牌
        </Text>
      </TouchableOpacity>

      <View style={styles.selectedInfo}>
        <Text style={styles.selectedText}>
          已选择 {selectedCount} 张牌
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          styles.playButton,
          (!canPlay || selectedCount === 0) && styles.disabledButton,
        ]}
        onPress={onPlayCards}
        disabled={!canPlay || selectedCount === 0}
      >
        <Text style={[
          styles.buttonText,
          (!canPlay || selectedCount === 0) && styles.disabledText,
        ]}>
          出牌
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playButton: {
    backgroundColor: '#4CAF50',
  },
  passButton: {
    backgroundColor: '#FF9800',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#999999',
  },
  selectedInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  selectedText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default GameControls;