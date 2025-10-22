import React, {useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { buildMediaUrl } from '../../utils/urlHelpers';
import LessonCard from './LessonCard';
import MediaViewerModal from '../modals/MediaViewerModal';
import API_BASE_URL from '../../config/api';


export default function UploadSection() {
  const { t } = useTranslation();
  const { user, token } = useAuth();
  const navigation = useNavigation();  
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleOpenMedia = (media: any) => {
    setSelectedMedia(media);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedMedia(null);
  };

  useEffect(() => {
    if (!user?.id) return;

    const fetchLessons = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/v1/lessons/coach/${user.id}`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });


        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const data = await response.json();
        setLessons(data.results || []);
      } catch (err: any) {
        console.error('Error fetching lessons:', err);
        setError('No se pudieron cargar las lecciones');
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [user?.id]);

  return (
    <View style={styles.container}>
      <View style = {styles.headerContainer}>
        <Image source= {
                user?.studentProfileImage
                  ? { uri: buildMediaUrl(user?.studentProfileImage)}
                  : require('../../../assets/img/userGeneric.png')
                } style={styles.avatar}
        />
        <Text style={styles.userNameText}>{user?.username}</Text>
      </View>
      
      <TouchableOpacity style = {styles.uploadButton} onPress={() => (navigation as any).navigate('UploadContent')}>
        <Text style = {styles.uploadButtonText}>{t('account.buttons.uploadContent')}</Text>
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={styles.lessonContainer}>
        {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              id={lesson.id.toString()}
              title={lesson.title}
              author={lesson.author_name}
              description={lesson.description}
              subcategory={lesson.subcategory}
              format={lesson.format}
              mediaType={lesson.mediaType as "audio" | "video" | "image"}
              mediaUrl={lesson.mediaUrl} 
              thumbnailUrl={lesson.thumbnail}               
              onOpenMedia={handleOpenMedia}
            />
        ))}
      </ScrollView>
      
      {/* Modal global para visualizar media */}
      <MediaViewerModal
        visible={modalVisible}
        media={selectedMedia}
        onClose={handleCloseModal}
        showInfo={true}
        likesCount={selectedMedia?.likes}
        commentsCount={selectedMedia?.comments}
      />

    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    headerContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50, // mitad del ancho y alto
    },
    userNameText: {
        fontFamily: "AnonymousPro-Bold",
        fontWeight: '700',
        fontSize: 25,
        marginTop: 15,
        marginBottom: 45,
        color: "#FFFFFF"
    },
    uploadButton:{
        width: "90%",
        height: 60, 
        backgroundColor: "#2B80BE",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        borderRadius: 45
    },
    uploadButtonText:{
        fontFamily: "AnonymousPro-Bold",
        fontWeight: '700',
        fontSize: 22,        
        color: "#FFFFFF"    
    },
    lessonContainer: {
        gap: 12,
        alignSelf: "center",
        marginTop: 25
    },
});
