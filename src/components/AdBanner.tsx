import React, { useEffect } from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';

interface AdBannerProps {
  slotId?: string;
  format?: 'banner' | 'rectangle' | 'leaderboard';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotId = 'default-slot',
  format = 'banner',
  className = ''
}) => {
  // Check if real AdSense client is configured via global or env
  const adsenseClientId = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_ADSENSE_CLIENT_ID || '';
  const isRealAdSenseEnabled = Boolean(adsenseClientId && adsenseClientId.startsWith('ca-pub-'));

  useEffect(() => {
    if (isRealAdSenseEnabled) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // Handle AdSense script error gracefully
      }
    }
  }, [isRealAdSenseEnabled]);

  // If real AdSense is set up, render the authentic Google AdSense unit
  if (isRealAdSenseEnabled) {
    return (
      <div className={`w-full overflow-hidden flex justify-center items-center my-2 ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={adsenseClientId}
          data-ad-slot={slotId}
          data-ad-format={format === 'rectangle' ? 'rectangle' : 'auto'}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Fallback high-converting cosmic ad slot with clean sponsor design
  return (
    <div
      className={`w-full rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 p-2.5 flex items-center justify-between text-left shadow-sm ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
              Sponsored
            </span>
            <span className="text-xs font-bold text-slate-200">Play More Free Web Games</span>
          </div>
          <p className="text-[10px] text-slate-400 line-clamp-1">
            Discover trending casual & puzzle browser games online.
          </p>
        </div>
      </div>

      <a
        href="https://github.com/FaaizNaved/cosmo-merge"
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-[11px] font-semibold transition"
      >
        <span>Explore</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};
