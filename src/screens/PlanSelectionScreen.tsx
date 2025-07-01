import React, { useState } from 'react';
import { ScrollView, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegistration } from '../context/RegistrationContext';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
import PlanCard from '../components/form/PlanCard';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';

interface Plan {
  id: string;
  title: string;
  price: string;
  priceValue: number;
  description: string;
  features: Array<{ text: string; included: boolean }>;
  isPopular?: boolean;
}

const plans: Plan[] = [
  {
    id: 'free',
    title: 'Free Plan',
    price: '$0/month',
    priceValue: 0,
    description: 'Perfect for new users exploring the platform',
    features: [
      { text: 'Preview access to all sections', included: true },
      { text: 'Blurred content with visible captions', included: true },
      { text: 'See what coaches and members are sharing', included: true },
      { text: 'No full access to videos, routines, or downloads', included: false },
    ],
  },
  {
    id: 'basic',
    title: 'Basic Plan',
    price: '$97/month',
    priceValue: 97,
    description: 'Perfect for athletes ready to train seriously',
    features: [
      { text: 'Full access to all content', included: true },
      { text: 'Training routines', included: true },
      { text: 'Mindset & motivations', included: true },
      { text: 'Nutrition & wellness', included: true },
      { text: 'Game analysis & tactics', included: true },
      { text: 'Community interaction', included: true },
      { text: 'Coaches\' interviews in-person events', included: true },
    ],
  },
  {
    id: 'premium',
    title: 'Premium Plan',
    price: '$147/month',
    priceValue: 147,
    description: 'Perfect for players aiming to go pro',
    features: [
      { text: 'Everything in Basic, plus:', included: true },
      { text: 'Direct access to coaches (chat enabled)', included: true },
      { text: 'Personalized monthly plans by coaches', included: true },
      { text: 'Pre-event support', included: true },
      { text: 'Personalized video feedback from coaches', included: true },
    ],
  },
];

export default function PlanSelectionScreen() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { updateData } = useRegistration();
  const navigation = useNavigation();

  const handleContinue = () => {
    if (!selectedPlan) {
      Alert.alert('Error', 'Please select a plan to continue');
      return;
    }

    const plan = plans.find(p => p.id === selectedPlan);
    if (plan) {
      updateData({
        selectedPlan: {
          id: plan.id,
          title: plan.title,
          price: plan.price,
          priceValue: plan.priceValue,
        },
      });
      (navigation as any).navigate('Summary');
    }
  };

  return (
    <ScreenLayout currentStep={13} totalSteps={14} showBackButton={true}>
      <ContentContainer centered={false} style={styles.contentContainer}>
        <ScreenTitle title="Choose a Plan" style={styles.title} />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              title={plan.title}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              isSelected={selectedPlan === plan.id}
              onSelect={() => setSelectedPlan(plan.id)}
              isPopular={plan.isPopular}
            />
          ))}
        </ScrollView>
      </ContentContainer>

      <BottomSection>
        <ContinueButton
          onPress={handleContinue}
          disabled={!selectedPlan}
          title="Continue to Summary"
        />
        <HelperText text="You can change your plan anytime in settings." />
      </BottomSection>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 10,
  },
  title: {
    marginBottom: 30,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
