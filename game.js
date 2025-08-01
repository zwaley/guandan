// 掼蛋游戏逻辑
class GuandanGame {
    constructor() {
        this.players = [];
        this.currentPlayer = 0;
        this.currentLevel = 2;
        this.deck = [];
        this.lastPlay = null;
        this.passCount = 0;
        this.selectedCards = [];
        this.gamePhase = 'menu'; // menu, playing, finished
        
        this.initializePlayers();
    }

    // 初始化玩家
    initializePlayers() {
        this.players = [
            { id: 0, name: '玩家', hand: [], isHuman: true, level: 2 },
            { id: 1, name: 'AI 1', hand: [], isHuman: false, level: 2 },
            { id: 2, name: 'AI 2', hand: [], isHuman: false, level: 2 },
            { id: 3, name: 'AI 3', hand: [], isHuman: false, level: 2 }
        ];
    }

    // 创建牌堆
    createDeck() {
        this.deck = [];
        const suits = ['♠', '♥', '♦', '♣'];
        const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        
        // 两副牌
        for (let deckNum = 0; deckNum < 2; deckNum++) {
            // 普通牌
            for (const suit of suits) {
                for (const value of values) {
                    this.deck.push({
                        suit: suit,
                        value: value,
                        display: this.getCardDisplay(value),
                        color: (suit === '♥' || suit === '♦') ? 'red' : 'black',
                        id: `${suit}-${value}-${deckNum}`
                    });
                }
            }
            
            // 大小王
            this.deck.push({
                suit: 'joker',
                value: 14,
                display: '小王',
                color: 'black',
                id: `joker-small-${deckNum}`
            });
            
            this.deck.push({
                suit: 'joker',
                value: 15,
                display: '大王',
                color: 'red',
                id: `joker-big-${deckNum}`
            });
        }
    }

    // 获取牌面显示
    getCardDisplay(value) {
        switch (value) {
            case 1: return 'A';
            case 11: return 'J';
            case 12: return 'Q';
            case 13: return 'K';
            default: return value.toString();
        }
    }

    // 洗牌
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    // 发牌
    dealCards() {
        const cardsPerPlayer = 27;
        
        // 清空手牌
        this.players.forEach(player => player.hand = []);
        
        // 发牌
        for (let i = 0; i < cardsPerPlayer; i++) {
            for (let playerIndex = 0; playerIndex < 4; playerIndex++) {
                if (this.deck.length > 0) {
                    this.players[playerIndex].hand.push(this.deck.pop());
                }
            }
        }
        
        // 排序手牌
        this.players.forEach(player => {
            player.hand.sort((a, b) => {
                if (a.value !== b.value) {
                    return a.value - b.value;
                }
                const suitOrder = {'♠': 0, '♥': 1, '♦': 2, '♣': 3, 'joker': 4};
                return suitOrder[a.suit] - suitOrder[b.suit];
            });
        });
    }

    // 开始新游戏
    startNewGame() {
        this.createDeck();
        this.shuffleDeck();
        this.dealCards();
        this.currentPlayer = 0;
        this.lastPlay = null;
        this.passCount = 0;
        this.selectedCards = [];
        this.gamePhase = 'playing';
        
        console.log('游戏开始:', {
            currentPlayer: this.currentPlayer,
            gamePhase: this.gamePhase,
            playerHandSize: this.players[0].hand.length
        });
        
        this.updateUI();
        this.updateControls(); // 确保按钮状态正确初始化
        this.checkAITurn();
    }

    // 识别牌型
    identifyCardType(cards) {
        if (!cards || cards.length === 0) return null;
        
        const sortedCards = [...cards].sort((a, b) => a.value - b.value);
        const length = cards.length;
        
        console.log('识别牌型 - 输入牌:', cards);
        console.log('排序后的牌:', sortedCards);
        console.log('牌数量:', length);
        
        if (length === 1) {
            console.log('识别为单张');
            return 'single';
        }
        
        if (length === 2 && this.isPair(sortedCards)) {
            console.log('识别为对子');
            return 'pair';
        }
        
        if (length === 3 && this.isTriple(sortedCards)) {
            console.log('识别为三张');
            return 'triple';
        }
        
        if (length >= 4 && this.isBomb(sortedCards)) {
            console.log('识别为炸弹');
            return 'bomb';
        }
        
        if (length >= 5 && this.isStraight(sortedCards)) {
            console.log('识别为顺子');
            return 'straight';
        }
        
        // 检查是否为连对
        if (length >= 4 && length % 2 === 0 && this.isConsecutivePairs(sortedCards)) {
            console.log('识别为连对');
            return 'consecutive_pairs';
        }
        
        console.log('无法识别牌型');
        return null;
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
        
        for (let i = 1; i < cards.length; i++) {
            if (cards[i].value !== cards[i-1].value + 1) {
                return false;
            }
        }
        return true;
    }

    // 检查是否为连对
    isConsecutivePairs(cards) {
        if (cards.length < 4 || cards.length % 2 !== 0) return false;
        
        // 检查是否都是对子
        for (let i = 0; i < cards.length; i += 2) {
            if (i + 1 >= cards.length || cards[i].value !== cards[i + 1].value) {
                return false;
            }
        }
        
        // 检查对子是否连续
        for (let i = 2; i < cards.length; i += 2) {
            if (cards[i].value !== cards[i - 2].value + 1) {
                return false;
            }
        }
        
        return true;
    }

    // 验证出牌
    validatePlay(cards) {
        console.log('验证出牌:', cards);
        const cardType = this.identifyCardType(cards);
        console.log('识别牌型:', cardType);
        
        if (!cardType) {
            console.log('无效牌型');
            return false;
        }
        
        // 如果没有上家出牌，任何合法牌型都可以出
        if (!this.lastPlay) {
            console.log('首次出牌，允许');
            return true;
        }
        
        const lastCardType = this.lastPlay.type;
        const lastCards = this.lastPlay.cards;
        console.log('上家出牌:', lastCardType, lastCards);
        
        // 炸弹可以压任何牌型
        if (cardType === 'bomb') {
            if (lastCardType !== 'bomb') return true;
            return this.compareBombs(cards, lastCards) > 0;
        }
        
        // 其他牌型必须同类型且更大
        if (cardType !== lastCardType || cards.length !== lastCards.length) {
            console.log('牌型不匹配或长度不同');
            return false;
        }
        
        const result = this.compareCards(cards, lastCards) > 0;
        console.log('比较结果:', result);
        return result;
    }

    // 比较牌的大小
    compareCards(cards1, cards2) {
        const getValue = (cards) => {
            const sorted = [...cards].sort((a, b) => a.value - b.value);
            return sorted[sorted.length - 1].value;
        };
        
        return getValue(cards1) - getValue(cards2);
    }

    // 比较炸弹大小
    compareBombs(bomb1, bomb2) {
        if (bomb1.length !== bomb2.length) {
            return bomb1.length - bomb2.length;
        }
        return bomb1[0].value - bomb2[0].value;
    }

    // 玩家出牌
    playCards() {
        if (this.currentPlayer !== 0 || this.selectedCards.length === 0) {
            return false;
        }
        
        const selectedCardObjects = this.selectedCards.map(index => 
            this.players[0].hand[index]
        );
        
        if (!this.validatePlay(selectedCardObjects)) {
            alert('出牌不符合规则！');
            return false;
        }
        
        // 从手牌中移除选中的牌
        const newHand = this.players[0].hand.filter((_, index) => 
            !this.selectedCards.includes(index)
        );
        this.players[0].hand = newHand;
        
        // 更新最后出牌
        this.lastPlay = {
            player: 0,
            cards: selectedCardObjects,
            type: this.identifyCardType(selectedCardObjects)
        };
        
        this.passCount = 0;
        this.selectedCards = [];
        
        // 检查是否出完牌
        if (this.players[0].hand.length === 0) {
            alert('恭喜！你赢了！');
            this.gamePhase = 'finished';
            return true;
        }
        
        this.nextPlayer();
        this.updateUI();
        this.checkAITurn();
        
        return true;
    }

    // 过牌
    passCards() {
        if (this.currentPlayer !== 0) return false;
        
        this.passCount++;
        
        if (this.passCount >= 3) {
            this.lastPlay = null;
            this.passCount = 0;
        }
        
        this.selectedCards = [];
        this.nextPlayer();
        this.updateUI();
        this.checkAITurn();
        
        return true;
    }

    // 下一个玩家
    nextPlayer() {
        this.currentPlayer = (this.currentPlayer + 1) % 4;
    }

    // 检查AI回合
    checkAITurn() {
        if (this.currentPlayer !== 0 && this.gamePhase === 'playing') {
            setTimeout(() => {
                this.executeAITurn();
            }, 1000 + Math.random() * 2000);
        }
    }

    // 执行AI回合
    executeAITurn() {
        if (this.currentPlayer === 0 || this.gamePhase !== 'playing') {
            return;
        }
        
        const player = this.players[this.currentPlayer];
        const decision = this.makeAIDecision(player);
        
        if (decision.action === 'play') {
            // AI出牌
            const newHand = player.hand.filter((_, index) => 
                !decision.cardIndices.includes(index)
            );
            player.hand = newHand;
            
            this.lastPlay = {
                player: this.currentPlayer,
                cards: decision.cards,
                type: this.identifyCardType(decision.cards)
            };
            
            console.log('AI出牌:', {
                player: player.name,
                cards: decision.cards,
                type: this.lastPlay.type,
                remainingCards: player.hand.length
            });
            
            this.passCount = 0;
            
            // 检查AI是否出完牌
            if (player.hand.length === 0) {
                alert(`${player.name} 赢了！`);
                this.gamePhase = 'finished';
                return;
            }
        } else {
            // AI过牌
            this.passCount++;
            
            if (this.passCount >= 3) {
                this.lastPlay = null;
                this.passCount = 0;
            }
        }
        
        this.nextPlayer();
        this.updateUI();
        this.checkAITurn();
    }

    // AI决策（简化版本）
    makeAIDecision(player) {
        const hand = player.hand;
        
        // 获取可能的出牌组合
        const possiblePlays = this.getPossiblePlays(hand);
        
        if (possiblePlays.length === 0) {
            return { action: 'pass' };
        }
        
        // 简单策略：优先出小牌
        const selectedPlay = possiblePlays.reduce((best, current) => {
            const bestValue = this.getPlayValue(best.cards);
            const currentValue = this.getPlayValue(current.cards);
            return currentValue < bestValue ? current : best;
        });
        
        return {
            action: 'play',
            cards: selectedPlay.cards,
            cardIndices: selectedPlay.indices
        };
    }

    // 获取可能的出牌组合
    getPossiblePlays(hand) {
        const plays = [];
        
        console.log('AI寻找可出牌:', {
            handSize: hand.length,
            hasLastPlay: !!this.lastPlay,
            lastPlay: this.lastPlay
        });
        
        // 如果没有上家出牌，可以出任何合法牌型
        if (!this.lastPlay) {
            // 单张
            for (let i = 0; i < hand.length; i++) {
                plays.push({ cards: [hand[i]], indices: [i] });
            }
            console.log('无上家出牌，找到可出牌:', plays.length);
            return plays;
        }
        
        // 有上家出牌时，需要找到能压过的牌
        const lastType = this.lastPlay.type;
        const lastCards = this.lastPlay.cards;
        
        // 单张
        if (lastType === 'single' && lastCards.length === 1) {
            const lastCard = lastCards[0];
            for (let i = 0; i < hand.length; i++) {
                const card = hand[i];
                // 直接比较牌值，避免调用validatePlay
                if (card.value > lastCard.value || 
                    (card.value === lastCard.value && card.suit > lastCard.suit)) {
                    plays.push({ cards: [card], indices: [i] });
                }
            }
        }
        
        // 对子
        if (lastType === 'pair') {
            for (let i = 0; i < hand.length - 1; i++) {
                for (let j = i + 1; j < hand.length; j++) {
                    if (hand[i].value === hand[j].value) {
                        const cards = [hand[i], hand[j]];
                        if (this.validatePlay(cards)) {
                            plays.push({ cards, indices: [i, j] });
                        }
                    }
                }
            }
        }
        
        // 三张
        if (lastType === 'triple') {
            for (let i = 0; i < hand.length - 2; i++) {
                for (let j = i + 1; j < hand.length - 1; j++) {
                    for (let k = j + 1; k < hand.length; k++) {
                        if (hand[i].value === hand[j].value && hand[j].value === hand[k].value) {
                            const cards = [hand[i], hand[j], hand[k]];
                            if (this.validatePlay(cards)) {
                                plays.push({ cards, indices: [i, j, k] });
                            }
                        }
                    }
                }
            }
        }
        
        // 炸弹（可以压任何牌型）
        for (let i = 0; i < hand.length - 3; i++) {
            let bombCards = [hand[i]];
            let bombIndices = [i];
            
            for (let j = i + 1; j < hand.length; j++) {
                if (hand[j].value === hand[i].value) {
                    bombCards.push(hand[j]);
                    bombIndices.push(j);
                }
            }
            
            if (bombCards.length >= 4) {
                if (this.validatePlay(bombCards)) {
                    plays.push({ cards: bombCards, indices: bombIndices });
                }
            }
        }
        
        console.log('AI找到可出牌数量:', plays.length);
        if (plays.length > 0) {
            console.log('第一个可出牌:', plays[0]);
        }
        
        return plays;
    }

    // 获取出牌价值（用于AI决策）
    getPlayValue(cards) {
        return cards.reduce((sum, card) => sum + card.value, 0) / cards.length;
    }

    // 更新UI
    updateUI() {
        this.updatePlayerInfo();
        this.updatePlayerHand();
        this.updateLastPlay();
        this.updateControls();
    }

    // 更新玩家信息
    updatePlayerInfo() {
        for (let i = 1; i < 4; i++) {
            const element = document.getElementById(`player${i}Cards`);
            if (element) {
                element.textContent = `${this.players[i].hand.length} 张牌`;
            }
            
            const playerElement = document.getElementById(`player${i}`);
            if (playerElement) {
                if (this.currentPlayer === i) {
                    playerElement.classList.add('current-player');
                } else {
                    playerElement.classList.remove('current-player');
                }
            }
        }
        
        // 更新当前回合显示
        const turnElement = document.getElementById('currentTurn');
        if (turnElement) {
            turnElement.textContent = this.currentPlayer + 1;
        }
        
        // 更新AI玩家手牌显示（显示牌背）
        this.updateAIPlayerCards();
    }

    // 更新玩家手牌显示
    updatePlayerHand() {
        const handContainer = document.getElementById('playerHand');
        if (!handContainer) return;
        
        handContainer.innerHTML = '';
        
        this.players[0].hand.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = `card ${card.color}`;
            cardElement.innerHTML = `
                <div>${card.display}</div>
                <div>${card.suit !== 'joker' ? card.suit : ''}</div>
                <div style="transform: rotate(180deg);">${card.display}</div>
            `;
            
            if (this.selectedCards.includes(index)) {
                cardElement.classList.add('selected');
            }
            
            cardElement.addEventListener('click', () => {
                this.toggleCardSelection(index);
            });
            
            handContainer.appendChild(cardElement);
        });
    }

    // 切换牌的选择状态
    toggleCardSelection(index) {
        if (this.currentPlayer !== 0) return;
        
        const selectedIndex = this.selectedCards.indexOf(index);
        if (selectedIndex > -1) {
            this.selectedCards.splice(selectedIndex, 1);
        } else {
            this.selectedCards.push(index);
        }
        
        console.log('选牌后的状态:', {
            selectedCards: this.selectedCards,
            currentPlayer: this.currentPlayer
        });
        
        this.updatePlayerHand();
        this.updateSelectedCount();
        this.updateControls(); // 添加这行来更新按钮状态
    }

    // 更新选中牌数显示
    updateSelectedCount() {
        const countElement = document.getElementById('selectedCount');
        if (countElement) {
            countElement.textContent = this.selectedCards.length;
        }
    }

    // 更新AI玩家手牌显示
    updateAIPlayerCards() {
        for (let i = 1; i < 4; i++) {
            const playerElement = document.getElementById(`player${i}`);
            if (playerElement) {
                // 清除现有的牌显示
                const existingCards = playerElement.querySelector('.ai-cards');
                if (existingCards) {
                    existingCards.remove();
                }
                
                // 创建牌显示容器
                const cardsContainer = document.createElement('div');
                cardsContainer.className = 'ai-cards';
                cardsContainer.style.cssText = `
                    display: flex;
                    flex-wrap: wrap;
                    gap: 2px;
                    margin-top: 5px;
                    justify-content: center;
                    max-width: 100px;
                `;
                
                // 显示牌背（最多显示10张，超过的用数字表示）
                const cardCount = this.players[i].hand.length;
                const displayCount = Math.min(cardCount, 10);
                
                for (let j = 0; j < displayCount; j++) {
                    const cardBack = document.createElement('div');
                    cardBack.style.cssText = `
                        width: 8px;
                        height: 12px;
                        background: #1976D2;
                        border: 1px solid #0D47A1;
                        border-radius: 2px;
                        margin: 1px;
                    `;
                    cardsContainer.appendChild(cardBack);
                }
                
                if (cardCount > 10) {
                    const moreText = document.createElement('div');
                    moreText.textContent = `+${cardCount - 10}`;
                    moreText.style.cssText = `
                        font-size: 10px;
                        color: white;
                        margin-left: 5px;
                    `;
                    cardsContainer.appendChild(moreText);
                }
                
                playerElement.appendChild(cardsContainer);
            }
        }
    }

    // 更新最后出牌显示
    updateLastPlay() {
        const lastPlayElement = document.getElementById('lastPlayInfo');
        console.log('updateLastPlay调用:', {
            elementFound: !!lastPlayElement,
            hasLastPlay: !!this.lastPlay,
            lastPlay: this.lastPlay
        });
        
        if (!lastPlayElement) {
            console.error('找不到lastPlayInfo元素!');
            return;
        }
        
        if (!this.lastPlay) {
            lastPlayElement.innerHTML = '<div class="last-play-text">等待出牌...</div>';
        } else {
            const playerName = this.players[this.lastPlay.player].name;
            const cardType = this.getCardTypeDisplay(this.lastPlay.type);
            
            console.log('准备显示AI出牌:', {
                playerName,
                cardType,
                cards: this.lastPlay.cards
            });
            
            // 创建牌面显示
            let cardsHtml = '';
            this.lastPlay.cards.forEach(card => {
                cardsHtml += `
                    <div class="center-card ${card.color}">
                        <div>${card.display}</div>
                        <div>${card.suit !== 'joker' ? card.suit : ''}</div>
                        <div style="transform: rotate(180deg);">${card.display}</div>
                    </div>
                `;
            });
            
            const finalHtml = `
                <div class="last-play-info">
                    <div class="last-play-text">${playerName} 出牌 (${cardType})</div>
                    <div class="last-play-cards">
                        ${cardsHtml}
                    </div>
                </div>
            `;
            
            console.log('设置HTML:', finalHtml);
            lastPlayElement.innerHTML = finalHtml;
        }
    }

    // 获取牌型显示名称
    getCardTypeDisplay(type) {
        const typeNames = {
            'single': '单张',
            'pair': '对子',
            'triple': '三张',
            'bomb': '炸弹',
            'straight': '顺子',
            'consecutive_pairs': '连对'
        };
        return typeNames[type] || type;
    }

    // 更新控制按钮状态
    updateControls() {
        const playBtn = document.getElementById('playBtn');
        const passBtn = document.getElementById('passBtn');
        
        if (playBtn && passBtn) {
            const canPlay = this.currentPlayer === 0 && this.gamePhase === 'playing';
            const hasSelectedCards = this.selectedCards.length > 0;
            
            console.log('更新控制按钮:', {
                currentPlayer: this.currentPlayer,
                gamePhase: this.gamePhase,
                canPlay: canPlay,
                hasSelectedCards: hasSelectedCards,
                selectedCards: this.selectedCards
            });
            
            // 检查选中的牌是否可以出
            let canPlaySelected = false;
            if (hasSelectedCards) {
                const selectedCardObjects = this.selectedCards.map(index => 
                    this.players[0].hand[index]
                );
                console.log('选中的牌对象:', selectedCardObjects);
                canPlaySelected = this.validatePlay(selectedCardObjects);
                console.log('可以出牌:', canPlaySelected);
            }
            
            playBtn.disabled = !canPlay || !hasSelectedCards || !canPlaySelected;
            passBtn.disabled = !canPlay;
            
            console.log('按钮状态:', {
                playBtnDisabled: playBtn.disabled,
                passBtnDisabled: passBtn.disabled
            });
            
            // 更新按钮样式
            if (playBtn.disabled) {
                playBtn.style.opacity = '0.5';
                playBtn.style.cursor = 'not-allowed';
            } else {
                playBtn.style.opacity = '1';
                playBtn.style.cursor = 'pointer';
            }
            
            if (passBtn.disabled) {
                passBtn.style.opacity = '0.5';
                passBtn.style.cursor = 'not-allowed';
            } else {
                passBtn.style.opacity = '1';
                passBtn.style.cursor = 'pointer';
            }
        }
    }
}

// 全局游戏实例
let game = new GuandanGame();

// 界面控制函数
function startGame() {
    document.getElementById('menuScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'flex';
    game.startNewGame();
}

function backToMenu() {
    if (confirm('确定要退出当前游戏吗？')) {
        document.getElementById('gameScreen').style.display = 'none';
        document.getElementById('menuScreen').style.display = 'flex';
        game = new GuandanGame();
    }
}

function playCards() {
    game.playCards();
}

function passCards() {
    game.passCards();
}

function showRules() {
    alert('掼蛋游戏规则：\n\n1. 使用两副牌，4人游戏\n2. 支持单张、对子、三张、顺子、炸弹等牌型\n3. 炸弹可以压任何牌型\n4. 相同牌型比大小\n5. 先出完牌的玩家获胜');
}

function showSettings() {
    alert('设置功能开发中...');
}

function showAbout() {
    alert('掼蛋单机版 v1.0.0\n\n一个简单的掼蛋游戏实现\n支持与AI对战');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('掼蛋游戏已加载');
    console.log('游戏对象:', game);
    console.log('当前时间:', new Date().toLocaleString());
    
    // 测试按钮是否存在
    const playBtn = document.getElementById('playBtn');
    const passBtn = document.getElementById('passBtn');
    console.log('出牌按钮:', playBtn);
    console.log('过牌按钮:', passBtn);
    
    if (playBtn) {
        console.log('出牌按钮初始状态:', {
            disabled: playBtn.disabled,
            style: playBtn.style.cssText
        });
    }
});