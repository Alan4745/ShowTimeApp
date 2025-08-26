// src/screens/CustomSplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

export default function CustomSplashScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      (navigation as any).navigate('Carousel');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <Image
          source={require('../../assets/img/LogoShowTime.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t('splash.splashFooter')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B80BE',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoImage: {
    width: width * 0.8,
    height: height * 0.3,
    maxWidth: 400,
    maxHeight: 200,
  },
  footer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  footerText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    letterSpacing: 1,
  },
});
