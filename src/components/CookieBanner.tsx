import React, { useState, useEffect } from 'react';
import { Cookie, Check } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cosmo_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cosmo_cookie_consent', 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 max-w-lg mx-auto z-40 bg-slate-950/95 border border-indigo-500/40 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-2.5">
        <Cookie className="w-5 h-5 text-amber-400 shrink-0" />
        <p className="text-[11px] text-slate-300 leading-tight">
          We use cookies to save high scores, remember preferences, and serve non-intrusive ads.
        </p>
      </div>
      <button
        onClick={handleAccept}
        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-500/20 active:scale-95"
      >
        <Check className="w-3.5 h-3.5" />
        <span>Accept</span>
      </button>
    </div>
  );
};
