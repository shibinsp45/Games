import React, { useState } from 'react';

export default function Game({ onNext }: { onNext: () => void }) {
  const [answer, setAnswer] = useState('');

  return (
    <main className="min-h-screen pt-24 pb-36 px-6 flex flex-col items-center max-w-lg mx-auto overflow-hidden relative z-10">
      <div className="absolute top-40 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-40 -right-20 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="w-full flex justify-between items-center mb-12">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full border-2 border-primary-fixed-dim flex items-center justify-center bg-surface-container-high shadow-[0_0_20px_rgba(253,144,0,0.3)]">
            <span className="text-xl font-headline font-extrabold text-primary">12</span>
          </div>
          <span className="text-[10px] font-label font-bold tracking-widest uppercase text-on-surface-variant">YOU</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-highest/60 border border-outline-variant/20 backdrop-blur-md">
          <span className="material-symbols-outlined text-[14px] text-tertiary">bolt</span>
          <span className="text-xs font-headline font-bold text-tertiary">STREAK: 5</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full border-2 border-secondary-fixed-dim flex items-center justify-center bg-surface-container-high shadow-[0_0_20px_rgba(166,140,255,0.3)]">
            <span className="text-xl font-headline font-extrabold text-secondary">08</span>
          </div>
          <span className="text-[10px] font-label font-bold tracking-widest uppercase text-on-surface-variant">PARTNER</span>
        </div>
      </div>

      <div className="w-full relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-25 transition duration-1000"></div>
        <div className="relative glass-card rounded-xl p-8 min-h-[320px] flex flex-col items-center justify-center text-center border border-white/5">
          <div className="mb-6 relative">
            <span className="text-6xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">🍕</span>
          </div>
          <h2 className="text-4xl font-headline font-extrabold leading-tight text-on-surface bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
            What's our favorite food?
          </h2>
          <div className="mt-8 flex gap-2 items-center">
            <span className="w-2 h-2 rounded-full bg-primary/40"></span>
            <span className="text-xs font-label font-medium text-on-surface-variant">Daily Truth Mission</span>
            <span className="w-2 h-2 rounded-full bg-primary/40"></span>
          </div>
        </div>
      </div>

      <div className="mt-12 mb-4 flex items-center gap-3">
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse-custom"></span>
          <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse-custom" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse-custom" style={{ animationDelay: '0.4s' }}></span>
        </div>
        <span className="text-sm font-label font-medium text-secondary-fixed-dim">Partner is typing...</span>
      </div>

      <div className="w-full space-y-4">
        <div className="relative group">
          <input 
            type="text" 
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your secret answer..." 
            className="w-full bg-surface-container-high/60 border border-white/5 rounded-2xl px-6 py-5 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary/50 backdrop-blur-xl transition-all font-body text-lg outline-none neon-glow-input"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">edit</span>
        </div>
        <button 
          onClick={onNext}
          disabled={!answer.trim()}
          className={`btn-primary w-full py-5 text-xl flex items-center justify-center gap-3 ${!answer.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Lock Answer
        </button>
      </div>
    </main>
  );
}
