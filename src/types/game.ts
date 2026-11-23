export interface CelestialBodyDef {
  tier: number;
  name: string;
  radius: number;
  color: string;
  glowColor: string;
  points: number;
  description: string;
  symbol: string;
  gradient: [string, string];
  features?: string[];
}

export interface BodyInstance {
  id: number;
  tier: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  angle: number;
  va: number;
  isMerging?: boolean;
  scale?: number;
  alpha?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  sparkle?: boolean;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
  scale: number;
}

export interface GameStats {
  score: number;
  highScore: number;
  merges: number;
  combo: number;
  highestTierReached: number;
  gamesPlayed: number;
  blackHolesCreated: number;
}

export type PowerUpType = 'bomb' | 'vortex' | 'swap' | 'shake';

export interface PowerUp {
  type: PowerUpType;
  name: string;
  count: number;
  icon: string;
  desc: string;
}
