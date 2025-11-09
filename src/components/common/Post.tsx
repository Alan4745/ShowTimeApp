import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {
  MessageCircle,
  Heart,
  Edit,
  Trash2,
  Bookmark,
} from 'lucide-react-native';
import MediaGrid from './MediaGrid';
import MediaViewerModal from '../modals/MediaViewerModal';
import PopupConfirm from '../modals/PopupConfirm';

type MediaItem = {
  id?: string;
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
  savedCount?: number;
  media: MediaItem[];
  likedByMe: boolean;
  savedByMe?: boolean;
};

type PostProps = {
  post: PostType;
  onPressComments: () => void;
  onToggleLike?: () => void;
  liking?: boolean; // <-- desactiva el botón mientras se hace la petición, evita doble click
  onToggleSave?: () => void;
  saving?: boolean;
  currentUserId?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean; //muestra editar y borrar solo en HomeTabScreen
  onPressPost?: () => void; // <-- Para abrir el post completo (solo en Home)
};

export default function Post({
  post,
  onPressComments,
  onToggleLike,
  liking,
  currentUserId,
  onEdit,
  onDelete,
  showActions = false,
  onPressPost,
}: PostProps) {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  if (!post) {
    return null;
  }

  const handleDelete = () => {
    setModalVisible(true); // Mostrar el modal al hacer clic en "Borrar"
  };

  const handlePostPress = () => {
    if (onPressPost) {
      onPressPost();
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={onPressPost ? 0.7 : 1}
      onPress={handlePostPress}
      disabled={!onPressPost}>
      <View style={styles.postHeader}>
        <View style={styles.infoContainer}>
          <Image
            source={
              post.avatar
                ? {uri: post.avatar}
                : require('../../../assets/img/userGeneric.png')
            }
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.username}>{post.username}</Text>
            <Text style={styles.userType}>
              {(post.userType || '').charAt(0).toUpperCase() +
                (post.userType || '').slice(1)}
            </Text>
          </View>
        </View>

        {/* Botones para editar y borrar post solo si es el post del usuario */}
        {showActions && currentUserId === post.userId && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
              <Edit size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.actionButton}>
              <Trash2 size={22} color="#ff4d4d" />
            </TouchableOpacity>
          </View>
        )}

        {/* Botón de comentar eliminado - ahora el ícono de comentarios abre el modal directamente */}
      </View>
      <View style={styles.postContent}>
        {/* Texto */}
        {!!post.text && <Text style={styles.postText}>{post.text}</Text>}

        {/* Imagen  y Video*/}
        <MediaGrid media={post.media} onMediaPress={setSelectedMedia} />

        {/*SECCIÓN DE ÍCONOS: cada icono ocupa 33.33% del ancho*/}
        <View style={[styles.iconRow, styles.iconRowDark]}>
          <TouchableOpacity
            style={[styles.iconItem, styles.iconColumn]}
            onPress={onToggleLike}
            disabled={liking}>
            <Heart
              size={24}
              color="#FFFFFF"
              fill={post.likedByMe ? '#FFFFFF' : 'none'}
            />
            <Text style={styles.iconText}>{post.likesCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconItem, styles.iconColumn]}
            onPress={onPressComments}>
            <MessageCircle size={24} color="#FFFFFF" />
            <Text style={styles.iconText}>{post.commentsCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconItem, styles.iconColumn, styles.iconDisabled]}
            disabled={true}
            accessibilityState={{disabled: true}}>
            <Bookmark
              size={24}
              color="#FFFFFF"
              fill={post.savedByMe ? '#FFFFFF' : 'none'}
            />
            <Text style={styles.iconText}>{post.savedCount ?? 0}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal para reproducir media */}
      <MediaViewerModal
        visible={!!selectedMedia}
        media={selectedMedia}
        onClose={() => setSelectedMedia(null)}
        likesCount={post.commentsCount}
        commentsCount={post.commentsCount}
      />

      {/* Modal de confirmación */}
      <PopupConfirm
        visible={isModalVisible}
        title="Confirm Deletion"
        message="Are you sure you want to delete this post?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          setModalVisible(false);
          if (onDelete) {
            onDelete();
          }
        }}
        onCancel={() => setModalVisible(false)}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  actionsContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 10,
  },
  actionButton: {
    marginLeft: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: 10,
  },
  userInfo: {
    flexDirection: 'column',
  },
  username: {
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
  commentButton: {
    width: '30%',
    backgroundColor: '#2B80BE',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    paddingVertical: 5,
  },
  commentText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    fontSize: 18,
    lineHeight: 24,
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
    marginBottom: 15,
    marginLeft: 10,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },
  iconRowDark: {},
  iconItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconColumn: {
    width: '33.33%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconDisabled: {
    opacity: 0.6,
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 6,
    fontFamily: 'AnonymousPro-Regular',
  },
});
