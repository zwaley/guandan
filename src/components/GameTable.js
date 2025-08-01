import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

import Card from './Card';

const {width, height} = Dimensions.get('window');

const GameTable = ({gameState}) => {
  const {players, lastPlay, currentPlayer} = gameState;

  const renderPlayerInfo = (playerIndex, position) => {
    const player = players[playerIndex];
    const isCurrentPlayer = currentPlayer === playerIndex;
    
    return (
      <View style={[styles.playerInfo, styles[`player${position}`]]}>
        <View style={[styles.playerCard, isCurrentPlayer && styles.currentPlayerCard]}>
          <Text style={styles.playerName}>
            {playerIndex === 0 ? '你' : `AI ${playerIndex}`}
          </Text>
          <Text style={styles.cardCount}>
            {player.hand.length} 张牌
          </Text>
          {player.level && (
            <Text style={styles.playerLevel}>
              等级: {player.level}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderLastPlay = () => {
    if (!lastPlay || !lastPlay.cards || lastPlay.cards.length === 0) {
      return (
        <View style={styles.centerArea}>
          <Text style={styles.waitingText}>等待出牌...</Text>
        </View>
      );
    }

    return (
      <View style={styles.centerArea}>
        <Text style={styles.lastPlayLabel}>
          {lastPlay.player === 0 ? '你' : `AI ${lastPlay.player}`} 出牌:
        </Text>
        <View style={styles.lastPlayCards}>
          {lastPlay.cards.map((card, index) => (
            <Card
              key={index}
              card={card}
              size="small"
              style={[styles.lastPlayCard, {marginLeft: index * 15}]}
            />
          ))}
        </View>
        <Text style={styles.cardTypeText}>
          {lastPlay.type}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 上方玩家 (AI 2) */}
      {renderPlayerInfo(2, 'Top')}
      
      {/* 左侧玩家 (AI 3) */}
      {renderPlayerInfo(3, 'Left')}
      
      {/* 右侧玩家 (AI 1) */}
      {renderPlayerInfo(1, 'Right')}
      
      {/* 中央出牌区域 */}
      {renderLastPlay()}
      
      {/* 底部是玩家自己，在GameScreen中单独渲染 */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    height: height * 0.5,
    position: 'relative',
  },
  playerInfo: {
    position: 'absolute',
  },
  playerTop: {
    top: 0,
    left: '50%',
    transform: [{translateX: -50}],
  },
  playerLeft: {
    left: 0,
    top: '50%',
    transform: [{translateY: -25}],
  },
  playerRight: {
    right: 0,
    top: '50%',
    transform: [{translateY: -25}],
  },
  playerCard: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  currentPlayerCard: {
    borderColor: '#FFD700',
    backgroundColor: '#66BB6A',
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardCount: {
    color: '#E8F5E8',
    fontSize: 12,
    marginTop: 2,
  },
  playerLevel: {
    color: '#FFD700',
    fontSize: 10,
    marginTop: 2,
  },
  centerArea: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -75}, {translateY: -40}],
    width: 150,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 125, 50, 0.3)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  waitingText: {
    color: '#A5D6A7',
    fontSize: 14,
    textAlign: 'center',
  },
  lastPlayLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 5,
  },
  lastPlayCards: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  lastPlayCard: {
    position: 'relative',
  },
  cardTypeText: {
    color: '#FFD700',
    fontSize: 10,
    textAlign: 'center',
  },
});

export default GameTable;