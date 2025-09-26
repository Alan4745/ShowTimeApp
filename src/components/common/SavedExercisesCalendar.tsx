import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Calendar from '../common/Calendar';
import LessonCard from './LessonCard';
import MediaViewerModal from '../modals/MediaViewerModal';
import lessons from '../../data/lessons.json'

type Lesson = {
  id: string;
  title: string;
  author: string;
  description: string;
  subcategory?: string;
  format?: string;
  mediaType: 'image' | 'video' | 'audio';
  mediaUrl: string;
  thumbnailUrl?: string;
  likes?: number;
  comments?: number;
};

type SavedLesson = Lesson & {
  date: string;
  time: string;
}

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
}

type MarkedDate = {
  selected: boolean;
  selectedColor?: string;
  selectedTextColor?: string;
};

type MarkedDates = {
  [date: string]: MarkedDate;
};

// Simulación de datos guardados
const savedExercises = [
  { id: '1', date: '2025-09-05', time: "3:30 PM", lessonId: 'lesson-001' },
  { id: '2', date: '2025-09-10', time: "10:15 AM", lessonId: 'lesson-003' },  
];

export default function SavedExercisesCalendar() {
  const { t, i18n } = useTranslation();  
  const cardHeight = 150; //comprime el alto de la tarjeta de lecciones
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [savedLessons, setSavedLessons] = useState<SavedLesson[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  
  useEffect(() => {
    // Marcar en calendario fechas guardadas.
    const marks: any = {};
    savedExercises.forEach((exercise) => {
      marks[exercise.date] = {
        selected: true,
        selectedColor: '#2B80BE',
        selectedTextColor: '#FFFFFF',
      };
    });
    setMarkedDates(marks);

    // Obtener las lecciones asociadas a las fechas
      const filteredLessons: SavedLesson[] = lessons
        .filter((lesson) => savedExercises.some((e) => e.lessonId === lesson.id))
        .map((lesson) => {
          const exercise = savedExercises.find((e) => e.lessonId === lesson.id);
          return {
            ...lesson,
            mediaType: lesson.mediaType as 'image' | 'video' | 'audio',
            date: exercise?.date ?? '',
            time: exercise?.time ?? '',
          };
        });

      setSavedLessons(filteredLessons);
  }, []);

  // Cambia el formato de fecha para mostrarlo
  const getFormattedDateParts = (dateString: string) => {
    const date = new Date(dateString);
    return {
      year: date.getFullYear(),
      monthDay: new Intl.DateTimeFormat(i18n.language, {
        month: 'short',
        day: 'numeric',
      }).format(date), // Ej: "10 oct" o "Oct 10" según idioma
    };
  };

  // Maneja el botón para borrar lecciones
  const handleDelete = (lessonIdToRemove: string) => {
    // 1. Buscar la lección a eliminar
    const lessonToRemove = savedLessons.find(l => l.id === lessonIdToRemove);
    if (!lessonToRemove) return;

    // 2. Filtrar lecciones para quitar la que eliminamos
    const updatedLessons = savedLessons.filter(lesson => lesson.id !== lessonIdToRemove);
    setSavedLessons(updatedLessons);

    // 3. Eliminar la fecha del calendario
    const updatedMarkedDates = { ...markedDates };
    delete updatedMarkedDates[lessonToRemove.date]; // quitar la marca por la fecha
    setMarkedDates(updatedMarkedDates);    
  };

  return (
    <View style = {styles.container}>      
      <Calendar markedDates={markedDates} />
      {savedLessons.length > 0 ? (
        <ScrollView
          style = {{flex: 1}}
          contentContainerStyle={styles.lessonScroll}
          showsHorizontalScrollIndicator={false}
        >
          {savedLessons.map((lesson) => {
            const { year, monthDay } = getFormattedDateParts(lesson.date);

            return (
              <View key={lesson.id} style={[styles.lessonRow, { height: cardHeight }]}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={[styles.lessonRow, {paddingRight: 70}]}
                >
                  <LessonCard
                    {...lesson}
                    cardHeight={cardHeight}
                    onOpenMedia={(media) => {
                      setSelectedMedia({
                        id: lesson.id,
                        mediaType: lesson.mediaType,    
                        uri: lesson.mediaUrl,
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

                  {/* Fecha y hora formateadas */}
                  <View style={styles.dateTimeContainer}>
                    <View style={styles.dateBox}>
                      <Text style={styles.dateText}>{year}</Text>
                      <Text style={styles.dateText}>{monthDay}</Text>
                    </View>
                    <View style={styles.timeBox}>
                      <Text style={styles.timeText}>{lesson.time}</Text>
                    </View>
                  </View>

                  {/* Botón de eliminar */}
                  <TouchableOpacity
                    style={styles.deleteBox}
                    onPress={() => handleDelete(lesson.id)}
                  >
                    <Text style={styles.deleteX}>X</Text>
                    <Text style={styles.deleteLabel}>{t('common.delete')}</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            );
          })}
        </ScrollView>):(
          <Text style={styles.noLessonsText}>{t('account.titles.noSavedLessons')}</Text>
      )}
      
      <MediaViewerModal
          visible={modalVisible}
          media={selectedMedia}
          onClose={() => {
            setModalVisible(false);
            setSelectedMedia(null);
          }}
          showInfo={true}
          likesCount={selectedMedia?.likes}
          commentsCount={selectedMedia?.comments}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    paddingHorizontal: 16,
  },
  lessonScroll: {
    gap: 15,
    alignItems: "center",
    marginTop: 20,
    paddingBottom: 60
  },
  lessonRow: {
    flexDirection: "row",            
    borderRadius: 10,    
    gap: 10,
  },
  dateTimeContainer:{
    height: "100%",
    width: "15%",    
  }, 
  dateBox: {
    height: "55%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2B80BE",  
    borderTopEndRadius: 10,
    borderTopStartRadius: 10, 
  },
  dateText: {
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    fontSize: 12,
    color: "#FFFFFF",
  },
  timeBox:{
    height: "45%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF", 
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10, 
  },
  timeText: {
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    fontSize: 12,
    color: "#000000",    
  },
  deleteBox: {  
    width: "15%",   
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#CC0033",
    borderRadius: 10,
  },
  deleteX: {
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    fontSize: 24,
    color: "#FFFFFF",   
    marginBottom: 5,
  },
  deleteLabel: {
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    fontSize: 10,
    color: "#FFFFFF",    
  },
  noLessonsText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 22,
    color: "#FFFFFF",
    alignSelf: "center",
    marginTop: 35,
  },
});
