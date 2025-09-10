import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';

interface TabBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export default function TabBar({ activeTab, onTabPress }: TabBarProps) {
  const tabs = [
    { id: 'learn', icon: require('../../../assets/img/icon/learn.png'), label: 'Learn' },
    { id: 'home', icon: require('../../../assets/img/icon/Training.png'), label: 'Home' },
    { id: 'coaches', icon: require('../../../assets/img/icon/Coaches.png'), label: 'Coach'},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const backgroundColor = isActive ? '#4A90E2' : '#000';
          const tintColor = '#FFFFFF';
          const textColor = '#FFFFFF';

          return (
            <React.Fragment key={tab.id}>
              <TouchableOpacity
                style={[styles.tab, { backgroundColor }]}
                onPress={() => onTabPress(tab.id)}
              >
                <View style={styles.tabContent}>
                  <Image
                    source={tab.icon}
                    style={[styles.icon, { tintColor }]}
                    resizeMode="contain"
                  />
                  <Text style={[styles.label, { color: textColor }]}>{tab.label}</Text>
                </View>
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
    marginBottom: 10,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#000',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 30,
    marginHorizontal: 4,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    width: 24,
    height: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'AnonymousPro-Regular', 
  },
  verticalDivider: {
    width: 1,
    height: '60%',
    backgroundColor: '#FFFFFF',
    opacity: 0.3,
  },
});
