import React from 'react';
import LottieView from 'lottie-react-native';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface LottieIconProps {
  source: any; // JSON file import
  size?: number;
  loop?: boolean;
  autoPlay?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const LottieIcon: React.FC<LottieIconProps> = ({
  source,
  size = 32,
  loop = false,
  autoPlay = true,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle, { width: size, height: size }]}>
      <LottieView
        source={source}
        autoPlay={autoPlay}
        loop={loop}
        style={{ flex: 1, width: size, height: size }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'    
  },
});

export default LottieIcon;
