import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';

import GameTable from '../components/GameTable';
import PlayerHand from '../components/PlayerHand';
import GameControls from '../components/GameControls';
import GameManager from '../game/GameManager';

const {width, height} = Dimensions.get('window');

const GameScreen = ({onBackToMenu}) => {
  const [gameManager] = useState(() => new GameManager());
  const [gameState, setGameState] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);

  useEffect(() => {
    // 初始化游戏
    gameManager.startNewGame();
    setGameState(gameManager.getGameState());

    // 监听游戏状态变化
    const unsubscribe = gameManager.onStateChange((newState) => {
      setGameState(newState);
    });

    return unsubscribe;
  }, [gameManager]);

  const handleCardSelect = (cardIndex) => {
    const newSelected = [...selectedCards];
    const index = newSelected.indexOf(cardIndex);
    
    if (index > -1) {
      newSelected.splice(index, 1);
    } else {
      newSelected.push(cardIndex);
    }
    
    setSelectedCards(newSelected);
  };

  const handlePlayCards = () => {
    if (selectedCards.length === 0) {
      Alert.alert('提示', '请选择要出的牌');
      return;
    }

    const success = gameManager.playCards(0, selectedCards); // 0是人类玩家
    if (success) {
      setSelectedCards([]);
    } else {
      Alert.alert('提示', '出牌不符合规则');
    }
  };

  const handlePass = () => {
    gameManager.pass(0);
    setSelectedCards([]);
  };

  const handleBackToMenu = () => {
    Alert.alert(
      '确认退出',
      '确定要退出当前游戏吗？',
      [
        {text: '取消', style: 'cancel'},
        {text: '确定', onPress: onBackToMenu},
      ]
    );
  };

  if (!gameState) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>游戏加载中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 顶部信息栏 */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToMenu}>
          <Text style={styles.backButtonText}>返回</Text>
        </TouchableOpacity>
        <Text style={styles.gameInfo}>
          当前等级: {gameState.currentLevel} | 回合: {gameState.currentPlayer + 1}
        </Text>
      </View>

      {/* 游戏桌面 */}
      <View style={styles.gameArea}>
        <GameTable gameState={gameState} />
      </View>

      {/* 玩家手牌 */}
      <View style={styles.handArea}>
        <PlayerHand
          cards={gameState.players[0].hand}
          selectedCards={selectedCards}
          onCardSelect={handleCardSelect}
        />
      </View>

      {/* 游戏控制按钮 */}
      <View style={styles.controlsArea}>
        <GameControls
          onPlayCards={handlePlayCards}
          onPass={handlePass}
          canPlay={gameState.currentPlayer === 0}
          selectedCount={selectedCards.length}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B5E20',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B5E20',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#2E7D32',
  },
  backButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  gameInfo: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handArea: {
    height: 120,
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
  },
  controlsArea: {
    height: 80,
    backgroundColor: '#1B5E20',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GameScreen;