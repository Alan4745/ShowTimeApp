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

type AppDiscoverySource = 'TikTok' | 'Youtube' | 'Instagram (or Facebook)' | 'Instagram Advertisement' | 'Friends/Family/Coach' | 'App Store Search' | 'Other';

export default function AppDiscoveryScreen() {
  const [selectedSource, setSelectedSource] = useState<AppDiscoverySource | null>(null);
  const { updateData } = useRegistration();
  const navigation = useNavigation();

  const handleContinue = () => {
    if (!selectedSource) {
      Alert.alert('Error', 'Please select how you found out about the app');
      return;
    }

    updateData({ appDiscoverySource: selectedSource } as RegistrationData);
    (navigation as any).navigate('PlanSelection');
};

  const discoveryOptions: AppDiscoverySource[] = [
    'TikTok',
    'Youtube',
    'Instagram (or Facebook)',
    'Instagram Advertisement',
    'Friends/Family/Coach',
    'App Store Search',
    'Other',
  ];

  const handleSourceSelect = (source: string) => {
    setSelectedSource(source as AppDiscoverySource);
  };

  return (
    <ScreenLayout currentStep={12} totalSteps={14}>
      <ContentContainer>
        <ScreenTitle title="How did you find out about the app?" />

        <View style={styles.selectorContainer}>
          <SelectPicker
            label=""
            placeholder="Select discovery source"
            options={discoveryOptions}
            selectedValue={selectedSource}
            onSelect={handleSourceSelect}
          />
        </View>
      </ContentContainer>

      <BottomSection>
        <ContinueButton
          onPress={handleContinue}
          disabled={!selectedSource}
        />
        <HelperText text="It helps us create a training experience that fits you best." />
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
