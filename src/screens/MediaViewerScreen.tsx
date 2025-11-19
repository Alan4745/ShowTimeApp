import React, {useEffect, useState, useRef, useMemo} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Text,
  Platform,
  Alert,
  Linking,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import Video from 'react-native-video';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  X,
  PlayCircle,
  PauseCircle,
  Heart,
  MessageCircle,
} from 'lucide-react-native';
import {RotateCw, Eye} from 'lucide-react-native';
import {useTranslation} from 'react-i18next';

export default function MediaViewerScreen() {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const media = route.params?.media;
  const {width, height} = useWindowDimensions();
  const isPortrait = height >= width;
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<any>(null);
  const isPlayingRef = useRef<boolean>(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState<number | null>(
    media?.likes ?? null,
  );
  const [controlsVisible, setControlsVisible] = useState(true);
  const [controlsMounted, setControlsMounted] = useState(true);
  const controlsAnim = useRef(new Animated.Value(1)).current;
  const hideTimeoutRef = useRef<any>(null);
  const [rotateVideo, setRotateVideo] = useState(false);
  const [isLandscapeVideo, setIsLandscapeVideo] = useState(false);
  const [_videoNaturalSize, setVideoNaturalSize] = useState<{
    w: number;
    h: number;
  }>({w: 0, h: 0});
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const {t} = useTranslation();

  const dynamicStyles = {
    fullscreenImage: {width, height},
    fullscreenVideo: {width, height},
  };

  const infoContainerStyle: any = {
    position: 'absolute',
    left: 20,
    width: isPortrait ? '80%' : '60%',
    marginBottom: 10,
    zIndex: 60,
  };

  if (media?.mediaType === 'video') {
    infoContainerStyle.top = isPortrait ? 60 : 20;
  } else {
    infoContainerStyle.bottom = isPortrait ? 40 : 20;
  }

  const getAudioBackground = () =>
    require('../../assets/img/audioPlaceholder.png');

  useEffect(() => {
    // No native track-player to avoid TurboModule/JNI incompatibilities.
    // Use react-native-video for audio playback; start paused until user presses play.
    setIsPlaying(false);
    setAudioError(null);
  }, [media]);

  const togglePlayback = () => {
    try {
      setIsPlaying(prev => {
        const next = !prev;
        // if starting playback, hide UI immediately (no timer)
        if (next) {
          // if we were at end, reset to start
          if (!prev && currentTime >= duration && duration > 0) {
            playerRef.current?.seek(0);
            setCurrentTime(0);
          }
          // hide controls immediately when playback starts
          setControlsVisible(false);
          hideControlsAnimated();
        } else {
          // paused: show controls
          showControlsAnimated();
          setControlsVisible(true);
        }

        return next;
      });
    } catch (err) {
      console.log('togglePlayback error', err);
      if (audioError && Platform.OS === 'android') {
        Alert.alert(
          'Audio no disponible',
          'No se puede reproducir este audio en este dispositivo.',
        );
      }
    }
  };

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const showControlsAnimated = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setControlsMounted(true);
    Animated.timing(controlsAnim, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const hideControlsAnimated = () => {
    Animated.timing(controlsAnim, {
      toValue: 0,
      duration: 260,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(({finished}) => {
      if (finished) {
        setControlsMounted(false);
      }
    });
  };

  const videoContainerStyle = useMemo(() => {
    if (rotateVideo) {
      // When rotating, create an absolutely positioned box sized to the
      // rotated rectangle and offset it so it's centered on screen. This
      // avoids the "stretched" look and keeps the overlay controls aligned.
      const left = (width - height) / 2;
      const top = (height - width) / 2;
      return {
        position: 'absolute',
        left,
        top,
        width: height,
        height: width,
        transform: [{rotate: '90deg'}],
        justifyContent: 'center',
        alignItems: 'center',
      } as any;
    }

    return styles.videoWrapperFull;
  }, [rotateVideo, width, height]);

  if (!media) {
    return null;
  }

  const shouldShowInfo =
    media &&
    (media.title ||
      media.author ||
      media.description ||
      media.subcategory ||
      media.format);

  const shouldHideControls = media.mediaType === 'video' && !controlsVisible;
  const floatTop = isPortrait ? height * 0.45 : height * 0.35;

  const onLoadVideo = (data: any) => {
    try {
      const dur = data?.duration || data?.naturalSize?.duration || 0;
      setDuration(dur);
      const w = data?.naturalSize?.width || 0;
      const h = data?.naturalSize?.height || 0;
      setVideoNaturalSize({w, h});
      setIsLandscapeVideo(w > h);
    } catch (err) {
      console.log('onLoadVideo error', err);
    }
  };

  const onProgress = (p: any) => {
    try {
      setCurrentTime(p.currentTime || 0);
    } catch (err) {
      console.log('onProgress error', err);
    }
  };

  const onEnd = () => {
    setIsPlaying(false);
    try {
      playerRef.current?.seek(0);
      setCurrentTime(0);
    } catch (e) {}
  };

  const seekTo = (seconds: number) => {
    try {
      playerRef.current?.seek(seconds);
      setCurrentTime(seconds);
    } catch (err) {
      console.log('seek error', err);
    }
  };

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) {
      return '00:00';
    }

    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {controlsMounted && (
        <Animated.View
          style={[
            styles.closeAnimatedWrapper,
            {
              opacity: controlsAnim,
              transform: [
                {
                  translateY: controlsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [6, 0],
                  }),
                },
              ],
            },
          ]}
          pointerEvents={controlsVisible ? 'auto' : 'none'}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <X size={30} color="#FFF" />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Top-right controls removed (duplicates in bottom controls row). */}

      {/* When UI is hidden, controls can be restored by tapping the screen. */}

      {shouldShowInfo && (media.mediaType !== 'video' || controlsMounted) && (
        <Animated.View
          style={[
            infoContainerStyle,
            {
              opacity: controlsAnim,
              transform: [
                {
                  translateY: controlsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [6, 0],
                  }),
                },
              ],
            },
          ]}
          pointerEvents={controlsVisible ? 'auto' : 'none'}>
          {media.title && <Text style={styles.title}>{media.title}</Text>}
          {media.author && <Text style={styles.author}>by {media.author}</Text>}
          {media.description && (
            <View>
              {/** Protección: asegurar que description es un string y truncar si es demasiado largo */}
              {(() => {
                try {
                  const raw = media.description ?? '';
                  const descStr =
                    typeof raw === 'string' ? raw : JSON.stringify(raw);
                  // prevenir renders con textos extremadamente grandes
                  const safeDesc =
                    descStr.length > 20000 ? descStr.slice(0, 20000) : descStr;
                  const isLong = safeDesc.length > 15;

                  return (
                    <>
                      <Text style={styles.description}>
                        {isLong && !descriptionExpanded
                          ? `${safeDesc.slice(0, 15)}...`
                          : safeDesc}
                      </Text>

                      {isLong && (
                        <TouchableOpacity
                          onPress={() => {
                            try {
                              setDescriptionExpanded(prev => !prev);
                            } catch (err) {
                              console.log('toggle description error', err);
                              try {
                                Alert.alert('Error', String(err));
                              } catch (e) {}
                            }
                          }}
                          style={styles.toggleButton}>
                          <Text style={styles.toggleButtonText}>
                            {descriptionExpanded
                              ? t('common.seeLess')
                              : t('common.seeMore')}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </>
                  );
                } catch (renderErr) {
                  console.log('Description render error', renderErr);
                  return (
                    <Text style={styles.description}>
                      {' '}
                      {t('common.unavailable') ?? 'Información no disponible'}
                    </Text>
                  );
                }
              })()}
            </View>
          )}

          <View style={styles.labelRow}>
            {media.subcategory && (
              <View style={styles.firstLabel}>
                <Text style={styles.firstLabelText}>{media.subcategory}</Text>
              </View>
            )}
            {media.format && (
              <View style={styles.secondLabel}>
                <Text style={styles.secondLabelText}>{media.format}</Text>
              </View>
            )}
          </View>
        </Animated.View>
      )}

      <View style={styles.mediaWithInlineBar}>
        {media.mediaType === 'image' && (
          <Image
            source={{uri: media.uri}}
            style={styles.flexMedia}
            resizeMode="contain"
          />
        )}

        {media.mediaType === 'video' && (
          <>
            {/** contenedor que aplica rotación; estilo dinámico calculado fuera del JSX para evitar inline styles */}
            <View
              style={[
                videoContainerStyle,
                rotateVideo ? styles.rotatedInner : null,
              ]}>
              <Video
                ref={playerRef}
                source={{uri: media.uri}}
                style={[
                  styles.flexMedia,
                  styles.transparentVideo,
                  styles.videoWrapperFull,
                ]}
                resizeMode="contain"
                controls={false}
                onLoad={onLoadVideo}
                onError={(e: any) => {
                  console.log('Video error', e);
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
                    console.log('Video onError fallback failed', err);
                  }
                }}
                onBuffer={(b: any) => setIsBuffering(Boolean(b?.isBuffering))}
                onProgress={onProgress}
                onEnd={onEnd}
                paused={!isPlaying}
              />
            </View>

            {/* Overlay táctil: tap para mostrar/ocultar controles */}
            <TouchableOpacity
              style={styles.touchOverlay}
              activeOpacity={1}
              onPress={() => {
                if (controlsVisible) {
                  // hide
                  setControlsVisible(false);
                  hideControlsAnimated();
                } else {
                  // show
                  setControlsVisible(true);
                  showControlsAnimated();
                }
              }}
            />
          </>
        )}

        {media.mediaType === 'audio' && (
          <View style={styles.audioFullScreen}>
            <Video
              source={{uri: media.uri}}
              style={styles.audioHidden}
              paused={!isPlaying}
              onError={e => {
                console.log('Audio (Video) error', e);
                setAudioError(String(e || 'Audio error'));
              }}
            />
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
                  {audioError ? 'Error al cargar audio' : 'Paused'}
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
              {media.title ? (
                <Text style={styles.pdfHeaderTitle}>{media.title}</Text>
              ) : null}
              <TouchableOpacity
                style={[styles.externalButton, styles.externalButtonMb]}
                onPress={() =>
                  navigation.navigate('PdfViewer', {
                    uri: media.uri,
                    id: media.id,
                    title: media.title,
                  })
                }>
                <Text style={styles.externalButtonText}>
                  Abrir en pantalla PDF
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Progress / timeline */}
        {media.mediaType === 'video' && controlsMounted && (
          <Animated.View
            style={[
              styles.progressContainer,
              {
                opacity: controlsAnim,
                transform: [
                  {
                    translateY: controlsAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [6, 0],
                    }),
                  },
                ],
              },
            ]}
            pointerEvents={controlsVisible ? 'auto' : 'none'}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>

            <TouchableOpacity
              style={styles.progressTouchable}
              onLayout={e => setProgressWidth(e.nativeEvent.layout.width)}
              onPress={e => {
                try {
                  const x = e.nativeEvent.locationX;
                  const w = progressWidth || 1;
                  const ratio = Math.max(0, Math.min(1, x / w));
                  const sec = (duration || 0) * ratio;
                  seekTo(sec);
                } catch (err) {
                  console.log('progress seek error', err);
                }
              }}>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${
                        duration > 0 ? (currentTime / duration) * 100 : 0
                      }%`,
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>

            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </Animated.View>
        )}

        {/* Center-bottom control icons (rotate + hide) placed above progress */}
        {media.mediaType === 'video' && controlsMounted && (
          <Animated.View
            style={[
              styles.bottomCenterControls,
              {
                opacity: controlsAnim,
                transform: [
                  {
                    translateY: controlsAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [6, 0],
                    }),
                  },
                ],
              },
            ]}
            pointerEvents={controlsVisible ? 'auto' : 'none'}>
            <View style={styles.centerControlsRow}>
              {isLandscapeVideo && (
                <TouchableOpacity
                  style={styles.smallIconButton}
                  onPress={() => setRotateVideo(prev => !prev)}>
                  <RotateCw size={18} color="#FFFFFF" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.smallIconButton, styles.playButtonSpacing]}
                onPress={togglePlayback}>
                {isBuffering ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : isPlaying ? (
                  <PauseCircle size={20} color="#FFFFFF" />
                ) : (
                  <PlayCircle size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.smallIconButton}
                onPress={() => {
                  setControlsVisible(false);
                  hideControlsAnimated();
                }}>
                <Eye size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Floating right column for like + comment */}
        <Animated.View
          style={[
            styles.floatingRightColumn,
            {
              top: floatTop,
              opacity: controlsAnim,
              transform: [
                {
                  translateY: controlsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [6, 0],
                  }),
                },
              ],
            },
          ]}
          pointerEvents={controlsVisible ? 'box-none' : 'none'}>
          <TouchableOpacity
            style={[
              styles.floatingButton,
              shouldHideControls ? styles.hidden : null,
            ]}
            onPress={() => {
              setLiked(prev => !prev);
              setLocalLikes(prev =>
                prev !== null ? (liked ? prev - 1 : prev + 1) : prev,
              );
            }}
            disabled={shouldHideControls}
            activeOpacity={0.8}>
            <Heart
              color={liked ? '#FF4F4F' : '#fff'}
              size={20}
              strokeWidth={3}
            />
            <Text style={styles.floatingLabel}>{localLikes ?? '–'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.floatingButton,
              shouldHideControls ? styles.hidden : null,
            ]}
            onPress={() => console.log('Comment')}
            disabled={shouldHideControls}
            activeOpacity={0.8}>
            <MessageCircle color="#fff" size={20} strokeWidth={3} />
            <Text style={styles.floatingLabel}>{media.comments ?? '–'}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    position: 'relative',
  },
  closeButton: {position: 'absolute', top: 40, right: 20, zIndex: 10},
  closeAnimatedWrapper: {position: 'absolute', top: 40, right: 20, zIndex: 10},
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
  labelRow: {flexDirection: 'row', gap: 10, marginTop: 4},
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
  flexMedia: {flex: 1, width: '100%'},
  transparentVideo: {backgroundColor: 'transparent'},
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
  hidden: {opacity: 0},
  visible: {opacity: 1},
  pdfFullScreen: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfHeaderContainer: {alignItems: 'center', padding: 20},
  pdfHeaderTitle: {
    fontSize: 20,
    fontFamily: 'AnonymousPro-Bold',
    color: '#FFF',
    marginBottom: 8,
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
  externalButtonMb: {marginBottom: 8},
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

  controlButton: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 12,
  },

  audioHidden: {width: 0, height: 0},
  videoWrapperFull: {width: '100%', height: '100%'},
  rotatedInner: {justifyContent: 'center', alignItems: 'center'},
  floatingRightColumn: {
    position: 'absolute',
    right: 12,
    bottom: 80,
    zIndex: 40,
    alignItems: 'center',
  },
  floatingButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 28,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  floatingLabel: {
    color: '#FFFFFF',
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
  bottomCenterControls: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 35,
    alignItems: 'center',
    bottom: 72,
  },
  centerLargeControl: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
    backgroundColor: 'transparent',
  },
  centerPlayButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  bufferIndicator: {
    marginTop: 12,
  },
  centerControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'transparent',
  },
  smallIconButton: {
    width: 46,
    height: 46,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonSpacing: {marginHorizontal: 6},
  smallIconText: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 20,
  },
  progressContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 36,
    zIndex: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#FFFFFF',
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 12,
    width: 44,
    textAlign: 'center',
  },
  progressTouchable: {
    flex: 1,
    marginHorizontal: 8,
  },
  progressBarBackground: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    backgroundColor: '#FF4F4F',
    borderRadius: 6,
  },
  touchOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 5,
  },
});
