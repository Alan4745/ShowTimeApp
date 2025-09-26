import React, {useState} from 'react';
import { View, Text, StyleSheet, TextInput, Keyboard, 
    useWindowDimensions, KeyboardAvoidingView, Platform} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useRegistration } from '../context/RegistrationContext';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';

export default function WriteBioScreen() {
    const {t} = useTranslation();
    const {width} = useWindowDimensions();
    const {updateData} = useRegistration();
    const navigation = useNavigation();
    const [bio, setBio] = useState("");
    const [inputHeight, setInputHeight] = useState(0);

    const isSmallScreen = width <= 360;
    const maxInputHeight = isSmallScreen ? 105 : 150;    

    const handleContentSizeChange = (event: any) => {
        const newHeight = event.nativeEvent.contentSize.height;
        if (newHeight < maxInputHeight) {
            setInputHeight(newHeight);
        } else {
            setInputHeight(maxInputHeight);
        }
    };

    const handleTextChange = (text: string) => {
        if (text.length <= 400) {
        setBio(text);
        }
    };

    const handleContinue = () => {
        updateData({ bio: bio});
        Keyboard.dismiss();
        (navigation as any).navigate("Accomplishments");
    }
    
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
        <ScreenLayout currentStep={7} totalSteps={8}>
            <ContentContainer>
                <ScreenTitle title={t('registration.writeBio')}/>

                <View style = {styles.selectorContainer}>
                    <TextInput
                        style={[styles.textInput, {maxHeight: maxInputHeight}]}
                        placeholder={t('placeholders.writeBioText')}
                        placeholderTextColor="#FFFFFF"
                        multiline                        
                        value={bio}
                        onChangeText={handleTextChange}
                        onContentSizeChange={handleContentSizeChange}
                        maxLength={400} 
                        scrollEnabled={inputHeight >= maxInputHeight} 
                        textAlignVertical="top"
                        
                    />

                    {/* Character counter */}
                        <Text style={styles.charCount}>{bio.length}/400</Text>          
                    
                    <HelperText 
                        text={t('helperTexts.writeBioHelperText')} 
                        style={{marginTop:20}}
                    />

                    
             
                </View>
            </ContentContainer>

            <BottomSection>
                <ContinueButton
                onPress={()=> handleContinue()}
                disabled={bio.trim().length === 0}
                />
                <HelperText text={""} />
            </BottomSection>
                
        </ScreenLayout>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    selectorContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    textInput: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: 25,
        paddingVertical: 16,
        paddingHorizontal: 20,
        width: '100%',        
        textAlign: "center",
        flexDirection: 'row',                
        fontFamily: 'AnonymousPro-Regular',
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 20,
        color: "#FFFFFF",
        minHeight: 30,
        maxHeight: 150
    },
    charCount: {
        alignSelf: 'flex-end',
        color: '#999',
        marginTop: 10,
        fontSize: 14,
    },    
})