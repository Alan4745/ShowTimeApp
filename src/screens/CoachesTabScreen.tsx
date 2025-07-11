import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import CoachCard from '../components/common/CoachCard';
import ContentCard from '../components/common/ContentCard';

const coaches = [
  {
    id: '1',
    name: 'NAME LAST',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown.',
    imageUrl: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    name: 'COACH TWO',
    description: 'Professional football coach with 10+ years of experience in developing young talent and tactical analysis.',
    imageUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function CoachesTabScreen() {

  const handleCoachPress = (coachId: string) => {
    console.log(`Coach ${coachId} pressed`);
  };

  const handleLessonPress = () => {
    console.log('Lesson pressed');
  };

  const renderCoach = ({ item }: { item: typeof coaches[0] }) => (
    <CoachCard
      name={item.name}
      description={item.description}
      imageUrl={item.imageUrl}
      onPress={() => handleCoachPress(item.id)}
    />
  );

  return (
    <View style={styles.container}>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Coaches Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coaches</Text>
          <FlatList
            data={coaches}
            renderItem={renderCoach}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.coachesCarousel}
          />
        </View>

        {/* Lessons Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lessons</Text>
          <ContentCard
            style={styles.lessonCard}
            onPress={handleLessonPress}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  coachesCarousel: {
    paddingRight: 20,
  },
  lessonCard: {
    height: 200,
  },
});
