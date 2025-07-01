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

const contentOptions = [
  {
    id: 'training-routines',
    title: 'Training routines',
    subtitle: '(fitness, drills, and structured plans)',
  },
  {
    id: 'nutrition-recipes',
    title: 'Nutrition & recipes',
    subtitle: '(healthy eating and tips)',
  },
  {
    id: 'daily-motivation',
    title: 'Daily motivation',
    subtitle: '(quotes, challenges, real stories)',
  },
  {
    id: 'highlight-videos',
    title: 'Highlight videos',
    subtitle: '(tapes, plays, replays)',
  },
  {
    id: 'coach-interviews',
    title: 'Coach interviews',
    subtitle: '(audio and video)',
  },
  {
    id: 'recovery-tips',
    title: 'Recovery tips & physical wellness',
  },
  {
    id: 'athlete-stories',
    title: 'Athlete & coach life stories',
  },
  {
    id: 'personal-achievements',
    title: 'Personal achievements & completed challenges',
  },
  {
    id: 'community-qa',
    title: 'Community: Q&A and peer interaction',
  },
  {
    id: 'events-giveaways',
    title: 'Events & giveaways',
    subtitle: '(updates, tournaments, prizes)',
  },
];

export default function ContentLikesScreen() {
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const { updateData } = useRegistration();
  const navigation = useNavigation();

  const handleContinue = () => {
    if (selectedContent.length === 0) {
      Alert.alert('Error', 'Please select at least one content type you like');
      return;
    }

    updateData({ contentLikes: selectedContent });
    (navigation as any).navigate('Notifications');
  };

  return (
    <ScreenLayout currentStep={10} totalSteps={14}>
      <ContentContainer centered={false} style={styles.contentContainer}>
        <MultiSelectGrid
          title="Content You Like"
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
        <HelperText text="It helps us create a training experience that fits you best." />
      </BottomSection>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 20,
  },
});
