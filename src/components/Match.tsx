import React, { useState } from 'react';

export default function Match({ onNext, onDashboard }: { onNext: () => void, onDashboard: () => void }) {
  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  const reactions = ['😂', '❤️', '🔥', '😮'];

  return (
    <main className="flex-1 pt-24 pb-32 px-6 max-w-lg mx-auto w-full relative z-10 min-h-screen">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-20 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] pointer-events-none -z-10"></div>

      <div className="text-center mb-10 relative">
        <div className="inline-block mb-2 px-4 py-1 rounded-full bg-secondary-container/30 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-widest">Question #12</div>
        <h2 className="font-headline text-4xl font-extrabold tracking-tight mb-2">It's a Match!</h2>
        <p className="text-on-surface-variant font-medium">You both chose the same vibe.</p>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <div className="absolute top-1/4 left-10 text-2xl animate-bounce">✨</div>
        <div className="absolute top-1/3 right-10 text-2xl animate-pulse">🎉</div>
        <div className="absolute bottom-1/2 left-20 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>💖</div>
        <div className="absolute top-2/3 right-15 text-2xl animate-pulse" style={{ animationDelay: '0.2s' }}>⭐</div>
      </div>

      <div className="flex gap-4 mb-12 items-end relative z-10">
        <div className="flex-1 flex flex-col gap-3 group">
          <span className="text-xs font-bold font-headline uppercase text-slate-500 text-center tracking-widest">Your Answer</span>
          <div className="glass-card rounded-xl p-6 text-center transform transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(253,144,0,0.2)] border-2 border-primary/40 ring-4 ring-primary/10">
            <div className="text-5xl mb-4 drop-shadow-xl transform group-hover:scale-110 transition-transform">🍕</div>
            <p className="font-headline font-bold text-lg text-primary">Pizza Night</p>
          </div>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full z-20 flex flex-col items-center animate-bounce">
          <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-full p-3 shadow-xl border-4 border-surface mb-2">
            <span className="material-symbols-outlined text-white font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
          </div>
          <div className="font-black text-2xl text-tertiary-fixed drop-shadow-[0_0_10px_rgba(0,227,253,0.5)]">+1 Point</div>
        </div>

        <div className="flex-1 flex flex-col gap-3 group">
          <span className="text-xs font-bold font-headline uppercase text-slate-500 text-center tracking-widest">Partner's Answer</span>
          <div className="glass-card rounded-xl p-6 text-center transform transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(253,144,0,0.2)] border-2 border-primary/40 ring-4 ring-primary/10">
            <div className="text-5xl mb-4 drop-shadow-xl transform group-hover:scale-110 transition-transform">🍕</div>
            <p className="font-headline font-bold text-lg text-primary">Pizza Night</p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 mb-8 flex flex-col items-center gap-4 relative z-10">
        <span className="text-xs font-bold font-headline uppercase text-outline-variant tracking-widest">React to this match</span>
        <div className="flex justify-around w-full">
          {reactions.map(emoji => (
            <button 
              key={emoji}
              onClick={() => setActiveReaction(emoji)}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all transform active:scale-90 border ${
                activeReaction === emoji 
                  ? 'bg-surface-bright border-primary scale-110 shadow-[0_0_15px_rgba(253,144,0,0.3)]' 
                  : 'bg-surface-container-high border-outline-variant/20 hover:bg-surface-bright'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <button onClick={onNext} className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-3 relative z-10">
        Keep Playing
        <span className="material-symbols-outlined">arrow_forward</span>
      </button>
      
      <div className="mt-8 text-center relative z-10">
        <button onClick={onDashboard} className="text-outline-variant font-label font-bold text-sm uppercase tracking-widest hover:text-on-surface transition-colors cursor-pointer">Go to Dashboard</button>
      </div>

      <div className="fixed inset-0 pointer-events-none z-40 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-secondary rotate-45 animate-bounce"></div>
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-tertiary rounded-full animate-ping"></div>
        <div className="absolute top-3/4 left-10 w-2 h-2 bg-error-dim rotate-12"></div>
      </div>
    </main>
  );
}
