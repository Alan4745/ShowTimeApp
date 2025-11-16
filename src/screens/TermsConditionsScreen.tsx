import React, {useEffect, useState, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
  BackHandler,
  Alert,
  Platform,
} from 'react-native';
import {WebView} from 'react-native-webview';
import RNFetchBlob from 'react-native-blob-util';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, Text} from 'react-native';
import {X} from 'lucide-react-native';

const TERMS_URL = 'https://showtimeuni.com/policies/terms-of-service';

export default function TermsConditionsScreen() {
  const navigation: any = useNavigation();
  const {t} = useTranslation();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      try {
        // Intentar hacer una petición HEAD para comprobar conectividad al recurso
        const resp = await fetch(TERMS_URL, {method: 'HEAD'});
        if (mounted) {
          setIsConnected(resp && resp.ok ? true : false);
        }
      } catch (e) {
        if (mounted) {
          setIsConnected(false);
        }
      }
    };

    check();

    return () => {
      mounted = false;
    };
  }, []);

  // Prevent hardware back while on this screen
  useFocusEffect(
    useCallback(() => {
      const onBack = () => {
        // consume the back button to keep user on this screen
        return true;
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
      return () => {
        sub.remove();
      };
    }, []),
  );

  // If offline, load local PDF by copying asset to cache and opening PdfViewerScreen
  useEffect(() => {
    let mounted = true;
    const openLocalPdf = async () => {
      try {
        setLoading(true);
        const assetPath = 'doc/Showtime University Terms and Conditions.pdf';

        let base64: string | null = null;

        // Try Android assets read
        try {
          base64 = await (RNFetchBlob.fs as any).readFileAssets(
            assetPath,
            'base64',
          );
        } catch (e) {
          // Try reading from main bundle (iOS) or from relative path
          try {
            const possible = `${
              (RNFetchBlob.fs as any).dirs.MainBundleDir
            }/${assetPath}`;
            base64 = await (RNFetchBlob.fs as any).readFile(possible, 'base64');
          } catch (err) {
            console.warn('No se pudo leer asset desde MainBundleDir', err);
          }
        }

        if (!base64) {
          throw new Error('No se pudo leer el PDF local desde los assets');
        }

        const dest = `${
          (RNFetchBlob.fs as any).dirs.CacheDir
        }/showtime_terms.pdf`;
        await (RNFetchBlob.fs as any).writeFile(dest, base64, 'base64');
        const fileUri =
          Platform.OS === 'android' ? `file://${dest}` : `file://${dest}`;

        if (mounted) {
          // Replace current screen with PdfViewer so user can't go back
          navigation.replace('PdfViewer', {
            uri: fileUri,
            title: t('registration.termsTitle'),
          });
        }
      } catch (e) {
        console.warn('Error al abrir PDF local', e);
        Alert.alert(
          'Error',
          'No hay conexión y no se pudo cargar el PDF local.',
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (isConnected === false) {
      openLocalPdf();
    }

    return () => {
      mounted = false;
    };
  }, [isConnected, navigation, t]);

  const onShouldStartLoadWithRequest = (request: any) => {
    // Permitir solo navegación dentro del mismo host (stay on showtimeuni)
    try {
      const url = request.url || '';
      const allowedHost = 'showtimeuni.com';
      if (url.startsWith('about:blank')) {
        return true;
      }
      const hostMatch = url.includes(allowedHost);
      if (hostMatch) {
        return true;
      }
      // Bloquear navegación a otros hosts
      return false;
    } catch (e) {
      return false;
    }
  };

  if (isConnected === null || (isConnected === false && loading)) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0a84ff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityLabel="Cerrar"
          onPress={() => navigation.goBack()}
          style={styles.closeButton}>
          <X size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('registration.termsTitle')}</Text>
      </View>
      <WebView
        source={{uri: TERMS_URL}}
        startInLoadingState
        onLoadEnd={() => setLoading(false)}
        renderLoading={() => (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#0a84ff" />
          </View>
        )}
        style={styles.webview}
        originWhitelist={['*']}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
    backgroundColor: '#fff',
  },
  closeButton: {padding: 8},
  headerTitle: {fontSize: 16, fontWeight: '600', marginLeft: 8},
  webview: {flex: 1},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
