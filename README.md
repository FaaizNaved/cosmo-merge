# 🌌 Cosmo Merge: Planetary 2048

A hyper-addictive, cosmic-themed 2D physics drop-and-merge puzzle web game built for viral engagement, mobile and desktop play, and turnkey Google AdSense monetization.

Play online: [https://cosmo-merge.vercel.app](https://cosmo-merge.vercel.app)

---

## 🚀 Game Features

- **Planetary Evolution Chain:** Fuse 12 celestial tiers from tiny Stardust all the way to Moon, Earth, Jupiter, Sun, Supernova, and Black Hole!
- **Juicy Real-Time Physics:** Custom sub-stepped circle collision engine with impulse resolution, restitution, inertia, and rolling friction.
- **Procedural Audio Synthesizer:** 100% zero-asset Web Audio API sound generator. Synthesizes melodic cosmic chimes on merges, bass impacts, drop whooshes, and ambient drone music.
- **Cosmic Power-Ups:**
  - 💥 **Supernova Bomb:** Vaporizes clustered or stuck planets.
  - 🌀 **Gravity Vortex:** Sucks celestial bodies inward into an instant mass fusion singularity.
  - 🔀 **Anti-Gravity Shake:** Gently jostles stacked planets to settle gaps.
  - 🎁 **Rewarded Refill:** Refill abilities anytime by watching a short sponsor ad.
- **Viral Growth & Retention:**
  - 1-Click Social Sharing generating viral emoji grids and score challenges for WhatsApp, Twitter/X, Telegram, and Facebook.
  - Responsive layout optimized for mobile touchscreens (iPhone/Android) and desktop mouse/keyboards.
  - PWA Support (installable directly as an app).
- **Monetization & AdSense Ready:**
  - Standard responsive ad units (Header Leaderboard, Bottom Banner, Interstitial Game-Over modal slot).
  - GDPR/CCPA-compliant Cookie Consent banner.
  - Pre-built Privacy Policy & Terms of Service for instant AdSense approval.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS
- **Physics Engine:** Custom 2D rigid-body circle physics with 6-step Verlet/Euler substepping
- **Audio Engine:** Web Audio API (procedural oscillator sound synthesis)
- **Deployment:** Vercel

---

## 💰 Connecting Google AdSense to Make Revenue

1. Obtain your **AdSense Publisher ID** (`ca-pub-XXXXXXXXXXXXXXXX`) from [Google AdSense](https://adsense.google.com).
2. Set your environment variable in Vercel or your local `.env`:
   ```bash
   VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
   ```
3. Alternatively, uncomment the Google AdSense script tag in `index.html`.
4. Deploy to Vercel — Google AdSense will automatically serve live ads in the designated responsive slots!

---

## 🎮 How to Play

1. **Aim:** Drag your cursor or finger across the drop container.
2. **Drop:** Release to drop the celestial body.
3. **Merge:** Collide two identical celestial bodies to evolve into the next tier.
4. **Survive:** Don't let your planets cross and stay above the red danger line!

---

## 📦 Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

---

## 📄 License

MIT © [Mohd Faaiz Naved](https://github.com/FaaizNaved)
