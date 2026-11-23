import React, { useState } from 'react';
import { X, Code, Check, Copy, ExternalLink, Globe } from 'lucide-react';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmbedModal: React.FC<EmbedModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const embedCode = `<iframe src="https://cosmo-merge.vercel.app" width="480" height="720" style="border:none;border-radius:16px;max-width:100%;box-shadow:0 10px 40px rgba(0,0,0,0.6);" allow="autoplay; fullscreen" title="Cosmo Merge: Planetary 2048"></iframe>\n<p style="font-size:12px;text-align:center;"><a href="https://cosmo-merge.vercel.app" target="_blank" rel="noopener">Play Cosmo Merge 2048 Online</a></p>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-indigo-500/40 rounded-2xl p-5 max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-black text-white uppercase tracking-wider">
              Embed on Your Website
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 py-2">
          Want to feature Cosmo Merge on your blog, gaming website, or school portal? Copy and paste the responsive iframe code below:
        </p>

        <div className="relative my-2">
          <pre className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap break-all select-all">
            {embedCode}
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition flex items-center gap-1 text-[10px] font-bold"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-2 py-2 text-[11px] text-slate-400">
          <div className="flex items-start gap-2">
            <Globe className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>Works seamlessly on WordPress, Notion, Blogger, Webflow, and custom HTML sites.</span>
          </div>
          <div className="flex items-start gap-2">
            <ExternalLink className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Zero dependencies, HTTPS secure, and automatically scales on mobile screens.</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
