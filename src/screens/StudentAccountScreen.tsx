import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native'
import React, {useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { Mail } from 'lucide-react-native'
import ScreenLayout from '../components/common/ScreenLayout'
import coachData from '../data/contentData.json'

export default function StudentAccountScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [activeButton, setActiveButton] = useState<"coach" | "save" | "settings">("coach");

  const handleMessagePress = (coach: typeof coachData[0]) => {
      (navigation as any).navigate('Chat', {
        name: coach.name,
        avatar: coach.avatar
      })
  }

  const renderCoach = ({ item }: { item: typeof coachData[0] }) => (
    <View style={styles.coachItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style = {{ flex: 1 }}>
        <Text style={styles.coachName}>{item.name}</Text>
        <Text style={styles.coachSubtitle}>{`${item.title} - ${item.tag}`}</Text>
      </View>      
      <TouchableOpacity onPress={() => handleMessagePress(item)} style={styles.iconButton}>
        <Mail color="#929292" width={26} height={26} />
      </TouchableOpacity>
    </View>
  )

  return (
    <ScreenLayout>
      
      {/*TITULO*/}
      <View style = {styles.titleContainer}>
        <Text style = {styles.titleText}>{t('account.titles.account')}</Text>
      </View>

      {/*BOTONES*/}
      <View style = {styles.buttonContainer}>
        
        <TouchableOpacity style = {[styles.button, activeButton === "coach" && styles.activeButton]} onPress={() => setActiveButton("coach")}>
          <Text style = {styles.buttonText}>{t('account.buttons.coach')}</Text>  
        </TouchableOpacity>
        
        <TouchableOpacity style = {[styles.button, activeButton === "save" && styles.activeButton]} onPress={() => setActiveButton("save")}>
          <Text style = {styles.buttonText}>{t('account.buttons.save')}</Text>  
        </TouchableOpacity>
        
        <TouchableOpacity style = {[styles.button, activeButton === "settings" && styles.activeButton]} onPress={() => setActiveButton("settings")}>
          <Text style = {styles.buttonText}>{t('account.buttons.settings')}</Text>  
        </TouchableOpacity>
        
      </View>

      {/* Coach List Section */}
      <View style={styles.coachListContainer}>
        <Text style={styles.sectionTitle}>{t('account.titles.coachList')}</Text>
        <FlatList
          data={coachData}
          keyExtractor={(item) => item.id}
          renderItem={renderCoach}
          horizontal={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
    fontSize: 18,
    color: "#FFFFFF"  
  },
  coachListContainer: {
    marginTop: 40,
    paddingHorizontal: 30,
  },
  sectionTitle: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: "700",
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  coachItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,    
    padding: 12,
    borderRadius: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  coachName: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: "700",
    fontSize: 20,
    color: '#FFFFFF',    
  },
  coachSubtitle:{
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 16,
    color: "#D9D9D9",
    marginLeft: 2,
  },
  iconButton: {
    padding: 8,
  }
})