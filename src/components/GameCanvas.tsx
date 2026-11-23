import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PhysicsEngine, MergeEvent } from '../engine/physics';
import { GameRenderer } from '../engine/renderer';
import { GAME_WIDTH, GAME_HEIGHT, DROP_LINE_Y } from '../utils/constants';
import { sounds } from '../utils/audio';

interface GameCanvasProps {
  onScoreUpdate: (points: number, combo: number, highestTier: number) => void;
  onGameOver: () => void;
  currentTier: number;
  onDropDone: () => void;
  isBombActive: boolean;
  onBombUsed: () => void;
  isGameOver: boolean;
  engineRef: React.MutableRefObject<PhysicsEngine | null>;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  onScoreUpdate,
  onGameOver,
  currentTier,
  onDropDone,
  isBombActive,
  onBombUsed,
  isGameOver,
  engineRef
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<GameRenderer | null>(null);
  const [dropX, setDropX] = useState<number>(GAME_WIDTH / 2);
  const [isAiming, setIsAiming] = useState<boolean>(false);
  const [canDrop, setCanDrop] = useState<boolean>(true);
  const lastTimeRef = useRef<number>(performance.now());
  const reqIdRef = useRef<number>(0);

  // Initialize engine & renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const engine = new PhysicsEngine();
    engine.onMergeCallback = (e: MergeEvent) => {
      onScoreUpdate(e.points, e.combo, e.tier);
    };
    engineRef.current = engine;
    rendererRef.current = new GameRenderer(ctx);

    // Initial warm-up frame
    rendererRef.current.render(engine, currentTier, dropX, false, false);
  }, []);

  // Main game loop
  const loop = useCallback((time: number) => {
    const engine = engineRef.current;
    const renderer = rendererRef.current;

    if (engine && renderer) {
      const dt = Math.min(0.05, (time - lastTimeRef.current) / 1000);
      lastTimeRef.current = time;

      if (!isGameOver) {
        engine.update(dt);

        // Check game over threshold
        if (engine.dangerTime >= 3.5) {
          sounds.playGameOver();
          onGameOver();
        }
      }

      renderer.render(engine, currentTier, dropX, isAiming, isGameOver);
    }

    reqIdRef.current = requestAnimationFrame(loop);
  }, [currentTier, dropX, isAiming, isGameOver, onGameOver]);

  useEffect(() => {
    lastTimeRef.current = performance.now();
    reqIdRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(reqIdRef.current);
  }, [loop]);

  // Handle aiming position mapping
  const getCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: GAME_WIDTH / 2, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = GAME_WIDTH / rect.width;
    const scaleY = GAME_HEIGHT / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const handlePointerDown = (clientX: number, clientY: number) => {
    if (isGameOver) return;
    const coords = getCanvasCoords(clientX, clientY);

    if (isBombActive && engineRef.current) {
      engineRef.current.triggerSupernovaBomb(coords.x, coords.y);
      onBombUsed();
      return;
    }

    setIsAiming(true);
    setDropX(coords.x);
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (isGameOver) return;
    const coords = getCanvasCoords(clientX, clientY);
    setDropX(coords.x);
  };

  const handlePointerUp = () => {
    if (isGameOver || !canDrop || isBombActive) {
      setIsAiming(false);
      return;
    }

    const engine = engineRef.current;
    if (engine) {
      sounds.playDrop();
      engine.addBody(currentTier, dropX, DROP_LINE_Y, (Math.random() - 0.5) * 0.4, 1.2);
      setCanDrop(false);
      onDropDone();

      // Drop cooldown to prevent spamming
      setTimeout(() => {
        setCanDrop(true);
      }, 500);
    }

    setIsAiming(false);
  };

  return (
    <div className="relative w-full max-w-[420px] mx-auto aspect-[480/680] rounded-2xl overflow-hidden shadow-2xl border-2 border-indigo-500/30 bg-slate-950 select-none touch-none">
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="w-full h-full block cursor-crosshair"
        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onMouseUp={handlePointerUp}
        onTouchStart={(e) => {
          if (e.touches.length > 0) {
            handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onTouchMove={(e) => {
          if (e.touches.length > 0) {
            handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onTouchEnd={handlePointerUp}
      />

      {/* Bomb Active Crosshair Overlay */}
      {isBombActive && (
        <div className="absolute inset-0 bg-orange-950/20 pointer-events-none flex items-center justify-center border-2 border-orange-500/80 animate-pulse">
          <div className="px-3 py-1.5 rounded-full bg-orange-600/90 text-white text-xs font-black tracking-wider shadow-lg">
            TAP ANYWHERE TO DETONATE BOMB
          </div>
        </div>
      )}
    </div>
  );
};
