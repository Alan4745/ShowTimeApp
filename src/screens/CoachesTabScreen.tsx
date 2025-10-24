import React, {useState, useEffect, useCallback}  from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CoachCard from '../components/common/CoachCard';
import { fetchWithTimeout } from '../utils/fetchWithTimeout';
import { buildMediaUrl } from '../utils/urlHelpers';
import { createThumbnail } from 'react-native-create-thumbnail';

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
      const response = await fetchWithTimeout(`/api/coach/all`, {
        method: 'GET',
      });
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      const coachesData: Coach[] = data.coaches || [];
      setCoaches(coachesData);

      // Generar thumbnails para los videos
      const thumbPromises = coachesData.map(async (coach) => {
        const fullUrl = buildMediaUrl(coach.coachMediaFile);
        if (coach.coachMediaFile?.toLowerCase().endsWith('.mp4')) {
          try {
            const thumb = await createThumbnail({ url: fullUrl });
            return { id: coach.id, thumbnail: thumb.path };
          } catch (err) {
            console.warn(`Error generando thumbnail para coach ${coach.id}:`, err);
            return { id: coach.id, thumbnail: '' };
          }
        }
        return { id: coach.id, thumbnail: '' };
      });

      const thumbResults = await Promise.all(thumbPromises);
      const thumbMap: Record<number, string> = {};
      thumbResults.forEach((t) => {
        if (t.thumbnail) thumbMap[t.id] = t.thumbnail;
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

  const renderContent = ({ item }: { item: Coach }) => {
    const isVideo = item.coachMediaFile?.toLowerCase().endsWith('.mp4');
    const mediaUrl = buildMediaUrl(item.coachMediaFile);
    const thumbUrl = thumbnails[item.id];
    const displayUrl = isVideo && thumbUrl ? thumbUrl : mediaUrl;

    return (
      <CoachCard
        title={item.coachingRole}
        name={item.username}
        tag={item.role}
        imageUrl={displayUrl}
        mediaUrl={mediaUrl}   
        isVideo={isVideo}
        style={{ marginHorizontal: 5 }}
        onMorePress={() =>
          (navigation as any).navigate('CoachDetails', { coach: item })
        }
      >
        {item.coachBiography}
      </CoachCard>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={coaches}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderContent}
      ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
      contentContainerStyle={{ paddingBottom: 40 }} // espacio al final
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }      
    />    
  );
}

