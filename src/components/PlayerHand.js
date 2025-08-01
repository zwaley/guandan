import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';

import Card from './Card';

const {width} = Dimensions.get('window');

const PlayerHand = ({cards, selectedCards, onCardSelect}) => {
  const handleCardPress = (index) => {
    if (onCardSelect) {
      onCardSelect(index);
    }
  };

  const sortCards = (cards) => {
    return [...cards].sort((a, b) => {
      // 先按花色排序
      const suitOrder = {'spades': 0, 'hearts': 1, 'diamonds': 2, 'clubs': 3, 'joker': 4};
      const suitA = a.suit || 'joker';
      const suitB = b.suit || 'joker';
      
      if (suitOrder[suitA] !== suitOrder[suitB]) {
        return suitOrder[suitA] - suitOrder[suitB];
      }
      
      // 再按点数排序
      return a.value - b.value;
    });
  };

  const sortedCards = sortCards(cards);
  const cardWidth = 50;
  const cardSpacing = 35; // 重叠显示，只显示部分宽度
  const totalWidth = sortedCards.length * cardSpacing + (cardWidth - cardSpacing);
  const shouldScroll = totalWidth > width;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          !shouldScroll && {justifyContent: 'center'},
        ]}
        style={styles.scrollView}
      >
        <View style={styles.cardsContainer}>
          {sortedCards.map((card, index) => {
            const isSelected = selectedCards.includes(index);
            
            return (
              <View
                key={`${card.suit}-${card.value}-${index}`}
                style={[
                  styles.cardWrapper,
                  {
                    marginLeft: index === 0 ? 0 : -15, // 重叠效果
                    zIndex: isSelected ? 1000 : sortedCards.length - index,
                  },
                ]}
              >
                <Card
                  card={card}
                  size="normal"
                  selected={isSelected}
                  onPress={() => handleCardPress(index)}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  cardsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end', // 选中的牌会向上移动
    height: 80, // 给选中状态的向上移动留出空间
  },
  cardWrapper: {
    position: 'relative',
  },
});

export default PlayerHand;