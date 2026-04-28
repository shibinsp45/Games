import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../utils/firebaseErrors';
import { motion } from 'motion/react';
import { playHaptic, playSuccess } from '../utils/haptics';

interface Props {
  onNext: () => void;
  roomId: string | null;
}

export default function Invite({ onNext, roomId }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!roomId) return;
    const unsubscribe = onSnapshot(doc(db, 'rooms', roomId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.guestId) {
          playSuccess();
          onNext(); // Guest joined, proceed to waiting/game
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `rooms/${roomId}`);
    });
    return () => unsubscribe();
  }, [roomId, onNext]);

  const handleCopy = () => {
    if (!roomId) return;
    playHaptic();
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (!roomId) return;
    playHaptic();
    if (navigator.share) {
      navigator.share({
        title: "Private Lounge",
        text: `Join my room in the Private Lounge! Code: ${roomId}`,
        url: window.location.href
      }).catch(console.error);
    } else {
      handleCopy();
    }
  };

  return (
    <motion.main 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-flare pt-24 pb-32"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg aspect-square bg-secondary/10 blur-[120px] rounded-full -z-10"></div>
      
      <div className="w-full max-w-md text-center space-y-12 z-10">
        <div className="space-y-4">
          <h2 className="font-headline font-extrabold text-4xl tracking-tight text-on-background">Invite Partner</h2>
          <p className="text-on-surface-variant font-medium tracking-wide uppercase text-xs opacity-70">Send this to your partner</p>
        </div>

        <div className="relative group cursor-pointer">
          <motion.div 
            animate={{ rotate: [12, -12, 12] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute -top-10 -right-4 text-6xl drop-shadow-[0_10px_20px_rgba(255,164,76,0.5)]"
          >
            🔥
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopy}
            className="bg-surface-variant/40 backdrop-blur-3xl p-12 rounded-xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col items-center gap-2"
          >
            <span className="font-headline font-black text-8xl md:text-9xl tracking-[0.15em] text-primary neon-glow select-all">
              {roomId || '....'}
            </span>
            <div className="w-16 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full mt-4 opacity-50"></div>
          </motion.div>
          <motion.div 
            animate={{ rotate: [-12, 12, -12] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-5xl drop-shadow-[0_10px_20px_rgba(166,140,255,0.4)]"
          >
            🎮
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full px-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy} 
            className="btn-secondary flex items-center justify-center gap-3 py-5 px-8 group"
          >
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">{copied ? 'check' : 'content_copy'}</span>
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare} 
            className="btn-primary flex items-center justify-center gap-3 py-5 px-8 group"
          >
            <span className="material-symbols-outlined text-on-primary group-hover:rotate-12 transition-transform">share</span>
            <span>Share</span>
          </motion.button>
        </div>

        <p className="text-on-surface-variant font-body text-sm max-w-[280px] mx-auto leading-relaxed">
          Waiting for your partner to join the lounge... the game starts when you're both connected!
        </p>
      </div>
    </motion.main>
  );
}
