'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Player, FireFist, GameState } from './types';
import { GAME_CONFIG } from './constants';
import {
  checkCollision,
  calculateLevel,
  getSpawnInterval,
  getSpeedMultiplier,
  getRandomFireFistType,
} from './utils';

interface GameCanvasProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onGameOver: (score: number, time: number, level: number) => void;
}

export default function GameCanvas({
  gameState,
  setGameState,
  onGameOver,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [player, setPlayer] = useState<Player>({
    x: GAME_CONFIG.PLAYER_START_X,
    y: GAME_CONFIG.PLAYER_START_Y,
    width: GAME_CONFIG.PLAYER_WIDTH,
    height: GAME_CONFIG.PLAYER_HEIGHT,
    speed: GAME_CONFIG.PLAYER_SPEED,
  });
  const [fireFists, setFireFists] = useState<FireFist[]>([]);
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});
  const [touchX, setTouchX] = useState<number | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  const luffyImageRef = useRef<HTMLImageElement | null>(null);
  const akainuImageRef = useRef<HTMLImageElement | null>(null);
  
  const animationFrameRef = useRef<number | undefined>(undefined);
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastScoreUpdateRef = useRef<number>(0);

  // Load images
  useEffect(() => {
    const luffyImg = new Image();
    const akainuImg = new Image();
    
    let luffyLoaded = false;
    let akainuLoaded = false;
    
    const checkAllLoaded = () => {
      if (luffyLoaded && akainuLoaded) {
        setImagesLoaded(true);
      }
    };
    
    luffyImg.onload = () => {
      luffyLoaded = true;
      checkAllLoaded();
    };
    
    akainuImg.onload = () => {
      akainuLoaded = true;
      checkAllLoaded();
    };
    
    luffyImg.onerror = () => {
      console.error('Failed to load luffy.png');
      luffyLoaded = true;
      checkAllLoaded();
    };
    
    akainuImg.onerror = () => {
      console.error('Failed to load akainu.png');
      akainuLoaded = true;
      checkAllLoaded();
    };
    
    luffyImg.src = '/luffy.png';
    akainuImg.src = '/akainu.png';
    
    luffyImageRef.current = luffyImg;
    akainuImageRef.current = akainuImg;
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'a', 'd', 'A', 'D'].includes(e.key)) {
        e.preventDefault();
        setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchX(touch.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchX(touch.clientX);
  };

  const handleTouchEnd = () => {
    setTouchX(null);
  };

  // Update player position
  const updatePlayer = useCallback(() => {
    setPlayer((prev) => {
      let newX = prev.x;
      
      // Keyboard controls
      if (keys['arrowleft'] || keys['a']) {
        newX -= prev.speed;
      }
      if (keys['arrowright'] || keys['d']) {
        newX += prev.speed;
      }
      
      // Touch controls
      if (touchX !== null && canvasRef.current) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const canvasX = (touchX - rect.left) * scaleX;
        
        // Move player towards touch position
        const targetX = canvasX - prev.width / 2;
        const diff = targetX - prev.x;
        
        if (Math.abs(diff) > prev.speed) {
          newX += (diff > 0 ? 1 : -1) * prev.speed;
        } else {
          newX = targetX;
        }
      }
      
      // Keep player in bounds
      newX = Math.max(0, Math.min(GAME_CONFIG.CANVAS_WIDTH - prev.width, newX));
      
      return { ...prev, x: newX };
    });
  }, [keys, touchX]);

  // Update fire fists
  const updateFireFists = useCallback(() => {
    setFireFists((prev) => {
      const updated = prev
        .map((fireFist) => ({
          ...fireFist,
          y: fireFist.y + fireFist.speed,
        }))
        .filter((fireFist) => fireFist.y < GAME_CONFIG.CANVAS_HEIGHT + 100);
      return updated;
    });
  }, []);

  // Check collisions
  const checkCollisions = useCallback(() => {
    for (const fireFist of fireFists) {
      if (checkCollision(player, fireFist)) {
        // Game over
        setGameState((prevState) => {
          onGameOver(prevState.score, prevState.time, prevState.level);
          return { ...prevState, isPlaying: false, gameOver: true };
        });
        return true;
      }
    }
    return false;
  }, [fireFists, player, setGameState, onGameOver]);

  // Update score and time
  const updateScore = useCallback((currentTime: number) => {
    const elapsed = Math.floor((currentTime - lastScoreUpdateRef.current) / 1000);
    
    if (elapsed >= 1) {
      setGameState((prevState) => {
        const newTime = prevState.time + elapsed;
        const newScore = prevState.score + (GAME_CONFIG.SCORE_PER_SECOND * elapsed);
        const newLevel = calculateLevel(newTime);
        
        return {
          ...prevState,
          time: newTime,
          score: newScore,
          level: newLevel,
        };
      });
      
      lastScoreUpdateRef.current = currentTime;
    }
  }, [setGameState]);

  // Game loop reference for state
  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Main game loop
  const gameLoop = useCallback((currentTime: number) => {
    const currentGameState = gameStateRef.current;
    
    if (!currentGameState.isPlaying || currentGameState.isPaused) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    
    // Update game objects
    updatePlayer();
    updateFireFists();
    updateScore(currentTime);
    
    // Check collisions
    const collision = checkCollisions();
    
    // Render
    if (!collision && canvasRef.current && imagesLoaded) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // Clear canvas with gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.CANVAS_HEIGHT);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F6FF');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
        
        // Draw player (Luffy)
        if (luffyImageRef.current && luffyImageRef.current.complete) {
          ctx.drawImage(
            luffyImageRef.current,
            player.x,
            player.y,
            player.width,
            player.height
          );
        } else {
          // Fallback: draw blue rectangle if image not loaded
          ctx.fillStyle = 'blue';
          ctx.fillRect(player.x, player.y, player.width, player.height);
        }
        
        // Draw fire fists (Akainu)
        if (akainuImageRef.current && akainuImageRef.current.complete) {
          fireFists.forEach((fireFist) => {
            ctx.drawImage(
              akainuImageRef.current!,
              fireFist.x,
              fireFist.y,
              fireFist.width,
              fireFist.height
            );
          });
        } else if (fireFists.length > 0) {
          // Fallback: draw red rectangles if image not loaded
          ctx.fillStyle = 'red';
          fireFists.forEach((fireFist) => {
            ctx.fillRect(fireFist.x, fireFist.y, fireFist.width, fireFist.height);
          });
        }
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [
    player,
    fireFists,
    updatePlayer,
    updateFireFists,
    updateScore,
    checkCollisions,
    imagesLoaded,
  ]);

  // Start/stop game loop
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && imagesLoaded) {
      lastScoreUpdateRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, imagesLoaded, gameLoop]);

  // Spawn interval - separate effect
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && imagesLoaded) {
      console.log('🎯 Starting spawn interval');
      
      // Start spawn interval - exactly 1 second
      spawnIntervalRef.current = setInterval(() => {
        const currentLevel = gameStateRef.current.level;
        console.log('🔥 Spawning fire fist at level', currentLevel);
        
        const fireFistType = getRandomFireFistType(currentLevel);
        const fireFistConfig = GAME_CONFIG.FIRE_FIST_SIZES[fireFistType];
        const speedMultiplier = getSpeedMultiplier(currentLevel);
        
        const newFireFist: FireFist = {
          x: Math.random() * (GAME_CONFIG.CANVAS_WIDTH - fireFistConfig.width),
          y: -fireFistConfig.height,
          width: fireFistConfig.width,
          height: fireFistConfig.height,
          speed: fireFistConfig.speed * speedMultiplier,
          type: fireFistType,
        };
        
        setFireFists((prev) => [...prev, newFireFist]);
      }, 1000);
      
    } else {
      if (spawnIntervalRef.current) {
        console.log('⏹️ Stopping spawn interval');
        clearInterval(spawnIntervalRef.current);
        spawnIntervalRef.current = null;
      }
    }
    
    return () => {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
        spawnIntervalRef.current = null;
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, imagesLoaded]);

  // Reset game when starting new game
  useEffect(() => {
    if (gameState.isPlaying && gameState.score === 0) {
      setPlayer({
        x: GAME_CONFIG.PLAYER_START_X,
        y: GAME_CONFIG.PLAYER_START_Y,
        width: GAME_CONFIG.PLAYER_WIDTH,
        height: GAME_CONFIG.PLAYER_HEIGHT,
        speed: GAME_CONFIG.PLAYER_SPEED,
      });
      setFireFists([]);
      setKeys({});
      setTouchX(null);
    }
  }, [gameState.isPlaying, gameState.score]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={GAME_CONFIG.CANVAS_WIDTH}
        height={GAME_CONFIG.CANVAS_HEIGHT}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="border-4 border-gray-800 rounded-lg shadow-2xl"
        style={{ touchAction: 'none' }}
      />
      
      {!imagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-sky-400 border-4 border-gray-800 rounded-lg">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-bounce">⏳</div>
            <p className="text-white text-xl font-bold">이미지 로딩 중...</p>
          </div>
        </div>
      )}
    </div>
  );
}

