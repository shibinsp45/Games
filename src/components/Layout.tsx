import React from 'react';
import { Screen } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
}

export default function Layout({ children, currentScreen, setCurrentScreen }: LayoutProps) {
  const showBottomNav = currentScreen !== 'onboarding';

  return (
    <div className="min-h-screen bg-background text-on-background font-body selection:bg-primary selection:text-on-primary overflow-x-hidden relative">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/40 backdrop-blur-xl shadow-[0_4px_30px_rgba(255,77,0,0.15)] flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <button className="text-orange-500 hover:opacity-80 transition-opacity scale-95 active:scale-90 duration-200">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="text-2xl font-black bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent font-headline tracking-tight">
            Lover's Lounge
          </h1>
        </div>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest border-2 border-primary/30 overflow-hidden">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2fNu4I8Mcx5_DZs_om0A5VnA8cz9Tf9xqRSoN0CXDtx3eWm6Q0FBL_DgI8ekCaJ_tziSaW6EMa1noBWkt-Ficx7EecJEoQxbkyyXT3OjA-l_vKbYzWYQTHDZIxu78Fmoc0kJ3bOQdj9Mqk3dlzCnpoVaPeRYH_Tm_xbbg49m9cKK-bxMgGgY69Mna57PdXfEDV4LC5mX-cmDrasPcfRi2F1-yy9Z8a2NTexcbF4Sj0TWdcmIcwBOl-BqAi5f0Wr5j8rRqDNIf5dXf" 
              alt="User Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-tertiary-fixed-dim rounded-full border-2 border-surface"></span>
        </div>
      </header>

      {children}

      {/* Bottom Navigation */}
      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-8 pb-8 pt-4 bg-[#0f0d16]/80 backdrop-blur-2xl z-50 rounded-t-[40px] shadow-[0_-10px_40px_rgba(166,140,255,0.2)]">
          <button onClick={() => setCurrentScreen('onboarding')} className="flex items-center justify-center text-slate-500 p-3 hover:text-orange-300 transition-colors">
            <span className="material-symbols-outlined">home</span>
          </button>
          <button onClick={() => setCurrentScreen('join')} className={`flex items-center justify-center p-3 transition-colors ${currentScreen === 'join' || currentScreen === 'invite' || currentScreen === 'waiting' ? 'bg-gradient-to-br from-orange-500 to-pink-600 rounded-full shadow-[0_0_20px_rgba(253,144,0,0.6)] scale-110 text-white' : 'text-slate-500 hover:text-orange-300'}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: (currentScreen === 'join' || currentScreen === 'invite' || currentScreen === 'waiting') ? "'FILL' 1" : "'FILL' 0" }}>group</span>
          </button>
          <button onClick={() => setCurrentScreen('game')} className={`flex items-center justify-center p-3 transition-colors ${currentScreen === 'game' || currentScreen === 'match' || currentScreen === 'game-over' ? 'bg-gradient-to-br from-orange-500 to-pink-600 rounded-full shadow-[0_0_20px_rgba(253,144,0,0.6)] scale-110 text-white' : 'text-slate-500 hover:text-orange-300'}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: (currentScreen === 'game' || currentScreen === 'match' || currentScreen === 'game-over') ? "'FILL' 1" : "'FILL' 0" }}>videogame_asset</span>
          </button>
          <button onClick={() => alert('Settings coming soon!')} className="flex items-center justify-center text-slate-500 p-3 hover:text-orange-300 transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </nav>
      )}
    </div>
  );
}
