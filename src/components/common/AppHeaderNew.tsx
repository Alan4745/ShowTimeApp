import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Account: undefined;
  // otras pantallas si es necesario
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Account'>;

interface AppHeaderProps {
  userAvatar?: string; 
}

export default function AppHeaderNew(props: AppHeaderProps) {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.header}>      
      <Text style={styles.title}>Showtime University</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Account')}>
        <Image source={
          props.userAvatar
          ? {uri: props.userAvatar}
          : require('../../../assets/img/userGeneric.png')
        }
        style={styles.avatar} /> 
      </TouchableOpacity>    
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
