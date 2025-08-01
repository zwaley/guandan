import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';

const {width, height} = Dimensions.get('window');

const MenuScreen = ({onStartGame}) => {
  return (
    <View style={styles.container}>
      {/* 游戏标题 */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>掼蛋</Text>
        <Text style={styles.subtitle}>单机版</Text>
      </View>

      {/* 菜单按钮 */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={onStartGame}>
          <Text style={styles.buttonText}>开始游戏</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.buttonText}>游戏规则</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.buttonText}>设置</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.buttonText}>关于</Text>
        </TouchableOpacity>
      </View>

      {/* 版本信息 */}
      <View style={styles.footer}>
        <Text style={styles.versionText}>版本 1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B5E20',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: '#000',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#E8F5E8',
    marginTop: 10,
  },
  menuContainer: {
    alignItems: 'center',
    width: '80%',
  },
  menuButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginVertical: 10,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
  },
  versionText: {
    color: '#A5D6A7',
    fontSize: 14,
  },
});

export default MenuScreen;