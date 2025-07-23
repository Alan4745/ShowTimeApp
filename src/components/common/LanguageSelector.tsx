import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react-native';

interface LanguageSelectorProps {
  style?: any;
  showLabel?: boolean;
}

export default function LanguageSelector({ style, showLabel = false }: LanguageSelectorProps) {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLanguage);
  };

  const getCurrentLanguageLabel = () => {
  return i18n.language.toUpperCase().slice(0, 2);
};

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={toggleLanguage}
    >
      <Globe color="#fff" size={20} />
      {showLabel && (
        <Text style={styles.languageText}>
          {getCurrentLanguageLabel()}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 40,
    minHeight: 40,
  },
  languageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});
