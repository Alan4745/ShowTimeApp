import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegistration } from '../context/RegistrationContext';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
import QuickSelectGrid from '../components/form/QuickSelectGrid';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';
import DateSelector from '../components/form/DateSelector';

export default function DateOfBirthScreen() {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const { updateData } = useRegistration();
  const navigation = useNavigation();

  const handleContinue = () => {
    if (!selectedMonth || !selectedDay || !selectedYear) {
      Alert.alert('Error', 'Please select your complete date of birth');
      return;
    }

    // Validate age (must be at least 13 years old)
    const today = new Date();
    const birthDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      if (age - 1 < 13) {
        Alert.alert('Error', 'You must be at least 13 years old to register');
        return;
      }
    } else if (age < 13) {
      Alert.alert('Error', 'You must be at least 13 years old to register');
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

  const quickSelectItems = [
    { label: 'Dec 15, 1995', value: { month: 12, day: 15, year: 1995 } },
    { label: 'Jun 20, 1990', value: { month: 6, day: 20, year: 1990 } },
  ];

  const handleQuickSelect = (value: { month: number; day: number; year: number }) => {
    setSelectedMonth(value.month);
    setSelectedDay(value.day);
    setSelectedYear(value.year);
  };

  const isFormComplete = selectedMonth && selectedDay && selectedYear;

  return (
    <ScreenLayout currentStep={3} totalSteps={6}>
      <ContentContainer>
        <ScreenTitle title="Enter your Date of birth" />

        <DateSelector
          selectedMonth={selectedMonth}
          selectedDay={selectedDay}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onDayChange={setSelectedDay}
          onYearChange={setSelectedYear}
        />

        <QuickSelectGrid
          title="Quick Select (Demo):"
          items={quickSelectItems}
          onSelect={handleQuickSelect}
          containerStyle={styles.quickSelect}
        />
      </ContentContainer>

      <BottomSection>
        <ContinueButton
          onPress={handleContinue}
          disabled={!isFormComplete}
        />
        <HelperText text="It helps us create a training experience that fits you best." />
      </BottomSection>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  quickSelect: {
    marginTop: 20,
  },
});
