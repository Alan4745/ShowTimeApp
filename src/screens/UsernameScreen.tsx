import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegistration } from '../context/RegistrationContext';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
import FormInput from '../components/form/FormInput';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';

export default function UsernameScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const { updateData } = useRegistration();

  const handleContinue = () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    if (username.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters long');
      return;
    }

    updateData({ username: username.trim() });
    (navigation as any).navigate('Gender');
  };

  return (
    <ScreenLayout currentStep={1} totalSteps={6} style={styles.titleFont}>
      <ContentContainer>
        <ScreenTitle title="Username" />
        <FormInput
          placeholder="Choose a username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          inputStyle={{ textAlign: 'center' }}
        />
      </ContentContainer>

      <BottomSection>
        <ContinueButton
          onPress={handleContinue}
          disabled={!username.trim()}
        />
        <HelperText text="It helps us create a training experience that fits you best." />
      </BottomSection>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  titleFont: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 24,
    lineHeight: 33,
  },
});

