import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Post from '../components/common/Post';
import SearchBar from '../components/form/SearchBar';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';

type MediaItem = {
  id: string;
  mediaType: 'image' | 'video' | 'audio';
  uri: string;
  thumbnailUrl: string;
  title?: string;
  author?: string;
  description?: string;
  subcategory?: string;
  format?: string;  
  likes?: number;
  comments?: number;
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
  const { token } = useAuth();
  const endpoint = `${API_BASE_URL}/api/posts/`;
  const [searchQuery, setSearchQuery] = useState('');
  const [allPosts, setAllPosts] = useState<PostType[]>([]); // posts con thumbnails
  const [filteredPosts, setFilteredPosts] = useState<PostType[]>([]); // posts filtrados


  // 1. Carga los posts de la base de datos.
  useEffect(() => {
    const buildFullUrl = (path) => {
      if (!path) return '';
      if (path.startsWith('http')) return path;
      return `${API_BASE_URL}${path}`;
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const text = await res.text();

        // Chequea si empieza como HTML (probable error)
        if (text.startsWith('<')) {
          console.error('⚠️ La respuesta no es JSON, es HTML:', text);
          return;
        }

        const json = JSON.parse(text);
        console.log('Respuesta parseada del backend:', json);
        const rawPosts = json.results || [];

        const enrichedPosts = rawPosts.map((post) => {
          const enrichedMedia = post.media.map((item) => {
            const fullUri = buildFullUrl(item.uri || '');
            let thumbnailUrl = '';

            if (item.type === 'pdf') {
              thumbnailUrl = require('../../assets/img/pdfIcon.png');
            } else if (item.thumbnail) {
              thumbnailUrl = buildFullUrl(item.thumbnail);
            }

            return {
              ...item,
              uri: fullUri,
              mediaType: item.type || 'image',
              thumbnailUrl,
            };
          });

          return {
            id: post.id,
            username: post.username || 'unknown',
            userType: post.userType || 'student',
            avatar: buildFullUrl(post.avatar || ''),
            text: post.text || '',
            commentsCount: post.commentsCount || 0,
            likesCount: post.likesCount || 0,
            media: enrichedMedia,
          };
        });

        setAllPosts(enrichedPosts);
        setFilteredPosts(enrichedPosts);
      } catch (err) {
        console.error('Error al cargar posts:', err);
      }
    };

    fetchPosts();
  }, [token]);


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
      onPressComments={() => (navigation as any).navigate('StudentPost', { postId: item.id })}
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
        onPress={() => (navigation as any).navigate('PublishPost')}
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

