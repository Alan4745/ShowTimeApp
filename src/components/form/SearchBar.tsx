import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';

export default function SearchBar({ value, onChangeText, placeholder }) {
  return (
    <View style={styles.container}>
      <Search size={18} color="#FFFFFF" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder || 'Buscar...'}
        placeholderTextColor="#FFFFFF"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 90,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    paddingVertical: 10,
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "700",
    fontSize: 14,
  },
});
