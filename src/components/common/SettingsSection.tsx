import React, {useState} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, useWindowDimensions, Alert } from 'react-native';
import {Bell, Star, CircleHelp, X, Power} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { ChatParamList } from '../../types';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../context/AuthContext';
import HighlightModal from '../modals/HighlightModal';
import API_BASE_URL from '../../config/api';
import { buildMediaUrl } from '../../utils/urlHelpers';

type SettingsSectionProps = {
  userType: 'student' | 'coach' | 'darwin';
};

type SettingOption = {
  icon: React.ElementType;
  label: string;
  onPress?: () => void;
};

type ChatNavigationProp = StackNavigationProp<ChatParamList, 'Chat'>;

const SettingItem = ({ icon: Icon, label, onPress }: SettingOption) => (
  <TouchableOpacity style={styles.mainSectionLine} onPress={onPress}>
    <Icon size={24} style={styles.icon} />
    <Text style={styles.mainSectionText}>{label}</Text>
  </TouchableOpacity>
);

export default function SettingsSection({ userType }: SettingsSectionProps ) {
    const {t} = useTranslation();
    const { user, logout } = useAuth();
    const {height} = useWindowDimensions();
    const navigation = useNavigation<ChatNavigationProp>(); 
    const [showHighlightModal, setShowHighlightModal] = useState(false);
    const settings: SettingOption[] = [
        { icon: Bell, label: t('account.content.notifications')},
        { icon: Star, label: t('account.content.subscription')},
        { 
            icon: CircleHelp, 
            label: t('account.content.contact'),
            onPress: async () => {
                try {
                const response = await fetch(`${API_BASE_URL}/api/v1/chat/messages/support`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const supportUser = data.supportUser;

                navigation.navigate("Chat", {
                    id: supportUser.id,
                    name: supportUser.username,
                    avatar: buildMediaUrl(supportUser.avatar),
                    role: supportUser.role,
                });
                } catch (error) {
                console.error("Error fetching support user:", error);
                // Aquí puedes mostrar un alert si quieres
                    Alert.alert("Error", "No se pudo contactar con soporte.");
                }
            }
        },
        { icon: X, label: t('account.content.cancelSubscription')},
    ];  
    
  const handleSignOut = () => {
    logout();
    (navigation as any).navigate("CustomSplash");  
  }  
    
  return (
        
        <View style = {styles.container}>

            {/* HEADER SECTION*/}
            <View style = {[styles.headerContainer, {marginTop: height *0.008}]}>
                <Image source={
                    user?.studentProfileImage
                    ? { uri: user?.studentProfileImage}
                    : require('../../../assets/img/userGeneric.png')
                } 
                style={styles.avatar}/>
                <View style = {styles.nameContainer}>
                    <Text style = {styles.nameText}>{user?.username}</Text>
                    <TouchableOpacity onPress={() => (navigation as any).navigate('EditProfile')}>
                        <Text style = {styles.editProfileText}>{t('account.titles.editProfile')}</Text>    
                    </TouchableOpacity>
                </View>
            </View> 

            {/* BUTTON SECTION */}
            <View style = {[styles.buttonContainer, {marginTop: height *0.04}]}>
                {userType !== 'coach' && (
                    <TouchableOpacity 
                        style = {[styles.button, styles.highlightButton]}
                        onPress={() => setShowHighlightModal(true)}
                    >
                        <Text style = {styles.highlightButtonText}>{t('account.buttons.highlight')}</Text>
                    </TouchableOpacity>
                )}
                
                <TouchableOpacity style = {[styles.button, styles.shareButton]}>
                    <Text style = {styles.shareButtonText}>{t('account.buttons.shareTheApp')}</Text>
                </TouchableOpacity>
            </View>

            {/* MAIN SECTION */}
            <View style = {[styles.mainSectionContainer, 
                {marginTop: height*0.06, gap: height*0.03}]}>
                {settings.map((setting, idx) => (
                    <SettingItem key={idx} {...setting} />
                ))}               
            </View>

            {/* FOOTER */}
            <View style = {[styles.signOutButtonContainer, {bottom: height*0.04}]}>
                <TouchableOpacity 
                    style = {[styles.button, styles.signOutButton]}  
                    onPress={handleSignOut}                   
                >
                    <View style = {styles.signOutButtonContent}>
                        <Power size={18} style={styles.icon}/>
                        <Text style = {styles.signOutButtonText}>{t('account.buttons.signOut')}</Text>
                    </View>                    
                </TouchableOpacity>
            </View> 

            <HighlightModal
                visible={showHighlightModal}
                onClose={() => setShowHighlightModal(false)}
            />           
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
    },
    headerContainer:{
        flexDirection: "row",
        alignItems: "center",
        gap: 20,        
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40, // mitad del ancho y alto
    },
    nameContainer: {
        flexDirection: "column",
    },
    nameText: {
        fontFamily: "AnonymousPro-Bold",
        fontWeight: "700",
        fontSize: 25,
        color: "#FFFFFF"
    },
    editProfileText: {
        fontFamily: "AnonymousPro-Regular",
        fontWeight: "400",
        fontSize: 18,
        color: "#FFFFFF"
    },
    buttonContainer: {
        flexDirection: "column",
        width: "100%",        
        gap: 25
    },
    button: {
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100
    },
    highlightButton:{
        backgroundColor: "#2B80BE",        
    },
    highlightButtonText:{
        fontFamily: "AnonymousPro-Bold",
        fontWeight: "700",
        fontSize: 16,
        color: "#FFFFFF",        
    },
    shareButton: {
        borderColor: "#FFFFFF",
        borderWidth: 1.5
    },
    shareButtonText:{
        fontFamily: "AnonymousPro-Bold",
        fontWeight: "700",
        fontSize: 16,
        color: "#FFFFFF"    
    },
    mainSectionContainer:{
        flexDirection: "column",        
        paddingHorizontal: 10
    },
    mainSectionLine:{
        flexDirection: "row",
        gap: 20,
    },
    mainSectionText:{
        fontFamily: "AnonymousPro-Regular",
        fontWeight: "400",
        fontSize: 18,
        color: "#FFFFFF" 
    },
    icon: {
        color: "#FFFFFF",
        backgroundColor: "#252A30",        
    },
    signOutButtonContainer: {
        position: "absolute",
        width: "100%",        
        alignSelf: "center"            
    },
    signOutButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    signOutButton:{
        backgroundColor: "#252A30"
    },
    signOutButtonText: {
        fontFamily: "AnonymousPro-Bold",
        fontWeight: "700",
        fontSize: 18,
        color: "#FFFFFF",    
    }
})