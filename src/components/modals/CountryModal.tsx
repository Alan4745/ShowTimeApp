import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Search} from 'lucide-react-native';

interface CountryModalProps {
  visible: boolean;
  onClose: () => void;
  countries: string[];
  selectedCountry: string | null;
  onSelect: (country: string) => void;
}

export default function CountryModal({
  visible,
  onClose,
  countries,
  selectedCountry,
  onSelect,
}: CountryModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelect = (country: string) => {
    Keyboard.dismiss();
    onSelect(country);
    setSearchQuery('');
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
    setSearchQuery('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            // keyboardVerticalOffset={keyboardOffset}
            style={styles.kav}>
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title}>Select Citizenship</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeButton}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.searchContainer}>
                <Search color="#666" size={20} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search countries..."
                  placeholderTextColor="#666"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  blurOnSubmit={true}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
              </View>

              <ScrollView
                style={styles.scrollView}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
                contentContainerStyle={styles.scrollContent}>
                {filteredCountries.map((country, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.item,
                      selectedCountry === country && styles.selectedItem,
                    ]}
                    onPress={() => handleSelect(country)}>
                    <Text
                      style={[
                        styles.itemText,
                        selectedCountry === country && styles.selectedItemText,
                      ]}>
                      {country}
                    </Text>
                    {selectedCountry === country && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
                {filteredCountries.length === 0 && (
                  <View style={styles.noResults}>
                    <Text style={styles.noResultsText}>No countries found</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '72%',
    marginHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 26,
    fontWeight: '400',
    lineHeight: 26,
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 20,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 15,
    margin: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    fontFamily: 'AnonymousPro-Regular',
    flex: 1,
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 20,
    color: '#fff',
  },
  scrollView: {
    maxHeight: 360,
  },
  kav: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  selectedItem: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  itemText: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 20,
    color: '#fff',
    flex: 1,
  },
  selectedItemText: {
    color: '#4A90E2',
  },
  checkmark: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 20,
    color: '#4A90E2',
  },
  noResults: {
    padding: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 20,
    color: '#666',
    textAlign: 'center',
  },
});
