import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInputProps,
} from 'react-native';
import {Eye, EyeOff} from 'lucide-react-native';

interface PasswordInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  containerStyle?: any;
}

export default function PasswordInput({
  value,
  onChangeText,
  placeholder = 'Enter password',
  label,
  error,
  containerStyle,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder={placeholder}
          placeholderTextColor="#666"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <EyeOff color="#666" size={20} />
          ) : (
            <Eye color="#666" size={20} />
          )}
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 20,
    color: '#fff',
    marginLeft: 4,
  },
  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    fontFamily: 'AnonymousPro-Regular',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingRight: 50,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 20,
    color: '#fff',
    flex: 1,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  error: {
    fontFamily: 'AnonymousPro-Regular',
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 16,
    marginLeft: 4,
  },
});
