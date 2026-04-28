import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../utils/firebaseErrors';
import { motion } from 'motion/react';
import { playHaptic, playSuccess } from '../utils/haptics';

interface Props {
  onPlayAgain: () => void;
  onChangeCategory: () => void;
  roomId: string | null;
  user: User;
}

export default function GameOver({ onPlayAgain, onChangeCategory, roomId, user }: Props) {
  const [roomData, setRoomData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!roomId) return;
    const unsubscribe = onSnapshot(doc(db, 'rooms', roomId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRoomData(data);
        
        if (data.status === 'waiting') {
          onPlayAgain();
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `rooms/${roomId}`);
    });
    return () => unsubscribe();
  }, [roomId, onPlayAgain]);

  const handlePlayAgain = async () => {
    if (!roomId || !roomData || isProcessing) return;
    setIsProcessing(true);
    try {
      await updateDoc(doc(db, 'rooms', roomId), {
        status: 'waiting',
        hostReady: deleteField(),
        guestReady: deleteField(),
        hostScore: 0,
        guestScore: 0,
        totalRounds: 0,
        hostAnswer: deleteField(),
        guestAnswer: deleteField(),
        currentQuestion: deleteField()
      });
      playSuccess();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `rooms/${roomId}`);
      setIsProcessing(false);
    }
  };

  const isHost = roomData?.hostId === user.uid;
  const myScore = isHost ? roomData?.hostScore : roomData?.guestScore;
  const partnerScore = isHost ? roomData?.guestScore : roomData?.hostScore;
  const totalRounds = roomData?.totalRounds || 0;
  const matchPercentage = totalRounds > 0 ? Math.round((myScore / totalRounds) * 100) : 0;

  return (
    <motion.main 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="pt-28 pb-32 px-6 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-screen relative z-10 bg-mesh"
    >
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tighter bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent uppercase">
          Game Over!
        </h1>
      </div>

      <div className="relative w-full aspect-square max-w-md flex items-center justify-center mb-12">
        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-75 -z-10"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="text-9xl mb-6 drop-shadow-[0_0_50px_rgba(255,77,0,0.5)]"
          >
            ❤️
          </motion.div>
          <div className="text-center">
            <div className="text-primary font-headline font-extrabold text-4xl md:text-5xl mb-2 drop-shadow-sm">
              You matched {myScore} times!
            </div>
            <div className="inline-block px-6 py-2 rounded-full bg-secondary-container/30 backdrop-blur-md border border-secondary/20 mb-4">
              <span className="text-secondary font-headline font-bold text-xl">{matchPercentage}% Soulmates</span>
            </div>
          </div>
        </div>

        <motion.div 
          animate={{ rotate: [12, 24, 12] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute -top-4 -right-4 w-24 h-24 bg-tertiary-container/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/5"
        >
          <span className="text-4xl">✨</span>
        </motion.div>
        <motion.div 
          animate={{ rotate: [-12, -24, -12] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute -bottom-6 -left-4 w-20 h-20 bg-primary-container/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/5"
        >
          <span className="text-3xl">🔥</span>
        </motion.div>
      </div>

      <div className="text-center mb-12 space-y-4">
        <p className="text-2xl md:text-3xl font-headline font-bold text-on-surface">
          {myScore > 3 ? "You really know each other!" : "Still learning about each other!"}
        </p>
        <p className="text-on-surface-variant font-body max-w-xs mx-auto">
          That was an incredible session. You've unlocked the "Deep Resonance" badge!
        </p>
      </div>

      {/* Bento Style Stats Grid */}
      <div className="grid grid-cols-2 gap-4 w-full mb-12">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-surface-container-high/50 backdrop-blur-lg p-6 rounded-lg border border-outline-variant/10 flex flex-col justify-between h-32"
        >
          <span className="text-on-surface-variant text-sm font-label uppercase tracking-widest">Your Score</span>
          <span className="text-tertiary font-headline font-bold text-2xl">{myScore} ⚡</span>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-surface-container-high/50 backdrop-blur-lg p-6 rounded-lg border border-outline-variant/10 flex flex-col justify-between h-32"
        >
          <span className="text-on-surface-variant text-sm font-label uppercase tracking-widest">Partner's Score</span>
          <span className="text-primary font-headline font-bold text-2xl">{partnerScore} 🔥</span>
        </motion.div>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-col gap-4 w-full sm:flex-row sm:justify-center">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { playHaptic(); handlePlayAgain(); }} 
          disabled={isProcessing} 
          className="btn-primary flex-1 max-w-xs px-8 py-5 text-lg flex items-center justify-center gap-3"
        >
          <span className="material-symbols-outlined">replay</span>
          {isProcessing ? 'Resetting...' : 'Play Again'}
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { playHaptic(); onChangeCategory(); }} 
          disabled={isProcessing} 
          className="btn-secondary flex-1 max-w-xs px-8 py-5 text-lg flex items-center justify-center gap-3 group"
        >
          <span className="material-symbols-outlined group-hover:text-primary">category</span>
          Change Categories
        </motion.button>
      </div>
    </motion.main>
  );
}
