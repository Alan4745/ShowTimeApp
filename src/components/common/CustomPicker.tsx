import React, { useRef } from 'react';
import { FlatList, View, Text, StyleSheet, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

interface CustomPickerProps {
  data: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  itemHeight?: number;
  visibleItems?: number;
}

export default function CustomPicker({
  data,
  selectedIndex,
  onChange,
  itemHeight = 50,
  visibleItems = 1,
}: CustomPickerProps) {
  const flatListRef = useRef<FlatList>(null);
  const fontSize = itemHeight * 0.5; // Ajusta este factor como prefieras
  const selectedFontSize = itemHeight * 0.65;

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / itemHeight);
    onChange(index);
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    const isSelected = index === selectedIndex;
    return (
      <View style={[styles.itemContainer, { height: itemHeight }]}>
        <Text style={{
          fontSize: isSelected ? selectedFontSize : fontSize,
          color: isSelected ? '#2B80BE' : '#999',
          fontWeight: isSelected ? 'bold' : 'normal',
        }}>{item}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { height: itemHeight * visibleItems }]}>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        bounces={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        contentOffset={{ y: selectedIndex * itemHeight, x: 0 }}
        renderItem={renderItem}
      />
      {/* Selector indicator */}
      <View
        pointerEvents="none"
        style={[
          styles.selector,
          {
            top: (itemHeight * visibleItems) / 2 - itemHeight / 2,
            height: itemHeight,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    overflow: 'hidden',
    position: 'relative',
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 22,
    color: '#999',
  },
  selectedItemText: {
    color: '#2B80BE',
    fontWeight: 'bold',
    fontSize: 28,
  },
  selector: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderWidth: 1,   
    borderColor: '#2B80BE',
  },
});
