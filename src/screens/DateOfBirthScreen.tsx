import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useRegistration } from '../context/RegistrationContext';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';
import DateSelector from '../components/form/DateSelector';

export default function DateOfBirthScreen() {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const { data, updateData } = useRegistration();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const isCoach = data.role === "coach";
  const totalSteps = isCoach ? 9 : 13;

  const handleContinue = () => {
    if (!selectedMonth || !selectedDay || !selectedYear) {
      Alert.alert(t('errors.selectDateOfBirth'));
      return;
    }

    const today = new Date();
    const birthDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      if (age - 1 < 13) {
        Alert.alert(t('errors.ageRestriction'));
        return;
      }
    } else if (age < 13) {
      Alert.alert(t('errors.ageRestriction'));
      return;
    }

    updateData({
      dateOfBirth: {
        month: selectedMonth,
        day: selectedDay,
        year: selectedYear,
      },
    });
    (navigation as any).navigate('Citizenship');
  };

  const isFormComplete = selectedMonth && selectedDay && selectedYear;

  return (
    <ScreenLayout currentStep={4} totalSteps={totalSteps}>
      <ContentContainer>
        <ScreenTitle title={t('registration.dateOfBirth')} />

        <DateSelector
          selectedMonth={selectedMonth}
          selectedDay={selectedDay}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onDayChange={setSelectedDay}
          onYearChange={setSelectedYear}
        />
      </ContentContainer>

      <BottomSection>
        <ContinueButton
          onPress={handleContinue}
          disabled={!isFormComplete}
        />
        <HelperText text={t('helperTexts.helperText')} />
      </BottomSection>
    </ScreenLayout>
  );
}

