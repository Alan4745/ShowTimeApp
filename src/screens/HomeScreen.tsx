import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import HomeTabScreen from './HomeTabScreen';
import LearnTabScreen from './LearnTabScreen';
import CoachesTabScreen from './CoachesTabScreen';
import TabBar from '../components/common/TabBar';
import AppHeader from '../components/common/AppHeader';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState('home');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkPress = () => {
    setIsBookmarked(!isBookmarked);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTabScreen />;
      case 'learn':
        return <LearnTabScreen />;
      case 'coaches':
        return <CoachesTabScreen />;
      default:
        return <HomeTabScreen />;
    }
  };

  const renderHeader = () => {
    switch (activeTab) {
      case 'home':
        return <AppHeader title={t('common.home')} />;
      case 'learn':
        return <AppHeader title={t('common.learn')} />;
      case 'coaches':
        return (
          <AppHeader
            title={t('common.coaches')}
            userAvatar="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?semt=ais_hybrid&w=740"
            onBookmarkPress={handleBookmarkPress}
          />
        );
      default:
        return <AppHeader title={t('common.home')} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.content}>
        {renderHeader()}
        {renderActiveTab()}
      </View>
      <TabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
});
