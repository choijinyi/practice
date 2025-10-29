// Game types and interfaces

export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Player extends GameObject {
  speed: number;
}

export interface FireFist extends GameObject {
  speed: number;
  type: 'small' | 'medium' | 'large';
}

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  score: number;
  time: number;
  level: number;
  gameOver: boolean;
}

export interface GameSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface LeaderboardEntry {
  score: number;
  time: number;
  level: number;
  date: string;
}


