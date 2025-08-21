import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import DropdownModal from '../modals/DropdownModal';

interface DateSelectorProps {
  selectedMonth: number | null;
  selectedDay: number | null;
  selectedYear: number | null;
  onMonthChange: (month: number | null) => void;
  onDayChange: (day: number | null) => void;
  onYearChange: (year: number | null) => void;
}

export default function DateSelector({
  selectedMonth,
  selectedDay,
  selectedYear,
  onMonthChange,
  onDayChange,
  onYearChange,
}: DateSelectorProps) {
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);

  const [monthInput, setMonthInput] = useState('');
  const [dayInput, setDayInput] = useState('');
  const [yearInput, setYearInput] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Sync input values with selected values
  useEffect(() => {
    setMonthInput(selectedMonth ? selectedMonth.toString() : '');
  }, [selectedMonth]);

  useEffect(() => {
    setDayInput(selectedDay ? selectedDay.toString() : '');
  }, [selectedDay]);

  useEffect(() => {
    setYearInput(selectedYear ? selectedYear.toString() : '');
  }, [selectedYear]);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const generateDays = () => {
    if (!selectedMonth || !selectedYear) {return Array.from({ length: 31 }, (_, i) => i + 1);}
    return Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => i + 1);
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 13; year >= currentYear - 100; year--) {
      years.push(year);
    }
    return years;
  };

  const handleMonthInputChange = (text: string) => {
    setMonthInput(text);

    if (text === '') {
      onMonthChange(null);
      return;
    }

    const month = parseInt(text);
    if (!isNaN(month) && month >= 1 && month <= 12) {
      onMonthChange(month);

      // Check if current day is valid for the new month
      if (selectedDay && selectedYear) {
        const maxDays = getDaysInMonth(month, selectedYear);
        if (selectedDay > maxDays) {
          onDayChange(null);
        }
      }
    } else {
      onMonthChange(null);
    }
  };

  const handleDayInputChange = (text: string) => {
    setDayInput(text);

    if (text === '') {
      onDayChange(null);
      return;
    }

    const day = parseInt(text);
    const maxDays = selectedMonth && selectedYear ? getDaysInMonth(selectedMonth, selectedYear) : 31;

    if (!isNaN(day) && day >= 1 && day <= maxDays) {
      onDayChange(day);
    } else {
      onDayChange(null);
    }
  };

  const handleYearInputChange = (text: string) => {
    setYearInput(text);

    if (text === '') {
      onYearChange(null);
      return;
    }

    const year = parseInt(text);
    const currentYear = new Date().getFullYear();

    if (!isNaN(year) && year >= currentYear - 100 && year <= currentYear - 13) {
      onYearChange(year);

      // Check if current day is valid for the new year
      if (selectedDay && selectedMonth) {
        const maxDays = getDaysInMonth(selectedMonth, year);
        if (selectedDay > maxDays) {
          onDayChange(null);
        }
      }
    } else {
      onYearChange(null);
    }
  };

  const handleMonthSelect = (monthName: string) => {
    const monthNumber = months.indexOf(monthName) + 1;
    onMonthChange(monthNumber);
    setShowMonthModal(false);

    // Check if current day is valid for the new month
    if (selectedDay && selectedYear) {
      const maxDays = getDaysInMonth(monthNumber, selectedYear);
      if (selectedDay > maxDays) {
        onDayChange(null);
      }
    }
  };

  const handleDaySelect = (day: number) => {
    onDayChange(day);
    setShowDayModal(false);
  };

  const handleYearSelect = (year: number) => {
    onYearChange(year);
    setShowYearModal(false);

    // Check if current day is valid for the new year
    if (selectedDay && selectedMonth) {
      const maxDays = getDaysInMonth(selectedMonth, year);
      if (selectedDay > maxDays) {
        onDayChange(null);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.selectorsContainer}>
        {/* Month Selector */}
        <View style={styles.selectorGroup}>
          {/* <Text style={styles.selectorLabel}>Month</Text> */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.textInput, selectedMonth && styles.selectedInput]}
              placeholder="Month"
              placeholderTextColor="#FFFFFF"
              value={monthInput}
              onChangeText={handleMonthInputChange}
              keyboardType="numeric"
              maxLength={2}
            />
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowMonthModal(true)}
            >
              <ChevronDown color="#FFFFFF" size={16} />
            </TouchableOpacity>
          </View>
          {selectedMonth && (
            <Text style={styles.selectedText}>{months[selectedMonth - 1]}</Text>
          )}
        </View>

        {/* Day Selector */}
        <View style={styles.selectorGroup}>
          {/* <Text style={styles.selectorLabel}>Day</Text> */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.textInput, selectedDay && styles.selectedInput]}
              placeholder="Day"
              placeholderTextColor="#FFFFFF"
              value={dayInput}
              onChangeText={handleDayInputChange}
              keyboardType="numeric"
              maxLength={2}
            />
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowDayModal(true)}
            >
              <ChevronDown color="#FFFFFF" size={16} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Year Selector */}
        <View style={styles.selectorGroup}>
          {/* <Text style={styles.selectorLabel}>Year</Text> */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.textInput, selectedYear && styles.selectedInput]}
              placeholder="Year"
              placeholderTextColor="#FFFFFF"
              value={yearInput}
              onChangeText={handleYearInputChange}
              keyboardType="numeric"
              maxLength={4}
            />
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowYearModal(true)}
            >
              <ChevronDown color="#FFFFFF" size={16} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modals */}
      <DropdownModal
        visible={showMonthModal}
        onClose={() => setShowMonthModal(false)}
        title="Select Month"
        items={months}
        onSelect={handleMonthSelect}
        renderItem={(month) => month}
      />

      <DropdownModal
        visible={showDayModal}
        onClose={() => setShowDayModal(false)}
        title="Select Day"
        items={generateDays()}
        onSelect={handleDaySelect}
        renderItem={(day) => day.toString()}
      />

      <DropdownModal
        visible={showYearModal}
        onClose={() => setShowYearModal(false)}
        title="Select Year"
        items={generateYears()}
        onSelect={handleYearSelect}
        renderItem={(year) => year.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 40,
  },
  selectorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  selectorGroup: {
    alignItems: 'center',
    flex: 1,
  },
  selectorLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  textInput: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingRight: 40,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    minWidth: 80,
  },
  selectedInput: {
    borderColor: '#2B80BE',
    backgroundColor: '#2B80BE',
  },
  dropdownButton: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: [{ translateY: -8 }],
    padding: 4,
  },
  selectedText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 4,
    textAlign: 'center',
  },
});
