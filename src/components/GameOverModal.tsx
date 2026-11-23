import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Share2, RotateCcw, Check, AlertCircle, HeartHandshake } from 'lucide-react';
import { CELESTIAL_BODIES } from '../utils/constants';
import { AdBanner } from './AdBanner';

interface GameOverModalProps {
  score: number;
  highScore: number;
  highestTier: number;
  isNewRecord: boolean;
  onRestart: () => void;
  onRevive: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  highestTier,
  isNewRecord,
  onRestart,
  onRevive
}) => {
  const [copied, setCopied] = useState(false);
  const highestDef = CELESTIAL_BODIES[highestTier] || CELESTIAL_BODIES[0];

  React.useEffect(() => {
    if (isNewRecord) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isNewRecord]);

  const handleShare = async () => {
    const shareText = `🌌 I just scored ${score.toLocaleString()} pts in Cosmo Merge 2048!\nHighest Planet: ${highestDef.symbol} ${highestDef.name}\nCan you beat my score? Play free at ${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cosmo Merge: Planetary 2048',
          text: shareText,
          url: window.location.origin
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-indigo-500/40 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl shadow-indigo-500/20 relative animate-in fade-in zoom-in duration-300">
        {/* Badge */}
        {isNewRecord ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold mb-3 animate-bounce">
            <Trophy className="w-3.5 h-3.5" />
            NEW HIGH SCORE RECORD!
          </div>
        ) : (
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold mb-3">
            <AlertCircle className="w-3.5 h-3.5" />
            SPACE COLLAPSE!
          </div>
        )}

        <h2 className="text-2xl font-black text-white tracking-wide mb-1">GAME OVER</h2>
        <p className="text-xs text-slate-400 mb-4">The cosmic bounds overflowed!</p>

        {/* Score Board */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 mb-4 flex flex-col gap-2">
          <div className="flex justify-between items-center px-2">
            <span className="text-xs text-slate-400 font-semibold">Final Score</span>
            <span className="text-xl font-black text-cyan-300">{score.toLocaleString()}</span>
          </div>
          <div className="h-[1px] bg-slate-800" />
          <div className="flex justify-between items-center px-2">
            <span className="text-xs text-slate-400 font-semibold">All-Time Best</span>
            <span className="text-sm font-bold text-amber-400">{highScore.toLocaleString()}</span>
          </div>
          <div className="h-[1px] bg-slate-800" />
          <div className="flex justify-between items-center px-2">
            <span className="text-xs text-slate-400 font-semibold">Peak Evolution</span>
            <span className="text-sm font-bold text-indigo-300 flex items-center gap-1">
              <span>{highestDef.symbol}</span>
              <span>{highestDef.name}</span>
            </span>
          </div>
        </div>

        {/* AdSense Interstitial Placeholder */}
        <div className="mb-4">
          <AdBanner slotId="interstitial-modal" format="rectangle" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {/* Rewarded Revive Option */}
          <button
            onClick={onRevive}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Watch Ad to Revive (Clear Top 30%)</span>
          </button>

          {/* Share Score Button */}
          <button
            onClick={handleShare}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Score Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-indigo-400" />
                <span>Challenge Friends (Share)</span>
              </>
            )}
          </button>

          {/* Restart */}
          <button
            onClick={onRestart}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>
        </div>
      </div>
    </div>
  );
};
