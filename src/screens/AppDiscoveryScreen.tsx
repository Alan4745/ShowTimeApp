import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RegistrationData, useRegistration } from '../context/RegistrationContext';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
import SelectPicker from '../components/form/SelectPicker';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';
import { useTranslation } from 'react-i18next';

type AppDiscoverySource =
  | 'TikTok'
  | 'Youtube'
  | 'Instagram (or Facebook)'
  | 'Instagram Advertisement'
  | 'Friends/Family/Coach'
  | 'App Store Search'
  | 'Other';

export default function AppDiscoveryScreen() {
  const [selectedSource, setSelectedSource] = useState<AppDiscoverySource | null>(null);
  const { updateData } = useRegistration();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleContinue = () => {
    if (!selectedSource) {
      Alert.alert(t('errors.selectAppDiscovery'));
      return;
    }
    updateData({ appDiscoverySource: selectedSource } as RegistrationData);
    (navigation as any).navigate('Notifications');
  };

  // const discoveryOptions: AppDiscoverySource[] = [
  //   'TikTok',
  //   'Youtube',
  //   'Instagram (or Facebook)',
  //   'Instagram Advertisement',
  //   'Friends/Family/Coach',
  //   'App Store Search',
  //   'Other',
  // ];

  // Aquí para mostrar las opciones traducidas
  const translatedOptions = [
    {
      value: 'TikTok',
      label: t('appDiscoverySources.tiktok'),
    },
    {
      value: 'Youtube',
      label: t('appDiscoverySources.youtube'),
    },
    {
      value: 'Instagram (or Facebook)',
      label: t('appDiscoverySources.instagram'),
    },
    {
      value: 'Instagram Advertisement',
      label: t('appDiscoverySources.instagramAd'),
    },
    {
      value: 'Friends/Family/Coach',
      label: t('appDiscoverySources.friendsFamily'),
    },
    {
      value: 'App Store Search',
      label: t('appDiscoverySources.appStore'),
    },
    {
      value: 'Other',
      label: t('appDiscoverySources.otherSource'),
    },
  ];

  const handleSourceSelect = (source: string) => {
    setSelectedSource(source as AppDiscoverySource);
  };

  return (
    <ScreenLayout currentStep={12} totalSteps={14}>
      <ContentContainer>
        <ScreenTitle title={t('registration.appDiscovery')} />

        <View style={styles.selectorContainer}>
          <SelectPicker
            label=""
            placeholder={t('placeholders.selectDiscoverySource')}
            options={translatedOptions}
            selectedValue={selectedSource}
            onSelect={handleSourceSelect}
          />
        </View>
      </ContentContainer>

      <BottomSection>
        <ContinueButton onPress={handleContinue} disabled={!selectedSource} />
        <HelperText text={t('helperTexts.helperText')} />
      </BottomSection>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  selectorContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
});
