import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {useTranslation} from 'react-i18next';
import {Trash2} from 'lucide-react-native';
import PopupConfirm from '../modals/PopupConfirm';

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

type CommentCardProps = {
  comment: CommentType;
  onDelete?: (id: string) => void;
  postAuthorName?: string;
};

export default function CommentCard({
  comment,
  onDelete,
  postAuthorName,
}: CommentCardProps) {
  const {user} = useAuth();
  const {t} = useTranslation();
  const isOwnComment = user?.id === comment.userId;
  const defaultAvatar = require('../../../assets/img/userGeneric.png');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmDelete = () => {
    setShowConfirm(false);
    onDelete?.(comment.id);
  };

  return (
    <View style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <Image
          source={comment.avatar ? {uri: comment.avatar} : defaultAvatar}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.commentAuthor}>{comment.username}</Text>
          <Text style={styles.userType}>
            {comment.role
              ? comment.role.charAt(0).toUpperCase() + comment.role.slice(1)
              : ''}
          </Text>
          {postAuthorName ? (
            <Text style={styles.postAuthorText}>
              En respuesta a{' '}
              <Text style={styles.replyUser}>{'@' + postAuthorName}</Text>
            </Text>
          ) : null}
        </View>

        {isOwnComment && (
          <TouchableOpacity
            onPress={() => setShowConfirm(true)}
            style={styles.deleteButton}>
            <Trash2 color="#fff" size={24} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.postContent}>
        <Text style={styles.postText}>{comment.text}</Text>
      </View>

      {/* PopupConfirm modal */}
      <PopupConfirm
        visible={showConfirm}
        title={t('modalTitles.confirmDelete')}
        message={t('placeholders.deleteComment')}
        confirmText={t('modalTitles.buttonOptions.delete')}
        cancelText={t('modalTitles.buttonOptions.cancel')}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
      {/* Separator line below the comment */}
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  commentContainer: {
    marginBottom: 15,
    width: '90%',
    alignSelf: 'center',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    marginTop: 6,
  },
  commentAuthor: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    fontSize: 16,
    color: '#FFFFFF',
  },
  postAuthorText: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 12,
    color: '#BBBBBB',
    marginTop: 2,
  },
  replyUser: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '700',
    fontSize: 12,
    color: '#007AFF',
  },
  userType: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    fontSize: 14,
    color: '#FFFFFF',
  },
  postContent: {
    marginLeft: 60,
    marginRight: 10,
    marginBottom: 10,
  },
  postText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
  },
  deleteButton: {
    marginLeft: 8,
    padding: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#2b2b2b',
    marginTop: 10,
    width: '100%',
  },
  userInfo: {
    flex: 1,
  },
});
