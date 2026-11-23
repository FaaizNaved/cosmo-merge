import React from 'react';
import { CELESTIAL_BODIES } from '../utils/constants';

interface NextPreviewProps {
  nextTier: number;
  upcomingTier: number;
}

export const NextPreview: React.FC<NextPreviewProps> = ({ nextTier, upcomingTier }) => {
  const currentDef = CELESTIAL_BODIES[nextTier] || CELESTIAL_BODIES[0];
  const upcomingDef = CELESTIAL_BODIES[upcomingTier] || CELESTIAL_BODIES[1];

  return (
    <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/70 border border-slate-800/80 rounded-xl max-w-lg mx-auto w-full backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Next:</span>
        <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
          <div
            className="w-4 h-4 rounded-full shadow-sm"
            style={{
              background: `radial-gradient(circle at 35% 35%, ${currentDef.gradient[0]}, ${currentDef.gradient[1]})`,
              boxShadow: `0 0 8px ${currentDef.glowColor}`
            }}
          />
          <span className="text-xs font-semibold text-slate-200">{currentDef.name}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">On-Deck:</span>
        <div className="flex items-center gap-1 bg-slate-950/60 px-2 py-0.5 rounded-lg border border-slate-800/50">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              background: `radial-gradient(circle at 35% 35%, ${upcomingDef.gradient[0]}, ${upcomingDef.gradient[1]})`
            }}
          />
          <span className="text-[11px] text-slate-400">{upcomingDef.name}</span>
        </div>
      </div>
    </div>
  );
};
