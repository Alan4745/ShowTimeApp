import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Keyboard,
  RefreshControl,
} from 'react-native';
import {Send} from 'lucide-react-native';
import {useAuth} from '../context/AuthContext';
import {useTranslation} from 'react-i18next';
import ScreenLayout from '../components/common/ScreenLayout';
import Post from '../components/common/Post';
import CommentCard from '../components/common/CommentCard';
import LottieIcon from '../components/common/LottieIcon';
import CommentModal from '../components/modals/CommentModal';
import loadingAnimation from '../../assets/lottie/loading.json';
import {buildMediaUrl} from '../utils/urlHelpers';
import {fetchWithTimeout} from '../utils/fetchWithTimeout';

type CommentType = {
  id: string;
  text: string;
  username: string;
  userId: number;
  role: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function StudentPostScreen({route}) {
  const {t} = useTranslation();
  const {token} = useAuth();
  const {postId} = route.params;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const defaultAvatar = require('../../assets/img/userGeneric.png');
  const defaultPdfIcon = require('../../assets/img/pdfIcon.png');
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const endpointPost = `/api/posts/${postId}/`;
  const endpointComments = `/api/posts/${postId}/comments/`;

  // Función para eliminar comentarios
  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetchWithTimeout(`/api/comments/${commentId}/`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Actualiza estado removiendo el comentario borrado
        setComments(prev => prev.filter(comment => comment.id !== commentId));
      } else {
        throw new Error('Error al eliminar comentario');
      }
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
    }
  };

  // Función para cargar comentarios
  const fetchComments = async (url: string, append = false) => {
    try {
      const res = await fetchWithTimeout(url);

      const data = await res.json();
      const newComments = Array.isArray(data.results) ? data.results : [];
      const processedComments = newComments.map(comment => ({
        ...comment,
        avatar: comment.avatar ? buildMediaUrl(comment.avatar) : '',
      }));

      if (append) {
        setComments(prev => [...prev, ...processedComments]);
      } else {
        setComments(processedComments);
      }

      setNextPageUrl(data.next);
    } catch (error) {
      console.error('Error cargando comentarios:', error);
    }
  };

  // Función para cargar más comentarios al hacer scroll
  const loadMoreComments = async () => {
    if (!nextPageUrl || loadingMore) return;
    setLoadingMore(true);
    await fetchComments(nextPageUrl, true);
    setLoadingMore(false);
  };

  // Recupera Post y comentarios de la base de datos al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch del post
        const postRes = await fetchWithTimeout(endpointPost);

        const postData = await postRes.json();

        const enrichedMedia = (postData.media || []).map(item => {
          const fullUri = buildMediaUrl(item.uri || '');
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

        setPost({
          ...postData,
          avatar: postData.avatar
            ? buildMediaUrl(postData.avatar)
            : Image.resolveAssetSource(defaultAvatar).uri,
          media: enrichedMedia,
        });

        // Fetch inicial de comentarios
        await fetchComments(endpointComments);
      } catch (error) {
        console.error('Error al cargar post o comentarios:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [postId, token]);

  const handleSubmitComment = async (text: string) => {
    try {
      const res = await fetchWithTimeout(
        endpointComments,
        {
          method: 'POST',
          body: JSON.stringify({text}),
        },
        30000,
      );

      if (!res.ok) {
        throw new Error('Error al enviar el comentario');
      }

      const newComment = await res.json();

      const processedComment = {
        ...newComment,
        avatar: newComment.avatar ? buildMediaUrl(newComment.avatar) : '',
      };

      setComments(prev => [
        processedComment,
        ...(Array.isArray(prev) ? prev : []),
      ]);
    } catch (error) {
      console.error('Error al enviar comentario:', error);
    }
  };

  const handleSendComment = async () => {
    if (commentText.trim().length === 0) {
      return;
    }

    await handleSubmitComment(commentText.trim());
    setCommentText('');

    // Recargar el post y los comentarios
    await onRefresh();
  };

  // Función para pull-to-refresh - actualiza tanto el post como los comentarios
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Actualizar el post
      const postRes = await fetchWithTimeout(endpointPost);
      const postData = await postRes.json();

      const enrichedMedia = (postData.media || []).map(item => {
        const fullUri = buildMediaUrl(item.uri || '');
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

      setPost({
        ...postData,
        avatar: postData.avatar
          ? buildMediaUrl(postData.avatar)
          : Image.resolveAssetSource(defaultAvatar).uri,
        media: enrichedMedia,
      });

      // Actualizar los comentarios
      await fetchComments(endpointComments);
    } catch (error) {
      console.error('Error al refrescar:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <ScreenLayout>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <LottieIcon source={loadingAnimation} size={120} loop={true} />
          <Text style={{color: '#fff', marginTop: 10}}>
            {t('publishPost.loading')}
          </Text>
        </View>
      </ScreenLayout>
    );
  }

  if (!post) {
    return (
      <ScreenLayout>
        <Text style={{color: '#fff', padding: 20}}>Post no encontrado</Text>
      </ScreenLayout>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.keyboardView}>
        <View style={styles.container}>
          <FlatList
            ListHeaderComponent={
              <View style={styles.headerWrapper}>
                <Post
                  post={post}
                  onPressComments={() => setShowCommentModal(true)}
                  showActions={false}
                />
              </View>
            }
            data={comments}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <CommentCard
                comment={item}
                onDelete={() => handleDeleteComment(item.id)}
              />
            )}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMoreComments}
            onEndReachedThreshold={0.5}
            contentContainerStyle={styles.commentsListContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#1DA1F2"
                colors={['#1DA1F2']}
              />
            }
          />
        </View>

        {/* Fixed bottom input bar - Twitter style - Always visible */}
        <View style={styles.bottomInputContainer}>
          <TextInput
            style={styles.input}
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Write a comment..."
            placeholderTextColor="#999"
            multiline
            maxLength={200}
          />
          <TouchableOpacity
            onPress={handleSendComment}
            disabled={!commentText.trim()}
            style={[
              styles.sendButton,
              !commentText.trim() && styles.sendButtonDisabled,
            ]}>
            <Send size={20} color={commentText.trim() ? '#1DA1F2' : '#555'} />
          </TouchableOpacity>
        </View>

        <CommentModal
          visible={showCommentModal}
          onClose={() => setShowCommentModal(false)}
          onSubmit={handleSubmitComment}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerWrapper: {
    marginTop: 20,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 8,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    marginTop: 10,
  },
  commentAuthor: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    fontSize: 16,
    color: '#FFFFFF',
  },
  userType: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    fontSize: 14,
    color: '#FFFFFF',
  },
  postContent: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  postText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
  },
  commentsListContent: {
    paddingBottom: 120,
  },
  bottomInputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  input: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 14,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
