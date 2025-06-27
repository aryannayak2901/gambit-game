// Arcade sound effect loader and player
// Usage: import playSound from './arcadeSounds'; playSound('door');

const sounds = {
  door: '/sounds/door.mp3',
  bribe: '/sounds/bribe.mp3',
  win: '/sounds/win.mp3',
  lose: '/sounds/lose.mp3',
  chat: '/sounds/chat.mp3',
}

const audioCache = {};

export default function playSound(type) {
  if (!sounds[type]) return;
  if (!audioCache[type]) {
    audioCache[type] = new Audio(sounds[type]);
  }
  audioCache[type].currentTime = 0;
  audioCache[type].play();
}
