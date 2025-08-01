import CardEngine from './CardEngine';
import AIPlayer from '../ai/AIPlayer';
import Deck from './Deck';

class GameManager {
  constructor() {
    this.gameState = {
      players: [],
      currentPlayer: 0,
      currentLevel: 2, // 从2开始
      deck: null,
      lastPlay: null,
      gamePhase: 'waiting', // waiting, dealing, playing, finished
      passCount: 0, // 连续过牌次数
    };
    
    this.cardEngine = new CardEngine();
    this.stateChangeListeners = [];
    this.initializePlayers();
  }

  initializePlayers() {
    // 创建4个玩家：0是人类，1-3是AI
    this.gameState.players = [
      {
        id: 0,
        name: '玩家',
        hand: [],
        isHuman: true,
        level: 2,
        partner: 2, // 对家是玩家2
      },
      {
        id: 1,
        name: 'AI 1',
        hand: [],
        isHuman: false,
        level: 2,
        partner: 3,
        ai: new AIPlayer(1, 'medium'),
      },
      {
        id: 2,
        name: 'AI 2',
        hand: [],
        isHuman: false,
        level: 2,
        partner: 0,
        ai: new AIPlayer(2, 'medium'),
      },
      {
        id: 3,
        name: 'AI 3',
        hand: [],
        isHuman: false,
        level: 2,
        partner: 1,
        ai: new AIPlayer(3, 'medium'),
      },
    ];
  }

  startNewGame() {
    this.gameState.deck = new Deck();
    this.gameState.deck.shuffle();
    this.dealCards();
    this.gameState.gamePhase = 'playing';
    this.gameState.currentPlayer = 0; // 从玩家开始
    this.gameState.lastPlay = null;
    this.gameState.passCount = 0;
    
    this.notifyStateChange();
    
    // 如果当前玩家是AI，自动出牌
    this.checkAITurn();
  }

  dealCards() {
    const cardsPerPlayer = 27; // 108张牌，每人27张
    
    // 清空所有玩家手牌
    this.gameState.players.forEach(player => {
      player.hand = [];
    });
    
    // 发牌
    for (let i = 0; i < cardsPerPlayer; i++) {
      for (let playerIndex = 0; playerIndex < 4; playerIndex++) {
        const card = this.gameState.deck.drawCard();
        if (card) {
          this.gameState.players[playerIndex].hand.push(card);
        }
      }
    }
    
    // 排序手牌
    this.gameState.players.forEach(player => {
      player.hand.sort((a, b) => {
        if (a.suit !== b.suit) {
          const suitOrder = {'spades': 0, 'hearts': 1, 'diamonds': 2, 'clubs': 3};
          return (suitOrder[a.suit] || 4) - (suitOrder[b.suit] || 4);
        }
        return a.value - b.value;
      });
    });
  }

  playCards(playerIndex, cardIndices) {
    if (this.gameState.currentPlayer !== playerIndex) {
      return false;
    }
    
    const player = this.gameState.players[playerIndex];
    const selectedCards = cardIndices.map(index => player.hand[index]);
    
    // 验证出牌是否合法
    if (!this.cardEngine.validatePlay(selectedCards, this.gameState.lastPlay)) {
      return false;
    }
    
    // 从手牌中移除选中的牌
    const newHand = player.hand.filter((_, index) => !cardIndices.includes(index));
    player.hand = newHand;
    
    // 更新最后出牌
    this.gameState.lastPlay = {
      player: playerIndex,
      cards: selectedCards,
      type: this.cardEngine.identifyCardType(selectedCards),
    };
    
    this.gameState.passCount = 0; // 重置过牌计数
    
    // 检查是否有玩家出完牌
    if (player.hand.length === 0) {
      this.handlePlayerFinished(playerIndex);
      return true;
    }
    
    // 切换到下一个玩家
    this.nextPlayer();
    this.notifyStateChange();
    
    // 检查AI回合
    this.checkAITurn();
    
    return true;
  }

  pass(playerIndex) {
    if (this.gameState.currentPlayer !== playerIndex) {
      return false;
    }
    
    this.gameState.passCount++;
    
    // 如果连续3个玩家过牌，清空最后出牌
    if (this.gameState.passCount >= 3) {
      this.gameState.lastPlay = null;
      this.gameState.passCount = 0;
    }
    
    this.nextPlayer();
    this.notifyStateChange();
    
    // 检查AI回合
    this.checkAITurn();
    
    return true;
  }

  nextPlayer() {
    this.gameState.currentPlayer = (this.gameState.currentPlayer + 1) % 4;
  }

  checkAITurn() {
    const currentPlayer = this.gameState.players[this.gameState.currentPlayer];
    
    if (!currentPlayer.isHuman && this.gameState.gamePhase === 'playing') {
      // AI玩家思考时间
      setTimeout(() => {
        this.executeAITurn();
      }, 1000 + Math.random() * 2000); // 1-3秒随机思考时间
    }
  }

  executeAITurn() {
    const currentPlayerIndex = this.gameState.currentPlayer;
    const currentPlayer = this.gameState.players[currentPlayerIndex];
    
    if (currentPlayer.isHuman || this.gameState.gamePhase !== 'playing') {
      return;
    }
    
    const decision = currentPlayer.ai.makeDecision(this.gameState);
    
    if (decision.action === 'play') {
      this.playCards(currentPlayerIndex, decision.cardIndices);
    } else {
      this.pass(currentPlayerIndex);
    }
  }

  handlePlayerFinished(playerIndex) {
    console.log(`玩家 ${playerIndex} 出完牌了！`);
    // 这里可以添加升级逻辑
    this.gameState.gamePhase = 'finished';
  }

  getGameState() {
    return {...this.gameState};
  }

  onStateChange(callback) {
    this.stateChangeListeners.push(callback);
    
    // 返回取消订阅函数
    return () => {
      const index = this.stateChangeListeners.indexOf(callback);
      if (index > -1) {
        this.stateChangeListeners.splice(index, 1);
      }
    };
  }

  notifyStateChange() {
    this.stateChangeListeners.forEach(callback => {
      callback(this.getGameState());
    });
  }
}

export default GameManager;