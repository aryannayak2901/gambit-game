import React, { useState } from "react";
import Ladder from "../components/Ladder";
import GameHUD from "../components/GameHUD";
import DevTools from "../components/DevTools";
import NeonButton from "../components/NeonButton"; // Neon retro button

const MOCK_PLAYER = {
  id: "dev-player",
  name: "TestUser",
  address: "dev-player",
  color: "blue",
  position: 1,
  status: "active",
  gorbaBalance: 99,
  bribes: 0,
  selectedDoor: null,
};

const generateSafeDoors = () => {
  const doors = {};
  for (let level = 1; level <= 10; level++) {
    doors[level] = Math.floor(Math.random() * 3);
  }
  return doors;
};

const initialGame = {
  id: "test-arena",
  players: [MOCK_PLAYER],
  status: "playing",
  currentLevel: 1,
  pot: 0,
  safeDoors: generateSafeDoors(),
  createdAt: Date.now(),
};

export default function Playground() {
  const [game, setGame] = useState({ ...initialGame });
  const [player, setPlayer] = useState({ ...MOCK_PLAYER });
  const [devSafeDoor, setDevSafeDoor] = useState(undefined);

  const handleDoorSelect = (doorIndex, level) => {
    const safeDoor = game.safeDoors[level];
    if (doorIndex === safeDoor) {
      setPlayer((p) => ({ ...p, position: level + 1 }));
      setGame((g) => ({ ...g, currentLevel: level + 1 }));
      if (level + 1 > 10) {
        setGame((g) => ({ ...g, status: "finished" }));
      }
    } else {
      setPlayer((p) => ({ ...p, status: "eliminated" }));
      setGame((g) => ({ ...g, status: "finished" }));
    }
  };

  const handleBribe = (level) => {
    setPlayer((p) => ({ ...p, bribes: (p.bribes || 0) + 1, gorbaBalance: p.gorbaBalance - 1 }));
  };

  // DevTools actions
  const handleDevSkipLevel = () => {
    handleDoorSelect(game.safeDoors[game.currentLevel], game.currentLevel);
  };
  const handleDevRevealSafeDoor = () => {
    setDevSafeDoor(game.safeDoors[game.currentLevel]);
  };
  const handleDevForceTrap = () => {
    let wrongDoor = [0, 1, 2].find((d) => d !== game.safeDoors[game.currentLevel]);
    handleDoorSelect(wrongDoor, game.currentLevel);
  };
  const handleDevAutoWin = () => {
    for (let lvl = game.currentLevel; lvl <= 10; lvl++) {
      handleDoorSelect(game.safeDoors[lvl], lvl);
    }
  };
  const handleRestart = () => {
    setGame({ ...initialGame, safeDoors: generateSafeDoors(), status: "playing", currentLevel: 1 });
    setPlayer({ ...MOCK_PLAYER, position: 1, status: "active", bribes: 0, gorbaBalance: 99 });
    setDevSafeDoor(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black relative overflow-hidden">
      {/* CRT/Arcade overlays intensified */}
      <div className="crt-effect">
        <div className="crt-scanlines"></div>
        <div className="crt-glow"></div>
        <div className="crt-static"></div>
      </div>
      <div className="arcade-bg-pixel absolute inset-0 w-full h-full z-0 pointer-events-none animate-bg-float"></div>
      <div className="arcade-sprite-overlay absolute inset-0 w-full h-full z-10 pointer-events-none"></div>
      <div className="absolute inset-0 w-full h-full z-20 pointer-events-none"></div>
      <div className="w-full max-w-6xl mx-auto relative z-30 flex flex-col items-center justify-center">
        {/* Main Title - arcade style */}
        <h1 className="text-5xl md:text-7xl font-bold pixel-text retro-glow animate-glow-flicker text-center mb-2 drop-shadow-neon animate-crt-flicker tracking-widest text-neon-cyan">
          <span className="block text-neon-yellow animate-glow-flicker">TEST ARENA</span>
          <span className="block text-neon-pink animate-glow-flicker">PLAYGROUND</span>
        </h1>
        <p className="text-center text-neon-cyan mb-8 pixel-text animate-glow-flicker text-lg max-w-2xl">Try out all game features instantly. No wallet or server required.</p>
        <div className="w-full grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 items-start justify-center">
          {/* Game Panel */}
          <div className="w-full flex flex-col items-center">
            <div className="w-full mb-6">
              <GameHUD game={game} currentPlayer={player} />
            </div>
            <div className="w-full">
              <Ladder
                game={game}
                currentPlayer={player}
                onDoorSelect={handleDoorSelect}
                onBribe={handleBribe}
              />
            </div>
            {game.status === "finished" && (
              <div className="text-center mt-8">
                <div className="text-3xl mb-2 text-neon-pink font-bold animate-glow-flicker">
                  {player.position > 10 ? "🎉 Victory!" : "💀 Eliminated!"}
                </div>
                <NeonButton className="mt-4" onClick={handleRestart}>
                  Restart Test
                </NeonButton>
              </div>
            )}
          </div>
          {/* DevTools Panel */}
          <div className="w-full md:w-80 flex flex-col items-center">
            <div className="w-full arcade-panel p-4">
              <DevTools
                onSkipLevel={handleDevSkipLevel}
                onRevealSafeDoor={handleDevRevealSafeDoor}
                onForceTrap={handleDevForceTrap}
                onAutoWin={handleDevAutoWin}
                safeDoor={devSafeDoor}
                currentLevel={game.currentLevel}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Particles Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="particle animate-glow-flicker"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
