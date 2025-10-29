import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, SlidersHorizontal } from 'lucide-react-native';
import LessonCard from '../components/common/LessonCard';
import MediaViewerModal from '../components/modals/MediaViewerModal';
import FilterModal from '../components/modals/filterModal';
import { fetchWithTimeout } from '../utils/fetchWithTimeout';

interface LearnCategoryScreenProps {
  title: string;
  categoryKey: string;
  subcategoryKey: string;
  onBack: () => void;
  onOpenCalendar: (lessonId: string) => void;
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

type LessonFromAPI = MediaItem & {};

export default function LearnCategoryScreen({
  title,
  categoryKey,
  subcategoryKey,
  onBack,
  onOpenCalendar,
}: LearnCategoryScreenProps) {
  const { t } = useTranslation();
  const [mediaViewerVisible, setMediaViewerVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [lessonsFromCoach, setLessonsFromCoach] = useState<LessonFromAPI[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<LessonFromAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const res = await fetchWithTimeout('/api/v1/coaches/5/lessons');
        if (!res.ok) throw new Error('Error fetching lessons');
        const data = await res.json();
        setLessonsFromCoach(data.lessons);
        setFilteredLessons(data.lessons);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  const handleOpenMedia = (media: MediaItem) => {
    setSelectedMedia(media);
    setMediaViewerVisible(true);    
  };

  const handleCloseMedia = () => {
    setSelectedMedia(null);
    setMediaViewerVisible(false);
  };

  const applyFilters = (filters: { format?: string; sortByName?: 'asc' | 'desc' }) => {
    let updated = [...lessonsFromCoach];
    if (filters.format) updated = updated.filter(l => l.format?.toLowerCase() === filters.format!.toLowerCase());
    if (filters.sortByName) updated.sort((a, b) => {
      if (!a.author || !b.author) return 0;
      return filters.sortByName === 'asc' ? a.author.localeCompare(b.author) : b.author.localeCompare(a.author);
    });
    setFilteredLessons(updated);
  };

  const clearFilters = () => setFilteredLessons(lessonsFromCoach);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2B80BE" />
      </View>
    );
  }

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
              onOpenMedia={() =>
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
                })
              }
            />
          ))
        )}
      </ScrollView>

      {/* Media Modal */}
      <MediaViewerModal
        visible={mediaViewerVisible}
        media={selectedMedia}
        onClose={handleCloseMedia}  
        showInfo={true} 
        likesCount={selectedMedia?.likes ?? 0}
        commentsCount={selectedMedia?.comments ?? 0} 
        onBookmarkPress={() => {
          if (selectedMedia?.id) {
            setTimeout(() => handleCloseMedia());
            onOpenCalendar(selectedMedia.id);
          }
        }}         
      />

      {/* Filter Modal */}  
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
    paddingHorizontal: 10,
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