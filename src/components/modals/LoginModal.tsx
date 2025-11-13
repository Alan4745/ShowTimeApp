import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import PopupAlert from './PopupAlert';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react-native'
import LottieIcon from '../common/LottieIcon';
import loadingAnimation from '../../../assets/lottie/loading.json';
import { fetchWithTimeout } from '../../utils/fetchWithTimeout';
import { buildMediaUrl } from '../../utils/urlHelpers';


interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void; // opcional: para navegar luego del login
}

export default function LoginModal({ visible, onClose, onSuccess }: LoginModalProps) {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [touchedEmail, setTouchedEmail] = useState(false);
  const isFormValid = email.trim() && password.trim() && !emailError;  
  const endpoint = '/api/auth/login';

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    if (!touchedEmail) return;

    if (!email.trim()) {
      setEmailError(t('errors.emailRequired'));
    } else if (!validateEmail(email)) {
      setEmailError(t('errors.invalidEmail'));
    } else {
      setEmailError('');
    }
  }, [email, touchedEmail, t]);

  const showAlert = (msg: string) => {
    setAlertMessage(msg);
    setAlertVisible(true);
  };

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!email || !password) {
      showAlert(t('errors.emailPassewordRequired'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetchWithTimeout(endpoint, {
        method: 'POST',        
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();      

      if (!response.ok) {
        if (response.status === 401 && data.error === 'invalid_credentials') {
          showAlert(t('errors.invalidEmailOrPassword'));
        } else {
          showAlert(t('errors.loginFailed'));
        }
        return;
      }

      // Guarda en AuthContext
      await login(data.token, {
        ...data.user,
        studentProfileImage: data.user.studentProfileImage
          ? buildMediaUrl(data.user.studentProfileImage)
          : '',
      });

      // Limpiar inputs después de login exitoso
      setEmail('');
      setPassword('');
      setAlertVisible(false);
      setAlertMessage('');
      onClose(); // Cierra el modal
      onSuccess?.(); // Llama a navegación si se pasó
    } finally {
      // 🔹 No hay catch porque errores globales ya los maneja fetchWithTimeout
      setIsLoading(false);
    }
  };

  const handleClose = () => {
      setEmail('');
      setPassword('');
      setAlertVisible(false); // Oculta la alerta si está abierta
      setAlertMessage('');
      onClose();  
  }
  if (!visible) return null; // No renderiza nada si no está visible

  return (
    <View style={styles.fullscreenOverlay}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <TouchableOpacity style={styles.close} onPress={handleClose}>
            <X size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.title}>{t('registration.signIn')}</Text>

          <TextInput
            style={styles.input}
            placeholder={t('registration.email')}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={text => {
              setEmail(text);
              if (!touchedEmail) setTouchedEmail(true);
            }}
          />
          {touchedEmail && emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder={t('registration.password')}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.loginButton,
                !isFormValid && styles.disabledButton,
              ]}
              onPress={handleLogin}
              disabled={!isFormValid}
            >
              <Text
                style={[
                  styles.buttonText,
                  !isFormValid && { color: '#FFFFFF' },
                ]}
              >
                {t('registration.signIn')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <LottieIcon
              source={loadingAnimation}
              size={100}
              loop={true}
              autoPlay={true}
            />
          </View>
        )}

        {/* 🔹 Solo se usa para errores del login, no de red o sesión */}
        <PopupAlert
          visible={alertVisible}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // asegúrate que esté por encima del contenido
  },
  overlay: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalBox: {
    backgroundColor: '#000000',
    borderRadius: 10,
    width: '100%',
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 10,
  },
  close: {
    alignSelf: "flex-end"
  },
  title: {
    fontFamily: "AnonymousPro-Bold",
    fontWeight: '700',
    fontSize: 22,
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 5,  
    marginTop: 15  
  },
  errorText:{
    fontFamily: "AnonymousPro-Bold",
    fontWeight: '700',
    fontSize: 14,
    color: "red",
    marginBottom: 10,    
  },
  buttonContainer :{
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 15
  },
  button: {
    width: "50%",
    paddingVertical: 12,    
    borderRadius: 30,
    borderWidth: 1,   
  },
  disabledButton: {
    backgroundColor: '#2B80BE',     
  },
  loginButton:{
    backgroundColor: '#FFFFFF',
  },  
  buttonText: {
    fontFamily: "AnonymousPro-Regular",
    fontWeight: '400',
    fontSize: 16,
    color: '#2B80BE',
    textAlign: 'center',
  },
    loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  }
});
