export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  duration: number;
  skill: string;
  youtubeVideoId: string;
  instructor?: string;
  thumbnail?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  interests: string[];
}
