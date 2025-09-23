import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useRegistration } from '../context/RegistrationContext';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';
import DropdownModal from '../components/modals/DropdownModal';
import { ChevronDown } from 'lucide-react-native';


export default function CoachingRoleScreen() {
    const {t} = useTranslation();
    const {updateData} = useRegistration();
    const navigation = useNavigation();
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const roles = ["performanceCoach", "nutrition", "gameAnalysis", "drillTechnical", "mindset"]
    
    const handleRoleSelect = (item: string) => {
        setSelectedRole(item);
        setShowModal(false);
    }

    const handleContinue = () => {
        updateData({ coachingRole: selectedRole as string });
        (navigation as any).navigate('UploadMedia');
    }

    return (
        <ScreenLayout currentStep={5} totalSteps={8}>
            <ContentContainer>
                <ScreenTitle title={t('registration.coachingRole')}/>

                <View style = {styles.selectorContainer}>
                <TouchableOpacity
                    style={[
                    styles.roleSelector,
                    selectedRole && styles.selectedRoleSelector,
                    ]}
                    onPress={() => setShowModal(true)}
                >
                    <Text style={[
                        styles.roleSelectorText,
                        selectedRole && styles.selectedRoleSelectorText,
                    ]}>
                        {selectedRole ? t(`coachingRoles.${selectedRole}`) : t('placeholders.selectRole')}
                    </Text>
                    <ChevronDown color={'#FFFFFF'} size={20}/>
                </TouchableOpacity>
                </View>
            </ContentContainer>

            <BottomSection>
                <ContinueButton
                onPress={()=> handleContinue()}
                disabled={!selectedRole}
                />
                <HelperText text={""} />
            </BottomSection>

            <DropdownModal
                visible = {showModal}
                title = {t('registration.chooseRol')}
                items = {roles}
                onSelect={handleRoleSelect}
                onClose = {() => setShowModal(false)}
                renderItem={(item) => t(`coachingRoles.${item}`)}
            />     
        </ScreenLayout>  
    )
}

const styles = StyleSheet.create({
    selectorContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    roleSelector: {
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
    roleSelectorText: {
        fontFamily: 'AnonymousPro-Regular',
        fontWeight: '600',
        lineHeight: 20,
        color: '#FFFFFF',
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
    },
    selectedRoleSelectorText: {
        color: '#FFFFFF',
        fontWeight: "600",
    }    
})