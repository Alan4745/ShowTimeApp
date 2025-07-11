import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, Image, FlatList } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useRegistration } from '../context/RegistrationContext';
import { X, Check, Star, ChevronDown, Lock } from 'lucide-react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const trainingCategories = [
  {
    icon: <Image source={require('../../assets/img/icon/learn.png')} style={{ width: 22, height: 28, resizeMode: 'contain' }} />,
    title: 'Role Training',
    description: 'Strength, mobility, and drills tailored to your position on the field.',
  },
  {
    icon: <Image source={require('../../assets/img/icon/apple.png')} style={{ width: 22, height: 28, resizeMode: 'contain' }} />,
    title: 'Smart Fuel',
    description: 'Nutrition and recovery tips to train harder and bounce back faster.',
  },
  {
    icon: <Image source={require('../../assets/img/icon/head.png')} style={{ width: 22, height: 28, resizeMode: 'contain' }} />,
    title: 'Mindset Focus',
    description: 'Daily habits and mental tools to build resilience, discipline, and drive.',
  },
  {
    icon: <Image source={require('../../assets/img/icon/points.png')} style={{width: 22, height: 28, resizeMode: 'contain'}} />,
    title: 'Game IQ',
    description: 'Tactical analysis and match breakdowns to sharpen your football intelligence.',
  },
];

const testimonials = [
  {
    id: 1,
    name: 'Mateo Seoane',
    avatar: '#',
    timeAgo: 'Hace 3 meses',
    rating: 5,
    text: 'I used to doubt myself a lot. The mindset lessons in this app helped me stay focused, build confidence, and enjoy the game again 🧠⚽',
  },
  {
    id: 2,
    name: 'Carlos Rodriguez',
    avatar: '#',
    timeAgo: 'Hace 1 mes',
    rating: 5,
    text: 'The training routines are incredible! My performance on the field has improved dramatically since I started using this app 💪⚽',
  },
  {
    id: 3,
    name: 'Sofia Martinez',
    avatar: '#',
    timeAgo: 'Hace 2 semanas',
    rating: 5,
    text: 'Amazing nutrition tips and recovery advice. I feel stronger and more energized during training sessions 🍎💚',
  },
];

export default function PlanSelectionScreen() {
  const [selectedPlan, setSelectedPlan] = useState<string>('basic');
  const { updateData } = useRegistration();
  const navigation = useNavigation();

  const handleContinue = () => {
    const planData = {
      id: selectedPlan,
      title: selectedPlan === 'free' ? 'Start Free' : selectedPlan === 'premium' ? 'Premium' : 'Basic',
      price: selectedPlan === 'free' ? 'Free' : selectedPlan === 'premium' ? '$197/month' : '$97/month',
      priceValue: selectedPlan === 'free' ? 0 : selectedPlan === 'premium' ? 197 : 97,
    };

    updateData({ selectedPlan: planData });
    (navigation as any).navigate('Summary');
  };

  const handleClose = () => {
    (navigation as any).goBack();
  };

  const handleFreeTrialPress = () => {
    setSelectedPlan('free');
    handleContinue();
  };

  const handlePremiumPress = () => {
    setSelectedPlan('premium');
    handleContinue();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section - Full Screen */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={require('../../assets/img/Football.jpg')}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            {/* Dark overlay for better text readability */}
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)']}
              style={styles.overlay}
            >
              {/* Header with Close Button */}
              <View style={styles.header}>
                {/* Header section with gradient background */}
                <LinearGradient
                  colors={['rgba(0,0,0,0.95)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.headerGradient}
                >
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleClose}
                  >
                    <X color="#fff" size={24} />
                  </TouchableOpacity>

                  <View style={styles.headerTitleContainer}>
                    <Text style={styles.heroTitle}>TRAIN SMARTER,</Text>
                    <Text style={styles.heroTitle}>GO FURTHER WITH</Text>
                    <Text style={styles.heroTitle}>SHOWTIME PRO</Text>
                  </View>
                </LinearGradient>
              </View>

              {/* Spacer for middle content */}
              <View style={styles.middleSpacer} />

              {/* Button Section at bottom */}
              <View style={styles.buttonSection}>
                <TouchableOpacity
                  style={styles.freeTrialButton}
                  onPress={handleFreeTrialPress}
                >
                  <Text style={styles.freeTrialText}>Start My 10-Day Free Trial</Text>
                </TouchableOpacity>

                <Text style={styles.freeTrialSubtext}>
                  Basic Plan | Try it risk-free — cancel anytime
                </Text>

                {/* Scroll Down Indicator */}
                <View style={styles.scrollIndicator}>
                  <ChevronDown color="rgba(255,255,255,0.7)" size={24} />
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Rest of Content - Starts on second screen */}
        <View style={styles.contentSection}>
          {/* Recommended Section */}
          <View style={styles.recommendedSection}>
            <Text style={styles.recommendedTitle}>Recommended for</Text>
            <Text style={styles.recommendedTitle}>players ready to</Text>
            <Text style={styles.recommendedTitle}>take the next step</Text>

             {/* Training Categories */}
            <View style={styles.categoriesContainer}>
              {trainingCategories.map((category, index) => (
                <View key={index} style={styles.categoryCard}>
                  <View style={styles.categoryIconLeft}>
                    {category.icon}
                  </View>
                  <View style={styles.categoryTextContent}>
                    <Text style={styles.categoryCardTitle}>{category.title}</Text>
                    <Text style={styles.categoryCardDescription}>{category.description}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Spacer to push button to bottom */}
            <View />

            {/* Coaches Section */}
            <View style={styles.coachesSection}>
              <View style={styles.coachesIcon}>
                <Image source={require('../../assets/img/icon/Coaches.png')} style={{ position: 'absolute', top: '30%', left: '50%', transform: [{ translateX: 1 }, { translateY: -12 }] }} />
                <Image source={require('../../assets/img/icon/Elipses.png')} style={{  top: '-17%'}} />
              </View>
              <Text style={styles.coachesTitle}>COACHES</Text>
              <View style={styles.coachesFeatures}>
                <Text style={styles.coachesFeature}>1.Personalized training plans created by real pro-level coaches.</Text>
                <Text style={styles.coachesFeature}>2. Direct chat access for questions, feedback, and progress tracking.</Text>
                <Text style={styles.coachesFeature}>3. Monthly follow-up calls or video reviews to support your growth.</Text>
              </View>
               <TouchableOpacity
                  style={styles.premiumButton}
                  onPress={handlePremiumPress}
                >
                  <Text style={styles.premiumText}>Premium Plan</Text>
                </TouchableOpacity>
              <Text style={styles.premiumPlanSubtext}>Connect with coaches who’ve trained academy and pro players.</Text>
            </View>
          </View>

          {/* Plans Comparison */}
          <View style={styles.plansSection}>
            <Text style={styles.plansSectionTitle}>Start Free, Train</Text>
            <Text style={styles.plansSectionTitle}>Smarter, Go Pro</Text>

            {/* Features Comparison Table */}
            <View style={styles.featuresTable}>
              <View style={styles.featuresHeader}>
                <Text style={styles.featuresHeaderTextLeft}>Feature</Text>
                <Text style={styles.featuresHeaderText}>Free</Text>
                <Text style={styles.featuresHeaderText}>Basic</Text>
                <Text style={styles.featuresHeaderText}>Premium</Text>
              </View>

              {[
                'Preview all sections',
                'Access to all content',
                'Mindset & motivation',
                'Direct chat with coaches',
                'Custom Plans',
              ].map((feature, index) => (
                <View key={index} style={{ ...styles.featureRow, backgroundColor: (index % 2 === 0 ? '#252A30' : '' ).toString()}}>
                  <Text style={styles.featureText}>{feature}</Text>
                  <View style={styles.featureStatus}>
                    {index === 0 ? (
                      <Check color="#fff" size={16} style={styles.featureAbled}/>
                    ) : (
                      <Lock color="#252A30" size={16} style={styles.featureDisabled} />
                    )}
                  </View>
                  <View style={styles.featureStatus}>
                    {index <= 2 ? (
                      <Check color="#fff" size={16} style={styles.featureAbled}/>
                    ) : (
                      <Lock color="#252A30" size={16} style={styles.featureDisabled} />
                    )}
                  </View>
                  <View style={styles.featureStatus}>
                    <Check color="#fff" size={16} style={styles.featureAbled} />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Testimonials */}
          <View style={styles.testimonialsSection}>
            <Text style={styles.testimonialsTitle}>Voices of</Text>
            <Text style={styles.testimonialsTitle}>Real Players</Text>

            <FlatList
              data={testimonials}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.testimonialsCarousel}
              renderItem={({ item }) => (
                <View style={styles.testimonialCard}>
                  <View style={styles.testimonialHeader}>
                    <View style={styles.testimonialAvatarContainer}>
                      <View style={[styles.testimonialAvatar, { backgroundColor: '#4A90E2' }]} />
                    </View>
                    <View style={styles.testimonialInfo}>
                      <Text style={styles.testimonialName}>{item.name}</Text>
                      <View style={styles.testimonialMeta}>
                        <View style={styles.starsContainer}>
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} color="#4A90E2" size={14} fill="#4A90E2" />
                          ))}
                        </View>
                        <Text style={styles.timeAgo}>{item.timeAgo}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.testimonialText}>
                    {item.text}
                  </Text>
                </View>
              )}
            />
          </View>

          {/* Bottom CTA */}
          <View style={styles.bottomSection}>
            <Text style={styles.bottomText}>You're free to cancel</Text>
            <Text style={styles.bottomText}>whenever. No penalties, no</Text>
            <Text style={styles.bottomText}>extra costs.</Text>

            <TouchableOpacity
              style={styles.finalTrialButton}
              onPress={handleFreeTrialPress}
            >
              <Text style={styles.finalTrialButtonText}>Start My 10-Day Free Trial</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Hero Section - Full Screen
  heroContainer: {
    height: screenHeight,
    width: screenWidth,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '77%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerGradient: {
    paddingTop: 4,
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  closeButton: {
    width: 26,
    height: 26,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignSelf: 'flex-start',
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    alignItems: 'center',
    width: '100%',
  },
  middleSpacer: {
    flex: 1,
  },
  heroTitle: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 26,
    fontWeight: '400',
    lineHeight: 26,
    color: '#fff',
    textAlign: 'center',
  },

  // Button Section - 34px from bottom
  buttonSection: {
    paddingBottom: 34,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  freeTrialButton: {
    backgroundColor: '#2B80BE',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 40,
    width: '85%',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  premiumButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 40,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  freeTrialText: {
    fontFamily: 'AnonymousPro-Bold',
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  premiumText: {
    fontFamily: 'AnonymousPro-Bold',
    color: '#2B80BE',
    fontSize: 18,
    fontWeight: '400',
  },
  freeTrialSubtext: {
    fontFamily: 'AnonymousPro-Bold',
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
    paddingHorizontal: 20,
    fontWeight: '500',
  },
  scrollIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
    marginTop: 10,
  },

  // Content Section
  contentSection: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  recommendedSection: {
    marginBottom: 40,
  },
  recommendedTitle: {
    fontFamily: 'AnonymousPro-Bold',
    color: '#fff',
    fontSize: 26,
    fontWeight: '400',
    textAlign: 'center',
  },
  categoriesContainer: {
    marginTop: 30,
    gap: 16,
  },
  categoryCard: {
    backgroundColor: '#252A30',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  categoryIconLeft: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  categoryTextContent: {
    flex: 1,
  },
  categoryCardTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 8,
    fontFamily: 'AnonymousPro-Bold',
  },
  categoryCardDescription: {
    color: '#E0E0E0',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'AnonymousPro-Regular',
  },
  coachesSection: {
    marginTop: 40,
    backgroundColor: '#2B80BE',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  coachesIcon: {
    // alignItems: 'center',
    // justifyContent: 'center',
    marginBottom: 10,
  },
  coachesTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    position: 'absolute',
    top: 120,
  },
  coachesFeatures: {
    alignSelf: 'stretch',
    marginBottom: 20,
    gap: 8,
  },
  coachesFeature: {
    fontFamily: 'AnonymousPro-Regular',
    color: '#fff',
    fontSize: 15,
    marginBottom: 8,
  },
  premiumPlanText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  premiumPlanSubtext: {
    fontFamily: 'AnonymousPro-Bold',
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    textAlign: 'center',
    paddingLeft: 22,
    paddingRight: 22,
  },
  plansSection: {
    marginBottom: 40,
  },
  plansSectionTitle: {
    fontFamily: 'AnonymousPro-Bold',
    color: '#fff',
    fontSize: 24,
    fontWeight: '400',
    textAlign: 'center',
  },
  featuresTable: {
    marginTop: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 20,
  },
  featuresHeader: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingBottom: 10,
    paddingLeft: 20,
    borderBottomWidth: 1,
  },
  featuresHeaderText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '400',
    color: '#B9B9B9',
    fontSize: 12,
    flex: 0.31,
    textAlign: 'center',
  },
  featuresHeaderTextLeft: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '400',
    color: '#B9B9B9',
    fontSize: 12,
    flex: 1,
    textAlign: 'justify',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 30,
    padding: 20,
  },
  featureRowColor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#252A30',
    borderRadius: 30,
    padding: 20,
  },
  featureText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '400',
    color: '#fff',
    fontSize: 12,
    flex: 6.4,
  },
  featureStatus: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: 20,
  },
  featureAbled: {
    padding: 10,
    width: 16,
    height: 16,
    borderRadius: 30,
    backgroundColor: '#4A90E2',
  },
  featureDisabled: {
    padding: 10,
    width: 16,
    height: 16,
    borderRadius: 30,
    backgroundColor: '#929292',
  },
   testimonialsSection: {
    marginBottom: 40,
  },
  testimonialsTitle: {
    fontFamily: 'AnonymousPro-Bold',
    color: '#fff',
    fontSize: 26,
    fontWeight: '400',
    textAlign: 'center',
  },
  testimonialsCarousel: {
    paddingHorizontal: 10,
    gap: 16,
  },
  testimonialCard: {
    backgroundColor: '#252A30',
    borderRadius: 15,
    padding: 20,
    marginTop: 24,
    width: 280,
    marginHorizontal: 8,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  testimonialAvatarContainer: {
    marginRight: 12,
  },
  testimonialAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#666',
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontFamily: 'AnonymousPro-Bold',
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  testimonialMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  timeAgo: {
    fontFamily: 'AnonymousPro-Regular',
    color: '#999',
    fontSize: 12,
    fontWeight: '400',
  },
  testimonialText: {
    color: '#E0E0E0',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'AnonymousPro-Regular',
  },
  bottomSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  bottomText: {
    fontFamily: 'AnonymousPro-Bold',
    color: '#fff',
    fontWeight: '400',
    fontSize: 20,
    textAlign: 'center',
  },
  finalTrialButton: {
    backgroundColor: '#2B80BE',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 40,
    marginTop: 20,
    width: '85%',
    alignItems: 'center',
  },
  finalTrialButtonText: {
    fontFamily: 'AnonymousPro-Bold',
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});




