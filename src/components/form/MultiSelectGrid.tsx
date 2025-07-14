import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Check } from 'lucide-react-native';

interface MultiSelectItem {
  id: string;
  title: string;
  subtitle?: string;
}

interface MultiSelectGridProps {
  title: string;
  items: MultiSelectItem[];
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  containerStyle?: any;
}

export default function MultiSelectGrid({
  title,
  items,
  selectedItems,
  onSelectionChange,
  containerStyle,
}: MultiSelectGridProps) {
  const handleItemToggle = (itemId: string) => {
    const isSelected = selectedItems.includes(itemId);
    let newSelection: string[];

    if (isSelected) {
      newSelection = selectedItems.filter(id => id !== itemId);
    } else {
      newSelection = [...selectedItems, itemId];
    }

    onSelectionChange(newSelection);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {items.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.item,
                  isSelected && styles.selectedItem,
                ]}
                onPress={() => handleItemToggle(item.id)}
              >
                <View style={styles.itemContent}>
                  <View style={styles.textContainer}>
                    <Text style={[
                      styles.itemTitle,
                      isSelected && styles.selectedItemTitle,
                    ]}>
                      {item.title}
                    </Text>
                    {item.subtitle && (
                      <Text style={[
                        styles.itemSubtitle,
                        isSelected && styles.selectedItemSubtitle,
                      ]}>
                        {item.subtitle}
                      </Text>
                    )}
                  </View>
                  {isSelected && (
                    <View style={styles.checkContainer}>
                      <Check color="#fff" size={16} strokeWidth={3} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 26,
    fontWeight: '400',
    lineHeight: 26,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  grid: {
    gap: 12,
    paddingBottom: 20,
  },
  item: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 20,
    minHeight: 60,
  },
  selectedItem: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 20,
    color: '#fff',
  },
  selectedItemTitle: {
    color: '#fff',
  },
  itemSubtitle: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 16,
    color: '#999',
    marginTop: 2,
  },
  selectedItemSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
