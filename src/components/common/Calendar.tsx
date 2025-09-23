import React, { useEffect } from 'react';
import { Calendar as RNCalendar, CalendarProps, LocaleConfig } from 'react-native-calendars';
import { useTranslation } from 'react-i18next';

export default function Calendar(props: CalendarProps) {
  const { i18n } = useTranslation();

  useEffect(() => {
    LocaleConfig.locales['en'] = {
      monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      monthNamesShort: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ],
      dayNames: [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
      ],
      dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      today: 'Today',
    };

    LocaleConfig.locales['es'] = {
      monthNames: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ],
      monthNamesShort: [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
      ],
      dayNames: [
        'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
      ],
      dayNamesShort: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      today: 'Hoy',
    };

    LocaleConfig.defaultLocale = i18n.language;
  }, [i18n.language]);

  return (
    <RNCalendar
      hideExtraDays={true}
      firstDay={1}
      theme={{
        backgroundColor: '#FFFFFF',
        calendarBackground: '#FFFFFF',
        textSectionTitleColor: '#000000',
        dayTextColor: '#000000',
        textDisabledColor: '#888888',
        monthTextColor: '#000000',
        arrowColor: '#000000',
        todayTextColor: '#000000',

        textDayFontFamily: 'Roboto-Regular',
        textDayFontWeight: '400',
        textDayFontSize: 16,

        textMonthFontFamily: 'Roboto-Medium',
        textMonthFontSize: 18,

        textDayHeaderFontFamily: 'Roboto-Medium',
        textDayHeaderFontWeight: '400',
        textDayHeaderFontSize: 18,

        'stylesheet.calendar.header': {
          headerContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          },
          monthText: {
            fontFamily: 'Roboto-Medium',
            fontWeight: '500',
            fontSize: 18,
            color: '#000000',
          },
          arrowStyle: {
            padding: 10,
          },
        }
      } as any}
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        width: '90%',
        alignSelf: 'center',
      }}
      {...props}
    />
  );
}
