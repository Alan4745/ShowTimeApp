import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, useWindowDimensions} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRegistration } from '../context/RegistrationContext';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { createThumbnail } from 'react-native-create-thumbnail';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';

type MediaItem = {
  id: string;
  type: 'image' | 'video';
  uri: string;
  thumbnail?: string;
};

export default function UploadMediaScreen() {
    const {t} = useTranslation();
    const {width} = useWindowDimensions();
    const {updateData} = useRegistration();
    const navigation = useNavigation();
    const [mediaItem, setMediaItem] = useState<MediaItem | null>(null);

    let thumbnailSize;
    if (width <= 360) {
        thumbnailSize = 140; // Teléfonos pequeños
    } else if (width <= 420) {
        thumbnailSize = 200; // Teléfonos medianos
    } else {
        thumbnailSize = 300; // Teléfonos grandes
    }
    
    const handleMediaSelect = () => {
        launchImageLibrary(
        {
            mediaType: 'mixed', // Permite imágenes y videos
            selectionLimit: 1,
        },
        async (response) => {
            if (response.didCancel || !response.assets || response.assets.length === 0) return;
            const asset = response.assets[0];
            const type = asset.type?.startsWith('video') ? 'video' : 'image';

            if (type === 'video') {
            try {
                const thumbnail = await createThumbnail({ url: asset.uri! });
                const videoItem: MediaItem = {
                id: `${Date.now()}`,
                type: 'video',
                uri: asset.uri!,
                thumbnail: thumbnail.path,
                };
                setMediaItem(videoItem);
            } catch (error) {
                console.error('Error generando thumbnail:', error);
            }
            } else {
            const imageItem: MediaItem = {
                id: `${Date.now()}`,
                type: 'image',
                uri: asset.uri!,
            };
            setMediaItem(imageItem);
            }
        }
        );
    };

    const handleContinue = () => {
        updateData({ uploadMedia: mediaItem.uri});
        (navigation as any).navigate('WriteBio');
    }

    return (
        <ScreenLayout currentStep={6} totalSteps={8}>
            <ContentContainer>
                <ScreenTitle title={t('registration.uploadMedia')}/>

                <View style = {styles.selectorContainer}>
                    <TouchableOpacity style={styles.mediaSelector} onPress={handleMediaSelect}>
                        <Text style={styles.mediaSelectorText}>{t('placeholders.upload')}</Text>                    
                    </TouchableOpacity>
                
                    <HelperText text={t('helperTexts.uploadMedia')} style={{marginTop:20}}></HelperText>
                
                    {mediaItem && (
                        <View style={styles.thumbnailContainer}>
                            <Image
                                source={{ uri: mediaItem.thumbnail || mediaItem.uri }}
                                style={[
                                    styles.thumbnail, 
                                    {width: thumbnailSize, height: thumbnailSize
                                }]}
                                resizeMode="cover"
                            />
                        </View>
                    )}
                </View>
            </ContentContainer>

            <BottomSection>
                <ContinueButton
                onPress={()=> handleContinue()}
                disabled={!mediaItem}
                />
                <HelperText text={""} />
            </BottomSection>
               
        </ScreenLayout>
    )
}

const styles = StyleSheet.create({
    selectorContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    mediaSelector: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: 25,
        paddingVertical: 16,
        paddingHorizontal: 20,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    selectedRoleSelector: {
        borderColor: '#4A90E2',
        backgroundColor: '#4A90E2',
    },
    mediaSelectorText: {
        fontFamily: 'AnonymousPro-Regular',
        fontWeight: '600',
        lineHeight: 20,
        color: '#FFFFFF',
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
    },
    thumbnailContainer: {
        marginTop: 25,
        alignItems: 'center',
    },
    thumbnail: {
        //width: 250,
        //height: 250,
        borderRadius: 10,
    },    
})