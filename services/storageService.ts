import { User, Post, Challenge } from "../types";

const STORAGE_KEYS = {
  USER: 'bitesnaps_user',
  POSTS: 'bitesnaps_posts',
  CHALLENGES: 'bitesnaps_challenges',
  HAS_SEEN_TUTORIAL: 'bitesnaps_seen_tutorial'
};

const INITIAL_CHALLENGES: Challenge[] = [
  { id: '1', title: 'Hydration Hero', description: 'Drink water 3 times today', type: 'SOLO', targetCount: 3, currentCount: 0, completed: false, requiredCategory: 'Drink' },
  { id: '2', title: 'Green Thumb', description: 'Add something green once', type: 'SOLO', targetCount: 1, currentCount: 0, completed: false, requiredCategory: 'Green/fresh' },
  { id: '3', title: 'New Flavors', description: 'Try 1 new dish this week', type: 'COMMUNITY', targetCount: 1, currentCount: 0, completed: false },
];

export const saveUser = (user: User) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const savePost = (post: Post) => {
  const posts = getPosts();
  posts.unshift(post); // Add to top
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  
  // Update User stats
  const user = getUser();
  if (user) {
    user.totalMeals += 1;
    saveUser(user);
  }

  // Update Challenges
  updateChallenges(post);
};

export const getPosts = (): Post[] => {
  const data = localStorage.getItem(STORAGE_KEYS.POSTS);
  return data ? JSON.parse(data) : [];
};

export const getChallenges = (): Challenge[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
  return data ? JSON.parse(data) : INITIAL_CHALLENGES;
};

const updateChallenges = (post: Post) => {
  const challenges = getChallenges();
  let updated = false;

  const newChallenges = challenges.map(c => {
    if (c.completed) return c;
    
    // Logic for challenge completion based on AI tags
    let match = false;
    if (c.id === '1' && post.analysis?.isWater) match = true;
    if (c.id === '2' && post.analysis?.category.includes('Green/fresh')) match = true;
    if (c.id === '3') match = true; // Generic "Try a dish" for demo purposes

    if (match) {
      updated = true;
      const newCount = c.currentCount + 1;
      return { ...c, currentCount: newCount, completed: newCount >= c.targetCount };
    }
    return c;
  });

  if (updated) {
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(newChallenges));
  }
};

export const setSeenTutorial = () => {
  localStorage.setItem(STORAGE_KEYS.HAS_SEEN_TUTORIAL, 'true');
};

export const hasSeenTutorial = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.HAS_SEEN_TUTORIAL) === 'true';
};

export const clearData = () => {
    localStorage.clear();
}