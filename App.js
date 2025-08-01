import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import GameScreen from './src/screens/GameScreen';
import MenuScreen from './src/screens/MenuScreen';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('menu'); // 'menu' | 'game'

  const navigateToGame = () => {
    setCurrentScreen('game');
  };

  const navigateToMenu = () => {
    setCurrentScreen('menu');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
      {currentScreen === 'menu' ? (
        <MenuScreen onStartGame={navigateToGame} />
      ) : (
        <GameScreen onBackToMenu={navigateToMenu} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B5E20',
  },
});

export default App;