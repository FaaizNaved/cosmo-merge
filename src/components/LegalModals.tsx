import React from 'react';
import { X, Shield, FileText } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-indigo-500/40 rounded-2xl p-5 max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            {type === 'privacy' ? (
              <Shield className="w-5 h-5 text-indigo-400" />
            ) : (
              <FileText className="w-5 h-5 text-indigo-400" />
            )}
            <h3 className="text-base font-black text-white uppercase tracking-wider">
              {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-3 py-3 pr-1 text-xs text-slate-300">
          {type === 'privacy' ? (
            <>
              <p>
                <strong>Last Updated:</strong> November 2026
              </p>
              <h4 className="font-bold text-white text-sm">1. Information We Collect</h4>
              <p>
                Cosmo Merge operates primarily as a client-side web game. We store minimal game state (high scores, audio preferences, and unlocked power-ups) locally on your device via HTML5 LocalStorage. We do not sell or collect personal identifiable information (PII).
              </p>
              <h4 className="font-bold text-white text-sm">2. Cookies & Advertising Partners</h4>
              <p>
                We may use third-party advertising partners, including Google AdSense and analytics providers. Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the Internet.
              </p>
              <h4 className="font-bold text-white text-sm">3. Opting Out of Personalized Ads</h4>
              <p>
                Users may opt out of personalized advertising by visiting Google Ads Settings (www.aboutads.info/choices).
              </p>
              <h4 className="font-bold text-white text-sm">4. GDPR & CCPA Compliance</h4>
              <p>
                If you are a resident of the European Economic Area (EEA) or California, you have the right to request access to or deletion of any stored preferences or opt out of tracking technologies.
              </p>
              <h4 className="font-bold text-white text-sm">5. Contact Information</h4>
              <p>
                For any privacy questions or inquiries, please contact the developer via GitHub: https://github.com/FaaizNaved
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Last Updated:</strong> November 2026
              </p>
              <h4 className="font-bold text-white text-sm">1. Acceptance of Terms</h4>
              <p>
                By accessing and playing Cosmo Merge, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the game.
              </p>
              <h4 className="font-bold text-white text-sm">2. Free to Play License</h4>
              <p>
                Cosmo Merge is provided free of charge for personal, non-commercial entertainment. You may not reverse-engineer, exploit, or disrupt game services.
              </p>
              <h4 className="font-bold text-white text-sm">3. Disclaimer of Warranties</h4>
              <p>
                The game is provided "as is" without warranty of any kind. We do not guarantee uninterrupted availability or error-free gameplay.
              </p>
            </>
          )}
        </div>

        <div className="pt-3 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
