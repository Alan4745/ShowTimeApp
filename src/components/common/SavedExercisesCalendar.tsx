import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Calendar from '../common/Calendar';
import LessonCard from './LessonCard';
import MediaViewerModal from '../modals/MediaViewerModal';
import {buildMediaUrl} from '../../utils/urlHelpers';
import {fetchWithTimeout} from '../../utils/fetchWithTimeout';

type MediaItem = {
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
};

type SavedLesson = {
  id: string;
  title: string;
  author: string;
  description: string;
  subcategory?: string;
  format?: string;
  mediaType: 'image' | 'video' | 'audio';
  mediaUrl: string;
  thumbnail?: string;
  likes?: number;
  comments?: number;
  date: string;
  time: string;
  eventId: number;
};

type MarkedDate = {
  selected: boolean;
  selectedColor?: string;
  selectedTextColor?: string;
};

type MarkedDates = {
  [date: string]: MarkedDate;
};

export default function SavedExercisesCalendar() {
  const {t, i18n} = useTranslation();
  const cardHeight = 150;
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [savedLessons, setSavedLessons] = useState<SavedLesson[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetchWithTimeout('/api/v1/calendar/events');
        if (!res.ok) {
          console.error('Error al cargar eventos');
          return;
        }
        const data = await res.json();
        const events = data.events;

        // Marcar fechas en calendario
        const marks: MarkedDates = {};
        events.forEach(e => {
          marks[e.event_date] = {
            selected: true,
            selectedColor: '#2B80BE',
            selectedTextColor: '#FFFFFF',
          };
        });
        setMarkedDates(marks);

        // Traer info completa de cada lección
        const lessonsWithDetails: SavedLesson[] = [];
        for (const e of events) {
          try {
            console.log('====================================');
            console.log(e.lesson);
            console.log('====================================');
            const lessonRes = await fetchWithTimeout(
              `/api/v1/lessons/${e.lesson}`,
            );
            if (!lessonRes.ok) continue;
            const lessonData = await lessonRes.json();
            lessonsWithDetails.push({
              id: lessonData.id.toString(),
              title: lessonData.title,
              author: lessonData.author,
              description: lessonData.description,
              subcategory: lessonData.subcategory,
              format: lessonData.format,
              mediaType: lessonData.mediaType,
              mediaUrl: lessonData.media_file || lessonData.mediaUrl,
              thumbnail: lessonData.thumbnail,
              likes: lessonData.likes,
              comments: lessonData.comments,
              date: e.event_date,
              time: e.event_time,
              eventId: e.id,
            });
          } catch (err) {
            console.error('Error al cargar lección', err);
          }
        }
        setSavedLessons(lessonsWithDetails);
      } catch (err) {
        console.error('Error al cargar eventos', err);
      }
    };

    fetchEvents();
  }, []);

  const getFormattedDateParts = (dateString: string) => {
    const date = new Date(dateString);
    return {
      year: date.getFullYear(),
      monthDay: new Intl.DateTimeFormat(i18n.language, {
        month: 'short',
        day: 'numeric',
      }).format(date),
    };
  };

  const handleDelete = async (eventId: number) => {
    try {
      const res = await fetchWithTimeout(
        `/api/v1/calendar/events/${eventId}/`,
        {
          method: 'DELETE',
        },
      );
      if (!res.ok) {
        Alert.alert('Error', 'No se pudo eliminar el evento');
        return;
      }
      // Actualizar estado
      const lessonToRemove = savedLessons.find(l => l.eventId === eventId);
      if (!lessonToRemove) return;

      setSavedLessons(prev => prev.filter(l => l.eventId !== eventId));
      const updatedMarks = {...markedDates};
      delete updatedMarks[lessonToRemove.date];
      setMarkedDates(updatedMarks);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Ocurrió un error al eliminar el evento');
    }
  };

  return (
    <View style={styles.container}>
      <Calendar markedDates={markedDates} />

      {savedLessons.length > 0 ? (
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={styles.lessonScroll}
          showsHorizontalScrollIndicator={false}>
          {savedLessons.map(lesson => {
            const {year, monthDay} = getFormattedDateParts(lesson.date);

            return (
              <View
                key={lesson.eventId}
                style={[styles.lessonRow, {height: cardHeight}]}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.lessonRow,
                    {paddingRight: 70},
                  ]}>
                  <LessonCard
                    {...lesson}
                    cardHeight={cardHeight}
                    onOpenMedia={media => {
                      setSelectedMedia({
                        id: lesson.id,
                        mediaType: lesson.mediaType,
                        uri: buildMediaUrl(lesson.mediaUrl),
                        title: lesson.title,
                        author: lesson.author,
                        description: lesson.description,
                        subcategory: lesson.subcategory,
                        format: lesson.format,
                        likes: lesson.likes,
                        comments: lesson.comments,
                      });
                      setModalVisible(true);
                    }}
                  />

                  <View style={styles.dateTimeContainer}>
                    <View style={styles.dateBox}>
                      <Text style={styles.dateText}>{year}</Text>
                      <Text style={styles.dateText}>{monthDay}</Text>
                    </View>
                    <View style={styles.timeBox}>
                      <Text style={styles.timeText}>{lesson.time}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.deleteBox}
                    onPress={() => handleDelete(lesson.eventId)}>
                    <Text style={styles.deleteX}>X</Text>
                    <Text style={styles.deleteLabel}>{t('common.delete')}</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <Text style={styles.noLessonsText}>
          {t('account.titles.noSavedLessons')}
        </Text>
      )}

      <MediaViewerModal
        visible={modalVisible}
        media={selectedMedia}
        onClose={() => {
          setModalVisible(false);
          setSelectedMedia(null);
        }}
        showInfo
        likesCount={selectedMedia?.likes}
        commentsCount={selectedMedia?.comments}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  lessonScroll: {
    gap: 15,
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 60,
  },
  lessonRow: {
    flexDirection: 'row',
    borderRadius: 10,
    gap: 10,
  },
  dateTimeContainer: {
    height: '100%',
    width: '15%',
  },
  dateBox: {
    height: '55%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2B80BE',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
  },
  dateText: {
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
  },
  timeBox: {
    height: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  },
  timeText: {
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    fontSize: 12,
    color: '#000000',
  },
  deleteBox: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#CC0033',
    borderRadius: 10,
  },
  deleteX: {
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  deleteLabel: {
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    fontSize: 10,
    color: '#FFFFFF',
  },
  noLessonsText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    fontSize: 22,
    color: '#FFFFFF',
    alignSelf: 'center',
    marginTop: 35,
  },
});
