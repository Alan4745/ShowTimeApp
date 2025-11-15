import React, {useRef, useEffect, useState} from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Text,
} from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import Sound from 'react-native-sound';
// ActivityIndicator/Alert not used in modal (handled in PdfViewerScreen)
// WebView rendering moved to dedicated PdfViewerScreen
// PDF handling moved to dedicated screen; no RNFetchBlob/useAuth here
import {useNavigation} from '@react-navigation/native';
import {
  X,
  PlayCircle,
  PauseCircle,
  Heart,
  MessageCircle,
} from 'lucide-react-native';

interface MediaItem {
  id: string;
  mediaType: 'image' | 'video' | 'audio' | 'pdf';
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

export default function MediaViewerModal({
  visible,
  media,
  onClose,
  showInfo = false,
  likesCount,
  commentsCount,
}: MediaViewerModalProps) {
  const navigation: any = useNavigation();
  const {width, height} = useWindowDimensions();
  const isPortrait = height >= width;
  const soundRef = useRef<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState<number | null>(null);
  const [controlsVisible, setControlsVisible] = useState(true);

  const dynamicStyles = {
    fullscreenImage: {
      width,
      height,
    },
    fullscreenVideo: {
      width,
      height,
    },
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

  // PDF download/view handled in `PdfViewerScreen` now.

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

      const sound = new Sound(media.uri, undefined, error => {
        if (error) {
          console.log('Error cargando el audio:', error);
          return;
        }

        sound.play(success => {
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
    if (!sound) {
      return;
    }

    if (isPlaying) {
      sound.pause();
      setIsPlaying(false);
    } else {
      sound.play(success => {
        if (!success) {
          console.log('Error reproduciendo el audio');
        }
      });
      setIsPlaying(true);
    }
  };

  if (!media) {
    return null;
  }

  const shouldShowInfo =
    showInfo &&
    (media?.title ||
      media?.author ||
      media?.description ||
      media?.subcategory ||
      media?.format);

  // Determinar si los elementos deben estar ocultos (solo para video)
  const shouldHideControls = media.mediaType === 'video' && !controlsVisible;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        {/* Mostrar botón X solo cuando los controles estén visibles (para video) o siempre (para imagen/audio) */}
        {(media.mediaType !== 'video' || controlsVisible) && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={30} color="#FFF" />
          </TouchableOpacity>
        )}

        {/* Mostrar info sólo si showInfo es true */}
        {shouldShowInfo && (
          <View style={infoContainerStyle}>
            {media?.title && <Text style={styles.title}>{media.title}</Text>}
            {media?.author && (
              <Text style={styles.author}>by {media.author}</Text>
            )}
            {media?.description && (
              <Text style={styles.description}>{media.description}</Text>
            )}
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

        {/* === OPCIÓN C: Inline bottom bar (normal flow) ===
            Contenedor flex que ajusta el media y la barra inline dentro de la pantalla.
            El media se ajusta automáticamente y la barra queda visible debajo.
        */}
        <View style={styles.mediaWithInlineBar}>
          {/* Renderiza los archivos de media según su tipo */}
          {media.mediaType === 'image' && (
            <Image
              source={{uri: media.uri}}
              style={styles.flexMedia}
              resizeMode="contain"
            />
          )}

          {media.mediaType === 'video' && (
            <VideoPlayer
              source={{uri: media.uri}}
              style={[styles.flexMedia, styles.transparentVideo]}
              resizeMode="contain"
              controlTimeout={0}
              disableBack={true}
              disableVolume={true}
              disableFullscreen={true}
              onBack={onClose}
              tapAnywhereToPause={false}
              repeat={true}
              onShowControls={() => setControlsVisible(true)}
              onHideControls={() => setControlsVisible(false)}
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
                  <Text style={styles.audioText}>Playing audio...</Text>
                )}
              </View>
            </View>
          )}

          {media.mediaType === 'pdf' && (
            <View style={styles.pdfFullScreen}>
              <View style={styles.pdfHeaderContainer}>
                {media?.title ? (
                  <Text style={styles.pdfHeaderTitle}>{media.title}</Text>
                ) : null}

                <TouchableOpacity
                  style={[styles.externalButton, styles.externalButtonMb]}
                  onPress={() => {
                    navigation.navigate('PdfViewer', {
                      uri: media.uri,
                      id: media.id,
                      title: media.title,
                    });
                  }}>
                  <Text style={styles.externalButtonText}>
                    Abrir en pantalla PDF
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Mostrar barra inline solo cuando los controles estén visibles (para video) o siempre (para imagen/audio) */}
          <View style={styles.bottomBarInline}>
            <TouchableOpacity
              style={styles.bottomIcon}
              onPress={() => {
                setLiked(prev => !prev);
                setLocalLikes(prev =>
                  prev !== null ? (liked ? prev - 1 : prev + 1) : prev,
                );
              }}
              disabled={shouldHideControls}
              activeOpacity={shouldHideControls ? 1 : 0.7}>
              <Heart
                color={liked ? '#FF4F4F' : '#fff'}
                size={20}
                strokeWidth={3}
                style={shouldHideControls ? styles.hidden : styles.visible}
              />
              <Text
                style={[
                  styles.iconLabel,
                  shouldHideControls ? styles.hidden : styles.visible,
                ]}>
                {localLikes ?? '–'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottomIcon}
              onPress={() => console.log('Comment')}
              disabled={shouldHideControls}
              activeOpacity={shouldHideControls ? 1 : 0.7}>
              <MessageCircle
                color="#fff"
                size={20}
                strokeWidth={3}
                style={shouldHideControls ? styles.hidden : styles.visible}
              />
              <Text
                style={[
                  styles.iconLabel,
                  shouldHideControls ? styles.hidden : styles.visible,
                ]}>
                {commentsCount ?? '–'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    position: 'relative',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
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
    fontWeight: '400',
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
    fontWeight: '400',
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
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
  },
  mediaWithInlineBar: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexMedia: {
    flex: 1,
    width: '100%',
  },
  transparentVideo: {
    backgroundColor: 'transparent',
  },
  bottomBarInline: {
    width: '100%',
    marginTop: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: 'transparent',
  },
  bottomIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 24,
  },
  iconLabel: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
    alignSelf: 'center',
  },
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  pdfFullScreen: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfLoader: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  pdfError: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pdfErrorText: {
    color: '#FFFFFF',
    marginBottom: 12,
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 16,
  },
  localDebug: {
    position: 'absolute',
    top: 80,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'flex-start',
    zIndex: 60,
  },
  localDebugText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 6,
  },
  localDebugRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    justifyContent: 'space-between',
  },
  debugButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginHorizontal: 4,
  },
  debugButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  externalButton: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  externalButtonText: {
    color: '#FFFFFF',
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 14,
  },
  pdfHeaderContainer: {
    alignItems: 'center',
    padding: 20,
  },
  pdfHeaderTitle: {
    fontSize: 20,
    fontFamily: 'AnonymousPro-Bold',
    color: '#FFF',
    marginBottom: 8,
  },
  externalButtonMb: {
    marginBottom: 8,
  },
});
