import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import ScreenLayout from '../components/common/ScreenLayout';
import ImagePickerModal from '../components/modals/ImagePickerModal';
import EditFieldModal from '../components/modals/EditFieldModal';
import {Pencil, ArrowRight} from 'lucide-react-native';
import {useAuth} from '../context/AuthContext';

export default function EditProfileScreen() {
  const {t} = useTranslation();
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editFieldTitle, setEditFieldTitle] = useState('');
  const [editFieldValue, setEditFieldValue] = useState('');
  const [currentFieldKey, setCurrentFieldKey] = useState<string | null>(null);
  const {user: authUser} = useAuth();

  console.log('====================================');
  console.log(authUser);
  console.log('====================================');

  // Parse fields that are stored as JSON strings in the user payload
  const rawDob = (authUser as any)?.dateOfBirth ?? null;
  let dateOfBirth: {month?: number; day?: number; year?: number} | null = null;
  try {
    dateOfBirth = rawDob ? JSON.parse(rawDob) : null;
  } catch (e) {
    dateOfBirth = null;
  }

  const rawPhysical = (authUser as any)?.physicalData ?? null;
  let physicalData: {
    weight?: number;
    weightUnit?: string;
    height?: number;
    heightUnit?: string;
  } | null = null;
  try {
    physicalData = rawPhysical ? JSON.parse(rawPhysical) : null;
  } catch (e) {
    physicalData = null;
  }

  const rawSelectedPlan = (authUser as any)?.selectedPlan ?? null;
  let selectedPlan: {
    id?: string;
    title?: string;
    price?: string;
    priceValue?: number;
  } | null = null;
  try {
    selectedPlan = rawSelectedPlan ? JSON.parse(rawSelectedPlan) : null;
  } catch (e) {
    selectedPlan = null;
  }

  const handleImagePicked = (_image: {path: string}) => {
    //updateData({ studentProfileImage: _image.path });
  };

  function formatHeight(height: number, unit: string) {
    // Normalización: si unidad es 'ft' pero el valor es muy grande (ej. > 30),
    // probablemente venga en cm por error; tratamos ese caso.
    if (unit === 'ft') {
      if (height > 30) {
        // tratar height como cm y convertir a ft/in
        const totalInches = Math.round((height as number) / 2.54);
        const feet = Math.floor(totalInches / 12);
        const inches = totalInches % 12;
        return `${feet} ft ${inches} in`;
      }

      const feet = Math.floor(height);
      const fractionalFeet = height - feet;
      const inches = Math.round(fractionalFeet * 12);
      return `${feet} ft ${inches} in`;
    }

    if (unit === 'cm') {
      return `${height} cm`;
    }

    return `${height} ${unit}`;
  }

  const openEditModal = (
    fieldTitle: string,
    fieldValue: string,
    fieldKey?: string,
  ) => {
    setEditFieldTitle(fieldTitle);
    setEditFieldValue(fieldValue);
    setCurrentFieldKey(fieldKey || null);
    setEditModalVisible(true);
  };

  const handleSaveEdit = (newValue: string) => {
    console.log(`Saving ${editFieldTitle}: ${newValue}`);
    // Aquí podrías hacer updateUserData(currentFieldKey, newValue);
    setEditModalVisible(false);
  };

  const renderProfileRow = (
    title: string,
    value: string,
    onPress?: () => void,
    icon: React.ReactNode = <Pencil size={24} color="#FFFFFF" />,
  ) => (
    <View style={styles.contentSubsection}>
      <View>
        <Text style={styles.contentTitles}>{title}</Text>
        {value !== '' && <Text style={styles.dataText}>{value}</Text>}
      </View>
      <TouchableOpacity onPress={onPress}>{icon}</TouchableOpacity>
    </View>
  );

  return (
    <ScreenLayout>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/*TITULO*/}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{t('account.titles.account')}</Text>
        </View>

        {/*AVATAR & NAME*/}
        <View style={styles.headerContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={
                (authUser as any)?.studentProfileImage ||
                (authUser as any)?.avatar
                  ? {
                      uri:
                        (authUser as any)?.studentProfileImage ||
                        (authUser as any)?.avatar,
                    }
                  : require('../../assets/img/userGeneric.png')
              }
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.editIconContainer}
              onPress={() => setPickerModalVisible(true)}>
              <Pencil size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>
              {(authUser as any)?.username ?? ''}
            </Text>
          </View>
        </View>

        {/*CONTENT SECTION*/}
        <View style={styles.contentSection}>
          {renderProfileRow(
            'User Name',
            (authUser as any)?.username ?? '',
            () =>
              openEditModal(
                'User Name',
                (authUser as any)?.username ?? '',
                'username',
              ),
          )}

          {renderProfileRow('Mail', (authUser as any)?.email ?? '', () =>
            openEditModal('Mail', (authUser as any)?.email ?? '', 'email'),
          )}

          {renderProfileRow('Number', (authUser as any)?.phoneNumber ?? '')}

          {renderProfileRow(
            'Weight and Height',
            `${physicalData?.weight ?? ''} ${
              physicalData?.weightUnit ?? ''
            } / ${formatHeight(
              physicalData?.height ?? 0,
              physicalData?.heightUnit ?? 'cm',
            )}`,
          )}

          {renderProfileRow('Position', (authUser as any)?.position ?? '')}

          {dateOfBirth
            ? renderProfileRow(
                'Date of birth',
                `${dateOfBirth.day ?? ''}/${dateOfBirth.month ?? ''}/${
                  dateOfBirth.year ?? ''
                }`,
              )
            : null}

          {selectedPlan
            ? renderProfileRow(
                'Plan',
                // si title viene como clave i18n, tradúcela; si no, mostrar id
                ((selectedPlan.title && (t as any)(selectedPlan.title)) ||
                  selectedPlan.id) ??
                  '',
              )
            : null}
        </View>

        {/* BOTTOM SECTION*/}
        <View style={styles.contentSection}>
          <View style={styles.contentSubsection}>
            <View>
              <Text style={styles.text}>Change Password</Text>
            </View>
            <ArrowRight size={24} color="#FFFFFF" />
          </View>
          <View style={styles.contentSubsection}>
            <View>
              <Text style={styles.text}>Delete Account</Text>
            </View>
            <ArrowRight size={24} color="#FFFFFF" />
          </View>
        </View>
      </ScrollView>
      <ImagePickerModal
        visible={pickerModalVisible}
        onClose={() => setPickerModalVisible(false)}
        onImagePicked={handleImagePicked}
      />

      <EditFieldModal
        visible={editModalVisible}
        title={editFieldTitle}
        initialValue={editFieldValue}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveEdit}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 21,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  titleText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 20,
    gap: 20,
  },
  avatarWrapper: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60, // mitad del ancho y alto
  },
  editIconContainer: {
    position: 'absolute',
    right: -25,
    bottom: 0,
    borderRadius: 20,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'column',
  },
  nameText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    fontSize: 25,
    color: '#FFFFFF',
  },
  contentSection: {
    backgroundColor: '#252A30',
    marginTop: 20,
  },
  contentSubsection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  contentTitles: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: '#868686',
  },
  dataText: {
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
    color: '#FFFFFF',
  },
  text: {
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
  },
});
