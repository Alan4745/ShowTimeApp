import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Post from '../components/common/Post';
import SearchBar from '../components/form/SearchBar';
import postsData from '../data/posts.json';
import { createThumbnail } from 'react-native-create-thumbnail';

type MediaItem = {
  type: 'image' | 'video';
  uri: string;
  thumbnail?: string;
};

type PostType = {
  id: number;
  username: string;
  userType: string;
  text: string;
  commentsCount: number;
  likesCount: number;
  media: MediaItem[];
};

export default function HomeTabScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [allPosts, setAllPosts] = useState<PostType[]>([]); // posts con thumbnails
  const [filteredPosts, setFilteredPosts] = useState<PostType[]>([]); // posts filtrados

  // 1. Cargar thumbnails
  useEffect(() => {
    const enrichPostsWithThumbnails = async () => {
      const enriched = await Promise.all(
        postsData.map(async post => {
          const enrichedMedia = await Promise.all(
            (post.media ?? []).map(async item => {
              if (item.type === 'video' && !item.thumbnail) {
                try {
                  const { path } = await createThumbnail({ url: item.uri });
                  return { ...item, thumbnail: path };
                } catch (error) {
                  console.error('Error creando thumbnail', error);
                  return item;
                }
              }
              return item;
            })
          );
          return { ...post, media: enrichedMedia };
        })
      );

      setAllPosts(enriched);
      setFilteredPosts(enriched); // mostrar todos inicialmente
    };

    enrichPostsWithThumbnails();
  }, []);

  // 2. Filtrar por búsqueda
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (query === '') {
      setFilteredPosts(allPosts);
    } else {
      const filtered = allPosts.filter(post =>
        post.text?.toLowerCase().includes(query)
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, allPosts]);

  const renderItem = ({ item }) => (
    <Post
      post={item}
      onPressComments={() => navigation.navigate('StudentPost', { postId: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={'Search'}
      />

      <FlatList
        data={filteredPosts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        scrollEnabled={true}
        contentContainerStyle={{paddingBottom: 100 }}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PublishPost')}
      >
        <Text style={styles.buttonText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000',     
  },
  button: {
    position: 'absolute',
    right: 20,
    bottom: 10,
    backgroundColor: '#2B80BE',
    width: 73,
    height: 73,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  buttonText: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 30,
    color: '#FFFFFF',
    lineHeight: 30,
  },
});

