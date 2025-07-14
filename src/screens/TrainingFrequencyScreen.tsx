import React, { useState } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegistration } from '../context/RegistrationContext';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';
import { ChevronDown } from 'lucide-react-native';
import DropdownModal from '../components/modals/DropdownModal';

type TrainingFrequency = '3-5 sessions per week' | '5-7 sessions per week' | '+7 sessions per week';

export default function TrainingFrequencyScreen() {
  const [selectedFrequency, setSelectedFrequency] = useState<TrainingFrequency | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { updateData } = useRegistration();
  const navigattion = useNavigation();

  const handleContinue = () => {
    if (!selectedFrequency) {
      Alert.alert('Error', 'Please select your training frequency');
      return;
    }

    updateData({ trainingFrequency: selectedFrequency });
    (navigattion as any).navigate('ContentLikes');
  };

  const frequencyOptions: TrainingFrequency[] = [
    '3-5 sessions per week',
    '5-7 sessions per week',
    '+7 sessions per week',
  ];

  const handleFrequencySelect = (frequency: string) => {
    setSelectedFrequency(frequency as TrainingFrequency);
    setShowModal(false);
  };

  return (
    <ScreenLayout currentStep={9} totalSteps={12}>
      <ContentContainer>
        <ScreenTitle title="Training Frequency" />

        <View style={styles.selectorContainer}>
          <TouchableOpacity
            style={[
              styles.frequencySelector,
              selectedFrequency && styles.selectedFrequencySelector,
            ]}
            onPress={() => setShowModal(true)}
          >
            <Text style={[
              styles.frequencySelectorText,
              selectedFrequency && styles.selectedFrequencySelectorText,
            ]}>
              {selectedFrequency || 'Select training frequency'}
            </Text>
            <ChevronDown color={selectedFrequency ? '#4A90E2' : '#666'} size={20} />
          </TouchableOpacity>
        </View>
      </ContentContainer>

      <BottomSection>
        <ContinueButton
          onPress={handleContinue}
          disabled={!selectedFrequency}
        />
        <HelperText text="It helps us create a training experience that fits you best." />
      </BottomSection>

      <DropdownModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Select Training Frequency"
        items={frequencyOptions}
        onSelect={handleFrequencySelect}
        renderItem={(item) => item}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  selectorContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  frequencySelector: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedFrequencySelector: {
    borderColor: '#4A90E2',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  frequencySelectorText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    lineHeight: 20,
    color: '#666',
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
  },
  selectedFrequencySelectorText: {
    color: '#fff',
  },
});
