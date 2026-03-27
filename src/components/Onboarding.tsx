import React, { useState } from 'react';

export default function Onboarding({ onNext, onJoin }: { onNext: () => void, onJoin: () => void }) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  return (
    <main className="pt-28 pb-32 px-6 max-w-2xl mx-auto flex flex-col gap-12 relative z-10">
      {/* Background Accents */}
      <div className="fixed top-[-10%] right-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10"></div>
      <div className="fixed bottom-[-5%] left-[-10%] w-80 h-80 bg-secondary/20 rounded-full blur-[100px] -z-10"></div>

      {/* Hero Section */}
      <section className="flex flex-col gap-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight bg-gradient-to-br from-on-background via-on-background to-secondary bg-clip-text text-transparent">
          Welcome to Lover's Lounge
        </h1>
        <p className="text-on-surface-variant text-lg leading-relaxed max-w-md mx-auto">
          Ready to deepen your connection? Let's personalize your experience.
        </p>
      </section>

      {/* Name Input */}
      <section className="flex flex-col gap-4">
        <label className="font-headline font-bold text-sm uppercase tracking-widest text-primary ml-1">Your Name</label>
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Enter your name" 
            className="w-full bg-surface-container-high border border-white/5 rounded-2xl px-6 py-5 text-lg font-medium focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-outline-variant outline-none neon-glow-input"
          />
          <div className="absolute inset-y-0 right-6 flex items-center text-outline-variant group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined">person</span>
          </div>
        </div>
      </section>

      {/* Categories Bento Grid */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="font-headline font-bold text-xl">Choose Your Mood</h2>
          <p className="text-on-surface-variant text-sm">Select the categories you'd like to explore tonight.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <MoodCard 
            emoji="❤️" title="Love" desc="Deep connections" colorClass="border-error-dim glow-shadow-error" bgClass="bg-error-dim/10"
            selected={selectedMood === 'love'} onClick={() => setSelectedMood('love')}
          />
          <MoodCard 
            emoji="📸" title="Memories" desc="Walk down lane" colorClass="border-tertiary-dim glow-shadow-tertiary" bgClass="bg-tertiary-dim/10"
            selected={selectedMood === 'memories'} onClick={() => setSelectedMood('memories')}
          />
          <MoodCard 
            emoji="🥳" title="Fun" desc="Light & playful" colorClass="border-primary glow-shadow-primary" bgClass="bg-primary/10"
            selected={selectedMood === 'fun'} onClick={() => setSelectedMood('fun')}
          />
          <MoodCard 
            emoji="🌶️" title="Spicy" desc="Heating things up" colorClass="border-secondary glow-shadow-secondary" bgClass="bg-secondary/10"
            selected={selectedMood === 'spicy'} onClick={() => setSelectedMood('spicy')}
          />
        </div>
      </section>

      {/* Decorative Illustration Element */}
      <section className="w-full h-48 rounded-2xl overflow-hidden relative shadow-2xl cursor-pointer hover:opacity-90 transition-opacity border border-white/10" onClick={onJoin}>
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzRlxGdHk4tGtxlfmaG3CwbMcHMFHf2XICuDSCAilaNXRbdTAFPZrfPWXQTyiWhehuJmvbDx_le3_JQje-LPJV5nOtMzCqcfrWcMSyk3dNJkQB2Ezpz1Eni_Y7gGHuXkrLdqgwGu7iM3DSGOCGLSguoYlIgLkTp7DfQsk3XlkQMJBr4bQcBrO1fmX3fgi8r3ir_Ciu4eCRSCMzyBwYkY69Cw9YVNwRXrGB6uEbiouWkLD7SCgI8qa12EYHZo6pcVDaHlfoiXIW7A3E" 
          alt="Couples Choice" 
          className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        <div className="absolute bottom-4 left-6 right-6">
          <p className="text-xs font-headline font-bold text-primary tracking-widest uppercase opacity-80">Couples Choice</p>
          <p className="text-lg font-bold">Trusted by 10,000+ happy pairs</p>
          <p className="text-sm text-on-surface-variant mt-1">Tap here to Join a Room instead</p>
        </div>
      </section>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 w-full px-8 pb-10 pt-4 bg-gradient-to-t from-background via-background/95 to-transparent z-50">
        <button onClick={onNext} className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-3">
          Get Started
          <span className="material-symbols-outlined font-black">arrow_forward</span>
        </button>
      </div>
    </main>
  );
}

function MoodCard({ emoji, title, desc, colorClass, bgClass, selected, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group cursor-pointer transition-all duration-300 border-b-4 ${colorClass} ${selected ? 'bg-surface-variant/80 scale-[0.98] shadow-inner' : 'hover:bg-surface-variant/60 hover:-translate-y-1 active:scale-[0.98]'}`}
    >
      <div className="text-5xl mb-2 filter drop-shadow-md group-hover:scale-110 transition-transform">{emoji}</div>
      <div className="flex flex-col">
        <span className="font-headline font-extrabold text-2xl text-on-background">{title}</span>
        <span className="text-xs text-on-surface-variant font-medium">{desc}</span>
      </div>
      <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full blur-2xl ${bgClass}`}></div>
    </div>
  );
}
