import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useRegistration } from '../context/RegistrationContext';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
import OptionButton from '../components/form/OptionButton';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';

type PhysicalGoal = 'Gain muscle' | 'Lose fat' | 'Maintain';

export default function PhysicalGoalScreen() {
  const { t } = useTranslation();
  const [selectedGoal, setSelectedGoal] = useState<PhysicalGoal | null>(null);
  const { updateData } = useRegistration();
  const navigation = useNavigation();

  const handleContinue = () => {
    if (!selectedGoal) {
      Alert.alert(t('error'), t('pleaseSelectYourPhysicalGoal'));
      return;
    }

    updateData({ physicalGoal: selectedGoal });
    (navigation as any).navigate('Position');
  };

  const goalOptions: PhysicalGoal[] = ['Gain muscle', 'Lose fat', 'Maintain'];

  return (
    <ScreenLayout currentStep={6} totalSteps={9}>
      <ContentContainer>
        <ScreenTitle title={t('physicalGoal')} />

        <View style={styles.optionsContainer}>
          {goalOptions.map((goal) => (
            <OptionButton
              key={goal}
              title={t(goal)}
              selected={selectedGoal === goal}
              onPress={() => setSelectedGoal(goal)}
              style={styles.optionButton}
            />
          ))}
        </View>
      </ContentContainer>

      <BottomSection>
        <ContinueButton
          onPress={handleContinue}
          disabled={!selectedGoal}
        />
        <HelperText text={t('itHelpsUsCreateATrainingExperienceThatFitsYouBest')} />
      </BottomSection>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    gap: 16,
    alignItems: 'center',
  },
  optionButton: {
    width: '80%',
  },
});

