import React from 'react';
import { FlatList, View, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import { Play } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;
const numColumnsMultiple = 2; // columnas cuando hay varios items
const paddingBetween = 5;

export default function MediaGrid({ media, onMediaPress }) {
  if (!media || media.length === 0) return null;

  const isSingle = media.length === 1;
  const numColumns = isSingle ? 1 : numColumnsMultiple;

  const itemSize = isSingle ? screenWidth - paddingBetween * 2 : (screenWidth - paddingBetween * (numColumns + 1)) / numColumns;

  const renderItem = ({ item, index }) => {
    const handlePress = () => onMediaPress(item);

    if (item.type === 'image') {
      return (
        <TouchableOpacity
          key={item.id || index}
          onPress={handlePress}
          style={[styles.itemContainer, { width: itemSize, height: itemSize }]}
        >
          <Image source={{ uri: item.uri }} style={styles.media} resizeMode="cover" />
        </TouchableOpacity>
      );
    }

    if (item.type === 'video') {
      return (
        <TouchableOpacity
          key={item.id || index}
          onPress={handlePress}
          style={[styles.itemContainer, { width: itemSize, height: itemSize }]}
        >
          <Video
            source={{ uri: item.uri }}
            style={styles.media}
            resizeMode="cover"
            controls={false}
            paused={true}
            muted={true}
            repeat={true}
          />
          <View style={styles.playIconWrapper}>
            <Play size={32} color="#FFF" />
          </View>
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <FlatList
      data={media}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.id || index.toString()}
      numColumns={numColumns}
      contentContainerStyle={styles.container}
      key={numColumns} // importante para que se re-renderice si cambia numColumns
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: paddingBetween,
  },
  itemContainer: {
    margin: paddingBetween / 2,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#222',
    position: 'relative',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  playIconWrapper: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
    borderRadius: 20,
    zIndex: 2,
  },
});


