// src/data/categoriesByUser.ts
const categoriesByUserType = {
  student: [
    'accomplishments',
    'announcements',
    'dailyMotivation',
    'highlightTape',
    'introduceYourself',
    'lifeOfAProfessional',
    'nutrition',
  ],
  coach: [
    'accomplishments',
    'questions',
    'announcements',
    'lifeAsAProfessional',
  ],
  admin: {
    training: ['strength', 'power', '4WeekProgram', 'exerciseLibrary', 'Workout'],
    mindset: ['anxiety', 'growthMindset', 'conflictResolution', 'teamDynamics'],
    nutrition: ['carbohydrates', 'protein', 'fat', 'supplementsHydration', 'nutritionProgram'],
    tactics: ['finishing', 'technical', 'passingDribbling'],
    gameAnalysis: ['defenders', 'forwards', 'generalAnalysis', 'interactive', 'midfielders'],
  },
};

export default categoriesByUserType;

export type UserType = keyof typeof categoriesByUserType;
