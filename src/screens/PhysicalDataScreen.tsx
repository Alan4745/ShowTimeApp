import React, {useState} from 'react';
import {
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useRegistration} from '../context/RegistrationContext';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
import PhysicalDataSelector from '../components/form/PhysicalDataSelector';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function PhysicalDataScreen() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [unitWeight, setUnitWeight] = useState('');
  const [unitHeight, setUnitHeight] = useState('');
  const {updateData} = useRegistration();
  const navigation = useNavigation();
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  // Usa un offset más moderado para evitar que el botón se mueva demasiado
  const keyboardVerticalOffset = Platform.OS === 'ios' ? insets.top + 40 : 0;

  const handleContinue = () => {
    if (!weight.trim() || !height.trim()) {
      Alert.alert(
        t('common.error'),
        t('registration.errors.enterPhysicalData'),
      );
      return;
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (isNaN(weightNum) || weightNum <= 0 || weightNum > 500) {
      Alert.alert(t('common.error'), t('registration.errors.validWeight'));
      return;
    }

    if (isNaN(heightNum) || heightNum <= 0 || heightNum > 300) {
      Alert.alert(t('common.error'), t('registration.errors.validHeight'));
      return;
    }

    updateData({
      physicalData: {
        weight: weightNum,
        weightUnit: unitWeight,
        height: heightNum,
        heightUnit: unitHeight,
      },
    });
    (navigation as any).navigate('PhysicalGoal');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScreenLayout currentStep={6} totalSteps={13}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={keyboardVerticalOffset}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            contentContainerStyle={styles.scrollContent}>
            <ContentContainer>
              <ScreenTitle title={t('registration.physicalData')} />
              <PhysicalDataSelector
                weight={weight}
                height={height}
                onWeightChange={setWeight}
                onHeightChange={setHeight}
                onUnitWeightChange={setUnitWeight}
                onUnitHeightChange={setUnitHeight}
              />
            </ContentContainer>
          </ScrollView>

          <BottomSection>
            <ContinueButton
              onPress={handleContinue}
              disabled={!weight.trim() || !height.trim()}
            />
            <HelperText text={t('helperTexts.helperText')} />
          </BottomSection>
        </KeyboardAvoidingView>
      </ScreenLayout>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollContent: {flexGrow: 1},
});

// const styles = StyleSheet.create({
//   selectorContainer: {
//     gap: 20,
//     paddingHorizontal: 20,
//   },
// });
