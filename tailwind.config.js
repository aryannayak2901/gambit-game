/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00ffff',
        'neon-pink': '#ff00ff',
        'neon-yellow': '#ffff00',
        'neon-green': '#00ff00',
        'dark-blue': '#0a0a2e',
        'space-blue': '#16213e',
        'deep-purple': '#1a1a3a',
      },
      fontFamily: {
        'pixel': ['Courier New', 'monospace'],
        'arcade': ['Orbitron', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-neon': 'pulse-neon 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'scanline': 'scanline 2s linear infinite',
        'flicker': 'flicker 0.15s infinite linear',
        'climb': 'climb 0.8s ease-out',
        'door-open': 'door-open 0.5s ease-out',
        'trap-shake': 'trap-shake 0.6s ease-in-out',
      },
      keyframes: {
        glow: {
          '0%': { 
            'box-shadow': '0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff',
            'text-shadow': '0 0 5px #00ffff'
          },
          '100%': { 
            'box-shadow': '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff',
            'text-shadow': '0 0 10px #00ffff'
          }
        },
        'pulse-neon': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        },
        climb: {
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'door-open': {
          '0%': { transform: 'scaleX(1)' },
          '100%': { transform: 'scaleX(0.1)' }
        },
        'trap-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' }
        }
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(135deg, #0a0a2e 0%, #16213e 50%, #1a1a3a 100%)',
        'neon-gradient': 'linear-gradient(45deg, #00ffff, #ff00ff)',
        'crt-lines': 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)',
      }
    },
  },
  plugins: [],
}