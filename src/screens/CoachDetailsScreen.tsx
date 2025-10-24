import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { ChevronUp } from 'lucide-react-native';
import { createThumbnail } from 'react-native-create-thumbnail';
import { PlayCircle } from 'lucide-react-native';
import { buildMediaUrl } from '../utils/urlHelpers';
import { fetchWithTimeout } from '../utils/fetchWithTimeout';
import AppHeaderNew from '../components/common/AppHeaderNew';
import LessonCard from '../components/common/LessonCard';
import TestimonialCard from '../components/common/TestimonialCard';
import HelperText from '../components/common/HelperText';
import PopupAlert from '../components/modals/PopupAlert';
import MediaViewerModal from '../components/modals/MediaViewerModal';

interface CoachDetailsScreenProps {
  route: any;
}

export default function CoachDetailsScreen({ route }: CoachDetailsScreenProps) {
    const {t} = useTranslation();
    const { user } = useAuth();  
    const { coach } = route.params;    
    const [showAccomplishments, setShowAccomplishments] = useState(true);    
    const [showLessons, setShowLessons] = useState(true);
    const [showTestimonials, setShowTestimonials] = useState(true);
    const [showCoachError, setShowCoachError] = useState(true);
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [showVideoModal, setShowVideoModal] = useState(false); 
    const [lessons, setLessons] = useState<any[]>([]);
    const [loadingLessons, setLoadingLessons] = useState(false);
    const [lessonsError, setLessonsError] = useState<string | null>(null);   
    const navigate = useNavigation();
    
    // Descargar las lecciones desde el backend
    useEffect(() => {
        const fetchCoachLessons = async () => {
            if (!coach.id) return;
                setLoadingLessons(true);
                setLessonsError(null);
            try {
                const response = await fetchWithTimeout(`/api/v1/coaches/${coach.id}/lessons`);
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

    // Genera thumbnail automáticamente
    useEffect(() => {
        if (coach?.coachMediaFile && coach.coachMediaFile.endsWith('.mp4')) {
            const videoUrl = buildMediaUrl(coach.coachMediaFile);
            createThumbnail({ url: videoUrl })
            .then(response => setThumbnail(response.path))
            .catch(err => console.warn('Error generando thumbnail:', err));
        }
    }, [coach]);
    
    const getMediaType = (lesson: any): 'image' | 'video' | 'audio' => {
        if (lesson.videoUrl) return 'video';
        if (lesson.audioUrl) return 'audio';
        if (lesson.imageUrl) return 'image';
        return 'image'; // fallback
    }       
    
    // Muestra una alerta si coach no existe
    if (!coach) {
        return (
            <View style={styles.container}>
            <PopupAlert
                visible={showCoachError}
                message={t("errors.coachNotFound")}
                onClose={() => {
                    setShowCoachError(false);
                    (navigate as any).goBack(); 
                }}
            />
            </View>
        );
    }

    
    const handlePlanPress = () => {
        (navigate as any).navigate('SubscribeElite')    
    }
    
    return (
        <View style={styles.container}>
            <AppHeaderNew userAvatar = {buildMediaUrl(user?.studentProfileImage)}/>
            <ScrollView contentContainerStyle={styles.scrollContent}>
               
                {/* IMAGEN O VIDEO */}
                <View style={styles.imageContainer}>
                      {coach.coachMediaFile ? (
                        coach.coachMediaFile.endsWith('.mp4') ? (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setShowVideoModal(true)}
                            style={{ position: 'relative' }}
                        >
                            <Image
                            source={{ uri: thumbnail || buildMediaUrl(coach.coachMediaFile) }}
                            style={styles.imageTop}
                            resizeMode="cover"
                            />
                            <View style={styles.playButtonOverlay}>
                            <PlayCircle color="#FFF" size={72} />
                            </View>
                        </TouchableOpacity>
                        ) : (
                        <Image
                            source={{ uri: buildMediaUrl(coach.coachMediaFile) }}
                            style={styles.imageTop}
                            resizeMode="cover"
                        />
                        )
                    ) : (
                        <View
                        style={[
                            styles.imageTop,
                            { backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
                        ]}
                        >
                        <Text style={{ color: '#aaa' }}>{t('coachDetails.noImage')}</Text>
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
                            <View  style={styles.coachingRoleTag}>
                                <Text style={styles.coachingRoleText}>{coach.coachingRole}</Text>
                            </View>
                        </View>                
                        <TouchableOpacity style={styles.subscribeButton}>
                            <Text style={styles.subscribeText}>{t('common.subscribe')}</Text>
                        </TouchableOpacity>                
                    </View> 

                    {/*DESCRIPCION*/}
                    {coach.coachBiography && <Text style={styles.description}>{coach.coachBiography}</Text>}         
                    
                    {/*ACCOMPLISHMENTS*/}
                    <TouchableOpacity
                        onPress={() => setShowAccomplishments(prev => !prev)}
                        style={{ height: 24, justifyContent: 'center', alignItems: "center", paddingVertical: 25 }}
                    >
                        <ChevronUp
                            color="#FFFFFF"
                            size={24}
                            style={{ transform: [{ rotate: showAccomplishments ? '0deg' : '180deg' }] }}
                        />
                    </TouchableOpacity>
                    {showAccomplishments && (
                        <View style={styles.accompContainer}>
                            <Text style={styles.accompTitle}>{t('coachDetails.myAccomplishments')}</Text>
                            {coach.coachAchievements && coach.coachAchievements.length > 0 ? (
                            <View style={styles.accompList}>
                                {coach.coachAchievements.map((item, index) => (
                                <Text key={index} style={styles.accompListItem}>
                                    • {item}
                                </Text>
                                ))}
                            </View>
                            ) : (
                                <Text style={[styles.accompListItem, {textAlign: "center", marginTop: 15, color: "#2B80BE", fontSize: 18}]}>{t('coachDetails.noAccomplishments')}</Text>
                            )}
                        </View>
                    )}
          
                    {/*LESSONS*/}
                    <TouchableOpacity
                        onPress={() => setShowLessons(prev => !prev)}
                        style={{ height: 24, justifyContent: 'center', alignItems: "center", paddingVertical: 25 }}
                        >
                        <ChevronUp
                            color="#FFFFFF"
                            size={24}
                            style={{ transform: [{ rotate: showLessons ? '0deg' : '180deg' }] }}
                        />
                    </TouchableOpacity>                   
                    {showLessons && (
                        <View style={styles.lessonsContainer}>
                            <Text style={styles.lessonsTitle}>{t('coachDetails.lessons')}</Text>

                            {loadingLessons ? (
                            <Text style={{ color: '#888', textAlign: 'center', marginTop: 20 }}>
                                {t('common.loading')}...
                            </Text>
                            ) : lessonsError ? (
                            <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>
                                {t('errors.loadLessonsError')}
                            </Text>
                            ) : lessons.length > 0 ? (
                            <View style={styles.lessonsList}>
                                {lessons.map((lesson) => (
                                <LessonCard
                                    key={lesson.id}
                                    id={lesson.id}
                                    title={lesson.title}
                                    author={lesson.author}
                                    description={lesson.description}
                                    subcategory={lesson.subcategory}
                                    format={lesson.format}
                                    mediaUrl={lesson.mediaUrl}
                                    mediaType={lesson.mediaType}
                                    cardHeight={220}
                                    thumbnail={lesson.thumbnail}
                                    likes={lesson.likes}
                                    comments={lesson.comments}
                                />
                                ))}
                            </View>
                            ) : (
                            <Text
                                style={{
                                textAlign: 'center',
                                marginTop: 15,
                                color: '#2B80BE',
                                fontSize: 18,
                                }}
                            >
                                {t('coachDetails.noLessons')}
                            </Text>
                            )}
                        </View>
                    )}

                    {/*TESTIMONIALS*/}
                    <TouchableOpacity
                        onPress={() => setShowTestimonials(prev => !prev)}
                        style={{ height: 24, justifyContent: 'center', alignItems: "center", paddingVertical: 25 }}
                        >
                        <ChevronUp
                            color="#FFFFFF"
                            size={24}
                            style={{ transform: [{ rotate: showTestimonials ? '0deg' : '180deg' }] }}
                        />
                    </TouchableOpacity>                   
                    {showTestimonials && (
                        <View style={styles.lessonsContainer}>
                            <Text style={styles.lessonsTitle}>{t('coachDetails.testimonials')}</Text>
                            {coach.testimonials && coach.testimonials.length > 0 ? (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={{ paddingVertical: 10 }}
                                >
                                    {coach.testimonials.map((testimonial: any) => (
                                    <View key={testimonial.id} style={{ marginRight: 16 }}>
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
                                    <Text style={[styles.lessonItem, {textAlign: 'center', color: '#2B80BE', fontSize: 18,
                                        marginTop: 15}]}> {t('coachDetails.noTestimonials')} </Text>
                                )
                            }
                        </View>
                    )}                 
                </View> 

                {/*PLAN BUTTON*/}
                <View style = {{alignItems: "center", marginTop: 20}}>
                    <TouchableOpacity style = {styles.planButton} onPress={handlePlanPress}>
                        <Text style = {styles.planButtonText}>Elite Plan</Text>
                    </TouchableOpacity>
                    <View style = {{ width: 270 }}>
                        <HelperText
                            text= {t('helperTexts.coachHelperText')}
                            style={{fontSize: 14}}
                        ></HelperText>                        
                    </View>                    
                </View>                               
            </ScrollView> 
            {/* Modal de reproducción */}
            <MediaViewerModal
                visible={showVideoModal}
                onClose={() => setShowVideoModal(false)}
                media={{
                    id: coach.id.toString(),
                    mediaType: 'video',
                    uri: buildMediaUrl(coach.coachMediaFile),
                    title: coach.name,
                    description: coach.description,
                }}
                showInfo={true}
            />                      
        </View>    
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,        
        backgroundColor: '#000000',
        paddingBottom: 30,        
    },
    scrollContent:{
        paddingBottom: 40,        
    }, 
    imageContainer: {        
        width: '100%',
        height: 318,
    },
    imageTop: {
        width: '100%',
        height: "100%",         
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
        marginTop: 10     
    },
    overlayContainer:{
        flexDirection: "row",
        flexWrap: "wrap",
        height: 35,                
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 30,
        rowGap: 8
    },
    overlayTagContainer:{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        rowGap: 8
    },
    roleTag:{
        backgroundColor: "#2B80BE",
        borderWidth: 1.5,
        minWidth: 80,
        height: 35,
        borderRadius: 38,
        alignItems: "center", 
        justifyContent: "center", 
        paddingHorizontal: 5      
    },
    coachingRoleTag:{
        borderColor: "#FFFFFF",
        borderWidth: 1.5,
        minWidth: 80,
        height: 35,
        borderRadius: 38,
        alignItems: "center", 
        justifyContent: "center",  
        paddingHorizontal: 5     
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
    subscribeButton:{
        width: 127,
        height: 51, 
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 124,
    },       
    subscribeText:{
        fontFamily: 'AnonymousPro-Bold',
        fontSize: 16,
        fontWeight: '700',
        color: '#2B80BE'
    },
    description:{
        fontFamily: 'AnonymousPro-Regular',
        fontSize: 16,
        fontWeight: '400',
        color: '#FFFFFF',
        marginVertical: 8,  
        lineHeight: 22,
    },
    accompContainer:{
        marginBottom: 5,
    },
    accompTitle:{
        fontFamily: 'AnonymousPro-Bold',
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,       
    },
    accompList: {
        paddingLeft: 10,
        marginTop: 10,
    },
    accompListItem: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'AnonymousPro-Regular',
        fontWeight: "400",
        marginBottom: 6,
        lineHeight: 20,
    },
    lessonsContainer: {
        marginBottom: 5,
    },
    lessonsTitle: {
        fontFamily: 'AnonymousPro-Bold',
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
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
        backgroundColor: "#FFFFFF",
        borderRadius: 37,
        borderColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,        
    },
    planButtonText: {
        fontFamily: 'AnonymousPro-Bold',
        fontWeight: "700",
        fontSize: 18,
        color: "#2B80BE",
    }   
});
