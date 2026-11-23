import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { NextPreview } from './components/NextPreview';
import { GameCanvas } from './components/GameCanvas';
import { PowerUpBar } from './components/PowerUpBar';
import { GameOverModal } from './components/GameOverModal';
import { EvolutionTreeModal } from './components/EvolutionTreeModal';
import { HelpModal } from './components/HelpModal';
import { LegalModal } from './components/LegalModals';
import { CookieBanner } from './components/CookieBanner';
import { AdBanner } from './components/AdBanner';
import { PhysicsEngine } from './engine/physics';
import {
  loadGameStats,
  saveGameStats,
  loadPowerups,
  savePowerups,
  PowerUpInventory
} from './utils/storage';
import { sounds } from './utils/audio';

export const App: React.FC = () => {
  const [stats, setStats] = useState(loadGameStats);
  const [powerups, setPowerups] = useState<PowerUpInventory>(loadPowerups);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [currentTier, setCurrentTier] = useState<number>(() => Math.floor(Math.random() * 3));
  const [nextTier, setNextTier] = useState<number>(() => Math.floor(Math.random() * 3));
  const [upcomingTier, setUpcomingTier] = useState<number>(() => Math.floor(Math.random() * 4));
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const [highestTierReached, setHighestTierReached] = useState<number>(0);

  // Modals
  const [showEvolution, setShowEvolution] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [legalType, setLegalType] = useState<'privacy' | 'terms' | null>(null);
  const [isBombActive, setIsBombActive] = useState<boolean>(false);

  // Audio state
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [musicOn, setMusicOn] = useState<boolean>(false);

  const engineRef = useRef<PhysicsEngine | null>(null);

  // Save powerup state
  useEffect(() => {
    savePowerups(powerups);
  }, [powerups]);

  // Handle Score and Merges
  const handleScoreUpdate = (points: number, currentCombo: number, tier: number) => {
    setScore(prev => {
      const newScore = prev + points;
      if (newScore > stats.highScore) {
        setIsNewRecord(true);
        const updatedStats = { ...stats, highScore: newScore };
        setStats(updatedStats);
        saveGameStats(updatedStats);
      }
      return newScore;
    });

    setCombo(currentCombo);
    if (tier > highestTierReached) {
      setHighestTierReached(tier);
    }
  };

  // Dropping planet & cycling queue
  const handleDropDone = () => {
    setCurrentTier(nextTier);
    setNextTier(upcomingTier);
    // Probabilistic selection for upcoming drop (mostly tiers 0-3, rarely 4)
    const r = Math.random();
    const nextVal = r < 0.45 ? 0 : r < 0.75 ? 1 : r < 0.92 ? 2 : 3;
    setUpcomingTier(nextVal);
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    const updatedStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      highestTierReached: Math.max(stats.highestTierReached, highestTierReached)
    };
    setStats(updatedStats);
    saveGameStats(updatedStats);
  };

  const handleRestart = () => {
    sounds.playClick();
    if (engineRef.current) {
      engineRef.current.reset();
    }
    setScore(0);
    setCombo(0);
    setIsGameOver(false);
    setIsNewRecord(false);
    setIsBombActive(false);
  };

  // Revive mechanism (clears top 35% of stacked bodies)
  const handleRevive = () => {
    sounds.playClick();
    const engine = engineRef.current;
    if (engine) {
      engine.dangerTime = 0;
      engine.isDanger = false;
      // Remove bodies in danger zone
      engine.bodies = engine.bodies.filter(b => b.y > 320);
      engine.triggerGravityVortex();
    }
    setIsGameOver(false);
  };

  // Power-up triggers
  const useBomb = () => {
    if (powerups.bomb <= 0) return;
    sounds.playClick();
    setIsBombActive(true);
  };

  const handleBombUsed = () => {
    setIsBombActive(false);
    setPowerups(p => ({ ...p, bomb: Math.max(0, p.bomb - 1) }));
  };

  const useVortex = () => {
    if (powerups.vortex <= 0 || !engineRef.current) return;
    engineRef.current.triggerGravityVortex();
    setPowerups(p => ({ ...p, vortex: Math.max(0, p.vortex - 1) }));
  };

  const useShake = () => {
    if (powerups.shake <= 0 || !engineRef.current) return;
    engineRef.current.triggerShake();
    setPowerups(p => ({ ...p, shake: Math.max(0, p.shake - 1) }));
  };

  // Rewarded Ad Simulation (Refill power-ups)
  const handleRewardAd = () => {
    sounds.playClick();
    // Simulate short ad display or grant rewards directly
    setPowerups({
      bomb: 3,
      vortex: 3,
      shake: 5
    });
    alert('🎉 Thank you for supporting Cosmo Merge! All cosmic power-ups have been refilled!');
  };

  const toggleSound = () => {
    const state = sounds.toggleSound();
    setSoundOn(state);
  };

  const toggleMusic = () => {
    const state = sounds.toggleMusic();
    setMusicOn(state);
  };

  return (
    <div className="min-h-screen bg-[#070814] text-slate-100 flex flex-col justify-between items-center selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation & Scoreboard */}
      <div className="w-full">
        <Header
          score={score}
          highScore={stats.highScore}
          combo={combo}
          onOpenHelp={() => setShowHelp(true)}
          onOpenEvolution={() => setShowEvolution(true)}
          soundOn={soundOn}
          musicOn={musicOn}
          onToggleSound={toggleSound}
          onToggleMusic={toggleMusic}
        />
        <div className="px-3 my-1">
          <NextPreview nextTier={nextTier} upcomingTier={upcomingTier} />
        </div>
      </div>

      {/* Main Playfield Canvas */}
      <main className="w-full px-2 my-1 flex justify-center">
        <GameCanvas
          onScoreUpdate={handleScoreUpdate}
          onGameOver={handleGameOver}
          currentTier={currentTier}
          onDropDone={handleDropDone}
          isBombActive={isBombActive}
          onBombUsed={handleBombUsed}
          isGameOver={isGameOver}
          engineRef={engineRef}
        />
      </main>

      {/* Power-Up Controls */}
      <div className="w-full">
        <PowerUpBar
          powerups={powerups}
          onUseBomb={useBomb}
          onUseVortex={useVortex}
          onUseShake={useShake}
          onRewardAd={handleRewardAd}
          isBombActive={isBombActive}
        />

        {/* AdSense Top / Bottom Responsive Banner */}
        <div className="max-w-lg mx-auto w-full px-3 mb-2">
          <AdBanner slotId="bottom-leaderboard" format="banner" />
        </div>

        {/* Footer Links & SEO Compliance */}
        <footer className="w-full max-w-lg mx-auto px-4 py-2 border-t border-slate-900/80 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>© 2026 Cosmo Merge</span>
            <button
              onClick={() => setLegalType('privacy')}
              className="hover:text-slate-300 transition underline underline-offset-2"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setLegalType('terms')}
              className="hover:text-slate-300 transition underline underline-offset-2"
            >
              Terms of Service
            </button>
          </div>
          <div className="text-[10px] text-slate-600">
            Built with React & Canvas
          </div>
        </footer>
      </div>

      {/* Modals & Overlays */}
      {isGameOver && (
        <GameOverModal
          score={score}
          highScore={stats.highScore}
          highestTier={highestTierReached}
          isNewRecord={isNewRecord}
          onRestart={handleRestart}
          onRevive={handleRevive}
        />
      )}

      <EvolutionTreeModal
        isOpen={showEvolution}
        onClose={() => setShowEvolution(false)}
      />

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />

      <LegalModal
        type={legalType}
        onClose={() => setLegalType(null)}
      />

      <CookieBanner />
    </div>
  );
};
export default App;
