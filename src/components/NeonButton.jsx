import React from "react";

/**
 * NeonButton - A classic retro neon-glow button for arcade games.
 * - Uses pixel font, animated neon borders, and CRT scanline overlay.
 * - Props: onClick, children, className, disabled
 * - Usage: <NeonButton onClick={...}>Start Match</NeonButton>
 */
const NeonButton = ({ onClick, children, className = '', disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`relative px-8 py-3 select-none uppercase tracking-widest font-arcade text-lg shadow-neon border-2 border-pink-500 rounded-lg bg-black bg-opacity-80 overflow-hidden transition-all duration-200
      ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-neon-bright hover:border-cyan-400'}
      ${className}`}
    style={{
      textShadow: '0 0 8px #ff00cc, 0 0 12px #00fff0',
      fontFamily: 'ArcadeClassic, monospace',
      letterSpacing: '0.1em',
    }}
  >
    {/* CRT Scanlines Overlay */}
    <span className="absolute inset-0 pointer-events-none z-10" aria-hidden>
      <span className="block w-full h-full opacity-20 mix-blend-overlay bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.1)_0_2px,transparent_2px_6px)]"></span>
    </span>
    {/* Neon Glow Border Animation */}
    <span className="absolute inset-0 rounded-lg border-2 border-cyan-400 animate-neon-glow pointer-events-none z-20" aria-hidden></span>
    <span className="relative z-30 flex items-center justify-center">
      {children}
    </span>
  </button>
);

export default NeonButton;

/*
Add to your Tailwind config:
  fontFamily: {
    arcade: ['ArcadeClassic', 'monospace'],
  },
  boxShadow: {
    neon: '0 0 8px #ff00cc, 0 0 16px #00fff0',
    'neon-bright': '0 0 16px #ff00cc, 0 0 32px #00fff0',
  },
  keyframes: {
    'neon-glow': {
      '0%, 100%': { boxShadow: '0 0 8px #ff00cc, 0 0 16px #00fff0' },
      '50%': { boxShadow: '0 0 16px #ff00cc, 0 0 32px #00fff0' },
    },
  },
  animation: {
    'neon-glow': 'neon-glow 2s infinite ease-in-out',
  },
Include ArcadeClassic font (Google "Arcade Classic font" or use a pixel font from Kenney.nl/itch.io).
*/
