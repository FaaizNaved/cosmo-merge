import React from 'react';
import { X, HelpCircle, MousePointer, Zap, Trophy, ShieldAlert } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-indigo-500/40 rounded-2xl p-5 max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-black text-white uppercase tracking-wider">
              How to Play Cosmo Merge
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-3 py-3 pr-1 text-xs text-slate-300">
          {/* Controls */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <h4 className="font-bold text-white mb-2 flex items-center gap-1.5 text-xs">
              <MousePointer className="w-4 h-4 text-cyan-400" />
              <span>Desktop & Mobile Controls</span>
            </h4>
            <ul className="space-y-1 text-slate-400 text-[11px]">
              <li>• <strong>Move / Aim:</strong> Move cursor or drag finger across the container.</li>
              <li>• <strong>Drop:</strong> Click or release your touch to launch the planet.</li>
            </ul>
          </div>

          {/* Merge Rule */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <h4 className="font-bold text-white mb-2 flex items-center gap-1.5 text-xs">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Merging & Combos</span>
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              When two celestial bodies of the same tier collide, they fuse into the next evolution tier! Rapid merges activate combo multipliers (up to 5x points).
            </p>
          </div>

          {/* Danger Line */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <h4 className="font-bold text-rose-400 mb-1 flex items-center gap-1.5 text-xs">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Danger Line</span>
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Keep your planets below the red dashed line! If planets rest above the danger threshold for more than 3.5 seconds, the spacetime sector collapses!
            </p>
          </div>

          {/* Powerups */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <h4 className="font-bold text-purple-400 mb-1 flex items-center gap-1.5 text-xs">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span>Cosmic Power-Ups</span>
            </h4>
            <ul className="space-y-1 text-slate-400 text-[11px]">
              <li>• <strong>Bomb:</strong> Vaporizes troublesome clustered planets.</li>
              <li>• <strong>Vortex:</strong> Pulls all planets toward center to trigger mass merges.</li>
              <li>• <strong>Shake:</strong> Shakes the container to settle awkward stacks.</li>
            </ul>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
          >
            START PLAYING
          </button>
        </div>
      </div>
    </div>
  );
};
