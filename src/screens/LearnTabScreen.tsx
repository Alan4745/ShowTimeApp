import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ContentCard from '../components/common/ContentCard';
import { useTranslation } from 'react-i18next';

export default function LearnTabScreen() {
  const { t } = useTranslation();

  const handleCardPress = (category: string) => {
    console.log(`${category} card pressed`);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Training Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('homeScreen.training')}</Text>
          <View style={styles.cardGrid}>
            <ContentCard
              style={styles.card}
              onPress={() => handleCardPress('Training')}
            />
            <ContentCard
              style={[styles.card, styles.cardSmall]}
              onPress={() => handleCardPress('Training 2')}
            />
          </View>
        </View>

        {/* Mindset Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('homeScreen.mindset')}</Text>
          <View style={styles.cardGrid}>
            <ContentCard
              style={styles.card}
              onPress={() => handleCardPress('Mindset')}
            />
            <ContentCard
              style={[styles.card, styles.cardSmall]}
              onPress={() => handleCardPress('Mindset 2')}
            />
          </View>
        </View>

        {/* Nutrition Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('homeScreen.nutrition')}</Text>
          <View style={styles.cardGrid}>
            <ContentCard
              style={styles.cardWide}
              onPress={() => handleCardPress('Nutrition')}
            />
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  cardGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    height: 200,
  },
  cardSmall: {
    flex: 0.6,
  },
  cardWide: {
    width: '100%',
    height: 150,
  },
});
