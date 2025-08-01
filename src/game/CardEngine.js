class CardEngine {
  constructor() {
    // 掼蛋牌型定义
    this.cardTypes = {
      SINGLE: 'single',
      PAIR: 'pair',
      TRIPLE: 'triple',
      STRAIGHT: 'straight',
      PAIR_STRAIGHT: 'pair_straight',
      TRIPLE_STRAIGHT: 'triple_straight',
      BOMB: 'bomb',
      STRAIGHT_FLUSH: 'straight_flush',
    };
  }

  // 识别牌型
  identifyCardType(cards) {
    if (!cards || cards.length === 0) {
      return null;
    }

    const sortedCards = this.sortCards(cards);
    const length = cards.length;

    // 单张
    if (length === 1) {
      return this.cardTypes.SINGLE;
    }

    // 对子
    if (length === 2 && this.isPair(sortedCards)) {
      return this.cardTypes.PAIR;
    }

    // 三张
    if (length === 3 && this.isTriple(sortedCards)) {
      return this.cardTypes.TRIPLE;
    }

    // 炸弹（4张或以上相同点数）
    if (length >= 4 && this.isBomb(sortedCards)) {
      return this.cardTypes.BOMB;
    }

    // 顺子（5张或以上连续）
    if (length >= 5 && this.isStraight(sortedCards)) {
      return this.cardTypes.STRAIGHT;
    }

    // 连对（3对或以上连续对子）
    if (length >= 6 && length % 2 === 0 && this.isPairStraight(sortedCards)) {
      return this.cardTypes.PAIR_STRAIGHT;
    }

    // 连三（2个或以上连续三张）
    if (length >= 6 && length % 3 === 0 && this.isTripleStraight(sortedCards)) {
      return this.cardTypes.TRIPLE_STRAIGHT;
    }

    // 同花顺
    if (length >= 5 && this.isStraightFlush(sortedCards)) {
      return this.cardTypes.STRAIGHT_FLUSH;
    }

    return null; // 无效牌型
  }

  // 验证出牌是否合法
  validatePlay(cards, lastPlay) {
    const cardType = this.identifyCardType(cards);
    
    if (!cardType) {
      return false; // 无效牌型
    }

    // 如果是第一次出牌或者上一轮所有人都过牌
    if (!lastPlay) {
      return true;
    }

    const lastCardType = lastPlay.type;
    const lastCards = lastPlay.cards;

    // 炸弹可以压任何牌型
    if (cardType === this.cardTypes.BOMB) {
      if (lastCardType !== this.cardTypes.BOMB) {
        return true;
      }
      // 炸弹压炸弹需要更大
      return this.compareBombs(cards, lastCards) > 0;
    }

    // 同花顺可以压炸弹以外的任何牌型
    if (cardType === this.cardTypes.STRAIGHT_FLUSH) {
      if (lastCardType === this.cardTypes.BOMB) {
        return false;
      }
      if (lastCardType !== this.cardTypes.STRAIGHT_FLUSH) {
        return true;
      }
      return this.compareCards(cards, lastCards) > 0;
    }

    // 其他牌型必须同类型且更大
    if (cardType !== lastCardType || cards.length !== lastCards.length) {
      return false;
    }

    return this.compareCards(cards, lastCards) > 0;
  }

  // 比较两组牌的大小
  compareCards(cards1, cards2) {
    const type1 = this.identifyCardType(cards1);
    const type2 = this.identifyCardType(cards2);

    if (type1 !== type2) {
      // 不同牌型的比较优先级
      const typePriority = {
        [this.cardTypes.SINGLE]: 1,
        [this.cardTypes.PAIR]: 2,
        [this.cardTypes.TRIPLE]: 3,
        [this.cardTypes.STRAIGHT]: 4,
        [this.cardTypes.PAIR_STRAIGHT]: 5,
        [this.cardTypes.TRIPLE_STRAIGHT]: 6,
        [this.cardTypes.BOMB]: 7,
        [this.cardTypes.STRAIGHT_FLUSH]: 8,
      };
      return typePriority[type1] - typePriority[type2];
    }

    // 相同牌型比较主牌点数
    const mainValue1 = this.getMainValue(cards1, type1);
    const mainValue2 = this.getMainValue(cards2, type2);

    return mainValue1 - mainValue2;
  }

  // 获取牌组的主要点数
  getMainValue(cards, cardType) {
    const sortedCards = this.sortCards(cards);
    
    switch (cardType) {
      case this.cardTypes.SINGLE:
      case this.cardTypes.PAIR:
      case this.cardTypes.TRIPLE:
      case this.cardTypes.BOMB:
        return sortedCards[0].value;
      
      case this.cardTypes.STRAIGHT:
      case this.cardTypes.STRAIGHT_FLUSH:
        return sortedCards[sortedCards.length - 1].value; // 最大牌
      
      case this.cardTypes.PAIR_STRAIGHT:
        return sortedCards[sortedCards.length - 1].value;
      
      case this.cardTypes.TRIPLE_STRAIGHT:
        return sortedCards[sortedCards.length - 1].value;
      
      default:
        return 0;
    }
  }

  // 检查是否为对子
  isPair(cards) {
    return cards.length === 2 && cards[0].value === cards[1].value;
  }

  // 检查是否为三张
  isTriple(cards) {
    return cards.length === 3 && 
           cards[0].value === cards[1].value && 
           cards[1].value === cards[2].value;
  }

  // 检查是否为炸弹
  isBomb(cards) {
    if (cards.length < 4) return false;
    
    const firstValue = cards[0].value;
    return cards.every(card => card.value === firstValue);
  }

  // 检查是否为顺子
  isStraight(cards) {
    if (cards.length < 5) return false;
    
    const sortedCards = this.sortCards(cards);
    
    for (let i = 1; i < sortedCards.length; i++) {
      if (sortedCards[i].value !== sortedCards[i-1].value + 1) {
        return false;
      }
    }
    
    return true;
  }

  // 检查是否为连对
  isPairStraight(cards) {
    if (cards.length < 6 || cards.length % 2 !== 0) return false;
    
    const sortedCards = this.sortCards(cards);
    
    // 检查是否都是对子
    for (let i = 0; i < sortedCards.length; i += 2) {
      if (sortedCards[i].value !== sortedCards[i + 1].value) {
        return false;
      }
    }
    
    // 检查对子是否连续
    for (let i = 2; i < sortedCards.length; i += 2) {
      if (sortedCards[i].value !== sortedCards[i - 2].value + 1) {
        return false;
      }
    }
    
    return true;
  }

  // 检查是否为连三
  isTripleStraight(cards) {
    if (cards.length < 6 || cards.length % 3 !== 0) return false;
    
    const sortedCards = this.sortCards(cards);
    
    // 检查是否都是三张
    for (let i = 0; i < sortedCards.length; i += 3) {
      if (sortedCards[i].value !== sortedCards[i + 1].value || 
          sortedCards[i + 1].value !== sortedCards[i + 2].value) {
        return false;
      }
    }
    
    // 检查三张是否连续
    for (let i = 3; i < sortedCards.length; i += 3) {
      if (sortedCards[i].value !== sortedCards[i - 3].value + 1) {
        return false;
      }
    }
    
    return true;
  }

  // 检查是否为同花顺
  isStraightFlush(cards) {
    if (cards.length < 5) return false;
    
    // 检查是否同花
    const firstSuit = cards[0].suit;
    if (!cards.every(card => card.suit === firstSuit)) {
      return false;
    }
    
    // 检查是否顺子
    return this.isStraight(cards);
  }

  // 比较炸弹大小
  compareBombs(bomb1, bomb2) {
    // 先比较张数
    if (bomb1.length !== bomb2.length) {
      return bomb1.length - bomb2.length;
    }
    
    // 再比较点数
    return bomb1[0].value - bomb2[0].value;
  }

  // 排序牌
  sortCards(cards) {
    return [...cards].sort((a, b) => {
      if (a.value !== b.value) {
        return a.value - b.value;
      }
      // 如果点数相同，按花色排序
      const suitOrder = {'spades': 0, 'hearts': 1, 'diamonds': 2, 'clubs': 3};
      return (suitOrder[a.suit] || 4) - (suitOrder[b.suit] || 4);
    });
  }
}

export default CardEngine;