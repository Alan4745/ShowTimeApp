import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react-native';
import LessonCard from '../components/common/LessonCard';
import FilterModal from '../components/modals/filterModal';
import {useNavigation} from '@react-navigation/native';
import {fetchWithTimeout} from '../utils/fetchWithTimeout';

interface LearnCategoryScreenProps {
  title: string;
  // full category object from data/learnCategories
  category: {
    key: string;
    id: string;
    subcategories: {key: string; image: any}[];
  };
  subcategoryKey: string;
  onBack: () => void;
  onOpenCalendar: (lessonId: string) => void;
}

type MediaItem = {
  id: string;
  mediaType: 'image' | 'video' | 'audio';
  uri: string;
  // backend returns mediaUrl; include it here
  mediaUrl?: string;
  title?: string;
  author?: string;
  description?: string;
  subcategory?: string;
  variant?: string;
  format?: string;
  likes?: number;
  comments?: number;
};

type LessonFromAPI = MediaItem & {};

export default function LearnCategoryScreen({
  title,
  category,
  subcategoryKey,
  onBack,
  onOpenCalendar: _onOpenCalendar,
}: LearnCategoryScreenProps) {
  const {t} = useTranslation();

  const navigation: any = useNavigation();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [lessonsFromCoach, setLessonsFromCoach] = useState<LessonFromAPI[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<LessonFromAPI[]>([]);
  const [totalLessonsCount, setTotalLessonsCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const pageSize = 12;
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);

        console.log(`Fetching lessons for category ID: ${category.id}`);
        console.log('====================================');
        console.log(subcategoryKey);
        console.log('====================================');

        const params = new URLSearchParams({
          page: String(page),
          page_size: String(pageSize),
        });
        if (subcategoryKey) params.append('variant', subcategoryKey);

        const url = `/api/v1/courses/category/${
          category.id
        }/lessons?${params.toString()}`;
        const res = await fetchWithTimeout(url);
        if (!res.ok) throw new Error('Error fetching lessons');
        const data = await res.json();
        console.log(data);

        // obtener total de la respuesta paginada (count) si existe
        const total =
          typeof data.count === 'number'
            ? data.count
            : Array.isArray(data.results)
            ? data.results.length
            : 0;
        setTotalLessonsCount(total);
        setNextPageUrl(data.next ?? null);
        setPrevPageUrl(data.previous ?? null);

        // Filtrar y ordenar los datos basándose en subcategoryKey
        const sortedLessons = data.results.sort(
          (a: LessonFromAPI, b: LessonFromAPI) => {
            const aMatches = a.variant === subcategoryKey;
            const bMatches = b.variant === subcategoryKey;

            // Si ambos coinciden o ninguno coincide, mantener el orden original
            if (aMatches === bMatches) return 0;

            // Los que coinciden van primero (return -1 significa que 'a' va antes que 'b')
            return aMatches ? -1 : 1;
          },
        );

        setLessonsFromCoach(sortedLessons);
        setFilteredLessons(sortedLessons);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [category, subcategoryKey, page]);

  // reset page when category or subcategoryKey changes
  useEffect(() => {
    setPage(1);
  }, [category.id, subcategoryKey]);

  const handleOpenMedia = (media: MediaItem) => {
    navigation.navigate('MediaViewer', {
      media: {
        id: media.id,
        mediaType: media.mediaType,
        uri: media.mediaUrl ?? media.uri ?? '',
        title: media.title ?? '',
        author: media.author ?? '',
        description: media.description ?? '',
        subcategory: media.subcategory,
        format: media.format,
        likes: media.likes,
        comments: media.comments,
      },
    });
  };

  const applyFilters = (filters: {
    format?: string;
    sortByName?: 'asc' | 'desc';
  }) => {
    let updated = [...lessonsFromCoach];
    if (filters.format)
      updated = updated.filter(
        l => l.format?.toLowerCase() === filters.format!.toLowerCase(),
      );
    if (filters.sortByName)
      updated.sort((a, b) => {
        if (!a.author || !b.author) return 0;
        return filters.sortByName === 'asc'
          ? a.author.localeCompare(b.author)
          : b.author.localeCompare(a.author);
      });
    setFilteredLessons(updated);
  };

  const clearFilters = () => setFilteredLessons(lessonsFromCoach);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <ActivityIndicator size="large" color="#2B80BE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft color="#FFFFFF" size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Filter Button */}
      <View style={styles.filterContainer}>
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[
              styles.pageButton,
              !prevPageUrl && styles.pageButtonDisabled,
            ]}
            onPress={() =>
              prevPageUrl ? setPage(p => Math.max(1, p - 1)) : null
            }
            disabled={!prevPageUrl}>
            <ChevronLeft
              size={16}
              color={prevPageUrl ? '#FFFFFF' : 'rgba(255,255,255,0.3)'}
            />
          </TouchableOpacity>

          <Text style={styles.lessonCount}>
            {filteredLessons.length}/
            {totalLessonsCount || lessonsFromCoach.length}
          </Text>

          <TouchableOpacity
            style={[
              styles.pageButton,
              !nextPageUrl && styles.pageButtonDisabled,
            ]}
            onPress={() => (nextPageUrl ? setPage(p => p + 1) : null)}
            disabled={!nextPageUrl}>
            <ChevronRight
              size={16}
              color={nextPageUrl ? '#FFFFFF' : 'rgba(255,255,255,0.3)'}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}>
          <Text style={styles.filterText}>{t('learn.filter')}</Text>
          <SlidersHorizontal size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Media list */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredLessons.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>{t('learn.noLessons')}</Text>
          </View>
        ) : (
          filteredLessons.map(lesson => (
            <LessonCard
              key={lesson.id}
              id={lesson.id}
              title={lesson.title ?? ''}
              author={lesson.author ?? ''}
              description={lesson.description ?? ''}
              subcategory={lesson.subcategory}
              format={lesson.format}
              mediaType={lesson.mediaType as any}
              mediaUrl={lesson.mediaUrl ?? ''}
              onOpenMedia={() =>
                handleOpenMedia({
                  id: lesson.id,
                  mediaType: lesson.mediaType as 'image' | 'video' | 'audio',
                  uri: lesson.mediaUrl ?? lesson.uri ?? '',
                  title: lesson.title ?? '',
                  author: lesson.author ?? '',
                  description: lesson.description ?? '',
                  subcategory: lesson.subcategory,
                  variant: lesson.variant,
                  format: lesson.format,
                  likes: lesson.likes,
                  comments: lesson.comments,
                })
              }
            />
          ))
        )}
      </ScrollView>

      {/* Media now opens in a dedicated screen via navigation */}

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={applyFilters}
        onClear={clearFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: -6,
    padding: 8,
    zIndex: 10,
  },
  title: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 26,
    color: '#fff',
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 40,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  lessonCount: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.8,
  },

  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageButton: {
    padding: 6,
    marginHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageButtonDisabled: {
    opacity: 0.35,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 20,
    minWidth: 110,
    justifyContent: 'center',
    textAlignVertical: 'center',
  },
  filterText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 8,
  },
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  noResultsText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
    opacity: 0.7,
  },
});
