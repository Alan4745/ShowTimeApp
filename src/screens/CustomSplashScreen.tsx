// // src/screens/CustomSplashScreen.tsx
// import React, { useCallback, useEffect } from 'react';
// import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
//   withDelay,
//   runOnJS,
// } from 'react-native-reanimated';
// import { useNavigation } from '@react-navigation/native';

// const { width, height } = Dimensions.get('window');

// export default function CustomSplashScreen() {
//   const logoOpacity = useSharedValue(0);
//   const logoScale = useSharedValue(0.8);
//   const footerOpacity = useSharedValue(0);

//   const navigation = useNavigation();

//   const navigateToRegister = useCallback(() => {
//     (navigation as any).navigate('RegisterMethod');
//   }, [navigation]);

//   useEffect(() => {
//     logoOpacity.value = withDelay(300, withTiming(1, { duration: 1200 }));
//     logoScale.value = withDelay(300, withTiming(1, { duration: 1200 }));
//     footerOpacity.value = withDelay(1000, withTiming(1, { duration: 800 }));

//     const timer = setTimeout(() => {
//       runOnJS(navigateToRegister)();
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [logoOpacity, logoScale, footerOpacity, navigateToRegister]);

//   const logoAnimatedStyle = useAnimatedStyle(() => ({
//     opacity: logoOpacity.value,
//     transform: [{ scale: logoScale.value }],
//   }));

//   const footerAnimatedStyle = useAnimatedStyle(() => ({
//     opacity: footerOpacity.value,
//     transform: [{
//       translateY: withTiming(footerOpacity.value === 1 ? 0 : 20, { duration: 800 }),
//     }],
//   }));

//   return (
//     <View style={styles.container}>
//       <View style={styles.mainContent}>
//         <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
//           <Image
//             source={require('../../assets/img/LogoShowTime.png')}
//             style={styles.logoImage}
//             resizeMode="contain"
//           />
//         </Animated.View>
//       </View>

//       <Animated.View style={[styles.footer, footerAnimatedStyle]}>
//         <Text style={styles.footerText}>© 2025 | Where talent meets opportunity | USA</Text>
//       </Animated.View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#2B80BE',
//   },
//   mainContent: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 40,
//   },
//   logoContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   logoImage: {
//     width: width * 0.8,
//     height: height * 0.3,
//     maxWidth: 400,
//     maxHeight: 200,
//   },
//   footer: {
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     paddingBottom: 40,
//     paddingHorizontal: 20,
//   },
//   footerText: {
//     fontFamily: 'AnonymousPro-Regular',
//     fontWeight: '400',
//     fontSize: 13,
//     color: 'rgba(255, 255, 255, 0.7)',
//     textAlign: 'center',
//     letterSpacing: 1,
//   },
// });
