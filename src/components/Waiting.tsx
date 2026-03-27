import React, { useEffect } from 'react';

export default function Waiting({ onNext }: { onNext: () => void }) {
  // Auto-advance after 3 seconds for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <main className="pt-24 pb-32 px-6 flex flex-col items-center justify-center min-h-screen relative z-10">
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -z-10"></div>
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-secondary/10 blur-[120px] rounded-full -z-10"></div>

      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tighter mb-4 text-on-surface">
          Waiting for Duo
        </h2>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-full border border-outline-variant/20 shadow-xl">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          <p className="text-sm font-label font-medium text-on-surface-variant">Waiting for partner...</p>
        </div>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* You Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-br from-primary to-orange-600 rounded-xl blur opacity-25 transition duration-1000"></div>
          <div className="relative bg-surface-container-highest/60 backdrop-blur-2xl p-8 rounded-xl border border-white/5 flex flex-col items-center justify-center min-h-[400px] shadow-2xl overflow-hidden">
            <div className="absolute top-4 right-4 bg-tertiary-container text-on-tertiary-container text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Ready
            </div>
            <div className="w-48 h-48 mb-8 relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"></div>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCz0aQo8ZcU0JzNpTazTf-0JnCN43RyHUFB-Lg8AWOpTvhpkxhWKJPJQqzty1G9fAOKri14muxMs91CVBxAEFgBFmq_elcLbEV0rsGstDmTlQiyIfYd4lRqSilkNpI0Ath2_OAfQtK-iGuXXulofMoszp-F8j7-uG-K6s4bNwUEHycAVw6qVb4bt1YSh7g-IU63pqPHmE6LPvgbtCst_ogugWd1_mu15OZkUEw6T03hbPzJKE3cUIjWHLuq7wZ0RevF3IrWoCS_3pY5" 
                alt="You Avatar" 
                className="w-full h-full object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(253,144,0,0.4)]"
              />
              <div className="absolute -bottom-2 -right-2 bg-tertiary text-on-tertiary p-2 rounded-full shadow-[0_0_20px_rgba(0,227,253,0.5)] z-20">
                <span className="material-symbols-outlined text-3xl font-bold" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
              </div>
            </div>
            <h3 className="text-2xl font-headline font-bold text-on-surface mb-1">You</h3>
            <p className="text-on-surface-variant font-label text-sm uppercase tracking-widest">Player 1</p>
          </div>
        </div>

        {/* Partner Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-br from-secondary to-purple-800 rounded-xl blur opacity-10 transition duration-1000"></div>
          <div className="relative bg-surface-container-low/40 backdrop-blur-xl p-8 rounded-xl border border-dashed border-outline-variant/30 flex flex-col items-center justify-center min-h-[400px] shadow-2xl overflow-hidden">
            <div className="w-48 h-48 mb-8 relative flex items-center justify-center">
              <div className="absolute w-32 h-32 bg-secondary/10 rounded-full avatar-pulse"></div>
              <div className="absolute w-44 h-44 bg-secondary/5 rounded-full avatar-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-40 h-40 rounded-full bg-surface-container-high/50 flex items-center justify-center border-2 border-dashed border-secondary/30">
                <span className="material-symbols-outlined text-6xl text-secondary/30 animate-pulse">person_add</span>
              </div>
            </div>
            <h3 className="text-2xl font-headline font-bold text-on-surface/50 mb-1">Partner</h3>
            <p className="text-secondary font-label text-sm uppercase tracking-widest animate-pulse">Joining...</p>
          </div>
        </div>
      </div>

      <div className="mt-16 w-full max-w-sm flex flex-col items-center">
        <button onClick={onNext} className="btn-secondary w-full text-outline font-headline font-bold text-lg py-5 px-8 flex items-center justify-center gap-3 opacity-50 hover:opacity-100">
          Start Game (Skip Wait)
          <span className="material-symbols-outlined">rocket_launch</span>
        </button>
        <p className="mt-4 text-xs font-label text-outline text-center">
          Waiting for your partner to scan the invite link or join the room.
        </p>
      </div>
    </main>
  );
}
