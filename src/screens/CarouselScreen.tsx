import React, { useEffect, useState } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const images = [
    require('../../assets/img/carousel/carousel1.jpg'),
    require('../../assets/img/carousel/carousel2.jpg'),
    require('../../assets/img/carousel/carousel3.jpg'),
    require('../../assets/img/carousel/carousel4.jpg'),
    require('../../assets/img/carousel/carousel5.jpg'),
    require('../../assets/img/carousel/carousel6.jpg'),
    require('../../assets/img/carousel/carousel7.jpg')
];

export default function CarouselScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const {t} = useTranslation();
  const navigation = useNavigation();

  // Temporizador para carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); 

    return () => clearInterval(interval); // Limpia al desmontar
  }, []);

  const handleGetStarted = () => {
    (navigation.navigate as any)({ name: 'RegisterMethod' });
  };

  return (
    <ImageBackground
        source={images[currentIndex]}
        style={styles.backgroundImage}
        resizeMode='cover'
    >
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

                <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
                                <Text style={styles.buttonText}>
                                {t('carousel.buttons.getStarted')}
                                </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.accessAccountButton} onPress={() => {}}>
                                <Text style={styles.buttonText}>
                                {t('carousel.buttons.accessAccount')}
                                </Text>
                </TouchableOpacity>

                <Text style={styles.footerText}>{t('carousel.footerText')}</Text>

            </View>            
        </View>        
    </ImageBackground>          
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)', 
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "space-between",    
  },
  bottomContent:{
    alignItems: "center",
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
    fontWeight: "700",
    fontSize: 25,
    color:"#FFFFFF",
  },
  getStartedButton:{
    width: 340,
    height: 61,
    backgroundColor: "#2B80BE",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
  accessAccountButton:{
    width: 340,
    height: 61,
    backgroundColor: "#000000", 
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  buttonText:{
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: "700",
    fontSize: 21,
    color: "#FFFFFF",
  },
  footerText:{
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 13,
    color: "#FFFFFF",  
  }
});


