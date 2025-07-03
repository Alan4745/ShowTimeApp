import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegistration } from '../context/RegistrationContext';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';
import DropdownModal from '../components/modals/DropdownModal';
import { ChevronDown } from 'lucide-react-native';

type Position = 'Goalkeeper' | 'Defender' | 'Center Back' | 'Fullback' | 'Midfielder' | 'Winger' | 'Forward';

export default function PositionScreen() {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const { updateData } = useRegistration();
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();

  const handleContinue = () => {
    if (!selectedPosition) {
      Alert.alert('Error', 'Please select your playing position');
      return;
    }

    updateData({ position: selectedPosition });
    (navigation as any).navigate('ExperienceLevel');
  };

  const positionOptions: Position[] = [
    'Goalkeeper',
    'Defender',
    'Center Back',
    'Fullback',
    'Midfielder',
    'Winger',
    'Forward',
  ];

  const handlePositionSelect = (position: string) => {
    setSelectedPosition(position as Position);
    setShowModal(false);
  };

  return (
     <ScreenLayout currentStep={7} totalSteps={12}>
      <ContentContainer>
        <ScreenTitle title="Playing Position" />

        <View style={styles.selectorContainer}>
          <TouchableOpacity
            style={[
              styles.positionSelector,
              selectedPosition && styles.selectedPositionSelector,
            ]}
            onPress={() => setShowModal(true)}
          >
            <Text style={[
              styles.positionSelectorText,
              selectedPosition && styles.selectedPositionSelectorText,
            ]}>
              {selectedPosition || 'Select your position'}
            </Text>
            <ChevronDown color={selectedPosition ? '#4A90E2' : '#666'} size={20} />
          </TouchableOpacity>
        </View>
      </ContentContainer>

      <BottomSection>
        <ContinueButton
          onPress={handleContinue}
          disabled={!selectedPosition}
        />
        <HelperText text="It helps us create a training experience that fits you best." />
      </BottomSection>

      <DropdownModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Select Position"
        items={positionOptions}
        onSelect={handlePositionSelect}
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
  positionSelector: {
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
  selectedPositionSelector: {
    borderColor: '#4A90E2',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  positionSelectorText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    lineHeight: 20,
    color: '#666',
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
  },
  selectedPositionSelectorText: {
    color: '#fff',
  },
});
