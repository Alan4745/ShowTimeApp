import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import LoginModal from '../components/modals/LoginModal';
import images from '../data/carouselImages';
import CAROUSEL_CONFIG from '../config/carouselConfig';

const {width, height} = Dimensions.get('window');

// images are imported from src/data/carouselImages

export default function CarouselScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const currentIndexRef = useRef(0);
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [loginVisible, setLoginVisible] = useState(false);

  // Keep a ref so the interval handler doesn't close over stale state
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Temporizador para carousel
  useEffect(() => {
    const interval = setInterval(() => {
      const next = (currentIndexRef.current + 1) % images.length;
      // darken image, swap, then clear dark (durations from config)
      setTimeout(() => {
        setCurrentIndex(next);
      }, 500);

      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: CAROUSEL_CONFIG.OVERLAY_DURATION,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }).start();
      });
    }, CAROUSEL_CONFIG.IMAGE_CHANGE_INTERVAL);

    return () => clearInterval(interval); // Limpia al desmontar
  }, [overlayAnim]);

  const handleGetStarted = () => {
    (navigation.navigate as any)({name: 'RegisterMethod'});
  };

  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={images[currentIndex]}
        style={styles.backgroundImage}
        resizeMode="cover">
        {/* overlay animation covers ONLY the image (placed before content so children render on top) */}
        <Animated.View
          pointerEvents="none"
          style={[styles.overlay, {opacity: overlayAnim}]}
        />
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Image
              source={require('../../assets/img/LogoShowTime.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.bottomContent}>
            <View style={styles.sloganTextContainer}>
              <Text style={styles.sloganText}>{t('carousel.text.line1')}</Text>
              <Text style={styles.sloganText}>{t('carousel.text.line2')}</Text>
            </View>

            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={handleGetStarted}>
              <Text style={styles.buttonText}>
                {t('carousel.buttons.getStarted')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.accessAccountButton}
              onPress={() => {
                setLoginVisible(true);
              }}>
              <Text style={styles.buttonText}>
                {t('carousel.buttons.accessAccount')}
              </Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>{t('carousel.footerText')}</Text>
          </View>
        </View>
        <LoginModal
          visible={loginVisible}
          onClose={() => setLoginVisible(false)}
          onSuccess={() => {
            setLoginVisible(false);
            // si quieres navegar al home, dashboard, etc. después del login:
            //(navigation.navigate as any)({ name: 'Home' });
          }}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomContent: {
    alignItems: 'center',
    marginBottom: 30,
    gap: 10,
  },
  headerContainer: {
    marginTop: 45,
  },
  logoImage: {
    width: width * 0.45,
    height: height * 0.2,
    maxWidth: 400,
    maxHeight: 200,
  },
  sloganTextContainer: {
    marginBottom: 5,
  },
  sloganText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '700',
    fontSize: 25,
    color: '#FFFFFF',
  },
  getStartedButton: {
    width: 340,
    height: 61,
    backgroundColor: '#2B80BE',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  accessAccountButton: {
    width: 340,
    height: 61,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  buttonText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    fontSize: 21,
    color: '#FFFFFF',
  },
  footerText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    fontSize: 13,
    color: '#FFFFFF',
  },
});
