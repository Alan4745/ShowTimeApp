import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {PlayCircle} from 'lucide-react-native';
import MediaViewerModal from '../modals/MediaViewerModal';

interface CoachCardProps {
  title?: string;
  name?: string;
  imageUrl?: string;
  tag?: string;
  onMorePress?: () => void;
  onPress?: () => void;
  style?: any;
  children?: React.ReactNode;
  isVideo?: boolean;
  mediaUrl?: string;
}

function truncateText(text: string, maxLength: number) {
  if (!text) {
    return '';
  }

  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

export default function CoachCard(props: CoachCardProps) {
  const {t} = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const handlePressMedia = () => {
    if (props.isVideo) {
      setModalVisible(true);
    }
  };

  return (
    <View style={[styles.card, props.style]}>
      {props.imageUrl ? (
        <>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              // If parent passed an onPress (or onMorePress) prefer navigation behavior
              if (props.onPress) {
                props.onPress();
                return;
              }
              if (props.onMorePress) {
                props.onMorePress();
                return;
              }

              // fallback: open media modal for videos
              handlePressMedia();
            }}
            style={styles.touchableFull}>
            <View style={styles.imageContainer}>
              <Image
                source={{uri: props.imageUrl}}
                style={styles.imageTop}
                resizeMode="cover"
              />

              {props.isVideo && (
                <View style={styles.playOverlay}>
                  <PlayCircle size={48} color="#fff" />
                </View>
              )}

              {props.tag && (
                <View style={styles.overlayContainer}>
                  <Text style={styles.overlayText}>{props.tag}</Text>
                </View>
              )}
            </View>

            <View style={styles.contentBottom}>
              {props.title && <Text style={styles.title}>{props.title}</Text>}
              {props.name && <Text style={styles.name}>{props.name}</Text>}
              {props.children && (
                <Text style={styles.children}>
                  {truncateText(String(props.children), 110)}
                  {/* corta texto largo */}
                  <Text style={styles.more} onPress={props.onMorePress}>
                    {' '}
                    ... {t('common.more')}
                  </Text>
                </Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Modal para mostrar el video */}
          {props.isVideo && props.mediaUrl && (
            <MediaViewerModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              media={{
                id: 'temp',
                mediaType: 'video',
                uri: props.mediaUrl,
                title: props.title || '',
                author: props.name || '',
              }}
              showInfo
            />
          )}
        </>
      ) : (
        <View style={styles.content}>
          {props.title && <Text style={styles.title}>{props.title}</Text>}
          {props.name && <Text style={styles.name}>{props.name}</Text>}
          {props.children && (
            <ScrollView
              style={styles.childrenScroll}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}>
              <Text style={styles.children}>
                {props.children}{' '}
                <Text style={styles.more} onPress={props.onMorePress}>
                  {t('common.more')}
                </Text>
              </Text>
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#252A30',
    height: 420,
    maxHeight: 420,
    marginBottom: 12,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 240,
  },
  playOverlay: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 30,
    padding: 4,
  },
  overlayContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 85,
    height: 35,
    backgroundColor: '#2B80BE',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#FFFFFF',
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontFamily: 'AnonymousPro-Regular',
  },
  imageTop: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  contentBottom: {
    padding: 20,
    backgroundColor: '#252A30',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  content: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  name: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  children: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 15,
    fontWeight: '400',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 20,
  },
  more: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 16,
    color: '#2B80BE',
    fontWeight: '700',
    //textDecorationLine: 'underline',
  },
  touchableFull: {
    flex: 1,
  },
  childrenScroll: {
    maxHeight: 200,
  },
});
