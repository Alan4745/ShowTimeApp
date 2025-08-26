import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

const PostAlan = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View>
        <Text>Info user</Text>
      </View>
      <View>
        <Text>Contendio</Text>
      </View>
      <View>
        <Text>Interactividad con el usuario</Text>
      </View>

      <Button
        title="Press me"
        onPress={() => (navigation as any).navigate('Postid')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    height: 400,
  },
});

export default PostAlan;
