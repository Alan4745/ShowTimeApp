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

type Role = 'student' | 'coach';

export default function SelectRoleScreen() {
const navigation = useNavigation();
  const {t} = useTranslation();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const {updateData} = useRegistration();
  const isCoach = selectedRole === "coach";
  const totalSteps = isCoach ? 9 : 13;

  const handleContinue = () => {
    if (!selectedRole) {
      return;
    }
    updateData({role: selectedRole});
    (navigation as any).navigate('Username');
  };

  return (
    <ScreenLayout currentStep={1} totalSteps={totalSteps}>
      <ContentContainer>
        <ScreenTitle title={t('registration.role')} />
        <View style={styles.optionsContainer}>
          {/* Top row: Female and Male */}
          <View style={styles.topRow}>
            <OptionButton
              title={t('registration.coach')}
              selected={selectedRole === 'coach'}
              onPress={() => setSelectedRole('coach')}
              style={styles.parallelButton}
            />
            <OptionButton
              title={t('registration.student')}
              selected={selectedRole === 'student'}
              onPress={() => setSelectedRole('student')}
              style={styles.parallelButton}
            />
          </View>

          {/* Bottom row eliminada: opción 'Other' removida */}
        </View>
      </ContentContainer>

      <BottomSection>
        <ContinueButton onPress={handleContinue} disabled={!selectedRole} />
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
  
});