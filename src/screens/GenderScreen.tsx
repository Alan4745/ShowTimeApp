import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useRegistration} from '../context/RegistrationContext';
import {useTranslation} from 'react-i18next';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
import OptionButton from '../components/form/OptionButton';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';

type Gender = 'Male' | 'Female';

export default function GenderScreen() {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const {updateData} = useRegistration();

  const handleContinue = () => {
    if (!selectedGender) {
      return;
    }

    updateData({gender: selectedGender});
    (navigation as any).navigate('DateOfBirth');
  };

  return (
    <ScreenLayout currentStep={2} totalSteps={6}>
      <ContentContainer>
        <ScreenTitle title={t('registration.gender')} />
        <View style={styles.optionsContainer}>
          {/* Top row: Female and Male */}
          <View style={styles.topRow}>
            <OptionButton
              title={t('registration.female')}
              selected={selectedGender === 'Female'}
              onPress={() => setSelectedGender('Female')}
              style={styles.parallelButton}
            />
            <OptionButton
              title={t('registration.male')}
              selected={selectedGender === 'Male'}
              onPress={() => setSelectedGender('Male')}
              style={styles.parallelButton}
            />
          </View>

          {/* Bottom row eliminada: opción 'Other' removida */}
        </View>
      </ContentContainer>

      <BottomSection>
        <ContinueButton onPress={handleContinue} disabled={!selectedGender} />
        <HelperText text={t('helperTexts.helperText')} />
      </BottomSection>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    gap: 16,
    alignItems: 'center',
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    justifyContent: 'space-between',
  },
  parallelButton: {
    flex: 1,
    minWidth: 0, // Allow flex to work properly
  },
  // centerButton y bottomRow eliminados
});
