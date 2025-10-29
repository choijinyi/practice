'use client';

import { useState, useEffect } from 'react';
import GameCanvas from './GameCanvas';
import { GameState, GameSettings, LeaderboardEntry } from './types';
import { LEVEL_INFO } from './constants';
import {
  formatTime,
  getHighScore,
  saveHighScore,
  getLeaderboard,
  loadSettings,
  saveSettings,
  getLevelInfo,
  getNextLevelInfo,
} from './utils';

type Screen = 'menu' | 'game' | 'gameOver' | 'settings' | 'leaderboard';

export default function GamePage() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    score: 0,
    time: 0,
    level: 1,
    gameOver: false,
  });
  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    vibrationEnabled: true,
  });
  const [highScore, setHighScore] = useState({ score: 0, time: 0 });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [finalScore, setFinalScore] = useState({ score: 0, time: 0, level: 1 });

  // Load settings and high score on mount
  useEffect(() => {
    const loadedSettings = loadSettings();
    setSettings(loadedSettings);
    const hs = getHighScore();
    setHighScore(hs);
    const lb = getLeaderboard();
    setLeaderboard(lb);
  }, []);

  const startGame = () => {
    setGameState({
      isPlaying: true,
      isPaused: false,
      score: 0,
      time: 0,
      level: 1,
      gameOver: false,
    });
    setScreen('game');
  };

  const handleGameOver = (score: number, time: number, level: number) => {
    setFinalScore({ score, time, level });
    
    // Save high score if needed
    if (score > highScore.score) {
      setHighScore({ score, time });
    }
    
    // Save to leaderboard
    saveHighScore(score, time, level);
    setLeaderboard(getLeaderboard());
    
    setScreen('gameOver');
  };

  const pauseGame = () => {
    setGameState({ ...gameState, isPaused: true });
  };

  const resumeGame = () => {
    setGameState({ ...gameState, isPaused: false });
  };

  const goToMenu = () => {
    setGameState({
      isPlaying: false,
      isPaused: false,
      score: 0,
      time: 0,
      level: 1,
      gameOver: false,
    });
    setScreen('menu');
  };

  const openSettings = () => {
    setScreen('settings');
  };

  const openLeaderboard = () => {
    setScreen('leaderboard');
  };

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettings(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-400 via-red-400 to-red-600 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Menu Screen */}
        {screen === 'menu' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <h1 className="text-6xl font-bold text-red-600 mb-4">
              🔥 불주먹 피하기 🔥
            </h1>
            <p className="text-2xl text-gray-700 mb-8">Fire Fist Dodger</p>
            <p className="text-lg text-gray-600 mb-8">
              하늘에서 떨어지는 불주먹을 피하세요!
            </p>
            
            <div className="space-y-4 mb-8">
              <button
                onClick={startGame}
                className="w-full max-w-md px-8 py-4 bg-red-500 hover:bg-red-600 text-white text-2xl font-bold rounded-lg shadow-lg transform transition hover:scale-105"
              >
                🎮 게임 시작
              </button>
              
              <button
                onClick={openLeaderboard}
                className="w-full max-w-md px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold rounded-lg shadow-lg transform transition hover:scale-105"
              >
                🏆 리더보드
              </button>
              
              <button
                onClick={openSettings}
                className="w-full max-w-md px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white text-lg font-bold rounded-lg shadow-lg transform transition hover:scale-105"
              >
                ⚙️ 설정
              </button>
            </div>
            
            {highScore.score > 0 && (
              <div className="bg-red-50 rounded-lg p-4 inline-block">
                <p className="text-gray-700 font-semibold">최고 기록</p>
                <p className="text-2xl font-bold text-red-600">
                  {highScore.score}점 ({formatTime(highScore.time)})
                </p>
              </div>
            )}
            
            <div className="mt-8 text-gray-600">
              <p className="font-semibold mb-2">조작 방법:</p>
              <p>💻 PC: 방향키 (←, →) 또는 A, D 키</p>
              <p>📱 모바일: 화면 터치</p>
            </div>
          </div>
        )}

        {/* Game Screen */}
        {screen === 'game' && (
          <div className="space-y-4">
            {/* Game HUD */}
            <div className="bg-white rounded-xl shadow-lg p-4 flex justify-between items-center flex-wrap gap-4">
              <div>
                <p className="text-gray-600 text-sm">점수</p>
                <p className="text-3xl font-bold text-red-600">{gameState.score}</p>
              </div>
              
              <div>
                <p className="text-gray-600 text-sm">시간</p>
                <p className="text-3xl font-bold text-orange-600">
                  {formatTime(gameState.time)}
                </p>
              </div>
              
              <div>
                <p className="text-gray-600 text-sm">레벨</p>
                <p className="text-3xl font-bold text-purple-600">{gameState.level}</p>
                <p className="text-xs text-gray-500">{getLevelInfo(gameState.level).name}</p>
              </div>
              
              <div className="space-x-2">
                {!gameState.isPaused ? (
                  <button
                    onClick={pauseGame}
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg"
                  >
                    ⏸️ 일시정지
                  </button>
                ) : (
                  <button
                    onClick={resumeGame}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg"
                  >
                    ▶️ 계속
                  </button>
                )}
                
                <button
                  onClick={goToMenu}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg"
                >
                  🏠 메뉴
                </button>
              </div>
            </div>
            
            {/* Canvas */}
            <div className="flex flex-col items-center gap-4">
              <GameCanvas
                gameState={gameState}
                setGameState={setGameState}
                onGameOver={handleGameOver}
              />
              
              {/* Mobile Controls */}
              <div className="md:hidden flex gap-4 w-full max-w-md justify-center">
                <button
                  onTouchStart={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-4xl font-bold py-8 rounded-lg shadow-lg"
                >
                  ←
                </button>
                <button
                  onTouchStart={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-4xl font-bold py-8 rounded-lg shadow-lg"
                >
                  →
                </button>
              </div>
            </div>
            
            {gameState.isPaused && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-3xl p-8 text-center">
                  <p className="text-4xl font-bold mb-4">⏸️ 일시정지</p>
                  <button
                    onClick={resumeGame}
                    className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-xl font-bold rounded-lg"
                  >
                    계속하기
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Game Over Screen */}
        {screen === 'gameOver' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <h2 className="text-5xl font-bold text-red-600 mb-6">게임 오버! 🔥</h2>
            
            <div className="space-y-4 mb-8">
              <div className="bg-red-100 rounded-lg p-4">
                <p className="text-gray-700 font-semibold">최종 점수</p>
                <p className="text-4xl font-bold text-red-600">{finalScore.score}</p>
              </div>
              
              <div className="bg-orange-100 rounded-lg p-4">
                <p className="text-gray-700 font-semibold">생존 시간</p>
                <p className="text-4xl font-bold text-orange-600">
                  {formatTime(finalScore.time)}
                </p>
              </div>
              
              <div className="bg-purple-100 rounded-lg p-4">
                <p className="text-gray-700 font-semibold">달성 레벨</p>
                <p className="text-4xl font-bold text-purple-600">
                  레벨 {finalScore.level}: {getLevelInfo(finalScore.level).name}
                </p>
              </div>
              
              {getNextLevelInfo(finalScore.level) && (
                <div className="bg-yellow-100 rounded-lg p-4">
                  <p className="text-gray-700 font-semibold">다음 레벨 도전!</p>
                  <p className="text-lg text-gray-800 mb-2">
                    레벨 {finalScore.level + 1}: {getNextLevelInfo(finalScore.level)!.name}
                  </p>
                  <p className="text-md text-gray-700">
                    "{getNextLevelInfo(finalScore.level)!.message}"
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    목표: {getNextLevelInfo(finalScore.level)!.threshold}초 생존
                  </p>
                </div>
              )}
              
              {finalScore.score > highScore.score && highScore.score > 0 && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg p-4">
                  <p className="text-2xl font-bold text-white">
                    🎉 신기록 달성! 🎉
                  </p>
                </div>
              )}
              
              {highScore.score === 0 && (
                <div className="bg-blue-100 rounded-lg p-4">
                  <p className="text-lg font-bold text-blue-800">
                    🎊 첫 기록을 세웠습니다!
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <button
                onClick={startGame}
                className="w-full max-w-md px-8 py-4 bg-red-500 hover:bg-red-600 text-white text-2xl font-bold rounded-lg shadow-lg transform transition hover:scale-105"
              >
                🔄 다시 도전
              </button>
              
              <button
                onClick={goToMenu}
                className="w-full max-w-md px-8 py-4 bg-gray-500 hover:bg-gray-600 text-white text-xl font-bold rounded-lg shadow-lg transform transition hover:scale-105"
              >
                🏠 메인 메뉴
              </button>
            </div>
          </div>
        )}

        {/* Settings Screen */}
        {screen === 'settings' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
              ⚙️ 설정
            </h2>
            
            <div className="space-y-6 mb-8">
              {/* Sound Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                <span className="text-lg font-semibold">🔊 사운드</span>
                <button
                  onClick={() =>
                    updateSettings({ soundEnabled: !settings.soundEnabled })
                  }
                  className={`px-6 py-2 rounded-lg font-bold ${
                    settings.soundEnabled
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-400 text-gray-700'
                  }`}
                >
                  {settings.soundEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
              
              {/* Vibration Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                <span className="text-lg font-semibold">📳 진동</span>
                <button
                  onClick={() =>
                    updateSettings({ vibrationEnabled: !settings.vibrationEnabled })
                  }
                  className={`px-6 py-2 rounded-lg font-bold ${
                    settings.vibrationEnabled
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-400 text-gray-700'
                  }`}
                >
                  {settings.vibrationEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
            
            <button
              onClick={goToMenu}
              className="w-full px-8 py-4 bg-gray-500 hover:bg-gray-600 text-white text-xl font-bold rounded-lg shadow-lg transform transition hover:scale-105"
            >
              ← 돌아가기
            </button>
          </div>
        )}

        {/* Leaderboard Screen */}
        {screen === 'leaderboard' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
              🏆 리더보드
            </h2>
            
            {leaderboard.length === 0 ? (
              <p className="text-center text-gray-600 text-xl my-8">
                아직 기록이 없습니다. 첫 번째 플레이어가 되어보세요!
              </p>
            ) : (
              <div className="space-y-3 mb-8">
                {leaderboard.map((entry, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      index === 0
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                        : index === 1
                        ? 'bg-gray-300'
                        : index === 2
                        ? 'bg-orange-300'
                        : 'bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl font-bold">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                      </span>
                      <div>
                        <p className="font-bold text-lg">{entry.score}점</p>
                        <p className="text-sm opacity-80">
                          {formatTime(entry.time)} · 레벨 {entry.level} ({getLevelInfo(entry.level).name})
                        </p>
                      </div>
                    </div>
                    <p className="text-sm opacity-70">
                      {new Date(entry.date).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={goToMenu}
              className="w-full px-8 py-4 bg-gray-500 hover:bg-gray-600 text-white text-xl font-bold rounded-lg shadow-lg transform transition hover:scale-105"
            >
              ← 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

