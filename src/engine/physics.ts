import { BodyInstance, Particle, FloatingText } from '../types/game';
import {
  CELESTIAL_BODIES,
  GAME_WIDTH,
  GAME_HEIGHT,
  GRAVITY,
  BOUNCE_RESTITUTION,
  FRICTION,
  WALL_RESTITUTION,
  SUB_STEPS,
  DANGER_LINE_Y
} from '../utils/constants';
import { sounds } from '../utils/audio';

export interface MergeEvent {
  tier: number;
  x: number;
  y: number;
  points: number;
  combo: number;
}

export class PhysicsEngine {
  public bodies: BodyInstance[] = [];
  public particles: Particle[] = [];
  public floatingTexts: FloatingText[] = [];
  public nextId: number = 1;
  public screenShake: number = 0;
  public combo: number = 0;
  public comboTimer: number = 0;
  public onMergeCallback?: (event: MergeEvent) => void;
  public dangerTime: number = 0; // ms spent above danger line
  public isDanger: boolean = false;

  public reset() {
    this.bodies = [];
    this.particles = [];
    this.floatingTexts = [];
    this.nextId = 1;
    this.screenShake = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.dangerTime = 0;
    this.isDanger = false;
  }

  public addBody(tier: number, x: number, y: number, vx: number = 0, vy: number = 0): BodyInstance {
    const def = CELESTIAL_BODIES[tier];
    const radius = def.radius;
    const mass = radius * radius;
    const body: BodyInstance = {
      id: this.nextId++,
      tier,
      x: Math.max(radius + 2, Math.min(GAME_WIDTH - radius - 2, x)),
      y,
      vx,
      vy,
      radius,
      mass,
      angle: Math.random() * Math.PI * 2,
      va: (Math.random() - 0.5) * 0.05,
      scale: 1,
      alpha: 1
    };
    this.bodies.push(body);
    return body;
  }

  public update(dt: number) {
    // Screen shake decay
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt * 25);
    }

    // Combo timer decay (resets combo after 2.5s of no merges)
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.combo = 0;
      }
    }

    const subGravity = GRAVITY * (dt * 60) / SUB_STEPS;

    // Sub-stepping for ultra stable physics
    for (let step = 0; step < SUB_STEPS; step++) {
      // 1. Move bodies & apply gravity
      for (let i = 0; i < this.bodies.length; i++) {
        const b = this.bodies[i];
        if (b.isMerging) continue;

        b.vy += subGravity;
        b.vx *= Math.pow(FRICTION, 1 / SUB_STEPS);
        b.vy *= Math.pow(FRICTION, 1 / SUB_STEPS);

        b.x += b.vx * (dt * 60) / SUB_STEPS;
        b.y += b.vy * (dt * 60) / SUB_STEPS;
        b.angle += b.va;

        // Wall collisions
        if (b.x - b.radius < 0) {
          b.x = b.radius;
          b.vx = -b.vx * WALL_RESTITUTION;
        } else if (b.x + b.radius > GAME_WIDTH) {
          b.x = GAME_WIDTH - b.radius;
          b.vx = -b.vx * WALL_RESTITUTION;
        }

        // Floor collision
        if (b.y + b.radius > GAME_HEIGHT) {
          b.y = GAME_HEIGHT - b.radius;
          b.vy = -b.vy * BOUNCE_RESTITUTION;
          b.vx *= 0.95; // floor friction
          if (Math.abs(b.vy) < 0.15) b.vy = 0;
        }
      }

      // 2. Circle to Circle Collision Resolution
      this.resolveCollisions();
    }

    // Remove merged bodies & spawn resulting bodies
    this.processPendingMerges();

    // Danger line detection (only check bodies that have settled somewhat)
    let hasBodyAboveDanger = false;
    for (const b of this.bodies) {
      if (b.y - b.radius < DANGER_LINE_Y && Math.abs(b.vy) < 1.0 && b.y > 60) {
        hasBodyAboveDanger = true;
        break;
      }
    }

    if (hasBodyAboveDanger) {
      this.dangerTime += dt;
      this.isDanger = true;
    } else {
      this.dangerTime = Math.max(0, this.dangerTime - dt * 1.5);
      this.isDanger = this.dangerTime > 0.5;
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update floating texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y -= 35 * dt;
      ft.life -= dt;
      ft.scale = Math.min(1.4, ft.scale + dt * 0.6);
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  private resolveCollisions() {
    const len = this.bodies.length;
    for (let i = 0; i < len; i++) {
      const b1 = this.bodies[i];
      if (b1.isMerging) continue;

      for (let j = i + 1; j < len; j++) {
        const b2 = this.bodies[j];
        if (b2.isMerging) continue;

        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const distSq = dx * dx + dy * dy;
        const minDist = b1.radius + b2.radius;

        if (distSq < minDist * minDist && distSq > 0.0001) {
          const dist = Math.sqrt(distSq);
          const nx = dx / dist;
          const ny = dy / dist;

          // Check if same tier -> trigger merge!
          if (b1.tier === b2.tier && b1.tier < CELESTIAL_BODIES.length - 1) {
            b1.isMerging = true;
            b2.isMerging = true;
            continue;
          }

          // Positional overlap resolution
          const overlap = minDist - dist;
          const totalMass = b1.mass + b2.mass;
          const ratio1 = b2.mass / totalMass;
          const ratio2 = b1.mass / totalMass;

          b1.x -= nx * overlap * ratio1;
          b1.y -= ny * overlap * ratio1;
          b2.x += nx * overlap * ratio2;
          b2.y += ny * overlap * ratio2;

          // Relative velocity along normal
          const rvx = b1.vx - b2.vx;
          const rvy = b1.vy - b2.vy;
          const velAlongNormal = rvx * nx + rvy * ny;

          if (velAlongNormal > 0) {
            const restitution = BOUNCE_RESTITUTION;
            const impulseMag = -(1 + restitution) * velAlongNormal / (1 / b1.mass + 1 / b2.mass);

            b1.vx += (nx * impulseMag) / b1.mass;
            b1.vy += (ny * impulseMag) / b1.mass;
            b2.vx -= (nx * impulseMag) / b2.mass;
            b2.vy -= (ny * impulseMag) / b2.mass;

            // Surface friction tangent
            const tx = -ny;
            const ty = nx;
            const velAlongTangent = rvx * tx + rvy * ty;
            const frictionImpulse = -velAlongTangent * 0.15 / (1 / b1.mass + 1 / b2.mass);
            b1.vx += (tx * frictionImpulse) / b1.mass;
            b1.vy += (ty * frictionImpulse) / b1.mass;
            b2.vx -= (tx * frictionImpulse) / b2.mass;
            b2.vy -= (ty * frictionImpulse) / b2.mass;
          }
        }
      }
    }
  }

  private processPendingMerges() {
    const mergingPairs: Array<[BodyInstance, BodyInstance]> = [];
    const checked = new Set<number>();

    for (let i = 0; i < this.bodies.length; i++) {
      const b1 = this.bodies[i];
      if (!b1.isMerging || checked.has(b1.id)) continue;

      for (let j = i + 1; j < this.bodies.length; j++) {
        const b2 = this.bodies[j];
        if (b2.isMerging && !checked.has(b2.id) && b1.tier === b2.tier) {
          mergingPairs.push([b1, b2]);
          checked.add(b1.id);
          checked.add(b2.id);
          break;
        }
      }
    }

    if (mergingPairs.length === 0) return;

    // Filter out bodies that merged
    this.bodies = this.bodies.filter(b => !checked.has(b.id));

    for (const [b1, b2] of mergingPairs) {
      const nextTier = b1.tier + 1;
      const midX = (b1.x + b2.x) / 2;
      const midY = (b1.y + b2.y) / 2;
      const nextDef = CELESTIAL_BODIES[nextTier];

      // Spawn next body
      const newBody = this.addBody(nextTier, midX, midY, (b1.vx + b2.vx) * 0.3, -1.2);
      newBody.scale = 0.4; // Pop in animation

      // Combo update
      this.combo++;
      this.comboTimer = 2.4;
      const comboMultiplier = Math.min(5, 1 + (this.combo - 1) * 0.25);
      const pointsEarned = Math.round(nextDef.points * comboMultiplier);

      // Screen shake
      this.screenShake = Math.min(18, this.screenShake + (nextTier >= 8 ? 12 : 5));

      // Audio
      sounds.playMerge(nextTier, this.combo);

      // Particle explosion
      this.spawnMergeParticles(midX, midY, nextDef.color, nextTier >= 7 ? 35 : 20);

      // Floating text
      const comboText = this.combo > 1 ? ` COMBO x${this.combo}!` : '';
      this.floatingTexts.push({
        id: this.nextId++,
        x: midX,
        y: midY - 15,
        text: `+${pointsEarned}${comboText}`,
        color: nextDef.color,
        life: 1.1,
        maxLife: 1.1,
        scale: 0.9
      });

      // Special callouts for high tiers
      if (nextTier === 10) {
        this.floatingTexts.push({
          id: this.nextId++,
          x: midX,
          y: midY - 45,
          text: 'SUPERNOVA!',
          color: '#ec4899',
          life: 1.8,
          maxLife: 1.8,
          scale: 1.4
        });
      } else if (nextTier === 11) {
        this.floatingTexts.push({
          id: this.nextId++,
          x: midX,
          y: midY - 45,
          text: 'SINGULARITY CREATED!',
          color: '#a855f7',
          life: 2.2,
          maxLife: 2.2,
          scale: 1.6
        });
      }

      // Notify callback
      if (this.onMergeCallback) {
        this.onMergeCallback({
          tier: nextTier,
          x: midX,
          y: midY,
          points: pointsEarned,
          combo: this.combo
        });
      }
    }
  }

  public spawnMergeParticles(x: number, y: number, color: string, count: number) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 4.5 + 2.0;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: Math.random() * 0.4 + 0.35,
        maxLife: 0.75,
        color,
        size: Math.random() * 4 + 2,
        sparkle: Math.random() > 0.4
      });
    }
  }

  // Supernova Bomb Powerup: vaporizes bodies in radius
  public triggerSupernovaBomb(x: number, y: number): number {
    const blastRadius = 140;
    let vaporizedCount = 0;
    sounds.playPowerup('bomb');
    this.screenShake = 16;

    this.bodies = this.bodies.filter(b => {
      const dist = Math.hypot(b.x - x, b.y - y);
      if (dist < blastRadius && b.tier < 9) {
        vaporizedCount++;
        this.spawnMergeParticles(b.x, b.y, CELESTIAL_BODIES[b.tier].color, 18);
        return false;
      }
      // Bodies outside blast get pushed violently
      if (dist < blastRadius * 1.6) {
        const pushAngle = Math.atan2(b.y - y, b.x - x);
        const force = (1 - dist / (blastRadius * 1.6)) * 12;
        b.vx += Math.cos(pushAngle) * force;
        b.vy += Math.sin(pushAngle) * force;
      }
      return true;
    });

    // Particle shockwave
    for (let i = 0; i < 40; i++) {
      const angle = (Math.PI * 2 * i) / 40;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * 7,
        vy: Math.sin(angle) * 7,
        life: 0.6,
        maxLife: 0.6,
        color: '#f97316',
        size: 5
      });
    }

    return vaporizedCount;
  }

  // Black Hole Vortex Powerup: pulls all bodies toward center
  public triggerGravityVortex(centerX: number = GAME_WIDTH / 2, centerY: number = GAME_HEIGHT / 2) {
    sounds.playPowerup('vortex');
    this.screenShake = 12;

    for (const b of this.bodies) {
      const dx = centerX - b.x;
      const dy = centerY - b.y;
      const dist = Math.hypot(dx, dy) || 1;
      const pull = Math.min(14, 180 / dist);
      b.vx += (dx / dist) * pull;
      b.vy += (dy / dist) * pull - 2.5; // slight upward lift
    }

    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 120 + 30;
      this.particles.push({
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r,
        vx: -Math.cos(angle) * 4,
        vy: -Math.sin(angle) * 4,
        life: 0.6,
        maxLife: 0.6,
        color: '#a855f7',
        size: 3
      });
    }
  }

  // Anti-Gravity / Shake: jostles stuck bodies
  public triggerShake() {
    sounds.playPowerup('shake');
    this.screenShake = 8;
    for (const b of this.bodies) {
      b.vx += (Math.random() - 0.5) * 8;
      b.vy -= Math.random() * 4 + 2;
    }
  }
}
