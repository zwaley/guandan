import CardEngine from '../game/CardEngine';

class AIPlayer {
  constructor(playerId, difficulty = 'medium') {
    this.playerId = playerId;
    this.difficulty = difficulty; // easy, medium, hard
    this.cardEngine = new CardEngine();
    this.memory = {
      playedCards: [], // 记住已出的牌
      playerStyles: {}, // 记住其他玩家的出牌风格
    };
  }

  // AI决策主函数
  makeDecision(gameState) {
    const player = gameState.players[this.playerId];
    const hand = player.hand;
    const lastPlay = gameState.lastPlay;

    // 更新记忆
    this.updateMemory(gameState);

    // 获取所有可能的出牌组合
    const possiblePlays = this.getPossiblePlays(hand, lastPlay);

    if (possiblePlays.length === 0) {
      return { action: 'pass' };
    }

    // 根据难度选择策略
    const selectedPlay = this.selectBestPlay(possiblePlays, gameState);

    if (selectedPlay) {
      const cardIndices = this.getCardIndices(hand, selectedPlay.cards);
      return {
        action: 'play',
        cardIndices: cardIndices,
        cards: selectedPlay.cards,
      };
    }

    return { action: 'pass' };
  }

  // 获取所有可能的出牌组合
  getPossiblePlays(hand, lastPlay) {
    const possiblePlays = [];

    // 如果没有上一次出牌，可以出任何合法牌型
    if (!lastPlay) {
      possiblePlays.push(...this.getAllValidCombinations(hand));
    } else {
      // 需要压过上一次出牌
      possiblePlays.push(...this.getBeatingCombinations(hand, lastPlay));
    }

    return possiblePlays;
  }

  // 获取所有合法的牌型组合
  getAllValidCombinations(hand) {
    const combinations = [];

    // 单张
    for (let i = 0; i < hand.length; i++) {
      combinations.push({
        cards: [hand[i]],
        type: this.cardEngine.identifyCardType([hand[i]]),
        priority: this.getCardPriority(hand[i]),
      });
    }

    // 对子
    combinations.push(...this.findPairs(hand));

    // 三张
    combinations.push(...this.findTriples(hand));

    // 炸弹
    combinations.push(...this.findBombs(hand));

    // 顺子
    combinations.push(...this.findStraights(hand));

    // 连对
    combinations.push(...this.findPairStraights(hand));

    // 连三
    combinations.push(...this.findTripleStraights(hand));

    return combinations;
  }

  // 获取能压过上一次出牌的组合
  getBeatingCombinations(hand, lastPlay) {
    const combinations = [];
    const allCombinations = this.getAllValidCombinations(hand);

    for (const combination of allCombinations) {
      if (this.cardEngine.validatePlay(combination.cards, lastPlay)) {
        combinations.push(combination);
      }
    }

    return combinations;
  }

  // 选择最佳出牌
  selectBestPlay(possiblePlays, gameState) {
    if (possiblePlays.length === 0) {
      return null;
    }

    // 根据难度应用不同策略
    switch (this.difficulty) {
      case 'easy':
        return this.easyStrategy(possiblePlays, gameState);
      case 'medium':
        return this.mediumStrategy(possiblePlays, gameState);
      case 'hard':
        return this.hardStrategy(possiblePlays, gameState);
      default:
        return this.mediumStrategy(possiblePlays, gameState);
    }
  }

  // 简单策略：随机选择或出最小的牌
  easyStrategy(possiblePlays, gameState) {
    // 30%概率随机选择，70%概率选择最小的牌
    if (Math.random() < 0.3) {
      return possiblePlays[Math.floor(Math.random() * possiblePlays.length)];
    }

    return possiblePlays.reduce((best, current) => {
      return current.priority < best.priority ? current : best;
    });
  }

  // 中等策略：考虑基本的游戏策略
  mediumStrategy(possiblePlays, gameState) {
    const player = gameState.players[this.playerId];
    const handSize = player.hand.length;

    // 如果手牌很少，优先出大牌
    if (handSize <= 5) {
      return possiblePlays.reduce((best, current) => {
        return current.priority > best.priority ? current : best;
      });
    }

    // 如果手牌很多，优先出小牌
    if (handSize >= 20) {
      return possiblePlays.reduce((best, current) => {
        return current.priority < best.priority ? current : best;
      });
    }

    // 中等手牌数量，平衡策略
    const sortedPlays = possiblePlays.sort((a, b) => a.priority - b.priority);
    const midIndex = Math.floor(sortedPlays.length / 2);
    return sortedPlays[midIndex];
  }

  // 困难策略：考虑高级策略
  hardStrategy(possiblePlays, gameState) {
    // 实现更复杂的策略，如配合队友、阻挡对手等
    const player = gameState.players[this.playerId];
    const partner = gameState.players[player.partner];
    const lastPlay = gameState.lastPlay;

    // 如果队友是上一个出牌的，考虑不压牌
    if (lastPlay && lastPlay.player === player.partner) {
      // 50%概率选择过牌（通过返回null实现）
      if (Math.random() < 0.5) {
        return null;
      }
    }

    // 如果对手手牌很少，优先出大牌阻挡
    const opponents = gameState.players.filter(p => p.id !== this.playerId && p.id !== player.partner);
    const minOpponentCards = Math.min(...opponents.map(p => p.hand.length));
    
    if (minOpponentCards <= 3) {
      return possiblePlays.reduce((best, current) => {
        return current.priority > best.priority ? current : best;
      });
    }

    // 默认使用中等策略
    return this.mediumStrategy(possiblePlays, gameState);
  }

  // 查找对子
  findPairs(hand) {
    const pairs = [];
    const valueGroups = this.groupByValue(hand);

    for (const value in valueGroups) {
      const cards = valueGroups[value];
      if (cards.length >= 2) {
        for (let i = 0; i < cards.length - 1; i++) {
          for (let j = i + 1; j < cards.length; j++) {
            pairs.push({
              cards: [cards[i], cards[j]],
              type: 'pair',
              priority: parseInt(value),
            });
          }
        }
      }
    }

    return pairs;
  }

  // 查找三张
  findTriples(hand) {
    const triples = [];
    const valueGroups = this.groupByValue(hand);

    for (const value in valueGroups) {
      const cards = valueGroups[value];
      if (cards.length >= 3) {
        triples.push({
          cards: cards.slice(0, 3),
          type: 'triple',
          priority: parseInt(value),
        });
      }
    }

    return triples;
  }

  // 查找炸弹
  findBombs(hand) {
    const bombs = [];
    const valueGroups = this.groupByValue(hand);

    for (const value in valueGroups) {
      const cards = valueGroups[value];
      if (cards.length >= 4) {
        bombs.push({
          cards: cards,
          type: 'bomb',
          priority: parseInt(value) + 100, // 炸弹优先级很高
        });
      }
    }

    return bombs;
  }

  // 查找顺子（简化版本）
  findStraights(hand) {
    const straights = [];
    const sortedHand = [...hand].sort((a, b) => a.value - b.value);
    
    // 简化实现：只查找5张的顺子
    for (let i = 0; i <= sortedHand.length - 5; i++) {
      const potential = sortedHand.slice(i, i + 5);
      if (this.cardEngine.isStraight(potential)) {
        straights.push({
          cards: potential,
          type: 'straight',
          priority: potential[4].value,
        });
      }
    }

    return straights;
  }

  // 查找连对（简化版本）
  findPairStraights(hand) {
    // 简化实现，暂时返回空数组
    return [];
  }

  // 查找连三（简化版本）
  findTripleStraights(hand) {
    // 简化实现，暂时返回空数组
    return [];
  }

  // 按点数分组
  groupByValue(hand) {
    const groups = {};
    for (const card of hand) {
      if (!groups[card.value]) {
        groups[card.value] = [];
      }
      groups[card.value].push(card);
    }
    return groups;
  }

  // 获取牌的优先级
  getCardPriority(card) {
    return card.value;
  }

  // 获取牌在手牌中的索引
  getCardIndices(hand, cards) {
    const indices = [];
    for (const card of cards) {
      const index = hand.findIndex(c => c.id === card.id);
      if (index !== -1) {
        indices.push(index);
      }
    }
    return indices;
  }

  // 更新AI记忆
  updateMemory(gameState) {
    if (gameState.lastPlay) {
      this.memory.playedCards.push(...gameState.lastPlay.cards);
    }
  }
}

export default AIPlayer;