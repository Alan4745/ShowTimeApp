import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, SlidersHorizontal } from 'lucide-react-native';
import LessonCard from '../components/common/LessonCard';
import MediaViewerModal from '../components/modals/MediaViewerModal';
import FilterModal from '../components/modals/filterModal';
import lessons from '../data/lessons.json';

interface LearnCategoryScreenProps {
    title: string;
    onBack: () => void;
    onOpenCalendar: (lessonId: string) => void
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
};

export default function LearnCategoryScreen({ title, onBack, onOpenCalendar} : LearnCategoryScreenProps) {
  const {t} = useTranslation();
  const [mediaViewerVisible, setMediaViewerVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filteredLessons, setFilteredLessons] = useState(lessons);  

  const handleOpenMedia = (media: MediaItem) => {
    setSelectedMedia(media);
    setMediaViewerVisible(true);    
  };

  const handleCloseMedia = () => {
    setSelectedMedia(null);
    setMediaViewerVisible(false);
  };

  // Función para aplicar filtros
  const applyFilters = (filters: {
    subcategory?: string;
    format?: string;
    sortByName?: 'asc' | 'desc';
  }) => {
    let updated = [...lessons];

    if (filters.subcategory) {
      updated = updated.filter(l => l.subcategory === filters.subcategory);
    }

    if (filters.format) {
      updated = updated.filter(l => l.format?.toLowerCase() === filters.format!.toLowerCase());
    }

    if (filters.sortByName) {
      updated.sort((a, b) => {
        if (!a.author || !b.author) return 0;
        return filters.sortByName === 'asc'
          ? a.author.localeCompare(b.author)
          : b.author.localeCompare(a.author);
      });
    }

    setFilteredLessons(updated);
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setFilteredLessons(lessons);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft color="#FFFFFF" size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Filter Button */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
          <Text style={styles.filterText}>{t("learn.filter")}</Text>
          <SlidersHorizontal size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Media list */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredLessons.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>{t("learn.noLessons")}</Text>
          </View>
        ) : (
          filteredLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              id={lesson.id}
              title={lesson.title}
              author={lesson.author}
              description={lesson.description}
              subcategory={lesson.subcategory}
              format={lesson.format}
              mediaType={lesson.mediaType as any}
              mediaUrl={lesson.mediaUrl}
              onOpenMedia = {() =>
                handleOpenMedia({
                  id: lesson.id,
                  mediaType: lesson.mediaType as 'image' | 'video' | 'audio',
                  uri: lesson.mediaUrl,
                  title: lesson.title,
                  author: lesson.author,
                  description: lesson.description,
                  subcategory: lesson.subcategory,
                  format: lesson.format,
                  likes: lesson.likes,
                  comments: lesson.comments,
              })}            
            />  
          ))
        )}       
      </ScrollView>
      
      {/* Modal para imagen/video */}
      <MediaViewerModal
        visible={mediaViewerVisible}
        media={selectedMedia}
        onClose={handleCloseMedia}  
        showInfo={true} 
        likesCount={selectedMedia?.likes ?? 0}
        commentsCount={selectedMedia?.comments ?? 0} 
        onBookmarkPress={() => {
          if (selectedMedia?.id) {
            setTimeout(()=>handleCloseMedia()); // cerrar el modal
            onOpenCalendar(selectedMedia.id);            
          }
        }}         
      />  

      {/* Modal para filtrar */}  
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={applyFilters}
        onClear={clearFilters}
      />     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',        
  },
  header: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: -6, 
    padding: 8,
    zIndex: 10,
  },
  title: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 26,
    color: '#fff',
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 20,        
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',    
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 20,
    minWidth: 110,   
    justifyContent: "center",
    textAlignVertical: "center"
  },
  filterText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: "700",
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 8,
  },
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  noResultsText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: "700",
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
    opacity: 0.7,
  },
});