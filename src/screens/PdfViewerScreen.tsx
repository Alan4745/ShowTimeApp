import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import RNFetchBlob from 'react-native-blob-util';
// Optional native PDF renderer (faster, better PDF features)
import Pdf from 'react-native-pdf';
import {useAuth} from '../context/AuthContext';
import {useRoute, useNavigation} from '@react-navigation/native';
import {X} from 'lucide-react-native';

type RouteParams = {
  uri: string;
  id?: string;
  title?: string;
};

export default function PdfViewerScreen() {
  const route = useRoute();
  const navigation: any = useNavigation();
  const {uri: initialUri, id, title} = (route.params || {}) as RouteParams;
  const {token} = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewerUri, setViewerUri] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setError(null);
      setLoading(true);

      try {
        if (!initialUri) {
          throw new Error('No hay URI para el PDF');
        }

        // Si ya es un file:// local, mostrar directamente
        if (initialUri.startsWith('file://')) {
          setViewerUri(initialUri);
          return;
        }

        // Intentar descargar con headers si es necesario
        const headers: Record<string, string> = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const dest = `${RNFetchBlob.fs.dirs.CacheDir}/showtime_${
          id || 'pdf'
        }.pdf`;

        const resp = await RNFetchBlob.config({
          fileCache: true,
          appendExt: 'pdf',
          path: dest,
        })
          .fetch('GET', initialUri, headers)
          .progress((received, total) => {
            const r = Number(received || 0);
            const t = Number(total || 0);
            const pct = t > 0 ? Math.round((r / t) * 100) : 0;
            if (mounted) {
              setDownloadProgress(pct);
            }
          });

        const p = resp.path();
        const fileUri = p.startsWith('file://') ? p : `file://${p}`;
        if (mounted) {
          setViewerUri(fileUri);
        }
      } catch (e: any) {
        console.warn('PdfViewer error', e);
        if (mounted) {
          setError(e && e.message ? e.message : 'Error cargando PDF');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [initialUri, id, token]);

  const openExternally = async () => {
    if (!initialUri) {
      return;
    }
    try {
      if (
        Platform.OS === 'android' &&
        RNFetchBlob &&
        RNFetchBlob.android &&
        RNFetchBlob.android.actionViewIntent &&
        viewerUri
      ) {
        RNFetchBlob.android.actionViewIntent(viewerUri, 'application/pdf');
        return;
      }
      await Linking.openURL(initialUri);
    } catch (e) {
      console.warn('Error opening external PDF', e);
      Alert.alert('Error', 'No se pudo abrir el PDF externamente');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <X size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
          {title || 'PDF'}
        </Text>
      </View>

      <View style={styles.content}>
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#2B80BE" />
            <Text style={styles.statusText}>
              Descargando... {downloadProgress}%
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.externalButton}
              onPress={openExternally}>
              <Text style={styles.externalButtonText}>Abrir externamente</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && viewerUri && (
          // Preferir native Pdf renderer cuando esté disponible
          <Pdf
            source={
              viewerUri.startsWith('file://')
                ? {uri: viewerUri}
                : token
                ? {
                    uri: initialUri,
                    headers: {Authorization: `Bearer ${token}`},
                    cache: true,
                  }
                : {uri: initialUri, cache: true}
            }
            onLoadComplete={(numberOfPages: number, filePath?: string) => {
              console.log(`PDF loaded, pages: ${numberOfPages}`, filePath);
            }}
            onPageChanged={(_page: number, _numberOfPages: number) => {
              // page changed
            }}
            onError={(err: any) => {
              console.warn('react-native-pdf error', err);
            }}
            style={styles.pdf}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  backButton: {padding: 8},
  headerTitle: {color: '#FFF', fontSize: 16, marginLeft: 8, flex: 1},
  content: {flex: 1},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  statusText: {color: '#FFF', marginTop: 8},
  errorText: {color: '#FFF', marginBottom: 12},
  externalButton: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  externalButtonText: {color: '#FFF'},
  webview: {flex: 1, backgroundColor: '#fff'},
  pdf: {flex: 1, width: '100%', backgroundColor: '#fff'},
});
