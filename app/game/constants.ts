// Game constants

export const GAME_CONFIG = {
  // Canvas dimensions
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  
  // Player settings
  PLAYER_WIDTH: 60,
  PLAYER_HEIGHT: 60,
  PLAYER_SPEED: 8,
  PLAYER_START_X: 370,
  PLAYER_START_Y: 510,
  
  // Fire Fist settings
  FIRE_FIST_SIZES: {
    small: { width: 40, height: 40, speed: 3 },
    medium: { width: 60, height: 60, speed: 4 },
    large: { width: 80, height: 80, speed: 5 },
  },
  
  // Game mechanics
  SPAWN_INTERVAL: 1000, // milliseconds - always 1 second
  SCORE_PER_SECOND: 10,
  FPS: 60,
  
  // Level progression
  LEVEL_TIME_THRESHOLDS: [0, 10, 30, 60, 90, 120], // seconds
  LEVEL_SPEED_MULTIPLIER: 0.2,
  LEVEL_SPAWN_DECREASE: 0, // Keep spawn interval constant at 1 second for all levels
};

export const LEVEL_INFO = [
  {
    name: "초보 해적",
    threshold: 0,
    message: "좀 더 빨리 움직여보세요!"
  },
  {
    name: "숙련된 해적",
    threshold: 10,
    message: "불주먹의 패턴을 읽어보세요!"
  },
  {
    name: "베테랑 해적",
    threshold: 30,
    message: "대단합니다! 더 집중하세요!"
  },
  {
    name: "해적 선장",
    threshold: 60,
    message: "거의 다 왔어요! 계속하세요!"
  },
  {
    name: "전설의 해적",
    threshold: 90,
    message: "놀라운 실력입니다!"
  },
  {
    name: "해적왕",
    threshold: 120,
    message: "당신은 진정한 해적왕입니다!"
  }
];

