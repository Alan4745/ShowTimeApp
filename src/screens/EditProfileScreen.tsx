import React, {useState} from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import ScreenLayout from '../components/common/ScreenLayout'
import ImagePickerModal from '../components/modals/ImagePickerModal'
import EditFieldModal from '../components/modals/EditFieldModal'
import {Pencil, ArrowRight} from 'lucide-react-native'
import user from '../data/user.json'

export default function EditProfileScreen() {
    const {t} = useTranslation();
    const [pickerModalVisible, setPickerModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editFieldTitle, setEditFieldTitle] = useState('');
    const [editFieldValue, setEditFieldValue] = useState('');
    const [currentFieldKey, setCurrentFieldKey] = useState<keyof typeof user | null>(null);

    const handleImagePicked = (image: { path: string }) => {
        //updateData({ studentProfileImage: image.path });
    };

    function formatHeight(height: number, unit: string) {
        if (unit === "cm") {
            return `${height} cm`;
        }

        if (unit === "ft") {
            const feet = Math.floor(height);
            const fractionalFeet = height - feet;
            const inches = Math.round(fractionalFeet * 12);
            return `${feet} ft ${inches} in`;
        }

        return "Invalid height unit";
    }

    const openEditModal = (
        fieldTitle: string,
        fieldValue: string,
        fieldKey?: keyof typeof user
        ) => {
        setEditFieldTitle(fieldTitle);
        setEditFieldValue(fieldValue);
        setCurrentFieldKey(fieldKey || null);
        setEditModalVisible(true);
    };

    const handleSaveEdit = (newValue: string) => {
        console.log(`Saving ${editFieldTitle}: ${newValue}`);
        // Aquí podrías hacer updateUserData(currentFieldKey, newValue);
        setEditModalVisible(false);
    };

    const renderProfileRow = (
        title: string,
        value: string,
        onPress?: () => void,
        icon: React.ReactNode = <Pencil size={24} color="#FFFFFF" />
        ) => (
        <View style={styles.contentSubsection}>
            <View>
                <Text style={styles.contentTitles}>{title}</Text>
                {value !== '' && <Text style={styles.dataText}>{value}</Text>}
            </View>
            <TouchableOpacity onPress={onPress}>
            {icon}
            </TouchableOpacity>
        </View>
    );

    return (
    <ScreenLayout>
        <ScrollView
            contentContainerStyle = {{paddingBottom: 30}}
        >
            {/*TITULO*/}
            <View style = {styles.titleContainer}>
                <Text style = {styles.titleText}>{t('account.titles.account')}</Text>
            </View>

            {/*AVATAR & NAME*/}
            <View style = {styles.headerContainer}>
                <View style = {styles.avatarWrapper}>
                    <Image source={{ uri: user.avatar}} style={styles.avatar}/>
                    <TouchableOpacity 
                        style = {styles.editIconContainer}
                        onPress={()=> setPickerModalVisible(true)}
                    >
                        <Pencil size={24} color = "#FFFFFF"/>                    
                    </TouchableOpacity>
                </View>            
                <View style = {styles.nameContainer}>
                    <Text style = {styles.nameText}>{user.username}</Text>
                </View>        
            </View>

            {/*CONTENT SECTION*/}
            <View style = {styles.contentSection}>
                {renderProfileRow(
                    "User Name", 
                    user.username, 
                    () => openEditModal("User Name",user.username, "username")
                )}
                {renderProfileRow(
                    "Mail", 
                    user.email,
                    () => openEditModal("Mail",user.email, "email")
                )}
                {renderProfileRow("Number", user.phoneNumber)}
                {renderProfileRow(
                    "Weight and Height", 
                    `${user.weight} ${user.weightUnit} / ${formatHeight(user.height, user.heightUnit)}`
                )}
                {renderProfileRow("Position", user.position)}            
            </View>

            {/* BOTTOM SECTION*/}
            <View style = {styles.contentSection}>            
                <View style = {styles.contentSubsection}>
                    <View>
                        <Text style = {styles.text}>Change Password</Text>                    
                    </View>
                    <ArrowRight size={24} color = "#FFFFFF"/>
                </View> 
                <View style = {styles.contentSubsection}>
                    <View>
                        <Text style = {styles.text}>Delete Account</Text>                    
                    </View>
                    <ArrowRight size={24} color = "#FFFFFF"/>
                </View>     
            </View>
        </ScrollView>    
        <ImagePickerModal
            visible={pickerModalVisible}
            onClose={() => setPickerModalVisible(false)}
            onImagePicked={handleImagePicked}
        />

        <EditFieldModal
            visible={editModalVisible}
            title={editFieldTitle}
            initialValue={editFieldValue}
            onClose={() => setEditModalVisible(false)}
            onSave={handleSaveEdit}
        />
    </ScreenLayout>
    )
}

const styles = StyleSheet.create({
    titleContainer:{
        marginTop: 21
    },
    titleText:{
        fontFamily: 'AnonymousPro-Bold',
        fontWeight: "700",
        fontSize: 22,
        color:"#FFFFFF",
        textAlign: "center"
    },
    headerContainer:{        
        alignItems: "center",
        marginTop: 20,
        gap: 20,        
    },
    avatarWrapper: {
        position: 'relative',
        width: 120,
        height: 120,
    },
    avatar: {
        width: "100%",
        height: "100%",
        borderRadius: 60, // mitad del ancho y alto
    },
    editIconContainer: {
        position: 'absolute',
        right: -25,
        bottom: 0,        
        borderRadius: 20,
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',        
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
    contentSection: {
        backgroundColor: "#252A30",
        marginTop: 20
    },
    contentSubsection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 15
    },
    contentTitles: {
        fontFamily: "AnonymousPro-Regular",
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 24,
        color: "#868686"
    },
    dataText: {
        fontFamily: "BeVietnamPro-Regular",
        fontWeight: "400",
        fontSize: 14,
        lineHeight: 21,
        color: "#FFFFFF"     
    },
    text: {
        fontFamily: "BeVietnamPro-Regular",
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 24,
        color: "#FFFFFF"     
    }
})
