import React, {useRef, useEffect, useState} from 'react';
import { Modal, View, Image, TouchableOpacity, StyleSheet, useWindowDimensions, Text } from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import Sound from 'react-native-sound';
import { X, PlayCircle, PauseCircle } from 'lucide-react-native';

interface MediaItem {
  type: 'image' | 'video' | 'audio';
  uri: string;
  title?: string;
  author?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}

interface MediaViewerModalProps {
  visible: boolean;
  media?: MediaItem | null;
  onClose: () => void;
  showInfo?: boolean;
}

export default function MediaViewerModal({ visible, media, onClose, showInfo = false }: MediaViewerModalProps) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;
  const soundRef = useRef<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);


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
    zIndex: 999,
  } as const;
   
  const getAudioBackground = () => {
    return require('../../../assets/img/audioPlaceholder.png');
  };
  

  useEffect(() => {
    console.log("📦 Media recibida:", media);
    if (media?.type === 'audio' && visible) {
      // Habilitar reproducción incluso en modo silencioso (solo iOS)
      Sound.setCategory('Playback');

      const sound = new Sound(media.uri, undefined, (error) => {
        if (error) {
          console.log('❌ Error cargando el audio:', error);
          return;
        }

        sound.play((success) => {
          if (!success) {
            console.log('❌ Error reproduciendo el audio');
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
          console.log('❌ Error reproduciendo el audio');
        }
      });
      setIsPlaying(true);
    }
  };
  
  if (!media) return null;
  const shouldShowInfo = showInfo && (media?.title || media?.author || media?.description || media?.primaryLabel || media?.secondaryLabel);

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={30} color="#FFF" />
        </TouchableOpacity>

        {/* Mostrar info sólo si showInfo es true */}
        {shouldShowInfo && (
          <View style={infoContainerStyle}>
            {media?.title && <Text style={styles.title}>{media.title}</Text>}
            {media?.author && <Text style={styles.author}>by {media.author}</Text>}
            {media?.description && <Text style={styles.description}>{media.description}</Text>}
            <View style={styles.labelRow}>
              {media?.primaryLabel && (
                <View style={styles.firstLabel}>
                  <Text style={styles.firstLabelText}>{media.primaryLabel}</Text>
                </View>
              )}
              {media?.secondaryLabel && (
                <View style={styles.secondLabel}>
                  <Text style={styles.secondLabelText}>{media.secondaryLabel}</Text>
                </View>
              )}
            </View>
          </View>
        )}   

        {/* Renderiza los archivos de media según su tipo */}
        {media.type === 'image' && (
          <Image
            source={{ uri: media.uri }}
            style={dynamicStyles.fullscreenImage}
            resizeMode="contain"
          />
        )}

        {media.type === 'video' && (
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
                {media.type === 'audio' && (
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
  }
});
