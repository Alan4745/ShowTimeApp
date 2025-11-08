import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../context/AuthContext';
import ScreenLayout from '../components/common/ScreenLayout';
import SubscriptionsSection from '../components/common/SubscriptionsSection';
import SavedExercisesCalendar from '../components/common/SavedExercisesCalendar';
import SettingsSection from '../components/common/SettingsSection';
import UploadSection from '../components/common/UploadSection';
import {buildMediaUrl} from '../utils/urlHelpers';
import {fetchWithTimeout} from '../utils/fetchWithTimeout';

type ButtonKey = 'coach' | 'save' | 'settings' | 'students' | 'upload';

export default function AccountScreen() {
  const {t} = useTranslation();
  const {token, user} = useAuth();
  const userType = user?.role || 'student';
  const navigation = useNavigation();
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState<ButtonKey | null>(null);

  // Define qué botones mostrar según tipo de usuario
  const buttons: ButtonKey[] =
    userType === 'student'
      ? ['coach', 'save', 'settings']
      : ['students', 'upload', 'settings'];

  useEffect(() => {
    const initial = userType === 'student' ? 'coach' : 'students';
    setActiveButton(initial);
  }, [userType]);

  // Obtener datos desde el endpoint correcto
  useEffect(() => {
    if (!activeButton || !token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        let endpoint: string | null = null;

        if (userType === 'student' && activeButton === 'coach') {
          endpoint = `/api/v1/chat/coaches/active/`;
        } else if (
          (userType === 'coach' || userType === 'admin') &&
          activeButton === 'students'
        ) {
          endpoint = `/api/v1/chat/students/active/`;
        }

        if (!endpoint) {
          setDataList([]);
          setLoading(false);
          return;
        }

        const res = await fetchWithTimeout(endpoint);

        if (!res.ok) {
          console.error('Error fetching list', await res.text());
          setDataList([]);
        } else {
          const json = await res.json();
          setDataList(json.results || []);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setDataList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeButton, userType, token]);

  // Cuando se selecciona a alguien para chatear
  const handleMessagePress = (person: any) => {
    // Deducimos el recipiente, según el rol del usuario
    let recipientRole: 'coach' | 'student' | 'admin' = 'student';

    if (userType === 'student') {
      // Si el usuario es estudiante y hace clic en alguien,
      // es un coach (o si agregas chat con admin, podrías validarlo distinto)
      recipientRole = 'coach';
    } else if (userType === 'coach' || userType === 'admin') {
      recipientRole = 'student';
    }

    (navigation as any).navigate('Chat', {
      id: person.id,
      name: person.username || person.fullName,
      avatar: buildMediaUrl(person.avatar),
      role: recipientRole,
    });
  };

  return (
    <ScreenLayout>
      {/*TITULO*/}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{t('account.titles.account')}</Text>
      </View>

      {/*BOTONES*/}
      {activeButton && (
        <View style={styles.buttonContainer}>
          {buttons.map(key => (
            <TouchableOpacity
              key={key}
              style={[
                styles.button,
                activeButton === key && styles.activeButton,
              ]}
              onPress={() => setActiveButton(key)}>
              <Text style={styles.buttonText}>
                {t(`account.buttons.${key}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* LISTA DE CONVERSACIÓN */}
      <View style={styles.listContainer}>
        {activeButton === (userType === 'student' ? 'coach' : 'students') &&
          (loading ? (
            <ActivityIndicator size="large" color="#2B80BE" />
          ) : (
            <View style={{height: '90%'}}>
              <SubscriptionsSection
                userType={userType as 'student' | 'coach' | 'admin'}
                data={dataList}
                onMessagePress={handleMessagePress}
              />
            </View>
          ))}
      </View>

      {/* SECCIONES EXTRA */}

      {/* Saved Calendar Section */}
      {activeButton === 'save' && <SavedExercisesCalendar />}

      {/* Settings Section */}
      {activeButton === 'settings' && (
        <SettingsSection
          userType={userType as 'coach' | 'student' | 'darwin'}
        />
      )}

      {/* Upload Section */}
      {activeButton === 'upload' && <UploadSection />}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 21,
  },
  titleText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
  },
  button: {
    height: 40,
    width: 110,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 57,
  },
  activeButton: {
    backgroundColor: '#2B80BE',
    borderColor: '#2B80BE',
  },
  buttonText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    fontSize: 14,
    color: '#FFFFFF',
  },
  listContainer: {
    marginTop: 40,
    paddingHorizontal: 30,
  },
});
