import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView style = {styles.safeArea}>
      <View style={styles.header}>
        <Image
          source={require('../../../assets/img/Logo_para_encabezado_app.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity onPress={() => navigation.navigate('Account')}>
          <Image source={
            props.userAvatar
            ? {uri: props.userAvatar}
            : require('../../../assets/img/userGeneric.png')
          }
          style={styles.avatar} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
    backgroundColor: '#000000', // o el color que quieras de fondo
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#000000',
    marginBottom: 5,
  },
  logo: {
    height: 40,
    width: 150,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30, // mitad del ancho y alto
  },
});
