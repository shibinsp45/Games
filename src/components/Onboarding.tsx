import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../utils/firebaseErrors';
import { motion } from 'motion/react';
import { playHaptic, playSuccess } from '../utils/haptics';

interface Props {
  onNext: () => void;
  onJoin: () => void;
  setRoomId: (id: string) => void;
  user: User;
}

export default function Onboarding({ onNext, onJoin, setRoomId, user }: Props) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = async () => {
    if (isCreating) return;
    setIsCreating(true);
    
    // Generate a random 4-character code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newRoomId = '';
    for (let i = 0; i < 4; i++) {
      newRoomId += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    try {
      await setDoc(doc(db, 'rooms', newRoomId), {
        hostId: user.uid,
        code: newRoomId,
        status: 'waiting',
        hostScore: 0,
        guestScore: 0,
        totalRounds: 0,
        createdAt: serverTimestamp()
      });
      playSuccess();
      setRoomId(newRoomId);
      onNext();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `rooms/${newRoomId}`);
      setIsCreating(false);
    }
  };

  return (
    <motion.main 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: "circOut" }}
      className="pt-24 pb-32 px-6 max-w-2xl mx-auto flex flex-col gap-10 relative z-10"
    >
      {/* Background Accents - More Atmospheric */}
      <div className="fixed top-[-15%] right-[-10%] w-[120%] h-[50%] bg-primary/20 rounded-full blur-[140px] -z-10 animate-pulse"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[120%] h-[50%] bg-secondary/20 rounded-full blur-[140px] -z-10 animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      {/* Hero Section - Better Typography */}
      <section className="flex flex-col gap-3 text-center">
        <div className="inline-block self-center mb-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
          Step One
        </div>
        <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent leading-[0.9]">
          Setting the<br />Scene
        </h1>
        <p className="text-on-surface-variant text-lg font-medium opacity-60 leading-relaxed max-w-[280px] mx-auto">
          Ready to deepen your connection? Pick a mood for tonight.
        </p>
      </section>

      {/* User Profile Display */}
      <section className="flex flex-col items-center justify-center mt-2 mb-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative"
        >
          <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-orange-500 to-pink-500 shadow-[0_0_30px_rgba(255,77,0,0.3)]">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-background bg-surface-container-highest flex items-center justify-center">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="User Avatar" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="material-symbols-outlined text-5xl text-primary">person</span>
              )}
            </div>
          </div>
          <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-background"></div>
        </motion.div>
        <h2 className="mt-4 text-2xl font-headline font-bold text-on-background tracking-tight">
          {user.displayName || 'Welcome!'}
        </h2>
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
            selected={selectedMood === 'love'} onClick={() => { playHaptic(); setSelectedMood('love'); }}
          />
          <MoodCard 
            emoji="📸" title="Memories" desc="Walk down lane" colorClass="border-tertiary-dim glow-shadow-tertiary" bgClass="bg-tertiary-dim/10"
            selected={selectedMood === 'memories'} onClick={() => { playHaptic(); setSelectedMood('memories'); }}
          />
          <MoodCard 
            emoji="🥳" title="Fun" desc="Light & playful" colorClass="border-primary glow-shadow-primary" bgClass="bg-primary/10"
            selected={selectedMood === 'fun'} onClick={() => { playHaptic(); setSelectedMood('fun'); }}
          />
          <MoodCard 
            emoji="🌶️" title="Spicy" desc="Heating things up" colorClass="border-secondary glow-shadow-secondary" bgClass="bg-secondary/10"
            selected={selectedMood === 'spicy'} onClick={() => { playHaptic(); setSelectedMood('spicy'); }}
          />
        </div>
      </section>

      {/* Decorative Illustration Element */}
      <motion.section 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full h-48 rounded-2xl overflow-hidden relative shadow-2xl cursor-pointer hover:opacity-90 transition-opacity border border-white/10" 
        onClick={() => { playHaptic(); onJoin(); }}
      >
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
      </motion.section>

      {/* Fixed Bottom CTA - Premium Shadow */}
      <div className="fixed bottom-0 left-0 w-full px-8 pb-10 pt-12 bg-gradient-to-t from-background via-background to-transparent z-50">
        <motion.button 
          whileHover={{ scale: 1.02, translateY: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateRoom} 
          disabled={isCreating} 
          className={`btn-primary w-full py-6 text-2xl flex items-center justify-center gap-4 shadow-[0_25px_60px_-10px_rgba(253,144,0,0.5)] ${isCreating ? 'opacity-50' : ''}`}
        >
          <span className="font-headline font-black">
            {isCreating ? 'Crafting Space...' : 'Create Space'}
          </span>
          {!isCreating && <span className="material-symbols-outlined text-3xl">add_circle</span>}
        </motion.button>
      </div>
    </motion.main>
  );
}

function MoodCard({ emoji, title, desc, colorClass, bgClass, selected, onClick }: any) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group cursor-pointer transition-all duration-300 border-b-4 ${colorClass} ${selected ? 'bg-surface-variant/80 shadow-inner' : 'hover:bg-surface-variant/60'}`}
    >
      <div className="text-5xl mb-2 filter drop-shadow-md group-hover:scale-110 transition-transform">{emoji}</div>
      <div className="flex flex-col">
        <span className="font-headline font-extrabold text-2xl text-on-background">{title}</span>
        <span className="text-xs text-on-surface-variant font-medium">{desc}</span>
      </div>
      <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full blur-2xl ${bgClass}`}></div>
    </motion.div>
  );
}
