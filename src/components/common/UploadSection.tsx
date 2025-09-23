import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import LessonCard from './LessonCard';
import userData from '../../data/coach.json';
import lessons from '../../data/lessons.json';


export default function UploadSection() {
  const { t } = useTranslation();
  const navigation = useNavigation();  

  return (
    <View style={styles.container}>
      <View style = {styles.headerContainer}>
        <Image source={{ uri: userData.avatar}} style={styles.avatar}/>
        <Text style={styles.userNameText}>{userData.username}</Text>
      </View>
      
      <TouchableOpacity style = {styles.uploadButton} onPress={() => (navigation as any).navigate('UploadContent')}>
        <Text style = {styles.uploadButtonText}>{t('account.buttons.uploadContent')}</Text>
      </TouchableOpacity>
      
          <ScrollView contentContainerStyle={styles.lessonContainer}>
            {lessons.map((lesson) => (
                <LessonCard
                key={lesson.id}
                id={lesson.id}
                title={lesson.title}
                author={lesson.author}
                description={lesson.description}
                subcategory={lesson.subcategory}
                format={lesson.format}
                mediaType={lesson.mediaType as "audio" | "video" | "image"}
                mediaUrl={lesson.mediaUrl}                
                onOpenMedia={() => {
                    // Aquí puedes navegar o abrir un modal
                }}
                />
            ))}
            </ScrollView>
      
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
