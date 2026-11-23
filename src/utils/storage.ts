import { GameStats } from '../types/game';

const STATS_KEY = 'cosmo_merge_stats';
const POWERUPS_KEY = 'cosmo_merge_powerups';
export const SOUND_KEY = 'cosmo_merge_sound_pref';

export interface PowerUpInventory {
  bomb: number;
  vortex: number;
  shake: number;
}

export function loadGameStats(): GameStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }

  return {
    score: 0,
    highScore: 0,
    merges: 0,
    combo: 0,
    highestTierReached: 0,
    gamesPlayed: 0,
    blackHolesCreated: 0
  };
}

export function saveGameStats(stats: GameStats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // fallback
  }
}

export function loadPowerups(): PowerUpInventory {
  try {
    const raw = localStorage.getItem(POWERUPS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return {
    bomb: 2,
    vortex: 2,
    shake: 3
  };
}

export function savePowerups(powerups: PowerUpInventory) {
  try {
    localStorage.setItem(POWERUPS_KEY, JSON.stringify(powerups));
  } catch {
    // fallback
  }
}

export function getDailySeed(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
}
