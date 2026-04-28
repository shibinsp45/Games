import React, { useState } from 'react';
import { User, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { motion } from 'motion/react';
import { playHaptic, isSoundEnabled, toggleSound } from '../utils/haptics';

interface Props {
  user: User;
}

export default function Settings({ user }: Props) {
  const [soundEnabled, setSoundEnabled] = useState(isSoundEnabled());

  const handleToggleSound = () => {
    playHaptic();
    toggleSound();
    setSoundEnabled(isSoundEnabled());
  };

  const handleLogout = async () => {
    playHaptic();
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="pt-28 pb-32 px-6 max-w-2xl mx-auto flex flex-col gap-8 relative z-10 min-h-screen"
    >
      <div className="text-center mb-4">
        <h1 className="text-4xl font-extrabold font-headline tracking-tight text-on-background">
          Settings
        </h1>
      </div>

      <div className="glass-card rounded-2xl p-6 flex flex-col items-center gap-4 border border-white/5">
        <div className="w-24 h-24 rounded-full bg-surface-container-highest border-4 border-primary/30 overflow-hidden flex items-center justify-center mb-2">
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="User Avatar" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="material-symbols-outlined text-4xl text-primary">person</span>
          )}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-headline font-bold text-on-surface">{user.displayName || 'Guest Player'}</h2>
          <p className="text-on-surface-variant text-sm">{user.isAnonymous ? 'Guest Account' : user.email}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-primary ml-1">Preferences</h3>
        
        <div className="glass-card rounded-2xl p-4 flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">{soundEnabled ? 'volume_up' : 'volume_off'}</span>
            </div>
            <div>
              <p className="font-headline font-bold text-on-surface">Sound & Haptics</p>
              <p className="text-xs text-on-surface-variant">Enable audio feedback for interactions</p>
            </div>
          </div>
          <button 
            onClick={handleToggleSound}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center ${soundEnabled ? 'bg-primary' : 'bg-surface-container-highest'}`}
          >
            <motion.div 
              layout
              className="w-6 h-6 rounded-full bg-white shadow-sm"
              animate={{ x: soundEnabled ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout} 
          className="btn-secondary w-full py-4 text-lg flex items-center justify-center gap-3 border-error/30 text-error hover:bg-error/10"
        >
          <span className="material-symbols-outlined">logout</span>
          Sign Out
        </motion.button>
      </div>
    </motion.main>
  );
}
