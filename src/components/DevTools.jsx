import React from "react";
import NeonButton from "./NeonButton";

const TEST_MODE = import.meta.env.VITE_TEST_MODE === "true";

class DevToolsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // You can log error info here if needed
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="arcade-panel bg-red-800/90 text-white p-4 rounded-xl shadow-xl text-xs flex flex-col gap-2 items-center animate-glow-flicker">
          <div className="font-bold pixel-text text-neon-yellow animate-glow">DEVTOOLS ERROR</div>
          <div className="pixel-text text-neon-pink">{this.state.error && this.state.error.toString()}</div>
          <div className="pixel-text text-neon-cyan">Check your DevTools code or props.</div>
        </div>
      );
    }
    return this.props.children;
  }
}

function DevTools({
  onSkipLevel,
  onRevealSafeDoor,
  onForceTrap,
  onAutoWin,
  safeDoor,
  currentLevel
}) {
  if (!TEST_MODE) return null;
  return (
    <div className="arcade-panel bg-gradient-to-br from-neon-pink/90 to-neon-cyan/80 text-white p-4 rounded-xl shadow-xl text-xs flex flex-col gap-2 items-stretch animate-glow-flicker">
      <div className="font-bold pixel-text retro-glow animate-glow">TEST MODE ACTIVE</div>
      <div className="pixel-text text-neon-yellow">Level: {currentLevel}</div>
      <NeonButton className="bg-neon-pink/80 text-white px-2 py-1 rounded pixel-text retro-glow animate-glow-flicker" onClick={onSkipLevel}>Skip Level</NeonButton>
      <NeonButton className="bg-neon-cyan/80 text-black px-2 py-1 rounded pixel-text retro-glow animate-glow-flicker" onClick={onRevealSafeDoor}>Reveal Safe Door</NeonButton>
      <NeonButton className="bg-red-500/80 text-white px-2 py-1 rounded pixel-text retro-glow animate-glow-flicker" onClick={onForceTrap}>Force Trap</NeonButton>
      <NeonButton className="bg-neon-yellow/80 text-black px-2 py-1 rounded pixel-text retro-glow animate-glow-flicker" onClick={onAutoWin}>Auto Win</NeonButton>
      {safeDoor !== undefined && (
        <div className="mt-2 pixel-text text-neon-cyan animate-glow-flicker">Safe Door: <span className="font-mono text-neon-yellow">{safeDoor}</span></div>
      )}
    </div>
  );
}

export default function DevToolsWithBoundary(props) {
  return (
    <DevToolsErrorBoundary>
      <DevTools {...props} />
    </DevToolsErrorBoundary>
  );
}
