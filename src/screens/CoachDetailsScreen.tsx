import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../context/AuthContext';
import {ChevronUp} from 'lucide-react-native';
import {ArrowLeft} from 'lucide-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createThumbnail} from 'react-native-create-thumbnail';
import {PlayCircle} from 'lucide-react-native';
import {buildMediaUrl} from '../utils/urlHelpers';
import {fetchWithTimeout} from '../utils/fetchWithTimeout';
import AppHeaderNew from '../components/common/AppHeaderNew';
import LessonCard from '../components/common/LessonCard';
import TestimonialCard from '../components/common/TestimonialCard';
import HelperText from '../components/common/HelperText';
import PopupAlert from '../components/modals/PopupAlert';
import MediaViewerModal from '../components/modals/MediaViewerModal';

interface CoachDetailsScreenProps {
  route: any;
}

export default function CoachDetailsScreen({route}: CoachDetailsScreenProps) {
  const {t} = useTranslation();
  const {user} = useAuth();
  const {coach} = route.params;
  const insets = useSafeAreaInsets();
  const [showAccomplishments, setShowAccomplishments] = useState(true);
  const [showLessons, setShowLessons] = useState(true);
  const [showTestimonials, setShowTestimonials] = useState(true);
  const [showCoachError, setShowCoachError] = useState(true);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [lessonsError, setLessonsError] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const navigate = useNavigation();

  // Descargar las lecciones desde el backend
  useEffect(() => {
    const fetchCoachLessons = async () => {
      if (!coach.id) {
        return;
      }
      setLoadingLessons(true);
      setLessonsError(null);
      try {
        const response = await fetchWithTimeout(
          `/api/v1/coaches/${coach.id}/lessons`,
        );
        if (!response.ok) {
          throw new Error('Error al obtener las lecciones');
        }
        const data = await response.json();
        setLessons(data.lessons || []);
      } catch (error: any) {
        console.error('Error cargando lecciones:', error);
        setLessonsError(error.message);
      } finally {
        setLoadingLessons(false);
      }
    };

    fetchCoachLessons();
  }, [coach.id]);

  // Procesar la URL del coach (decodificar si viene codificada)
  const getProcessedMediaUrl = useCallback(() => {
    let mediaUrl = coach?.coachMediaFile || '';

    // Si la URL viene codificada por el backend, decodificarla
    if (mediaUrl.includes('https%3A') || mediaUrl.includes('http%3A')) {
      mediaUrl = decodeURIComponent(mediaUrl.replace(/^\/?media\/?/, ''));
    } else if (mediaUrl && !mediaUrl.startsWith('http')) {
      // Si es una ruta relativa, usar buildMediaUrl
      mediaUrl = buildMediaUrl(mediaUrl);
    }

    return mediaUrl;
  }, [coach?.coachMediaFile]);

  // Genera thumbnail automáticamente
  useEffect(() => {
    // Validar que coachMediaFile exista y sea un video
    if (
      !coach?.coachMediaFile ||
      typeof coach.coachMediaFile !== 'string' ||
      !coach.coachMediaFile.endsWith('.mp4')
    ) {
      return;
    }

    const videoUrl = getProcessedMediaUrl();

    // Validar que la URL procesada sea válida
    if (!videoUrl || videoUrl === '') {
      console.warn('URL de video inválida para thumbnail');
      return;
    }

    createThumbnail({url: videoUrl})
      .then(response => setThumbnail(response.path))
      .catch(err => {
        console.warn('Error generando thumbnail:', err);
        setThumbnail(null);
      });
  }, [coach, getProcessedMediaUrl]);

  // Muestra una alerta si coach no existe
  if (!coach) {
    return (
      <View style={styles.container}>
        <PopupAlert
          visible={showCoachError}
          message={t('errors.coachNotFound')}
          onClose={() => {
            setShowCoachError(false);
            (navigate as any).goBack();
          }}
        />
      </View>
    );
  }

  const handlePlanPress = () => {
    (navigate as any).navigate('SubscribeElite');
  };

  const handleLessonPress = (lesson: any) => {
    setSelectedLesson(lesson);
    setShowLessonModal(true);
  };

  return (
    <View style={styles.container}>
      <AppHeaderNew userAvatar={buildMediaUrl(user?.studentProfileImage)} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View
          style={[styles.topBar, {paddingTop: insets.top ? insets.top : 0}]}>
          <TouchableOpacity
            accessibilityLabel="back-button"
            onPress={() => (navigate as any).goBack()}
            style={styles.backButton}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <ArrowLeft color="#FFFFFF" size={22} />
          </TouchableOpacity>
        </View>
        {/* IMAGEN O VIDEO */}
        <View style={styles.imageContainer}>
          {coach.coachMediaFile ? (
            coach.coachMediaFile.endsWith('.mp4') ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowVideoModal(true)}
                style={styles.videoContainer}>
                <Image
                  source={{
                    uri: thumbnail || getProcessedMediaUrl(),
                  }}
                  style={styles.imageTop}
                  resizeMode="cover"
                />
                <View style={styles.playButtonOverlay}>
                  <PlayCircle color="#FFF" size={72} />
                </View>
              </TouchableOpacity>
            ) : (
              <Image
                source={{uri: getProcessedMediaUrl()}}
                style={styles.imageTop}
                resizeMode="cover"
              />
            )
          ) : (
            <View style={[styles.imageTop, styles.noImageContainer]}>
              <Text style={styles.noImageText}>
                {t('coachDetails.noImage')}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.contentBottom}>
          {/*TITULO Y NOMBRE*/}
          {coach.username && <Text style={styles.name}>{coach.username}</Text>}

          <View style={styles.overlayContainer}>
            {/*ETIQUETAS*/}
            <View style={styles.overlayTagContainer}>
              <View style={styles.roleTag}>
                <Text style={styles.roleText}>{coach.role}</Text>
              </View>
              <View style={styles.coachingRoleTag}>
                <Text style={styles.coachingRoleText}>
                  {coach.coachingRole}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.subscribeButton}>
              <Text style={styles.subscribeText}>{t('common.subscribe')}</Text>
            </TouchableOpacity>
          </View>

          {/*DESCRIPCION*/}
          {coach.coachBiography && (
            <Text style={styles.description}>{coach.coachBiography}</Text>
          )}

          {/*ACCOMPLISHMENTS*/}
          <TouchableOpacity
            onPress={() => setShowAccomplishments(prev => !prev)}
            style={styles.accordionHeader}>
            <Text style={styles.accordionTitle}>
              {t('coachDetails.myAccomplishments')}
            </Text>
            <ChevronUp
              color="#FFFFFF"
              size={24}
              style={{
                transform: [{rotate: showAccomplishments ? '0deg' : '180deg'}],
              }}
            />
          </TouchableOpacity>
          {showAccomplishments && (
            <View style={styles.accompContainer}>
              {coach.coachAchievements && coach.coachAchievements.length > 0 ? (
                <View style={styles.accompList}>
                  {coach.coachAchievements.map(
                    (item: string, index: number) => (
                      <View key={index} style={styles.accomplishmentBox}>
                        <Text style={styles.accomplishmentText}>{item}</Text>
                      </View>
                    ),
                  )}
                </View>
              ) : (
                <Text style={styles.emptyStateText}>
                  {t('coachDetails.noAccomplishments')}
                </Text>
              )}
            </View>
          )}

          {/*LESSONS*/}
          <TouchableOpacity
            onPress={() => setShowLessons(prev => !prev)}
            style={styles.accordionHeader}>
            <Text style={styles.accordionTitle}>
              {t('coachDetails.lessons')}
            </Text>
            <ChevronUp
              color="#FFFFFF"
              size={24}
              style={{transform: [{rotate: showLessons ? '0deg' : '180deg'}]}}
            />
          </TouchableOpacity>
          {showLessons && (
            <View style={styles.lessonsContainer}>
              {loadingLessons ? (
                <Text style={styles.loadingText}>{t('common.loading')}...</Text>
              ) : lessonsError ? (
                <Text style={styles.errorText}>
                  {t('errors.loadLessonsError')}
                </Text>
              ) : lessons.length > 0 ? (
                <View style={styles.lessonsList}>
                  {lessons.map(lesson => (
                    <LessonCard
                      key={lesson.id}
                      id={lesson.id}
                      title={lesson.title || 'Sin título'}
                      author={lesson.author || 'Coach'}
                      description={lesson.description || ''}
                      subcategory={lesson.subcategory || ''}
                      format={lesson.format || 'Video'}
                      mediaUrl={lesson.mediaUrl || ''}
                      mediaType={lesson.mediaType || 'video'}
                      cardHeight={220}
                      thumbnailUrl={lesson.thumbnail || ''}
                      onOpenMedia={() => handleLessonPress(lesson)}
                    />
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyStateText}>
                  {t('coachDetails.noLessons')}
                </Text>
              )}
            </View>
          )}

          {/*TESTIMONIALS*/}
          <TouchableOpacity
            onPress={() => setShowTestimonials(prev => !prev)}
            style={styles.accordionHeader}>
            <Text style={styles.accordionTitle}>
              {t('coachDetails.testimonials')}
            </Text>
            <ChevronUp
              color="#FFFFFF"
              size={24}
              style={{
                transform: [{rotate: showTestimonials ? '0deg' : '180deg'}],
              }}
            />
          </TouchableOpacity>
          {showTestimonials && (
            <View style={styles.lessonsContainer}>
              {coach.testimonials && coach.testimonials.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.testimonialsScroll}>
                  {coach.testimonials.map((testimonial: any) => (
                    <View key={testimonial.id} style={styles.testimonialCard}>
                      <TestimonialCard
                        avatar={testimonial.avatar}
                        name={testimonial.username}
                        rating={testimonial.rating}
                        message={testimonial.message}
                        timeSincePost={testimonial.timeSincePost}
                      />
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <Text style={styles.emptyStateText}>
                  {t('coachDetails.noTestimonials')}
                </Text>
              )}
            </View>
          )}
        </View>

        {/*CHAT BUTTON*/}
        <View style={styles.planContainer}>
          <TouchableOpacity style={styles.planButton} onPress={handlePlanPress}>
            <Text style={styles.planButtonText}>
              {t('coachDetails.letsChat')}
            </Text>
          </TouchableOpacity>
          <View style={styles.helperTextContainer}>
            <HelperText
              text={t('helperTexts.coachHelperText')}
              style={styles.helperTextStyle}
            />
          </View>
        </View>
      </ScrollView>
      {/* Modal de reproducción del coach */}
      <MediaViewerModal
        visible={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        media={{
          id: coach.id?.toString() || '0',
          mediaType: 'video',
          uri: getProcessedMediaUrl(),
          title: coach.username || 'Coach',
          description: coach.coachBiography || '',
        }}
        showInfo={true}
      />

      {/* Modal de reproducción de lecciones */}
      {selectedLesson && (
        <MediaViewerModal
          visible={showLessonModal}
          onClose={() => {
            setShowLessonModal(false);
            setSelectedLesson(null);
          }}
          media={{
            id: selectedLesson.id || '0',
            mediaType: selectedLesson.mediaType || 'video',
            uri: selectedLesson.mediaUrl || '',
            title: selectedLesson.title || 'Lección',
            description: selectedLesson.description || '',
          }}
          showInfo={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingBottom: 30,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  backButton: {
    position: 'absolute',
    left: 12,
    top: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    width: '100%',
    height: 318,
  },
  imageTop: {
    width: '100%',
    height: '100%',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 10,
  },
  contentBottom: {
    padding: 10,
  },
  name: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 10,
  },
  overlayContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 35,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    rowGap: 8,
  },
  overlayTagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    rowGap: 8,
  },
  roleTag: {
    backgroundColor: '#2B80BE',
    borderWidth: 1.5,
    minWidth: 80,
    height: 35,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  coachingRoleTag: {
    borderColor: '#FFFFFF',
    borderWidth: 1.5,
    minWidth: 80,
    height: 35,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontFamily: 'AnonymousPro-Regular',
  },
  coachingRoleText: {
    color: '#FFFFFF',
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontFamily: 'AnonymousPro-Regular',
  },
  subscribeButton: {
    width: 120,
    height: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 124,
  },
  subscribeText: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 16,
    fontWeight: '700',
    color: '#2B80BE',
  },
  description: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    marginVertical: 8,
    lineHeight: 22,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  accordionTitle: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  videoContainer: {
    position: 'relative',
  },
  noImageContainer: {
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#aaa',
  },
  emptyStateText: {
    textAlign: 'center',
    marginTop: 15,
    color: '#2B80BE',
    fontSize: 18,
  },
  loadingText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  testimonialsScroll: {
    paddingVertical: 10,
  },
  testimonialCard: {
    marginRight: 16,
  },
  planContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  helperTextContainer: {
    width: 270,
  },
  helperTextStyle: {
    fontSize: 14,
  },
  accompContainer: {
    marginBottom: 5,
  },
  accompList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  accomplishmentBox: {
    borderColor: '#FFFFFF',
    borderWidth: 1.5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accomplishmentText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
  },
  lessonsContainer: {
    marginBottom: 5,
  },
  lessonsList: {
    marginTop: 10,
  },
  lessonItem: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'AnonymousPro-Regular',
    marginBottom: 6,
    lineHeight: 20,
  },
  planButton: {
    width: 294,
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 37,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  planButtonText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    fontSize: 18,
    color: '#2B80BE',
  },
});
