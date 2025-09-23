import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ChevronLeft} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import LottieIcon from '../components/common/LottieIcon';
import Calendar from '../components/common/Calendar';
import TimePickerModal from '../components/modals/TimePickerModal';

interface CalendarScreenProps {
  lessonId: string;
  title: string;   // esta sigue siendo la key de categoría, ej: "training"
  onBack: () => void;
}

export default function CalendarScreen({ lessonId, title, onBack }: CalendarScreenProps) {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string>(
    new Date().toISOString().split('T')[0].slice(0,7)  // "YYYY-MM"
  ); 
  const [showSuccess, setShowSuccess] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState<{ hour: number; minute: number; ampm: 'AM' | 'PM' } | null>(null);   

  return (
    <View style={styles.container}>
      {/* Header general */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft color="#FFFFFF" size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>{ t(`learn.categories.${title}`) }</Text>
      </View>

      <Text style={styles.calendarText}>
        { t('learn.calendarText')}
      </Text>

      <View style={styles.calendarWrapper}>
        <Calendar
            current={currentMonth + '-01'}
            markedDates={
            selectedDate
                ? {
                    [selectedDate]: {
                    selected: true,
                    selectedColor: '#2B80BE',
                    selectedTextColor: '#FFFFFF',
                    }
                }
                : {}
            }
            onDayPress={(day) => setSelectedDate(day.dateString)}
            onMonthChange={(month) => {
            const m = month.dateString.slice(0, 7);
            setCurrentMonth(m);
            }}
        />                
      </View>

      <View style={styles.nextButtonContainer}>
        <TouchableOpacity 
        onPress={() => setModalVisible(true)}
            style={[
                styles.nextButton,
                !selectedDate && styles.nextButtonDisabled
            ]}
            disabled={!selectedDate}
        >
            <Text style={styles.nextButtonText}>{ t("learn.next") }</Text>
        </TouchableOpacity>        
      </View>      
      
      <TimePickerModal
        visible={modalVisible}
        selectedDate={selectedDate}
        onClose={() => setModalVisible(false)}
        onSave={(time) => {
            setSelectedTime(time);
            setModalVisible(false);
            // Reemplazar console log con lógica para enviar datos a la api
            console.log('Hora seleccionada:', {
              lessonId,
              date: selectedDate,
              time: time,
            });
            // Mostrar animación
            setShowSuccess(true);
            
            // Esperar 1.5 segundos antes de regresar
            setTimeout(() => {
              setShowSuccess(false); //ocultar animación
              onBack();
            }, 1500);
            
        }}
      />

      {showSuccess && (
        <View style={styles.successAnimationContainer}>
          <LottieIcon
            source={require('../../assets/lottie/Success.json')} 
            size={150}
            loop={false}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',   
    padding: 20,
  },
  header: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,    
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 0,
    padding: 8,
    zIndex: 10,
  },
  title: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: "700",
    fontSize: 24,
    color: '#FFFFFF',
  },
  calendarText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: "700",
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 100,
    marginBottom: 30,
  },
  calendarWrapper: {
    position: "relative",
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    width: "90%",    
    alignSelf: "center"     
  },
  nextButtonContainer:{    
    alignSelf: "flex-end",
    marginTop: 15,
    marginRight: 20,     
  },
  nextButton: {
    width: 98,
    height: 40,
    backgroundColor: "#2B80BE",
    borderRadius: 100,
    justifyContent: "center",  
  },
  nextButtonDisabled: {
    backgroundColor: '#888888', 
  },
  nextButtonText:{
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: "center",
  },
  successAnimationContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#000000" 
  },
});
