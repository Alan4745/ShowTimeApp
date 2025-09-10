import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronUp } from 'lucide-react-native';
import AppHeaderNew from '../components/common/AppHeaderNew';
import contentData from '../data/contentData.json';
import LessonCard from '../components/common/LessonCard';
import TestimonialCard from '../components/common/TestimonialCard';
import HelperText from '../components/common/HelperText';
import PopupAlert from '../components/modals/PopupAlert';
import { useTranslation } from 'react-i18next';
import userData from '../data/user.json'

interface CoachDetailsScreenProps {
  route: any;
}

export default function CoachDetailsScreen({ route }: CoachDetailsScreenProps) {
    const {t} = useTranslation();
    const [activeTag, setActivTag] = useState<"tag" | "gymflow">("tag");
    const [showAccomplishments, setShowAccomplishments] = useState(true);    
    const [showLessons, setShowLessons] = useState(true);
    const [showTestimonials, setShowTestimonials] = useState(true);
    const [showCoachError, setShowCoachError] = useState(true);
    const {id} = route.params;    
    const navigate = useNavigation();

    const getMediaType = (lesson: any): 'image' | 'video' | 'audio' => {
        if (lesson.videoUrl) return 'video';
        if (lesson.audioUrl) return 'audio';
        if (lesson.imageUrl) return 'image';
        return 'image'; // fallback
}

    // Verificar si coach existe
    const coach = contentData.find(c => c.id === id);
    React.useEffect(() => {
    if (!coach) {
        setShowCoachError(true);
    }
    }, [coach]); 
    
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
            <AppHeaderNew userAvatar = {userData.avatar}/>
            <ScrollView contentContainerStyle={styles.scrollContent}>
               
                {/*IMAGEN*/}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: coach.imageUrl }}
                        style={styles.imageTop}
                        resizeMode="cover"
                    />                        
                </View>

                <View style={styles.contentBottom}>
                    {/*TITULO Y NOMBRE*/}
                    {coach.title && <Text style={styles.title}>{coach.title}</Text>}
                    {coach.name && <Text style={styles.name}>{coach.name}</Text>}
                    
                    <View style={styles.overlayContainer}>
                        {/*BOTONES*/}
                        <View style={styles.overlayButtonContainer}>
                            <TouchableOpacity 
                                style={[styles.overlayButton,
                                    activeTag === "tag" && styles.overlayButtonActive
                                ]}
                                onPress={() => setActivTag("tag")}
                            >
                                <Text style={styles.overlayText}>{coach.tag}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.overlayButton,
                                    activeTag === "gymflow" && styles.overlayButtonActive
                                ]}
                                onPress={() => setActivTag("gymflow")}
                            >
                                <Text style={styles.overlayText}>{t('common.gymflow')}</Text>
                            </TouchableOpacity>
                        </View>                
                        <TouchableOpacity style={styles.subscribeButton}>
                            <Text style={styles.subscribeText}>{t('common.subscribe')}</Text>
                        </TouchableOpacity>                
                    </View> 

                    {/*DESCRIPCION*/}
                    {coach.description && <Text style={styles.description}>{coach.description}</Text>}         
                    
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
                            {coach.accomplishments && coach.accomplishments.length > 0 ? (
                            <View style={styles.accompList}>
                                {coach.accomplishments.map((item, index) => (
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
                            <View style={styles.lessonsList}>
                            {coach.lessons && coach.lessons.length > 0 ? (
                                coach.lessons.map((lesson: any) => (
                                <LessonCard
                                    key={lesson.id}
                                    title={lesson.title}
                                    author={lesson.author}
                                    description={lesson.description}
                                    mediaUrl={lesson.imageUrl}  
                                    mediaType={getMediaType(lesson)}                                                         
                                />
                                ))
                                ) : (
                                    <Text style={[styles.lessonItem, {textAlign: "center", marginTop: 15, color: "#2B80BE", fontSize: 18}]}>{t('coachDetails.noLessons')}</Text>
                                )}
                            </View>
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
                                        imageUrl={testimonial.imageUrl}
                                        name={testimonial.name}
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
    contentBottom: {
        padding: 10,    
    },
    title: {
        fontFamily: 'AnonymousPro-Bold',
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',        
    },
    name: {
        fontFamily: 'AnonymousPro-Bold',
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',        
    },
    overlayContainer:{
        flexDirection: "row",
        height: 35,                
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 30,
    },
    overlayButtonContainer:{
        flexDirection: "row",
        gap: 10,
    },
    overlayButton:{
        borderColor: "#FFFFFF",
        borderWidth: 1.5,
        width: 95,
        height: 35,
        borderRadius: 38,
        alignItems: "center", 
        justifyContent: "center"       
    },
    overlayButtonActive:{
        backgroundColor: "#2B80BE",
        borderColor: "#2B80BE",
    },
    overlayText: {
        color: '#FFFFFF',
        fontSize: 16,
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
        marginBottom: 8,  
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
