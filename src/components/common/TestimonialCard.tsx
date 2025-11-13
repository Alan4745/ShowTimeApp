import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'

interface TestimonialCardProps {
  avatar: string;
  name: string;
  rating: string;  
  message: string;
  timeSincePost: string;  
}

export default function TestimonialCard(props: TestimonialCardProps) {
  const ratingNumber = parseFloat(props.rating);

  const renderStars = () => {
    const fullStars = Math.floor(ratingNumber);
    const halfStar = ratingNumber % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <View style={styles.starsContainer}>
        {Array(fullStars).fill("★").map((star, index) => (
          <Text key={`full-${index}`} style={styles.star}>★</Text>
        ))}
        {halfStar && <Text style={styles.star}>☆</Text>}
        {Array(emptyStars).fill("☆").map((star, index) => (
          <Text key={`empty-${index}`} style={styles.star}>☆</Text>
        ))}
      </View>
    );
  };   

  return (
    <View style = {styles.container}>
      
      {/* Avatar y nombre */}
      <View style = {styles.header}>
        <View style = {styles.imageContainer}>
        <Image
        source={{ uri: props.avatar }}
        style={styles.image}
        resizeMode="cover"
        />        
        </View>
        <Text style = {styles.nameText}>{props.name}</Text> 
      </View>

      {/* Fila para estrellas + tiempo */}
      <View style={styles.ratingRow}>
        {renderStars()}
        <Text style={styles.timeText}>{props.timeSincePost}</Text>
      </View>
      
      {/* Texto testimonial */}
      <View style = {styles.testimonialContainer}>
        <Text style = {styles.testimonialText}>{props.message}</Text>
      </View>


    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 360,
    height: 238,
    borderRadius: 16,
    backgroundColor: "#252A30"   
  },
  header:{
    flexDirection: "row",
    top: 15,
    left: 15,
    alignItems: 'center',
    gap: 25,
  },
  imageContainer:{      
    width: 60, 
    height: 60, 
    borderRadius: 30, //mitad del ancho y alto
    overflow: 'hidden',       
    justifyContent: 'center',
    alignItems: 'center',
  },
  image:{
    width: "100%",
    height: "100%",      
  }, 
  nameText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: "700",
    fontSize: 18,
    color: '#FFFFFF',      
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',    
    marginBottom: 15,
    marginTop: 20,
    left: 15,
    gap: 10,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 24,
    color: '#2B80BE', 
    marginRight: 4,
  },
  timeText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 18,
    color: '#FFFFFF',
    paddingTop: 4,    
  },
  testimonialContainer:{
    width: "95%",
    left: 15,
  },
  testimonialText:{
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 18,
    color: '#FFFFFF', 
    lineHeight: 20, 
  }
})