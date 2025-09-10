import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import LessonCard from '../components/common/LessonCard';
import MediaViewerModal from '../components/modals/MediaViewerModal';
import lessons from '../data/lessons.json';

interface LearnCategoryScreenProps {
    title: string;
    onBack: () => void;
}

type MediaItem = {
  type: 'image' | 'video' | 'audio';
  uri: string;
  title?: string;
  author?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
};

export default function LearnCategoryScreen({ title, onBack} : LearnCategoryScreenProps) {
  const [mediaViewerVisible, setMediaViewerVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const handleOpenMedia = (media: MediaItem) => {
    setSelectedMedia(media);
    setMediaViewerVisible(true);
  };

  const handleCloseMedia = () => {
    setSelectedMedia(null);
    setMediaViewerVisible(false);
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

      {/* Media list */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {lessons.map((lesson, index) => (
          <LessonCard
            key={index}
            title={lesson.title}
            author={lesson.author}
            description={lesson.description}
            primaryLabel={lesson.tag1}
            secondaryLabel={lesson.tag2}
            mediaType={lesson.mediaType as any}
            mediaUrl={lesson.mediaUrl}
            onOpenMedia = {handleOpenMedia}
            // Puedes agregar labels si los tienes en el JSON
          />
        ))}
      </ScrollView>
      
      {/* Modal para imagen/video */}
      <MediaViewerModal
        visible={mediaViewerVisible}
        media={selectedMedia}
        onClose={handleCloseMedia}  
        showInfo={true}      
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});