import React, {useRef, useEffect, useState} from 'react';
import { Modal, View, Image, TouchableOpacity, StyleSheet, useWindowDimensions, Text } from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import Sound from 'react-native-sound';
import { X, PlayCircle, PauseCircle, Heart, MessageCircle, Bookmark } from 'lucide-react-native';

interface MediaItem {
  id: string;
  mediaType: 'image' | 'video' | 'audio';
  uri: string;
  title?: string;
  author?: string;
  description?: string;
  subcategory?: string;
  format?: string;
  likes?: number;
  comments?: number;
}

interface MediaViewerModalProps {
  visible: boolean;
  media?: MediaItem | null;
  onClose: () => void;
  showInfo?: boolean;
  likesCount?: number;
  commentsCount?: number;
  onBookmarkPress?: () => void;
}

export default function MediaViewerModal({ visible, media, onClose, showInfo = false, likesCount, commentsCount, onBookmarkPress}: MediaViewerModalProps) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;
  const soundRef = useRef<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState<number | null>(null);  

  const dynamicStyles = {
    fullscreenImage: {
      width,
      height,      
    },
    fullscreenVideo: {
      width,
      height,      
    }
  };

  const infoContainerStyle = {
    position: 'absolute',
    left: 20,
    bottom: isPortrait ? 40 : 20,
    width: isPortrait ? '80%' : '60%',
    marginBottom: 10,
    zIndex: 50,
  } as const;
   
  const getAudioBackground = () => {
    return require('../../../assets/img/audioPlaceholder.png');
  };
    
  useEffect(() => {
    // Reset estado al abrir un nuevo media
    if (visible && likesCount !== undefined) {
      setLocalLikes(likesCount);
      setLiked(false); // o restaurar de algún valor guardado
    }
  }, [media, visible, likesCount]);
  
  useEffect(() => {
    if (media?.mediaType === 'audio' && visible) {
      // Habilitar reproducción incluso en modo silencioso (solo iOS)
      Sound.setCategory('Playback');

      const sound = new Sound(media.uri, undefined, (error) => {
        if (error) {
          console.log('Error cargando el audio:', error);
          return;
        }

        sound.play((success) => {
          if (!success) {
            console.log('Error reproduciendo el audio');
          }
          setIsPlaying(false);
        });
        setIsPlaying(true);
      });

      soundRef.current = sound;
    }

      // Cleanup: parar y liberar audio
      return () => {
        if (soundRef.current) {
          soundRef.current.stop(() => {
            soundRef.current?.release();
          });
          soundRef.current = null;
          setIsPlaying(false);
        }
    };
  }, [media, visible]); 
  
  const togglePlayback = () => {
    const sound = soundRef.current;
    if (!sound) return;

    if (isPlaying) {
      sound.pause();
      setIsPlaying(false);
    } else {
      sound.play((success) => {
        if (!success) {
          console.log('Error reproduciendo el audio');
        }
      });
      setIsPlaying(true);
    }
  };
  
  if (!media) return null;
  const shouldShowInfo = showInfo && (media?.title || media?.author || media?.description || media?.subcategory || media?.format);

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={30} color="#FFF" />
        </TouchableOpacity>

        {/* Floating Action Icons */}
        <View style={styles.floatingIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => {
            setLiked(prev => !prev);
            setLocalLikes(prev => (prev !== null ? (liked ? prev - 1 : prev + 1) : prev));
          }}>
            <Heart color={liked ? "#FF4F4F"  :"#fff"} size={24} strokeWidth={3.5} />
            <Text style={styles.iconLabel}>{localLikes ?? '–'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => console.log('Comment')}>
            <MessageCircle color="#fff" size={24} strokeWidth={3.5} />
            <Text style={styles.iconLabel}>{commentsCount ?? '–'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={onBookmarkPress}>
            <Bookmark color="#fff" size={24} strokeWidth={3.5} />
          </TouchableOpacity>
        </View>

        {/* Mostrar info sólo si showInfo es true */}
        {shouldShowInfo && (
          <View style={infoContainerStyle}>
            {media?.title && <Text style={styles.title}>{media.title}</Text>}
            {media?.author && <Text style={styles.author}>by {media.author}</Text>}
            {media?.description && <Text style={styles.description}>{media.description}</Text>}
            <View style={styles.labelRow}>
              {media?.subcategory && (
                <View style={styles.firstLabel}>
                  <Text style={styles.firstLabelText}>{media.subcategory}</Text>
                </View>
              )}
              {media?.format && (
                <View style={styles.secondLabel}>
                  <Text style={styles.secondLabelText}>{media.format}</Text>
                </View>
              )}
            </View>
          </View>        
        )}       

        {/* Renderiza los archivos de media según su tipo */}
        {media.mediaType === 'image' && (
          <Image
            source={{ uri: media.uri }}
            style={dynamicStyles.fullscreenImage}
            resizeMode="contain"
          />
        )}

        {media.mediaType === 'video' && (
          <VideoPlayer
            source= {{ uri: media.uri }}
            style={dynamicStyles.fullscreenVideo}
            resizeMode="contain"
            controlTimeout={3000}
            disableBack={true} 
            onBack={onClose} 
            tapAnywhereToPause={true}
            showOnStart={true}
          />
        )}
                {media.mediaType === 'audio' && (
          <View style={styles.audioFullScreen}>
            <Image
              source={getAudioBackground()}
              style={dynamicStyles.fullscreenImage}
              resizeMode="cover"
            />

            <View style={styles.audioOverlay}>
              <TouchableOpacity onPress={togglePlayback}>
                {isPlaying ? (
                  <PauseCircle size={64} color="#FFF" />
                ) : (
                  <PlayCircle size={64} color="#FFF" />
                )}
              </TouchableOpacity>

              {!isPlaying && (
                <Text style={styles.audioText}>
                  {soundRef.current ? 'Paused' : 'Loading audio...'}
                </Text>
              )}

              {isPlaying && (
                <Text style={styles.audioText}>
                  Playing audio...
                </Text>
              )}
            </View>
          </View>
        )}               
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    position: "relative",
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  audioContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
   audioFullScreen: {
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioOverlay: {
    position: 'absolute',
    justifyContent: "center",
    alignItems: 'center',    
  },
  audioText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: "700",
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 15,
  },
  title: {
    fontSize: 22,
    fontFamily: 'AnonymousPro-Bold',
    color: '#FFF',
    marginBottom: 6,
  },
  author: {
    fontSize: 16,
    fontFamily: 'AnonymousPro-Regular',
    color: '#CCCCCC',
    marginBottom: 10,
  },
  description: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 18,
    color: '#CCCCCC',
    marginBottom: 12,
    lineHeight: 20,
  },
  labelRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  firstLabel: {
    backgroundColor: '#2B80BE',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  firstLabelText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 16,
    color: '#FFF',
  },
  secondLabel: {
    borderColor: '#FFFFFF',
    borderWidth: 1.5,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  secondLabelText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 16,
    color: '#FFFFFF',
  },
  floatingIcons: {
    position: 'absolute',
    right: 20,
    top: '35%',
    zIndex: 11,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 30,
  },
  iconButton: {
    marginVertical: 10,    
    padding: 10,    
  },  
  iconLabel:{
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 16,
    color: '#FFFFFF', 
    alignSelf: "center", 
  }
});
