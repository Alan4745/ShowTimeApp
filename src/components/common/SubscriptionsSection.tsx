/* Componente usado en Account para mostrar el listado de coaches a los que 
se suscribió un estudiantes.  Y estudiantes que tiene suscritos en el caso de 
coaches y Darwin*/

import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Mail } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface SubscriptionsSectionProps {
  userType: 'student' | 'coach' | 'darwin';
  data: Array<any>;
  onMessagePress: (item: any) => void;
}

export default function SubscriptionsSection({ userType, data, onMessagePress }: SubscriptionsSectionProps) {
  const { t } = useTranslation();

  const title = userType === 'student'
    ? t('account.titles.coachList')
    : t('account.titles.studentList');

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>      
    <Image source={{ uri: item.avatar }} style={styles.avatar} />
    <View style={{ flex: 1 }}>
        <Text style={styles.coachName}>{item.name}</Text>
        <Text style={styles.coachSubtitle}>{item.title || item.tag}</Text>
    </View>
    <TouchableOpacity onPress={() => onMessagePress(item)} style={styles.iconButton}>
        <Mail color="#929292" width={26} height={26} />
    </TouchableOpacity>
    </View>
       
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    marginTop: 20 
  },  
  sectionTitle: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: "700",
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,    
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
  },
  coachItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,    
    padding: 12,
    borderRadius: 10,
  }
});
