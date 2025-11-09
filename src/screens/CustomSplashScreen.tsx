// src/screens/CustomSplashScreen.tsx
import React, {useEffect} from 'react';
import {View, Image, Text, StyleSheet, Dimensions} from 'react-native';
import {useTranslation} from 'react-i18next';

const {width, height} = Dimensions.get('window');

export default function CustomSplashScreen() {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <Image
          source={require('../../assets/img/logo_showtimeNew.png')}
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
    paddingHorizontal: 10,
  },
  logoImage: {
    width: width * 1.0,
    height: height * 0.9,
    maxWidth: 1600,
    maxHeight: 1600,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 28,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footerText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '500',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    letterSpacing: 1.2,
  },
});
