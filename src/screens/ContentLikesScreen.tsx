import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegistration } from '../context/RegistrationContext';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import MultiSelectGrid from '../components/form/MultiSelectGrid';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';
import { useTranslation } from 'react-i18next';

const contentOptionKeys = [
  'trainingRoutines',
  'nutritionRecipes',
  'dailyMotivation',
  'highlightVideos',
  'coachInterviews',
  'recoveryTips',
  'athleteStories',
  'personalAchievements',
  'communityQA',
  'eventsGiveaways',
];

export default function ContentLikesScreen() {
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const { updateData } = useRegistration();
  const navigation = useNavigation();
  const { t } = useTranslation();

  // Construimos las opciones traducidas
  const contentOptions = contentOptionKeys.map((key) => ({
    id: key,
    title: t(`contentTypes.${key}`),
    subtitle: t(`contentTypes.${key}Desc`, ''), // si no existe descripción, '' evita que se muestre "undefined"
  }));

  const handleContinue = () => {
    if (selectedContent.length === 0) {
      Alert.alert(t('errors.selectContentLikes'), t('errors.selectContentLikes'));
      return;
    }

    updateData({ contentLikes: selectedContent });
    (navigation as any).navigate('AppDiscovery');
  };

  return (
    <ScreenLayout currentStep={10} totalSteps={14}>
      <ContentContainer centered={false} style={styles.contentContainer}>
        <MultiSelectGrid
          title={t('registration.contentLikes')}
          items={contentOptions}
          selectedItems={selectedContent}
          onSelectionChange={setSelectedContent}
        />
      </ContentContainer>

      <BottomSection>
        <ContinueButton
          onPress={handleContinue}
          disabled={selectedContent.length === 0}
        />
        <HelperText text={t('helperTexts.helperText')} />
      </BottomSection>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 20,
  },
});
