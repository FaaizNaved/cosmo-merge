import React from 'react';
import { Bomb, Magnet, Shuffle, PlayCircle } from 'lucide-react';
import { PowerUpInventory } from '../utils/storage';

interface PowerUpBarProps {
  powerups: PowerUpInventory;
  onUseBomb: () => void;
  onUseVortex: () => void;
  onUseShake: () => void;
  onRewardAd: () => void;
  isBombActive: boolean;
}

export const PowerUpBar: React.FC<PowerUpBarProps> = ({
  powerups,
  onUseBomb,
  onUseVortex,
  onUseShake,
  onRewardAd,
  isBombActive
}) => {
  return (
    <div className="flex items-center justify-between gap-2 max-w-lg mx-auto w-full px-2 py-1.5">
      {/* Supernova Bomb */}
      <button
        onClick={onUseBomb}
        disabled={powerups.bomb <= 0}
        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border text-xs font-bold transition shadow-sm ${
          isBombActive
            ? 'bg-orange-500/30 border-orange-400 text-orange-200 ring-2 ring-orange-500/50 animate-pulse'
            : powerups.bomb > 0
            ? 'bg-slate-900/90 border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/60'
            : 'bg-slate-900/40 border-slate-800/60 text-slate-600 cursor-not-allowed'
        }`}
        title="Supernova Bomb: Tap anywhere on canvas to vaporize stuck planets"
      >
        <Bomb className="w-3.5 h-3.5" />
        <span>Bomb</span>
        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-orange-500/20 text-orange-300">
          {powerups.bomb}
        </span>
      </button>

      {/* Gravity Vortex */}
      <button
        onClick={onUseVortex}
        disabled={powerups.vortex <= 0}
        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border text-xs font-bold transition shadow-sm ${
          powerups.vortex > 0
            ? 'bg-slate-900/90 border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/60'
            : 'bg-slate-900/40 border-slate-800/60 text-slate-600 cursor-not-allowed'
        }`}
        title="Gravity Vortex: Pulls celestial bodies to center for mass merge"
      >
        <Magnet className="w-3.5 h-3.5" />
        <span>Vortex</span>
        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300">
          {powerups.vortex}
        </span>
      </button>

      {/* Anti-Gravity Shake */}
      <button
        onClick={onUseShake}
        disabled={powerups.shake <= 0}
        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border text-xs font-bold transition shadow-sm ${
          powerups.shake > 0
            ? 'bg-slate-900/90 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/60'
            : 'bg-slate-900/40 border-slate-800/60 text-slate-600 cursor-not-allowed'
        }`}
        title="Cosmic Shake: Jostles and rearranges jammed planets"
      >
        <Shuffle className="w-3.5 h-3.5" />
        <span>Shake</span>
        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300">
          {powerups.shake}
        </span>
      </button>

      {/* Rewarded Ad for Free Powerups */}
      <button
        onClick={onRewardAd}
        className="flex items-center gap-1 py-2 px-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/60 text-xs font-bold transition shadow-sm"
        title="Watch short ad to refill all powerups"
      >
        <PlayCircle className="w-3.5 h-3.5" />
        <span>+Refill</span>
      </button>
    </div>
  );
};
