// Smart contract API stub for frontend integration
// Replace with real Solana/Anchor calls in production

export async function createMatch(seed, entryFee) {
  // TODO: Call Anchor contract
  return { matchId: Math.floor(Math.random() * 1e9) };
}

export async function joinMatch(matchId) {
  // TODO: Call Anchor contract
  return { success: true };
}

export async function selectDoor(matchId, player, level, doorChoice) {
  // TODO: Call Anchor contract
  // Simulate on-chain RNG
  return { safe: Math.random() < 0.33 };
}

export async function bribe(matchId, player, level) {
  // TODO: Call Anchor contract
  return { success: true };
}

export async function endMatch(matchId) {
  // TODO: Call Anchor contract
  return { winner: 'player1' };
}
