import { View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import React, {useState, useEffect} from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import ScreenLayout from '../components/common/ScreenLayout'
import SubscriptionsSection from '../components/common/SubscriptionsSection'
import SavedExercisesCalendar from '../components/common/SavedExercisesCalendar'
import SettingsSection from '../components/common/SettingsSection'
import UploadSection from '../components/common/UploadSection'
import { useAuth } from '../context/AuthContext'
import coachData from '../data/contentData.json'
import studentData from '../data/studentList.json'
import coach from '../data/coach.json'

type ButtonKey = "coach" | "save" | "settings" | "students" | "upload";

export default function AccountScreen() {
  const {t} = useTranslation();
  const { user } = useAuth();
  const userType = user?.role || "student";
  const navigation = useNavigation();  
  const [activeButton, setActiveButton] = useState<ButtonKey | null>(null);
  const buttons: Array<"coach" | "save" | "settings" | "students" | "upload"> =
  userType === "student" ? ["coach", "save", "settings"] : ["students", "upload", "settings"];

  useEffect(() => {
    const initial = userType === "student" ? "coach" : "students";
    setActiveButton(initial);
  }, [userType]);  

  const handleMessagePress = (coach: typeof coachData[0]) => {
      (navigation as any).navigate('Chat', {
        name: coach.name,
        avatar: coach.avatar
      })
  }

  return (
    <ScreenLayout>
      
      {/*TITULO*/}
      <View style = {styles.titleContainer}>
        <Text style = {styles.titleText}>{t('account.titles.account')}</Text>
      </View>

      {/*BOTONES*/}
      {activeButton && (
        <View style={styles.buttonContainer}>
          {buttons.map((key) => (
            <TouchableOpacity
              key={key}
              style={[styles.button, activeButton === key && styles.activeButton]}
              onPress={() => setActiveButton(key)}
            >
              <Text style={styles.buttonText}>{t(`account.buttons.${key}`)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Coach List Section */}
      <View style={styles.listContainer}>        
        {activeButton === (userType === 'student' ? 'coach' : 'students') && (
          <SubscriptionsSection
            userType={userType as 'student' | 'coach' | 'darwin'}
            data={coachData} // o studentData si los tienes separados
            onMessagePress={handleMessagePress}
          />
        )}
      </View>

      {/* Saved Calendar Section */}  
      {(activeButton === 'save') && (<SavedExercisesCalendar/>)}

      {/* Settings Section */}  
      {activeButton === 'settings' && (<SettingsSection userType={userType as "coach" | "student" | "darwin"}/>)}  

      {/* Upload Section */}
      {activeButton === 'upload' && (<UploadSection />)}

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
  buttonContainer:{
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 35,    
  },
  button:{
    height: 40,
    width: 110,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 57,
  },
  activeButton:{
    backgroundColor: '#2B80BE',
    borderColor: '#2B80BE',
  },
  buttonText:{
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 14,
    color: "#FFFFFF"  
  },
  listContainer: {
    marginTop: 40,
    paddingHorizontal: 30,
  },  
  
})