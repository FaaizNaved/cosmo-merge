import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { CELESTIAL_BODIES } from '../utils/constants';

interface EvolutionTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EvolutionTreeModal: React.FC<EvolutionTreeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-indigo-500/40 rounded-2xl p-5 max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-black text-white uppercase tracking-wider">
              Celestial Evolution Tree
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 py-2">
          Drop and merge two identical bodies to evolve into the next cosmic tier!
        </p>

        <div className="overflow-y-auto space-y-2 pr-1 flex-1">
          {CELESTIAL_BODIES.map((body, index) => (
            <div
              key={body.tier}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/40 transition"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-md shrink-0"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${body.gradient[0]}, ${body.gradient[1]})`,
                    boxShadow: `0 0 10px ${body.glowColor}`
                  }}
                >
                  {body.symbol}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">
                      Tier {index + 1}: {body.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{body.description}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-black text-cyan-400">+{body.points}</span>
                <span className="text-[10px] text-slate-500 block">points</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
          >
            GOT IT
          </button>
        </div>
      </div>
    </div>
  );
};
