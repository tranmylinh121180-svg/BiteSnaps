export enum ViewState {
  ONBOARDING = 'ONBOARDING',
  TUTORIAL = 'TUTORIAL',
  FEED = 'FEED',
  CAMERA = 'CAMERA',
  STATS = 'STATS',
  CHALLENGES = 'CHALLENGES',
  PROFILE = 'PROFILE',
  WRAPPED = 'WRAPPED'
}

export interface User {
  username: string;
  email: string;
  avatarUrl?: string;
  streak: number;
  totalMeals: number;
  eatingStyle: string[];
  friends: string[];
}

export interface AnalysisResult {
  foodName: string;
  category: string[]; // Comfort, Sweet, Savory, Green, Protein, Snack, Drink
  moodSuggestion: string;
  timeContext: string; // Morning, Afternoon, Evening, Late Night
  isHealthyLean: boolean; // For "Green" challenges
  isWater: boolean; // For hydration challenges
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  timestamp: number;
  imageUrl: string;
  caption: string;
  analysis: AnalysisResult | null;
  likes: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'SOLO' | 'FRIENDS' | 'COMMUNITY';
  targetCount: number;
  currentCount: number;
  completed: boolean;
  requiredCategory?: string; // e.g., "Green", "Drink"
}

export interface WeeklyStats {
  labels: string[];
  data: number[];
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}