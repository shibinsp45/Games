import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { ErrorBoundary } from './components/ErrorBoundary';
import { handleFirestoreError, OperationType } from './utils/firebaseErrors';
import { motion } from 'motion/react';
import { playHaptic } from './utils/haptics';

import Onboarding from './components/Onboarding';
import Invite from './components/Invite';
import Join from './components/Join';
import Waiting from './components/Waiting';
import Game from './components/Game';
import Match from './components/Match';
import GameOver from './components/GameOver';
import Settings from './components/Settings';
import Layout from './components/Layout';

export type Screen = 'onboarding' | 'invite' | 'join' | 'waiting' | 'game' | 'match' | 'game-over' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [roomId, setRoomId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            const userData: any = {
              name: currentUser.displayName || 'Guest User',
              email: currentUser.email || `guest_${currentUser.uid}@temporary.app`,
              createdAt: serverTimestamp()
            };
            
            if (currentUser.photoURL) {
              userData.photoURL = currentUser.photoURL;
            }

            await setDoc(userRef, userData);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${currentUser.uid}`);
        }
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setError(null);
      playHaptic();
      await signInAnonymously(auth);
    } catch (err: any) {
      console.error("Anonymous login failed:", err);
      if (err.code === 'auth/admin-restricted-operation') {
        setError("Anonymous Login is not enabled in Firebase. Please enable it in the Firebase Console (Authentication > Sign-in method).");
      } else {
        setError("Login failed. Please check your connection and try again.");
      }
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 blur-[120px] rounded-full -z-10 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/20 blur-[120px] rounded-full -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 relative z-10"
        >
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-[0.3em] text-on-surface-variant">
            Guest Mode Ready
          </div>
          <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent font-headline tracking-tighter mb-6 leading-none">
            Private<br />Lounge
          </h1>
          <p className="text-on-surface-variant text-xl font-medium max-w-[280px] mx-auto leading-relaxed opacity-80">
            A private space for you and your favorite human.
          </p>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-error-container text-on-error-container rounded-2xl text-sm max-w-sm text-center border border-error/20"
          >
            <span className="material-symbols-outlined align-middle mr-2">warning</span>
            {error}
          </motion.div>
        )}

        <motion.button 
          whileHover={{ scale: 1.05, translateY: -4 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          onClick={handleLogin} 
          className="btn-primary px-12 py-5 text-xl flex items-center gap-4 group shadow-[0_20px_50px_rgba(253,144,0,0.3)]"
        >
          <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">bolt</span>
          <span className="font-headline font-bold">Start Playing</span>
        </motion.button>

        <div className="absolute bottom-12 text-on-surface-variant/30 text-[10px] font-bold uppercase tracking-[0.5em] animate-pulse">
          Secure • Private • Real-time
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding': return <Onboarding onNext={() => setCurrentScreen('invite')} onJoin={() => setCurrentScreen('join')} setRoomId={setRoomId} user={user} />;
      case 'invite': return <Invite onNext={() => setCurrentScreen('waiting')} roomId={roomId} />;
      case 'join': return <Join onNext={() => setCurrentScreen('waiting')} setRoomId={setRoomId} user={user} />;
      case 'waiting': return <Waiting onNext={() => setCurrentScreen('game')} roomId={roomId} user={user} />;
      case 'game': return <Game onNext={() => setCurrentScreen('match')} roomId={roomId} user={user} />;
      case 'match': return <Match onNext={() => setCurrentScreen('game')} onDashboard={() => setCurrentScreen('game-over')} roomId={roomId} user={user} />;
      case 'game-over': return <GameOver onPlayAgain={() => setCurrentScreen('waiting')} onChangeCategory={() => setCurrentScreen('onboarding')} roomId={roomId} user={user} />;
      case 'settings': return <Settings user={user} />;
      default: return <Onboarding onNext={() => setCurrentScreen('invite')} onJoin={() => setCurrentScreen('join')} setRoomId={setRoomId} user={user} />;
    }
  };

  return (
    <ErrorBoundary>
      <Layout currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} user={user}>
        {renderScreen()}
      </Layout>
    </ErrorBoundary>
  );
}
