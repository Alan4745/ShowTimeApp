import React, {useRef, useEffect, useState} from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Text,
  Platform,
  Alert,
  Linking,
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
import {useTranslation} from 'react-i18next';

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
  const [audioError, setAudioError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState<number | null>(null);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const {t} = useTranslation();

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

  const infoContainerStyle: any = {
    position: 'absolute',
    left: 20,
    width: isPortrait ? '80%' : '60%',
    marginBottom: 10,
    zIndex: 60,
  };

  // Mostrar la info en la parte superior para vídeos (flotante), abajo para otros media
  if (media?.mediaType === 'video') {
    infoContainerStyle.top = isPortrait ? 60 : 20;
  } else {
    infoContainerStyle.bottom = isPortrait ? 40 : 20;
  }

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
      try {
        // Habilitar reproducción incluso en modo silencioso (solo iOS)
        if (Platform.OS === 'ios' && Sound.setCategory) {
          try {
            Sound.setCategory('Playback');
          } catch (e) {
            console.log('Sound.setCategory error:', e);
          }
        }

        // Proteger la creación del objeto Sound — algunos URIs remotos o configuraciones
        // pueden dar lugar a errores nativos que cierran la app si no son soportados.
        const sound = new Sound(media.uri, undefined, error => {
          if (error) {
            console.log('Error cargando el audio:', error);
            setAudioError(String(error || 'Audio load error'));
            return;
          }

          try {
            sound.play(success => {
              if (!success) {
                console.log('Error reproduciendo el audio');
              }
              setIsPlaying(false);
            });
            setIsPlaying(true);
            setAudioError(null);
            soundRef.current = sound;
          } catch (playErr) {
            console.log('Error al reproducir audio:', playErr);
            setAudioError(String(playErr));
            try {
              sound.release();
            } catch (e) {
              // ignore
            }
          }
        });
      } catch (e) {
        console.log('Audio init unexpected error:', e);
        setAudioError(String(e));
      }
    }

    // Cleanup: parar y liberar audio
    return () => {
      try {
        if (soundRef.current) {
          soundRef.current.stop(() => {
            try {
              soundRef.current?.release();
            } catch (e) {
              // ignore
            }
          });
          soundRef.current = null;
          setIsPlaying(false);
        }
      } catch (cleanupErr) {
        console.log('Audio cleanup error:', cleanupErr);
      }
    };
  }, [media, visible]);

  const togglePlayback = () => {
    const sound = soundRef.current;
    if (!sound) {
      // Si ocurrió un error al preparar audio, mostrar alerta ligera
      if (audioError) {
        if (Platform.OS === 'android') {
          // En Android a veces el módulo nativo falla — informar al usuario
          Alert.alert(
            'Audio no disponible',
            'No se puede reproducir este audio en este dispositivo.',
          );
        }
      }
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
              <View>
                <Text style={styles.description}>
                  {media.description.length > 15 && !descriptionExpanded
                    ? `${media.description.slice(0, 15)}...`
                    : media.description}
                </Text>
                {media.description.length > 15 && (
                  <TouchableOpacity
                    onPress={() => setDescriptionExpanded(!descriptionExpanded)}
                    style={styles.toggleButton}>
                    <Text style={styles.toggleButtonText}>
                      {descriptionExpanded
                        ? t('common.seeLess')
                        : t('common.seeMore')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
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
              controlTimeout={3000}
              showOnStart={false}
              disableBack={true}
              disableVolume={true}
              disableFullscreen={true}
              onBack={onClose}
              tapAnywhereToPause={false}
              repeat={true}
              onShowControls={() => setControlsVisible(true)}
              onHideControls={() => setControlsVisible(false)}
              onError={e => {
                console.log('VideoPlayer error', e);
                // If it's a .mov, offer to open externally (Android may not support some codecs)
                try {
                  const uri = media.uri ?? '';
                  if (uri.toLowerCase().endsWith('.mov')) {
                    Alert.alert(
                      'Formato no compatible',
                      'Este video no se puede reproducir en la app. ¿Quieres abrirlo en una aplicación externa?',
                      [
                        {text: 'Cancelar', style: 'cancel'},
                        {
                          text: 'Abrir',
                          onPress: async () => {
                            try {
                              await Linking.openURL(uri);
                            } catch (err) {
                              console.log('open external error', err);
                              Alert.alert(
                                'Error',
                                'No se pudo abrir el archivo en una app externa',
                              );
                            }
                          },
                        },
                      ],
                    );
                  }
                } catch (err) {
                  console.log('onError fallback failed', err);
                }
              }}
              paused={!isPlaying}
            />
          )}

          {/* Controles de vídeo ahora se muestran por encima de la barra inferior (no sobrepuestos) */}
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
                    // Close modal before navigating to dedicated PdfViewer screen
                    try {
                      onClose();
                    } catch (err) {
                      // ignore if onClose is not provided
                    }
                    // navigate after closing modal
                    setTimeout(() => {
                      navigation.navigate('PdfViewer', {
                        uri: media.uri,
                        id: media.id,
                        title: media.title,
                      });
                    }, 50);
                  }}>
                  <Text style={styles.externalButtonText}>
                    Abrir en pantalla PDF
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Mostrar barra inline solo cuando los controles estén visibles (para video) o siempre (para imagen/audio) */}
          {/* Contenedor de controles justo encima de la barra inferior */}
          {/* Controles personalizados eliminados: se confía en los controles nativos del componente */}
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
  videoControlsInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginRight: 'auto',
    marginLeft: 12,
  },
  toggleButton: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  toggleButtonText: {
    color: '#2B80BE',
    fontSize: 14,
    fontFamily: 'AnonymousPro-Bold',
    textDecorationLine: 'underline',
  },
});
