import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const Card = ({card, size = 'normal', selected = false, onPress, style}) => {
  const getSuitSymbol = (suit) => {
    switch (suit) {
      case 'spades': return '♠';
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      default: return '';
    }
  };

  const getSuitColor = (suit) => {
    return suit === 'hearts' || suit === 'diamonds' ? '#FF0000' : '#000000';
  };

  const getValueDisplay = (value) => {
    switch (value) {
      case 1: return 'A';
      case 11: return 'J';
      case 12: return 'Q';
      case 13: return 'K';
      case 14: return '小王';
      case 15: return '大王';
      default: return value.toString();
    }
  };

  const isJoker = card.value === 14 || card.value === 15;
  const suitColor = isJoker ? (card.value === 14 ? '#000000' : '#FF0000') : getSuitColor(card.suit);
  
  const cardStyles = [
    styles.card,
    styles[size],
    selected && styles.selected,
    isJoker && styles.joker,
    style,
  ];

  const CardContent = () => (
    <View style={cardStyles}>
      {/* 左上角 */}
      <View style={styles.corner}>
        <Text style={[styles.value, {color: suitColor}, styles[`${size}Value`]]}>
          {getValueDisplay(card.value)}
        </Text>
        {!isJoker && (
          <Text style={[styles.suit, {color: suitColor}, styles[`${size}Suit`]]}>
            {getSuitSymbol(card.suit)}
          </Text>
        )}
      </View>

      {/* 中央 */}
      <View style={styles.center}>
        {isJoker ? (
          <Text style={[styles.jokerText, {color: suitColor}, styles[`${size}Joker`]]}>
            {card.value === 14 ? '小' : '大'}
          </Text>
        ) : (
          <Text style={[styles.centerSuit, {color: suitColor}, styles[`${size}CenterSuit`]]}>
            {getSuitSymbol(card.suit)}
          </Text>
        )}
      </View>

      {/* 右下角 (旋转180度) */}
      <View style={[styles.corner, styles.bottomRight]}>
        <Text style={[styles.value, {color: suitColor}, styles[`${size}Value`], styles.rotated]}>
          {getValueDisplay(card.value)}
        </Text>
        {!isJoker && (
          <Text style={[styles.suit, {color: suitColor}, styles[`${size}Suit`], styles.rotated]}>
            {getSuitSymbol(card.suit)}
          </Text>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  normal: {
    width: 50,
    height: 70,
  },
  small: {
    width: 30,
    height: 42,
  },
  large: {
    width: 60,
    height: 84,
  },
  selected: {
    borderColor: '#FFD700',
    borderWidth: 2,
    transform: [{translateY: -10}],
  },
  joker: {
    backgroundColor: '#FFF8DC',
  },
  corner: {
    position: 'absolute',
    top: 2,
    left: 2,
    alignItems: 'center',
  },
  bottomRight: {
    top: undefined,
    left: undefined,
    bottom: 2,
    right: 2,
  },
  rotated: {
    transform: [{rotate: '180deg'}],
  },
  value: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  normalValue: {
    fontSize: 12,
  },
  smallValue: {
    fontSize: 8,
  },
  largeValue: {
    fontSize: 14,
  },
  suit: {
    textAlign: 'center',
    marginTop: -2,
  },
  normalSuit: {
    fontSize: 10,
  },
  smallSuit: {
    fontSize: 6,
  },
  largeSuit: {
    fontSize: 12,
  },
  center: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -10}, {translateY: -10}],
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerSuit: {
    textAlign: 'center',
  },
  normalCenterSuit: {
    fontSize: 16,
  },
  smallCenterSuit: {
    fontSize: 10,
  },
  largeCenterSuit: {
    fontSize: 20,
  },
  jokerText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  normalJoker: {
    fontSize: 14,
  },
  smallJoker: {
    fontSize: 8,
  },
  largeJoker: {
    fontSize: 16,
  },
});

export default Card;