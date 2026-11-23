import { CelestialBodyDef } from '../types/game';

export const CELESTIAL_BODIES: CelestialBodyDef[] = [
  {
    tier: 0,
    name: "Stardust",
    radius: 18,
    color: "#94a3b8",
    glowColor: "rgba(148, 163, 184, 0.6)",
    points: 2,
    description: "Tiny cosmic dust grains drift in orbit.",
    symbol: "✨",
    gradient: ["#cbd5e1", "#64748b"]
  },
  {
    tier: 1,
    name: "Meteorite",
    radius: 25,
    color: "#f97316",
    glowColor: "rgba(249, 115, 22, 0.6)",
    points: 4,
    description: "A fast fiery rock burning through space.",
    symbol: "☄️",
    gradient: ["#fb923c", "#c2410c"]
  },
  {
    tier: 2,
    name: "Luna Moon",
    radius: 33,
    color: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.6)",
    points: 8,
    description: "A cratered lunar body reflecting solar rays.",
    symbol: "🌙",
    gradient: ["#7dd3fc", "#0284c7"]
  },
  {
    tier: 3,
    name: "Mercury",
    radius: 41,
    color: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.6)",
    points: 16,
    description: "A dense, scorched mineral-rich core.",
    symbol: "🪐",
    gradient: ["#fcd34d", "#b45309"]
  },
  {
    tier: 4,
    name: "Mars",
    radius: 50,
    color: "#ef4444",
    glowColor: "rgba(239, 68, 68, 0.6)",
    points: 32,
    description: "The Red Planet with iron dust storms.",
    symbol: "🔴",
    gradient: ["#f87171", "#b91c1c"]
  },
  {
    tier: 5,
    name: "Earth",
    radius: 60,
    color: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.7)",
    points: 64,
    description: "The vibrant cradle of oceans and atmosphere.",
    symbol: "🌍",
    gradient: ["#34d399", "#047857"]
  },
  {
    tier: 6,
    name: "Neptune",
    radius: 71,
    color: "#6366f1",
    glowColor: "rgba(99, 102, 241, 0.7)",
    points: 128,
    description: "Supersonic methane winds and frozen ice mantle.",
    symbol: "🔵",
    gradient: ["#818cf8", "#4338ca"]
  },
  {
    tier: 7,
    name: "Jupiter",
    radius: 83,
    color: "#eab308",
    glowColor: "rgba(234, 179, 8, 0.7)",
    points: 256,
    description: "A colossal gas giant with roaring cyclones.",
    symbol: "🌪️",
    gradient: ["#fef08a", "#a16207"]
  },
  {
    tier: 8,
    name: "Solar Sun",
    radius: 96,
    color: "#f97316",
    glowColor: "rgba(255, 115, 0, 0.8)",
    points: 512,
    description: "A roaring thermonuclear furnace powering worlds.",
    symbol: "☀️",
    gradient: ["#ffedd5", "#ea580c"]
  },
  {
    tier: 9,
    name: "Pulsar Star",
    radius: 110,
    color: "#ec4899",
    glowColor: "rgba(236, 72, 153, 0.8)",
    points: 1024,
    description: "A magnetized neutron beacon sweeping gamma rays.",
    symbol: "⚡",
    gradient: ["#f472b6", "#be185d"]
  },
  {
    tier: 10,
    name: "Supernova",
    radius: 124,
    color: "#a855f7",
    glowColor: "rgba(168, 85, 247, 0.9)",
    points: 2048,
    description: "A cataclysmic stellar explosion birthing elements.",
    symbol: "💥",
    gradient: ["#e9d5ff", "#7e22ce"]
  },
  {
    tier: 11,
    name: "Black Hole",
    radius: 140,
    color: "#030712",
    glowColor: "rgba(147, 51, 234, 0.95)",
    points: 4096,
    description: "An infinite singularity warping spacetime herself.",
    symbol: "🕳️",
    gradient: ["#1e1b4b", "#000000"]
  }
];

export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 680;
export const DROP_LINE_Y = 100;
export const DANGER_LINE_Y = 135;
export const GRAVITY = 0.32;
export const BOUNCE_RESTITUTION = 0.28;
export const FRICTION = 0.985;
export const WALL_RESTITUTION = 0.35;
export const SUB_STEPS = 6; // High accuracy physics simulation steps per frame
