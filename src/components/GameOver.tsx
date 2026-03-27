import React from 'react';

export default function GameOver({ onPlayAgain, onChangeCategory }: { onPlayAgain: () => void, onChangeCategory: () => void }) {
  return (
    <main className="pt-28 pb-32 px-6 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-screen relative z-10 bg-mesh">
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tighter bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent uppercase">
          Game Over!
        </h1>
      </div>

      <div className="relative w-full aspect-square max-w-md flex items-center justify-center mb-12">
        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-75 -z-10"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-9xl mb-6 drop-shadow-[0_0_50px_rgba(255,77,0,0.5)] animate-bounce">
            ❤️
          </div>
          <div className="text-center">
            <div className="text-primary font-headline font-extrabold text-4xl md:text-5xl mb-2 drop-shadow-sm">
              You matched 8/10
            </div>
            <div className="inline-block px-6 py-2 rounded-full bg-secondary-container/30 backdrop-blur-md border border-secondary/20 mb-4">
              <span className="text-secondary font-headline font-bold text-xl">80% Soulmates</span>
            </div>
          </div>
        </div>

        <div className="absolute -top-4 -right-4 w-24 h-24 bg-tertiary-container/10 backdrop-blur-xl rounded-2xl rotate-12 flex items-center justify-center border border-white/5">
          <span className="text-4xl">✨</span>
        </div>
        <div className="absolute -bottom-6 -left-4 w-20 h-20 bg-primary-container/20 backdrop-blur-xl rounded-full -rotate-12 flex items-center justify-center border border-white/5">
          <span className="text-3xl">🔥</span>
        </div>
      </div>

      <div className="text-center mb-12 space-y-4">
        <p className="text-2xl md:text-3xl font-headline font-bold text-on-surface">
          You really know each other!
        </p>
        <p className="text-on-surface-variant font-body max-w-xs mx-auto">
          That was an incredible session. You've unlocked the "Deep Resonance" badge!
        </p>
      </div>

      {/* Bento Style Stats Grid */}
      <div className="grid grid-cols-2 gap-4 w-full mb-12">
        <div className="bg-surface-container-high/50 backdrop-blur-lg p-6 rounded-lg border border-outline-variant/10 flex flex-col justify-between h-32">
          <span className="text-on-surface-variant text-sm font-label uppercase tracking-widest">Speed</span>
          <span className="text-tertiary font-headline font-bold text-2xl">Fast ⚡</span>
        </div>
        <div className="bg-surface-container-high/50 backdrop-blur-lg p-6 rounded-lg border border-outline-variant/10 flex flex-col justify-between h-32">
          <span className="text-on-surface-variant text-sm font-label uppercase tracking-widest">Streak</span>
          <span className="text-primary font-headline font-bold text-2xl">5 Wins 🔥</span>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-col gap-4 w-full sm:flex-row sm:justify-center">
        <button onClick={onPlayAgain} className="btn-primary flex-1 max-w-xs px-8 py-5 text-lg flex items-center justify-center gap-3">
          <span className="material-symbols-outlined">replay</span>
          Play Again
        </button>
        <button onClick={onChangeCategory} className="btn-secondary flex-1 max-w-xs px-8 py-5 text-lg flex items-center justify-center gap-3 group">
          <span className="material-symbols-outlined group-hover:text-primary">category</span>
          Change Categories
        </button>
      </div>
    </main>
  );
}
