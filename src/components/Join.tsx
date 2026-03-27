import React from 'react';

export default function Join({ onNext }: { onNext: () => void }) {
  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center px-8 z-10 relative overflow-hidden pt-24 pb-32">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 blur-[120px] rounded-full -z-10"></div>

      <div className="w-full max-w-md flex flex-col items-center">
        <div className="text-center mb-12">
          <h2 className="font-headline text-5xl font-extrabold tracking-tighter mb-4 text-on-surface">
            Join the Fun
          </h2>
          <p className="text-on-surface-variant font-medium text-lg max-w-[280px] mx-auto leading-relaxed">
            Enter your partner's unique room code to start playing.
          </p>
        </div>

        <div className="w-full space-y-6">
          <div className="relative group">
            <input 
              type="text" 
              maxLength={4} 
              placeholder="Enter code" 
              className="w-full h-20 bg-surface-variant/50 border-2 border-primary/30 rounded-xl px-6 text-center text-4xl font-headline font-bold tracking-[0.5em] text-primary placeholder:text-outline-variant placeholder:tracking-normal placeholder:font-medium placeholder:text-xl transition-all duration-300 neon-glow-input focus:border-primary focus:ring-0 outline-none uppercase"
            />
            <div className="absolute -top-6 -right-4 text-4xl drop-shadow-[0_10px_15px_rgba(255,164,76,0.4)] rotate-12 transition-transform group-focus-within:scale-125 group-focus-within:rotate-0 duration-500">
              🔥
            </div>
            <div className="absolute -bottom-4 -left-6 text-4xl drop-shadow-[0_10px_15px_rgba(166,140,255,0.4)] -rotate-12 transition-transform group-focus-within:scale-110 group-focus-within:rotate-6 duration-500">
              ✨
            </div>
          </div>

          <button onClick={onNext} className="btn-primary w-full h-16 flex items-center justify-center gap-3">
            <span className="font-headline font-bold text-xl">Join Room</span>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
          </button>
        </div>

        <div className="mt-16 flex items-center gap-3 bg-surface-container-high/60 px-6 py-2.5 rounded-full border border-outline-variant/20">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-tertiary shadow-[0_0_10px_rgba(0,227,253,0.8)]"></span>
          </span>
          <span className="text-tertiary-dim font-headline font-bold uppercase tracking-widest text-[11px]">Servers Active</span>
        </div>
      </div>
    </main>
  );
}
