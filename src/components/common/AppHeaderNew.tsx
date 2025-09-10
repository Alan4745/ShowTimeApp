import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface AppHeaderProps {
  userAvatar: string; // Ahora es requerido
}

export default function AppHeaderNew(props: AppHeaderProps) {
  return (
    <View style={styles.header}>      
      <Text style={styles.title}>Showtime University</Text>
      <Image source={{ uri: props.userAvatar}} style={styles.avatar} />    
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',    
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#000000',
    marginBottom: 5,    
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30, // mitad del ancho y alto
    
  },
  title: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});
