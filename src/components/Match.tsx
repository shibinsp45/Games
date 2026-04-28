import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../utils/firebaseErrors';
import { motion } from 'motion/react';
import { playHaptic, playSuccess } from '../utils/haptics';

interface Props {
  onNext: () => void;
  onDashboard: () => void;
  roomId: string | null;
  user: User;
}

import { QUESTIONS } from '../constants';

export default function Match({ onNext, onDashboard, roomId, user }: Props) {
  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  const [roomData, setRoomData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const reactions = ['😂', '❤️', '🔥', '😮'];

  useEffect(() => {
    if (!roomId) return;
    const unsubscribe = onSnapshot(doc(db, 'rooms', roomId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRoomData(data);

        if (data.status === 'playing') {
          onNext(); // Go back to Game screen
        } else if (data.status === 'game-over') {
          onDashboard(); // Go to GameOver screen
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `rooms/${roomId}`);
    });
    return () => unsubscribe();
  }, [roomId, onNext, onDashboard]);

  const handleNextRound = async () => {
    if (!roomId || !roomData || isProcessing) return;
    setIsProcessing(true);
    try {
      const isMatch = roomData.hostAnswer?.toLowerCase().trim() === roomData.guestAnswer?.toLowerCase().trim();
      
      const nextQuestion = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
      
      await updateDoc(doc(db, 'rooms', roomId), {
        status: 'playing',
        currentQuestion: nextQuestion,
        hostAnswer: deleteField(),
        guestAnswer: deleteField(),
        hostScore: roomData.hostScore + (isMatch ? 1 : 0),
        guestScore: roomData.guestScore + (isMatch ? 1 : 0),
        totalRounds: (roomData.totalRounds || 0) + 1
      });
      playSuccess();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `rooms/${roomId}`);
      setIsProcessing(false);
    }
  };

  const handleEndGame = async () => {
    if (!roomId || !roomData || isProcessing) return;
    playHaptic();
    setIsProcessing(true);
    try {
      const isMatch = roomData.hostAnswer?.toLowerCase().trim() === roomData.guestAnswer?.toLowerCase().trim();
      await updateDoc(doc(db, 'rooms', roomId), {
        status: 'game-over',
        hostScore: roomData.hostScore + (isMatch ? 1 : 0),
        guestScore: roomData.guestScore + (isMatch ? 1 : 0),
        totalRounds: (roomData.totalRounds || 0) + 1
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `rooms/${roomId}`);
      setIsProcessing(false);
    }
  };

  const isHost = roomData?.hostId === user.uid;
  const myAnswer = isHost ? roomData?.hostAnswer : roomData?.guestAnswer;
  const partnerAnswer = isHost ? roomData?.guestAnswer : roomData?.hostAnswer;
  const isMatch = myAnswer?.toLowerCase().trim() === partnerAnswer?.toLowerCase().trim();

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 pt-24 pb-32 px-6 max-w-lg mx-auto w-full relative z-10 min-h-screen overflow-hidden"
    >
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>

      <div className="text-center mb-12 relative">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant overflow-hidden"
        >
          {roomData?.currentQuestion || "The Results"}
          <motion.div 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-1/3"
          />
        </motion.div>
        
        <h2 className="font-headline text-5xl md:text-7xl font-black tracking-tighter mb-2 leading-none">
          {isMatch ? "Perfect\nSync" : "Not This\nTime"}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-12 relative z-10">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`relative p-8 rounded-3xl overflow-hidden glass-card flex flex-col items-center justify-center gap-2 border-2 transition-all duration-500 ${isMatch ? 'border-primary shadow-[0_20px_50px_rgba(253,144,0,0.2)]' : 'border-white/5'}`}
        >
           <span className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant/40">You said</span>
           <p className={`font-headline font-black text-3xl md:text-4xl text-center ${isMatch ? 'text-primary neon-glow' : 'text-on-surface'}`}>{myAnswer || '...'}</p>
        </motion.div>

        <div className="flex justify-center -my-6 relative z-20">
          <motion.div 
            animate={isMatch ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl border-4 border-background ${isMatch ? 'bg-gradient-to-br from-orange-500 to-pink-600 text-white' : 'bg-surface-bright text-on-surface-variant'}`}
          >
            <span className="material-symbols-outlined text-2xl font-black">{isMatch ? 'favorite' : 'close'}</span>
          </motion.div>
        </div>

        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`relative p-8 rounded-3xl overflow-hidden glass-card flex flex-col items-center justify-center gap-2 border-2 transition-all duration-500 ${isMatch ? 'border-primary shadow-[0_20px_50px_rgba(253,144,0,0.2)]' : 'border-white/5'}`}
        >
           <span className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant/40">Partner said</span>
           <p className={`font-headline font-black text-3xl md:text-4xl text-center ${isMatch ? 'text-primary neon-glow' : 'text-on-surface'}`}>{partnerAnswer || '...'}</p>
        </motion.div>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex justify-center gap-3">
          {reactions.map((emoji, idx) => (
            <motion.button 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + (idx * 0.1) }}
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              key={emoji}
              onClick={() => { playHaptic(); setActiveReaction(emoji); }}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all border ${
                activeReaction === emoji 
                  ? 'bg-white/10 border-primary shadow-[0_0_20px_rgba(253,144,0,0.3)]' 
                  : 'bg-white/5 border-white/5 hover:bg-white/10'
              }`}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 w-full px-8 pb-10 pt-12 bg-gradient-to-t from-background via-background to-transparent z-50">
        {isHost ? (
          <div className="flex flex-col gap-4 max-w-md mx-auto">
            <motion.button 
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNextRound} 
              disabled={isProcessing} 
              className="btn-primary w-full py-6 text-2xl flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(253,144,0,0.3)]"
            >
              <span className="font-headline font-black">Next Vibe</span>
              <span className="material-symbols-outlined text-3xl">play_arrow</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEndGame} 
              disabled={isProcessing} 
              className="btn-secondary w-full py-4 text-xl flex items-center justify-center gap-3 opacity-60 hover:opacity-100"
            >
              <span className="font-headline font-bold uppercase tracking-widest text-sm">Finishing Touch</span>
            </motion.button>
          </div>
        ) : (
          <div className="text-center p-8 bg-white/5 backdrop-blur-3xl rounded-[40px] border border-white/10 max-w-md mx-auto animate-pulse">
            <p className="text-on-surface-variant font-black uppercase tracking-[0.3em] text-xs">Waiting for your favorite human...</p>
          </div>
        )}
      </footer>
    </motion.main>
  );
}
