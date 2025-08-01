# 掼蛋单机版手游

一个基于React Native开发的掼蛋单机版手机游戏，支持与AI对战。

## 功能特性

### 🎮 游戏功能
- **单机模式**: 1个人类玩家 + 3个AI玩家
- **完整掼蛋规则**: 支持所有标准掼蛋牌型和规则
- **智能AI**: 三种难度等级的AI对手
- **精美界面**: 现代化的游戏UI设计
- **流畅动画**: 出牌、发牌等动画效果

### 🃏 支持的牌型
- 单张
- 对子
- 三张
- 顺子（5张及以上连续）
- 连对（3对及以上连续对子）
- 连三（2个及以上连续三张）
- 炸弹（4张及以上相同点数）
- 同花顺

### 🤖 AI特性
- **简单AI**: 基础出牌逻辑
- **中等AI**: 考虑手牌数量的策略
- **困难AI**: 高级策略，包括配合队友、阻挡对手

## 技术架构

### 前端技术栈
- **React Native 0.72.6**: 跨平台移动应用框架
- **JavaScript/ES6+**: 主要开发语言
- **React Hooks**: 状态管理

### 核心模块
```
src/
├── components/          # UI组件
│   ├── Card.js         # 扑克牌组件
│   ├── GameTable.js    # 游戏桌面
│   ├── PlayerHand.js   # 玩家手牌
│   └── GameControls.js # 游戏控制按钮
├── screens/            # 页面组件
│   ├── MenuScreen.js   # 主菜单
│   └── GameScreen.js   # 游戏界面
├── game/               # 游戏逻辑
│   ├── GameManager.js  # 游戏管理器
│   ├── CardEngine.js   # 牌型识别引擎
│   └── Deck.js         # 牌堆管理
├── ai/                 # AI系统
│   └── AIPlayer.js     # AI玩家
└── utils/              # 工具函数
```

## 安装和运行

### 环境要求
- Node.js >= 16
- React Native CLI
- Android Studio (Android开发)
- Xcode (iOS开发，仅macOS)

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 运行项目

#### Android
```bash
npx react-native run-android
```

#### iOS
```bash
npx react-native run-ios
```

### 开发模式
```bash
npx react-native start
```

## 游戏规则

### 基本规则
1. 使用两副牌（108张），4人游戏
2. 每人27张牌
3. 按掼蛋标准规则进行游戏
4. 支持升级制度

### 牌型大小
1. **单张**: 按点数大小
2. **对子**: 按点数大小
3. **三张**: 按点数大小
4. **顺子**: 按最大牌点数
5. **炸弹**: 张数多的大，张数相同按点数
6. **同花顺**: 最高级别牌型

## 开发计划

### 已完成
- ✅ 基础项目结构
- ✅ 游戏UI界面
- ✅ 牌型识别引擎
- ✅ AI决策系统
- ✅ 基本游戏流程

### 待完成
- 🔄 完善AI策略
- 🔄 添加音效
- 🔄 游戏设置功能
- 🔄 成就系统
- 🔄 游戏统计
- 🔄 更多动画效果

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过Issue联系。