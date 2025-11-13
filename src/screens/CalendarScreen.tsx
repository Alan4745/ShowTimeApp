import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import LottieIcon from '../components/common/LottieIcon';
import Calendar from '../components/common/Calendar';
import TimePickerModal from '../components/modals/TimePickerModal';
import { fetchWithTimeout } from '../utils/fetchWithTimeout'; // ✅ usa tu utilidad
import success from '../../assets/lottie/Success.json'
import API_BASE_URL from '../config/api';

interface CalendarScreenProps {
  lessonId: string;
  title: string;   // key de la categoría (ej: "training")
  onBack: () => void;
}

export default function CalendarScreen({ lessonId, title, onBack }: CalendarScreenProps) {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string>(
    new Date().toISOString().split('T')[0].slice(0, 7)
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState<{ hour: number; minute: number; ampm: 'AM' | 'PM' } | null>(null);

  const handleSaveEvent = async (time: { hour: number; minute: number; ampm: 'AM' | 'PM' }) => {
    try {
      if (!selectedDate) {
        Alert.alert('Error', t('learn.selectDateFirst'));
        return;
      }

      // Convertir la hora a formato 24h: "HH:mm:ss"
      let hour24 = time.hour % 12;
      if (time.ampm === 'PM') hour24 += 12;
      const formattedTime = `${hour24.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}:00`;

      const body = {
        lesson_id: lessonId,
        event_date: selectedDate,
        event_time: formattedTime,
      };

      const response = await fetchWithTimeout(`/api/v1/calendar/events`,
        {
          method: 'POST',          
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onBack();
        }, 1500);
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.detail || 'No se pudo registrar el evento.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un error al conectar con el servidor.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft color="#FFFFFF" size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>{t(`learn.categories.${title}`)}</Text>
      </View>

      <Text style={styles.calendarText}>{t('learn.calendarText')}</Text>

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
                  },
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
          style={[styles.nextButton, !selectedDate && styles.nextButtonDisabled]}
          disabled={!selectedDate}
        >
          <Text style={styles.nextButtonText}>{t('learn.next')}</Text>
        </TouchableOpacity>
      </View>

      <TimePickerModal
        visible={modalVisible}
        selectedDate={selectedDate}
        onClose={() => setModalVisible(false)}
        onSave={(time) => {
          setSelectedTime(time);
          setModalVisible(false);
          handleSaveEvent(time); // ✅ aquí se envía al backend
        }}
      />

      {showSuccess && (
        <View style={styles.successAnimationContainer}>
          <LottieIcon 
            source={success} 
            loop={false}   
            size={200}  
            containerStyle={{ width: '100%', height: '100%' }}        
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
  },
  backButton: {
    position: 'absolute',
    left: 5,
    top: -5,
    paddingVertical: 8,
    zIndex: 10,
  },
  title: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: "700",
    fontSize: 22,
    color: '#FFFFFF',    
  },
  calendarText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: "700",
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: "10%",
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
