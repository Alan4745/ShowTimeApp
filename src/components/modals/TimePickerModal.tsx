import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import CustomPicker from '../common/CustomPicker';


interface TimePickerProps {
  visible: boolean;
  selectedDate: string | null;
  onSave: (time: { hour: number; minute: number; ampm: 'AM' | 'PM' }) => void;
  onClose: () => void;
}

export default function TimePickerModal({ visible, selectedDate, onSave, onClose }: TimePickerProps) {
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');
  const hourItems = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minuteItems = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));
  const { i18n } = useTranslation();  

  useEffect(() => {
    if (visible) {
      setHour(7);
      setMinute(0);
      setAmpm('AM');
    }
  }, [visible]);

  if (!visible) return null;

  function formatDate(dateString: string | null): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.dateContainer}>
            <Text style={styles.dateTitle}>Date</Text>
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        </View>
            
        <View style = {styles.timeContainer}>
          <Text style={styles.selectTimeText}>Select Time</Text>

          <View style = {{flexDirection: 'row'}}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <CustomPicker
                data={hourItems}
                selectedIndex={hour - 1}
                itemHeight={70}
                onChange={(index) => setHour(index + 1)}
              />
              <Text style={{ fontSize: 32, fontWeight: 'bold', marginHorizontal: 5 }}>:</Text>
              <CustomPicker
                data={minuteItems}
                selectedIndex={minute / 5}
                itemHeight={70}
                onChange={(index) => setMinute(index * 5)}
              />
            </View>            

            <View style={styles.row}>
                <TouchableOpacity
                    onPress={() => setAmpm('AM')}
                    style={[styles.ampmButton, ampm === 'AM' && styles.ampmButtonSelected]}
                >
                    <Text style={ampm === 'AM' ? styles.ampmTextSelected : styles.ampmText}>AM</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setAmpm('PM')}
                    style={[styles.ampmButton, ampm === 'PM' && styles.ampmButtonSelected]}
                >
                    <Text style={ampm === 'PM' ? styles.ampmTextSelected : styles.ampmText}>PM</Text>
                </TouchableOpacity>
            </View>
          </View>          
        </View> 

        <View style={styles.rowButtons}>
          <TouchableOpacity onPress={onClose} style={styles.actionButton}><Text>Cancelar</Text></TouchableOpacity>
          <TouchableOpacity
            onPress={() => onSave({ hour, minute, ampm })}
            style={[styles.actionButton, {backgroundColor: '#2B80BE'}]}
          >
            <Text style={{color: '#fff'}}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {    
    position: 'absolute',
    backgroundColor: '#000000',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  container: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 20,
    width: 370,
    alignItems: 'center',
  },
  dateContainer:{
    backgroundColor: "#FFFFFF",
    width: "95%",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  dateTitle: {
    fontFamily: "Roboto-Regular",
    fontWeight: 400,
    fontSize: 15,
    color: "#6200EE",
  },
  dateText: {
    fontFamily: "Roboto-Regular",
    fontWeight: 400,
    fontSize: 15,
    color: "#000000",
  },
  timeContainer: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    width: "95%",
    marginTop: 15,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  selectTimeText:{
    fontFamily: "Roboto-Regular",
    fontWeight: 400,
    fontSize: 15,
    color: "#000000",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#2B80BE',
    padding: 10,
    borderRadius: 6,
    marginHorizontal: 20,
  },
  buttonText:{
    fontFamily: "Roboto-Regular",
    fontWeight: 400,
    fontSize: 20,
    color: "#FFFFFF",
  },
  timeText: {
    fontSize: 36,
    fontWeight: '700',
    width: 60,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'column',
    alignItems: 'center',    
    alignSelf: "center",    
  },
  ampmButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 30,        
    marginHorizontal: 10,
  },
  ampmButtonSelected: {
    backgroundColor: '#2B80BE',
    borderColor: '#2B80BE',
  },
  ampmText: {
    fontWeight: '700',
    color: '#444',
  },
  ampmTextSelected: {
    fontWeight: '700',
    color: '#fff',
  },
  rowButtons: {
    flexDirection: 'row',
    marginTop: 25,
    width: '85%',
    justifyContent: 'space-between',
    alignSelf: "center"
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    backgroundColor: '#eee',
  },
});
