import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface DropdownModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  items: any[];
  onSelect: (item: any) => void;
  renderItem: (item: any, index: number) => string;
}

export default function DropdownModal({
  visible,
  onClose,
  title,
  items,
  onSelect,
  renderItem,
}: DropdownModalProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom || 0;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.content, {paddingBottom: bottomInset + 20}]}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              {paddingBottom: bottomInset + 40},
            ]}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.item}
                onPress={() => onSelect(item)}>
                <Text style={styles.itemText}>{renderItem(item, index)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
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
    maxHeight: '70%',
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
  scrollView: {
    maxHeight: 300,
  },
  scrollContent: {
    paddingBottom: 12,
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  itemText: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 20,
    color: '#fff',
    textAlign: 'center',
  },
});
