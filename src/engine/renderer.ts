import { PhysicsEngine } from './physics';
import {
  CELESTIAL_BODIES,
  GAME_WIDTH,
  GAME_HEIGHT,
  DANGER_LINE_Y,
  DROP_LINE_Y
} from '../utils/constants';

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
}

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private stars: Star[] = [];

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.initStars();
  }

  private initStars() {
    this.stars = [];
    for (let i = 0; i < 70; i++) {
      this.stars.push({
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * GAME_HEIGHT,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.02 + 0.005
      });
    }
  }

  public render(
    engine: PhysicsEngine,
    currentTier: number,
    dropX: number,
    _isAiming: boolean,
    isGameOver: boolean
  ) {
    const ctx = this.ctx;
    ctx.save();

    // 1. Apply Screen Shake
    if (engine.screenShake > 0) {
      const shakeMag = engine.screenShake;
      const sx = (Math.random() - 0.5) * shakeMag;
      const sy = (Math.random() - 0.5) * shakeMag;
      ctx.translate(sx, sy);
    }

    // 2. Clear canvas with cosmic space background
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    const bgGrad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    bgGrad.addColorStop(0, '#090a1a');
    bgGrad.addColorStop(0.5, '#0d0f28');
    bgGrad.addColorStop(1, '#050612');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // 3. Render ambient stars & nebula dust
    for (const star of this.stars) {
      star.alpha += star.speed;
      if (star.alpha > 1 || star.alpha < 0.2) star.speed = -star.speed;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.alpha)})`;
      ctx.fill();
    }

    // 4. Render Danger Line with Pulsing Glow
    ctx.save();
    const dangerGlow = engine.isDanger ? 'rgba(239, 68, 68, 0.9)' : 'rgba(239, 68, 68, 0.25)';
    ctx.strokeStyle = dangerGlow;
    ctx.lineWidth = engine.isDanger ? 2.5 : 1.5;
    ctx.setLineDash([8, 6]);
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = engine.isDanger ? 12 : 4;
    ctx.beginPath();
    ctx.moveTo(10, DANGER_LINE_Y);
    ctx.lineTo(GAME_WIDTH - 10, DANGER_LINE_Y);
    ctx.stroke();

    // Danger Warning text if timer is active
    if (engine.isDanger && !isGameOver) {
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'right';
      const timeLeft = Math.max(0, (3.5 - engine.dangerTime)).toFixed(1);
      ctx.fillText(`DANGER: ${timeLeft}s`, GAME_WIDTH - 15, DANGER_LINE_Y - 8);
    }
    ctx.restore();

    // 5. Render Physics Bodies
    for (const b of engine.bodies) {
      if (b.isMerging) continue;

      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.angle);

      // Pop in scale effect
      if (b.scale && b.scale < 1) {
        b.scale = Math.min(1, b.scale + 0.1);
        ctx.scale(b.scale, b.scale);
      }

      const def = CELESTIAL_BODIES[b.tier];
      this.drawCelestialBody(ctx, b.radius, def);
      ctx.restore();
    }

    // 6. Render Particles
    for (const p of engine.particles) {
      ctx.save();
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (p.sparkle ? (Math.random() > 0.5 ? 1.4 : 0.7) : 1), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 7. Render Floating Text (Scores & Callouts)
    for (const ft of engine.floatingTexts) {
      ctx.save();
      const alpha = Math.max(0, ft.life / ft.maxLife);
      ctx.fillStyle = ft.color;
      ctx.globalAlpha = alpha;
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = 10;
      ctx.font = `bold ${Math.round(18 * ft.scale)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    // 8. Render Aiming Dropper & Guideline (if active and not game over)
    if (!isGameOver) {
      const def = CELESTIAL_BODIES[currentTier];
      const boundedX = Math.max(def.radius + 10, Math.min(GAME_WIDTH - def.radius - 10, dropX));

      // Vertical guide beam
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(boundedX, DROP_LINE_Y + def.radius);
      ctx.lineTo(boundedX, GAME_HEIGHT - 10);
      ctx.stroke();
      ctx.restore();

      // Current planet held at dropper
      ctx.save();
      ctx.translate(boundedX, DROP_LINE_Y);
      this.drawCelestialBody(ctx, def.radius, def);
      ctx.restore();
    }

    ctx.restore();
  }

  private drawCelestialBody(ctx: CanvasRenderingContext2D, radius: number, def: (typeof CELESTIAL_BODIES)[0]) {
    // Outer Glow / Atmosphere
    ctx.shadowColor = def.glowColor;
    ctx.shadowBlur = Math.min(22, radius * 0.4);

    // Planet body gradient
    const grad = ctx.createRadialGradient(-radius * 0.3, -radius * 0.3, radius * 0.1, 0, 0, radius);
    grad.addColorStop(0, def.gradient[0]);
    grad.addColorStop(1, def.gradient[1]);

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Planet Specific Decorative Features
    ctx.shadowBlur = 0; // reset for inner details

    if (def.tier === 2) {
      // Luna Craters
      ctx.fillStyle = 'rgba(2, 132, 199, 0.35)';
      ctx.beginPath();
      ctx.arc(-radius * 0.3, -radius * 0.2, radius * 0.2, 0, Math.PI * 2);
      ctx.arc(radius * 0.25, radius * 0.3, radius * 0.15, 0, Math.PI * 2);
      ctx.arc(radius * 0.1, -radius * 0.4, radius * 0.12, 0, Math.PI * 2);
      ctx.fill();
    } else if (def.tier === 5) {
      // Earth Continents & Swirls
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(-radius * 0.3, 0, radius * 0.35, 0, Math.PI * 2);
      ctx.arc(radius * 0.3, radius * 0.2, radius * 0.28, 0, Math.PI * 2);
      ctx.fill();

      // Cloud swirl
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.65, 0.2, 1.8);
      ctx.stroke();
    } else if (def.tier === 6) {
      // Neptune Rings
      ctx.strokeStyle = 'rgba(165, 180, 252, 0.6)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 1.35, radius * 0.4, Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();
    } else if (def.tier === 7) {
      // Jupiter Cloud Belts & Red Spot
      ctx.strokeStyle = 'rgba(161, 98, 7, 0.45)';
      ctx.lineWidth = radius * 0.18;
      ctx.beginPath();
      ctx.arc(0, -radius * 0.35, radius * 0.85, 0.4, Math.PI - 0.4);
      ctx.arc(0, radius * 0.35, radius * 0.85, 0.4, Math.PI - 0.4);
      ctx.stroke();

      // Great Red Spot
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.ellipse(radius * 0.35, radius * 0.2, radius * 0.2, radius * 0.13, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (def.tier === 8) {
      // Sun Flares
      ctx.strokeStyle = 'rgba(251, 146, 60, 0.7)';
      ctx.lineWidth = 2.5;
      for (let f = 0; f < 8; f++) {
        const fa = (Math.PI * 2 * f) / 8;
        ctx.beginPath();
        ctx.moveTo(Math.cos(fa) * radius, Math.sin(fa) * radius);
        ctx.lineTo(Math.cos(fa) * (radius + 8), Math.sin(fa) * (radius + 8));
        ctx.stroke();
      }
    } else if (def.tier === 9) {
      // Pulsar Radiation Beams
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.8)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, -radius * 1.5);
      ctx.lineTo(0, radius * 1.5);
      ctx.stroke();
    } else if (def.tier === 10) {
      // Supernova Starburst
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.85)';
      ctx.lineWidth = 3;
      for (let s = 0; s < 12; s++) {
        const sa = (Math.PI * 2 * s) / 12;
        ctx.beginPath();
        ctx.moveTo(Math.cos(sa) * (radius * 0.8), Math.sin(sa) * (radius * 0.8));
        ctx.lineTo(Math.cos(sa) * (radius * 1.25), Math.sin(sa) * (radius * 1.25));
        ctx.stroke();
      }
    } else if (def.tier === 11) {
      // Black Hole Event Horizon & Photon Sphere
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.08, 0, Math.PI * 2);
      ctx.stroke();

      // Accretion disk tilt
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 1.45, radius * 0.35, Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Outer rim highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius - 0.75, 0, Math.PI * 2);
    ctx.stroke();
  }
}
