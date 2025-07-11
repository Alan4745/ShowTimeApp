import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';

interface TabBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export default function TabBar({ activeTab, onTabPress }: TabBarProps) {
  const tabs = [
    { id: 'learn', icon: require('../../../assets/img/icon/learn.png') },
    { id: 'home', icon: require('../../../assets/img/icon/Training.png') },
    { id: 'coaches', icon: require('../../../assets/img/icon/Coaches.png') },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const color = isActive ? '#4A90E2' : '#666';

          return (
            <React.Fragment key={tab.id}>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => onTabPress(tab.id)}
              >
                <Image
                  source={tab.icon}
                  style={{ width: 24, height: 24, tintColor: color }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              {index < tabs.length - 1 && <View style={styles.verticalDivider} />}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    backgroundColor: '#000',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
  },
});
