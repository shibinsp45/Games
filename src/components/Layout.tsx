import React from 'react';
import { User } from 'firebase/auth';
import { Screen } from '../App';
import { motion } from 'motion/react';
import { playHaptic } from '../utils/haptics';

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  user: User | null;
}

export default function Layout({ children, currentScreen, setCurrentScreen, user }: LayoutProps) {
  const showBottomNav = !['game', 'match'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-background text-on-background font-body selection:bg-primary selection:text-on-primary overflow-x-hidden relative">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-2xl border-b border-white/5 flex justify-end items-center px-6 py-4">
        <div className="relative">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { playHaptic(); setCurrentScreen('settings'); }}
            className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-all"
          >
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="User Avatar" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="material-symbols-outlined text-primary">person</span>
            )}
          </motion.button>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background pointer-events-none"></span>
        </div>
      </header>

      {children}

      {/* Bottom Navigation */}
      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-8 pb-8 pt-4 bg-[#0f0d16]/80 backdrop-blur-2xl z-50 rounded-t-[40px] shadow-[0_-10px_40px_rgba(166,140,255,0.2)]">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { playHaptic(); setCurrentScreen('onboarding'); }} 
            className={`flex items-center justify-center p-3 transition-colors ${currentScreen === 'onboarding' ? 'bg-gradient-to-br from-orange-500 to-pink-600 rounded-full shadow-[0_0_20px_rgba(253,144,0,0.6)] scale-110 text-white' : 'text-slate-500 hover:text-orange-300'}`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: currentScreen === 'onboarding' ? "'FILL' 1" : "'FILL' 0" }}>home</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { playHaptic(); setCurrentScreen('join'); }} 
            className={`flex items-center justify-center p-3 transition-colors ${currentScreen === 'join' || currentScreen === 'invite' || currentScreen === 'waiting' ? 'bg-gradient-to-br from-orange-500 to-pink-600 rounded-full shadow-[0_0_20px_rgba(253,144,0,0.6)] scale-110 text-white' : 'text-slate-500 hover:text-orange-300'}`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: (currentScreen === 'join' || currentScreen === 'invite' || currentScreen === 'waiting') ? "'FILL' 1" : "'FILL' 0" }}>group</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { playHaptic(); setCurrentScreen('game'); }} 
            className={`flex items-center justify-center p-3 transition-colors ${currentScreen === 'game' || currentScreen === 'match' || currentScreen === 'game-over' ? 'bg-gradient-to-br from-orange-500 to-pink-600 rounded-full shadow-[0_0_20px_rgba(253,144,0,0.6)] scale-110 text-white' : 'text-slate-500 hover:text-orange-300'}`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: (currentScreen === 'game' || currentScreen === 'match' || currentScreen === 'game-over') ? "'FILL' 1" : "'FILL' 0" }}>videogame_asset</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { playHaptic(); setCurrentScreen('settings'); }} 
            className={`flex items-center justify-center p-3 transition-colors ${currentScreen === 'settings' ? 'bg-gradient-to-br from-orange-500 to-pink-600 rounded-full shadow-[0_0_20px_rgba(253,144,0,0.6)] scale-110 text-white' : 'text-slate-500 hover:text-orange-300'}`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: currentScreen === 'settings' ? "'FILL' 1" : "'FILL' 0" }}>settings</span>
          </motion.button>
        </nav>
      )}
    </div>
  );
}
