import React from 'react';
import { Volume2, VolumeX, Music, HelpCircle, Trophy, Sparkles, Orbit, Code } from 'lucide-react';

interface HeaderProps {
  score: number;
  highScore: number;
  combo: number;
  onOpenHelp: () => void;
  onOpenEvolution: () => void;
  onOpenEmbed: () => void;
  soundOn: boolean;
  musicOn: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  highScore,
  combo,
  onOpenHelp,
  onOpenEvolution,
  onOpenEmbed,
  soundOn,
  musicOn,
  onToggleSound,
  onToggleMusic
}) => {
  return (
    <header className="w-full max-w-lg mx-auto px-3 py-2 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-[2px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Orbit className="w-5 h-5 text-indigo-400 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent uppercase leading-none">
              Cosmo Merge
            </h1>
            <span className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase">
              Planetary 2048
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenEmbed}
            title="Embed on your website / blog"
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenEvolution}
            title="Planet Evolution Tree"
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenHelp}
            title="How to Play"
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleSound}
            title={soundOn ? 'Mute Sound FX' : 'Enable Sound FX'}
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>
          <button
            onClick={onToggleMusic}
            title={musicOn ? 'Mute Ambient Music' : 'Enable Ambient Music'}
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition"
          >
            <Music className={`w-4 h-4 ${musicOn ? 'text-indigo-400' : 'text-slate-500'}`} />
          </button>
        </div>
      </div>

      {/* Score Dashboard */}
      <div className="grid grid-cols-2 gap-2">
        {/* Current Score */}
        <div className="bg-slate-900/90 border border-indigo-500/20 rounded-xl p-2.5 flex items-center justify-between shadow-inner">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Score</div>
            <div className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              {score.toLocaleString()}
              {combo > 1 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 font-bold animate-pulse">
                  x{combo}
                </span>
              )}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
        </div>

        {/* Best High Score */}
        <div className="bg-slate-900/90 border border-amber-500/20 rounded-xl p-2.5 flex items-center justify-between shadow-inner">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Best</div>
            <div className="text-xl font-extrabold text-amber-200 tracking-tight">
              {highScore.toLocaleString()}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
        </div>
      </div>
    </header>
  );
};
