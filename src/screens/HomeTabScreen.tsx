import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import Post from '../components/common/Post';
import SearchBar from '../components/form/SearchBar';
import LottieIcon from '../components/common/LottieIcon';
import { useAuth } from '../context/AuthContext';
import loadingAnimation from '../../assets/lottie/loading.json'
import { buildMediaUrl } from '../utils/urlHelpers';
import API_BASE_URL from '../config/api';

type MediaItem = {
  id: string;
  mediaType: 'image' | 'video' | 'audio' | 'pdf';
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
  id: string;
  userId: number;
  username: string;
  userType: string;
  avatar: string;
  text: string;
  commentsCount: number;
  likesCount: number;
  media: MediaItem[];
  likedByMe: boolean;
};

type RawMediaItem = {
  type: string;
  uri: string;
  thumbnail: string;
};

type RawPost = {
  id: string;
  author_id: number;
  username: string;
  userType: string;
  avatar: string;
  text: string;
  media: RawMediaItem[];
  commentsCount: number;
  likesCount: number;
  likedByMe: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function HomeTabScreen() {
  const navigation = useNavigation();
  const { token, user} = useAuth();  
  const [searchQuery, setSearchQuery] = useState('');
  const [allPosts, setAllPosts] = useState<PostType[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostType[]>([]);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [likingPostId, setLikingPostId] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const defaultAvatar = require('../../assets/img/userGeneric.png');
  const defaultPdfIcon = require('../../assets/img/pdfIcon.png');  
  const endpoint = `${API_BASE_URL}/api/posts/`; 

  // Para que refresque el contenido de HomeTabScreen y se muestren las actualizaciones
  useFocusEffect(
    useCallback(() => {
      fetchPosts(endpoint); // ← Re-fetch cuando la pantalla recupera el foco
    }, [token])
  );

  // Función para el toggle de like
  const handleToggleLike = async (postId: string, likedByMe: boolean) => {
    if (likingPostId === postId) return; // previene doble click
    setLikingPostId(postId);
    
    try {
      const method = likedByMe ? 'DELETE' : 'POST';
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/like/`, {
        method,
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.ok) {
        setAllPosts(prev =>
          prev.map(post =>
            post.id === postId
              ? {
                  ...post,
                  likedByMe: !likedByMe,
                  likesCount: post.likesCount + (likedByMe ? -1 : 1),
                }
              : post
          )
        );

        setFilteredPosts(prev =>
          prev.map(post =>
            post.id === postId
              ? {
                  ...post,
                  likedByMe: !likedByMe,
                  likesCount: post.likesCount + (likedByMe ? -1 : 1),
                }
              : post
          )
        );
      }
    } catch (err) {
      console.error('Error al hacer toggle de like:', err);
    } finally {
      setLikingPostId(null);
    }
  };

  // Función para cargar posts, puede cargar inicial o paginados
  const fetchPosts = async (url: string, append = false) => {
    if (!append) setIsInitialLoading(true);
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Token ${token}` },
      });

      const text = await res.text();

      if (text.startsWith('<')) {
        console.error('La respuesta no es JSON, es HTML:', text);
        return;
      }

      const json = JSON.parse(text);
      const rawPosts = json.results || [];

      const enrichedPosts = rawPosts.map((post: RawPost) => {
        const enrichedMedia = post.media.map((item: RawMediaItem) => {
          const fullUri = buildMediaUrl(item.uri);
          let thumbnailUrl = '';

          if (item.type === 'pdf') {
            thumbnailUrl = Image.resolveAssetSource(defaultPdfIcon).uri;
          } else if (item.thumbnail) {
            thumbnailUrl = buildMediaUrl(item.thumbnail);
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
          userId: post.author_id,
          username: post.username || 'unknown',
          userType: post.userType || 'student',
          avatar: post.avatar
            ? buildMediaUrl(post.avatar)
            : Image.resolveAssetSource(defaultAvatar).uri,
          text: post.text || '',
          commentsCount: post.commentsCount || 0,
          likesCount: post.likesCount || 0,
          media: enrichedMedia,
          likedByMe: post.likedByMe || false,
        };
      });

      if (append) {
        setAllPosts(prev => [...prev, ...enrichedPosts]);
        setFilteredPosts(prev => [...prev, ...enrichedPosts]);
      } else {
        setAllPosts(enrichedPosts);
        setFilteredPosts(enrichedPosts);
      }

      setNextPageUrl(json.next || null);
    } catch (err) {
      console.error('Error al cargar posts:', err);
    } finally{
      if (!append) setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(endpoint);
  }, [token]);

  // Filtrar búsqueda
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

  // Scroll infinito
  const handleLoadMore = async () => {
    if (loadingMore || !nextPageUrl) return;
    setLoadingMore(true);
    await fetchPosts(nextPageUrl, true);
    setLoadingMore(false);
  };

  //Elimina el Post, solo los que pertencen al usuario logeado
  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Filtra el post eliminado del estado
        setAllPosts(prev => prev.filter(post => post.id !== postId));
        setFilteredPosts(prev => prev.filter(post => post.id !== postId));
      } else {
        const errorText = await response.text();
        console.error('Error al eliminar el post:', errorText);
      }
    } catch (err) {
      console.error('Error de red al eliminar el post:', err);
    }
  };
  // Renderiza los posts
  const renderItem = ({ item }: { item: PostType }) => (
    <Post
      post={item}
      currentUserId={user?.id}
      onEdit={() => (navigation as any).navigate('PublishPost', { postToEdit: item })}
      onDelete={() => handleDeletePost(item.id)}
      onPressComments={() =>
        (navigation as any).navigate('StudentPost', { postId: item.id })
      }
      onToggleLike = {() => handleToggleLike(item.id, item.likedByMe)}
      liking = {likingPostId === item.id}
      showActions = {true}
    />
  );

  if (isInitialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieIcon
          source={loadingAnimation}
          size={100}
          loop={true}
          autoPlay={true}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search"
      />   
   
      <FlatList
        data={filteredPosts.filter(p => !!p && !!p.id)}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        scrollEnabled={true}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" color="#fff" style={{ marginVertical: 20 }} />
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 100 }}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // o el fondo que uses
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

