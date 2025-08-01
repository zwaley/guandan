class Deck {
  constructor() {
    this.cards = [];
    this.initializeDeck();
  }

  // 初始化牌堆（掼蛋使用两副牌）
  initializeDeck() {
    this.cards = [];
    
    const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]; // A, 2-10, J, Q, K
    
    // 两副牌
    for (let deck = 0; deck < 2; deck++) {
      // 普通牌
      for (const suit of suits) {
        for (const value of values) {
          this.cards.push({
            suit: suit,
            value: value,
            id: `${suit}-${value}-${deck}`,
          });
        }
      }
      
      // 大小王
      this.cards.push({
        suit: 'joker',
        value: 14, // 小王
        id: `joker-small-${deck}`,
      });
      
      this.cards.push({
        suit: 'joker',
        value: 15, // 大王
        id: `joker-big-${deck}`,
      });
    }
  }

  // 洗牌（Fisher-Yates算法）
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  // 抽牌
  drawCard() {
    return this.cards.pop();
  }

  // 获取剩余牌数
  getRemainingCount() {
    return this.cards.length;
  }

  // 重置牌堆
  reset() {
    this.initializeDeck();
  }

  // 获取所有牌（用于调试）
  getAllCards() {
    return [...this.cards];
  }
}

export default Deck;