import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';

interface TrialBannerProps {
  daysRemaining: number;
}

export default function TrialBanner({daysRemaining}: TrialBannerProps) {
  const {t} = useTranslation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🎉</Text>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{t('subscription.trialBanner.title')}</Text>
        <Text style={styles.subtitle}>
          {daysRemaining} {daysRemaining === 1 ? t('subscription.trialBanner.daysRemaining') : t('subscription.trialBanner.daysRemainingPlural')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(43, 128, 190, 0.2)',
    borderWidth: 1,
    borderColor: '#2B80BE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 14,
    color: '#B9B9B9',
  },
});
