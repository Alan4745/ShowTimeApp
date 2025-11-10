import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';
import LearnContentCard from '../components/common/LearnContentCard';
import LearnCategoryScreen from './LearnCategoryScreen';
import CalendarScreen from './CalendarScreen';
import {learnCategories} from '../data/learnCategories';

// Category type derived from the data file
type Category = (typeof learnCategories)[number];

export default function LearnTabScreen() {
  const {t} = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [calendarLesson, setCalendarLesson] = useState<{
    lessonId: string;
    title: string;
  } | null>(null);

  const handleOpenCalendar = (lessonId: string) => {
    if (selectedCategory) {
      setCalendarLesson({
        lessonId,
        title: t(`learn.categories.${selectedCategory.key}`),
      });
    }
  };

  const handleCardPress = (category: Category, subcategoryKey: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategoryKey);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  if (calendarLesson) {
    return (
      <CalendarScreen
        lessonId={calendarLesson.lessonId}
        title={calendarLesson.title}
        onBack={() => setCalendarLesson(null)}
      />
    );
  }

  // Si hay categoría seleccionada, mostrar la pantalla correspondiente
  if (selectedCategory && selectedSubcategory) {
    const categoryTitle = t(`learn.categories.${selectedCategory.key}`);
    return (
      <LearnCategoryScreen
        title={categoryTitle}
        category={selectedCategory}
        subcategoryKey={selectedSubcategory}
        onBack={handleBack}
        onOpenCalendar={handleOpenCalendar}
      />
    );
  }

  // Pantalla principal (categorías)
  return (
    <ScrollView style={styles.container}>
      {learnCategories.map((category, categoryIndex) => (
        <View key={categoryIndex} style={styles.categorySection}>
          <Text style={styles.categoryTitle}>
            {t(`learn.categories.${category.key}`)}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {category.subcategories.map((sub, subIndex) => {
              const COLOR_A = '#252A30';
              const COLOR_B = '#2B80BE';

              const isEvenCategory = categoryIndex % 2 === 0;

              const backgroundColor = (
                isEvenCategory ? subIndex % 2 === 0 : subIndex % 2 !== 0
              )
                ? COLOR_A
                : COLOR_B;

              return (
                <LearnContentCard
                  key={subIndex}
                  title={t(`learn.subcategories.${sub.key}.title`)}
                  image={sub.image}
                  description={t(`learn.subcategories.${sub.key}.description`)}
                  backgroundColor={backgroundColor}
                  onPress={() => handleCardPress(category, sub.key)}
                />
              );
            })}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#000000',
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    fontSize: 22,
    color: '#FFFFFF',
    marginBottom: 12,
  },
});
