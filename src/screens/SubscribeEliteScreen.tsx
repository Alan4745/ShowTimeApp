import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import SubscriptionLayout from "../components/common/SubscriptionLayout";
import ScreenLayout from "../components/common/ScreenLayout";
import ContentContainer from "../components/common/ContentContainer";
import ScreenTitle from "../components/common/ScreenTitle";
import BottomSection from '../components/common/BottomSection';

import HomeTabScreen from './HomeTabScreen';
import LearnTabScreen from './LearnTabScreen';
import CoachesTabScreen from './CoachesTabScreen';

import AppHeader from '../components/common/AppHeader';
import TabBar from '../components/common/TabBar';

export default function SubscribeEliteScreen() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('subscribe');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTabScreen />;
      case 'learn':
        return <LearnTabScreen />;
      case 'coaches':
        return <CoachesTabScreen />;
      default:
        return (
          <>
            <ContentContainer>
              <ScreenTitle title={t('subscription.title')} />
              <SubscriptionLayout planKey="subscription.elite" />
            </ContentContainer>

            <BottomSection>
              <TouchableOpacity style={styles.subscribeButton} onPress={() => {}}>
                <Text style={styles.subscribeButtonText}>
                  {t('subscription.elite.button')}
                </Text>
              </TouchableOpacity>
            </BottomSection>
          </>
        );
    }
  };

  const renderHeader = () => {
    switch (activeTab) {
      case 'home':
        return <AppHeader title={t('common.home')} />;
      case 'learn':
        return <AppHeader title={t('common.learn')} />;
      case 'coaches':
        return <AppHeader title={t('common.coaches')} />;      
    }
  };

  return (
    <ScreenLayout>
      {renderHeader()}
      {renderActiveTab()}
      <TabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  subscribeButton: {
    width: 282,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 32,
    alignItems: 'center',   
  },
  
  subscribeButtonText: {
    color: '#2B80BE',
    fontWeight: '700',
    fontSize: 18,
  },
});

