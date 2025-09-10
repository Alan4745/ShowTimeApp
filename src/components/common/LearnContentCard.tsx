import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

interface LearnContentCardProps {
  title?: string;
  description?: string;
  backgroundColor?: string;
  image?: any;
  onPress?: () => void;
  
}

export default function LearnContentCard(props: LearnContentCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={props.onPress}>
      <View style={[styles.imageContainer, { backgroundColor: props.backgroundColor }]}>
        <ImageBackground
          source={props.image}
          style={styles.image}
          imageStyle={styles.imageStyle}
          resizeMode="cover"
        >
          <View style={styles.titleOverlay}>
            <Text style={styles.titleText}>{props.title}</Text>
          </View>
          <View style={styles.descriptionOverlay}>
            <Text style={styles.descriptionText}>{props.description}</Text>
          </View>
        </ImageBackground>  
        
      </View>      
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {    
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
    width: 350,
  },
  imageContainer: {
    height: 250,
    overflow: "hidden",    
  },
  image: {
    flex: 1,
    position: "relative"
  },
  imageStyle: {
    marginLeft: 55, 
  },
  titleOverlay: {
    position: 'absolute',
    width: "55%",
    top: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  titleText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 22,
    color: '#FFFFFF',
    marginTop: 10,
    marginLeft: 5,
  },
  descriptionOverlay:{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,  
  },
  descriptionText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 10,
    marginLeft: 5,
  }
});
