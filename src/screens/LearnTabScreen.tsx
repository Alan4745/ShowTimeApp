import React, {useState} from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import LearnContentCard from '../components/common/LearnContentCard';
import { learnCategories } from '../data/learnCategories';
import LearnCategoryScreen from './LearnCategoryScreen';

export default function LearnTabScreen() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCardPress = (categoryTitle: string) => {
    setSelectedCategory(categoryTitle);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  }

  // Si hay categoría seleccionada, mostrar la pantalla correspondiente
  if (selectedCategory) {    
    const title = t(`learn.categories.${selectedCategory}`);    
    return <LearnCategoryScreen title={title} onBack={handleBack} />;
  }

  // Pantalla principal (categorías)
  return (
    <ScrollView style={styles.container}>
      {learnCategories.map((category, categoryIndex) => (
        <View key={categoryIndex} style={styles.categorySection}>
          <Text style={styles.categoryTitle}>{t(`learn.categories.${category.key}`)}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {category.subcategories.map((sub, subIndex) => {
              const COLOR_A = '#252A30';
              const COLOR_B = '#2B80BE';

              const isEvenCategory = categoryIndex % 2 === 0;

              const backgroundColor = (isEvenCategory ? subIndex % 2 === 0 : subIndex % 2 !== 0)
                ? COLOR_A
                : COLOR_B;

              return (
                <LearnContentCard
                  key={subIndex}
                  title={t(`learn.subcategories.${sub.key}.title`)}
                  image={sub.image}
                  description={t(`learn.subcategories.${sub.key}.description`)}
                  backgroundColor={backgroundColor}
                  onPress={() => handleCardPress(category.key)}
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
    fontWeight: "700",
    fontSize: 22,
    color: '#FFFFFF',    
    marginBottom: 12,
  }, 
});
