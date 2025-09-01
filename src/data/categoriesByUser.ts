// src/data/categoriesByUser.ts
const categoriesByUserType = {
  Student: [
    'accomplishments',
    'announcements',
    'dailyMotivation',
    'highlightTape',
    'introduceYourself',
    'lifeOfAProfessional',
    'nutrition',
  ],
  Coach: [
    'announcements',
    'trainingTips',
    'playerHighlights',
    'coachingAdvice',
  ],
  Darwin: {
    Training: ['Strength', 'Power', '4WeekProgram', 'ExerciseLibrary'],
    Mindset: ['Anxiety', 'GrowthMindset', 'ConflictResolution', 'TeamDynamics'],
    Nutrition: ['Carbohydrates', 'Protein', 'Fat', 'SupplementsHydration', 'NutritionProgram'],
    Tactics: ['Finishing', 'Technical', 'PassingDribbling'],
    GameAnalysis: ['Defenders', 'Forwards', 'GeneralAnalysis', 'Interactive', 'Midfielders'],
  },
};

export default categoriesByUserType;

// Cambia este tipo también:
export type UserType = keyof typeof categoriesByUserType;
