import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegistration } from '../context/RegistrationContext';
import { useTranslation } from 'react-i18next';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';
import DropdownModal from '../components/modals/DropdownModal';
import { ChevronDown } from 'lucide-react-native';

type Position =
  | 'goalkeeper'
  | 'defender'
  | 'centerBack'
  | 'fullback'
  | 'midfielder'
  | 'winger'
  | 'forward';

export default function PositionScreen() {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const { t } = useTranslation();
  const { updateData } = useRegistration();
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();

  const handleContinue = () => {
    if (!selectedPosition) {
      Alert.alert(t('errors.selectPosition'), t('errors.selectPosition'));
      return;
    }

    updateData({ position: selectedPosition });
    (navigation as any).navigate('ExperienceLevel');
  };

  const positionOptions: Position[] = [
    'goalkeeper',
    'defender',
    'centerBack',
    'fullback',
    'midfielder',
    'winger',
    'forward',
  ];

  const handlePositionSelect = (position: Position) => {
    setSelectedPosition(position);
    setShowModal(false);
  };

  return (
    <ScreenLayout currentStep={8} totalSteps={13}>
      <ContentContainer>
        <ScreenTitle title={t('registration.position')} />

        <View style={styles.selectorContainer}>
          <TouchableOpacity
            style={[
              styles.positionSelector,
              selectedPosition && styles.selectedPositionSelector,
            ]}
            onPress={() => setShowModal(true)}
          >
            <Text
              style={[
                styles.positionSelectorText,
                selectedPosition && styles.selectedPositionSelectorText,
              ]}
            >
              {selectedPosition
                ? t(`positions.${selectedPosition}`)
                : t('errors.selectPosition')}
            </Text>
            <ChevronDown color={selectedPosition ? '#FFFFFF' : '#929292'} size={20} />
          </TouchableOpacity>
        </View>
      </ContentContainer>

      <BottomSection>
        <ContinueButton onPress={handleContinue} disabled={!selectedPosition} />
        <HelperText text={t('helperTexts.helperText')} />
      </BottomSection>

      <DropdownModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title={t('registration.position')}
        items={positionOptions}
        onSelect={handlePositionSelect}
        renderItem={(item) => t(`positions.${item}`)}
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
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedPositionSelector: {
    borderColor: '#2B80BE',
    backgroundColor: '#2B80BE',
  },
  positionSelectorText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    lineHeight: 20,
    color: '#929292',
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
  },
  selectedPositionSelectorText: {
    color: '#FFFFFF',
  },
});
