import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CoachCard from '../components/common/CoachCard';
import {fetchWithTimeout} from '../utils/fetchWithTimeout';
import {buildMediaUrl} from '../utils/urlHelpers';
import {createThumbnail} from 'react-native-create-thumbnail';

type Coach = {
  id: number;
  username: string;
  role: string;
  coachingRole: string;
  coachBiography: string;
  coachAchievements: string[];
  coachMediaFile: string;
};

export default function CoachesTabScreen() {
  const navigation = useNavigation();
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [thumbnails, setThumbnails] = useState<Record<number, string>>({});

  // Obtener coaches del backend
  const fetchCoaches = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchWithTimeout('/api/coach/all', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      const data = await response.json();
      const coachesData: Coach[] = data.coaches || [];
      setCoaches(coachesData);

      // Generar thumbnails para los videos
      const thumbPromises = coachesData.map(async coach => {
        // Validar que coachMediaFile exista y sea un string válido
        if (!coach.coachMediaFile || typeof coach.coachMediaFile !== 'string') {
          return {id: coach.id, thumbnail: ''};
        }

        const fullUrl = buildMediaUrl(coach.coachMediaFile);

        // Validar que sea un video y que la URL sea válida
        if (coach.coachMediaFile?.toLowerCase().endsWith('.mp4') && fullUrl) {
          try {
            const thumb = await createThumbnail({url: fullUrl});
            return {id: coach.id, thumbnail: thumb.path};
          } catch (err) {
            console.warn(
              `Error generando thumbnail para coach ${coach.id}:`,
              err,
            );
            return {id: coach.id, thumbnail: ''};
          }
        }
        return {id: coach.id, thumbnail: ''};
      });

      const thumbResults = await Promise.all(thumbPromises);
      const thumbMap: Record<number, string> = {};
      thumbResults.forEach(t => {
        if (t.thumbnail) {
          thumbMap[t.id] = t.thumbnail;
        }
      });
      setThumbnails(thumbMap);
    } catch (err) {
      console.error('Error fetching coaches:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCoaches();
  }, [fetchCoaches]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCoaches();
  };

  const renderContent = ({item}: {item: Coach}) => {
    // 🔹 Procesar la URL directamente del backend
    let mediaUrl = item.coachMediaFile || '';

    // Si la URL viene codificada por el backend, decodificarla
    if (mediaUrl.includes('https%3A') || mediaUrl.includes('http%3A')) {
      // Remover /media/ y decodificar
      mediaUrl = decodeURIComponent(mediaUrl.replace(/^\/?media\/?/, ''));
    } else if (mediaUrl && !mediaUrl.startsWith('http')) {
      // Si es una ruta relativa, usar buildMediaUrl
      mediaUrl = buildMediaUrl(mediaUrl);
    }

    const isVideo = mediaUrl?.toLowerCase().endsWith('.mp4');
    const thumbUrl = thumbnails[item.id];
    const displayUrl = isVideo && thumbUrl ? thumbUrl : mediaUrl;

    return (
      <CoachCard
        title={item.coachingRole || 'Coach'}
        name={item.username || 'Unknown'}
        tag={item.role || 'coach'}
        imageUrl={displayUrl}
        mediaUrl={mediaUrl}
        isVideo={isVideo}
        style={styles.coachCardWithMargin}
        onMorePress={() =>
          (navigation as any).navigate('CoachDetails', {coach: item})
        }>
        {item.coachBiography || ''}
      </CoachCard>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={coaches}
      keyExtractor={item => String(item.id)}
      renderItem={renderContent}
      ItemSeparatorComponent={ItemSeparator}
      contentContainerStyle={styles.contentContainer} // espacio al final
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

const ItemSeparator = () => <View style={styles.itemSeparator} />;

const styles = StyleSheet.create({
  coachCard: {
    marginHorizontal: 5,
  },
  coachCardWithMargin: {
    marginHorizontal: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  itemSeparator: {
    height: 20,
  },
});
