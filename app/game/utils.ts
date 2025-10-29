// Game utility functions
import { GameObject, LeaderboardEntry, GameSettings } from './types';
import { GAME_CONFIG, LEVEL_INFO } from './constants';

// Collision detection
export function checkCollision(obj1: GameObject, obj2: GameObject): boolean {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

// Calculate current level based on time
export function calculateLevel(time: number): number {
  const thresholds = GAME_CONFIG.LEVEL_TIME_THRESHOLDS;
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (time >= thresholds[i]) {
      return i + 1;
    }
  }
  return 1;
}

// Get level info
export function getLevelInfo(level: number) {
  const index = Math.min(level - 1, LEVEL_INFO.length - 1);
  return LEVEL_INFO[index];
}

// Get next level info
export function getNextLevelInfo(level: number) {
  if (level >= LEVEL_INFO.length) {
    return null;
  }
  return LEVEL_INFO[level];
}

// Get spawn interval based on level
export function getSpawnInterval(level: number): number {
  const baseInterval = GAME_CONFIG.SPAWN_INTERVAL;
  const decrease = GAME_CONFIG.LEVEL_SPAWN_DECREASE * (level - 1);
  return Math.max(300, baseInterval - decrease);
}

// Get speed multiplier based on level
export function getSpeedMultiplier(level: number): number {
  return 1 + (level - 1) * GAME_CONFIG.LEVEL_SPEED_MULTIPLIER;
}

// Random fire fist type based on level
export function getRandomFireFistType(level: number): 'small' | 'medium' | 'large' {
  const rand = Math.random();
  
  if (level <= 2) {
    return rand < 0.7 ? 'small' : 'medium';
  } else if (level <= 4) {
    return rand < 0.4 ? 'small' : rand < 0.8 ? 'medium' : 'large';
  } else {
    return rand < 0.3 ? 'small' : rand < 0.6 ? 'medium' : 'large';
  }
}

// Format time display
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Local storage functions
export function saveHighScore(score: number, time: number, level: number): void {
  const entries = getLeaderboard();
  entries.push({
    score,
    time,
    level,
    date: new Date().toISOString(),
  });
  
  // Sort by score descending and keep top 10
  entries.sort((a, b) => b.score - a.score);
  const top10 = entries.slice(0, 10);
  
  localStorage.setItem('fireFist_leaderboard', JSON.stringify(top10));
}

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];
  
  const data = localStorage.getItem('fireFist_leaderboard');
  return data ? JSON.parse(data) : [];
}

export function getHighScore(): { score: number; time: number } {
  const entries = getLeaderboard();
  if (entries.length === 0) {
    return { score: 0, time: 0 };
  }
  return { score: entries[0].score, time: entries[0].time };
}

export function saveSettings(settings: GameSettings): void {
  localStorage.setItem('fireFist_settings', JSON.stringify(settings));
}

export function loadSettings(): GameSettings {
  if (typeof window === 'undefined') {
    return {
      soundEnabled: true,
      vibrationEnabled: true,
    };
  }
  
  const data = localStorage.getItem('fireFist_settings');
  return data ? JSON.parse(data) : {
    soundEnabled: true,
    vibrationEnabled: true,
  };
}


