import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../utils/firebaseErrors';
import { motion } from 'motion/react';
import { playHaptic, playSuccess } from '../utils/haptics';

interface Props {
  onNext: () => void;
  setRoomId: (id: string) => void;
  user: User;
}

export default function Join({ onNext, setRoomId, user }: Props) {
  const [code, setCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async () => {
    const fullCode = code.toUpperCase();
    if (fullCode.length !== 4) {
      setError("Please enter a 4-character code.");
      return;
    }

    if (isJoining) return;
    setIsJoining(true);
    setError(null);

    try {
      const roomRef = doc(db, 'rooms', fullCode);
      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) {
        setError("Room not found. Please check the code.");
        setIsJoining(false);
        return;
      }

      const roomData = roomSnap.data();
      if (roomData.guestId && roomData.guestId !== user.uid) {
        setError("This room is already full.");
        setIsJoining(false);
        return;
      }

      if (!roomData.guestId) {
        await updateDoc(roomRef, {
          guestId: user.uid
        });
      }

      playSuccess();
      setRoomId(fullCode);
      onNext();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `rooms/${fullCode}`);
      setIsJoining(false);
    }
  };

  return (
    <motion.main 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "circOut" }}
      className="w-full min-h-screen flex flex-col items-center justify-center px-8 z-10 relative overflow-hidden pt-24 pb-32"
    >
      <div className="fixed top-[-10%] left-[-10%] w-[120%] h-[50%] bg-primary/20 blur-[140px] -z-10 animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[120%] h-[50%] bg-secondary/20 blur-[140px] -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-md flex flex-col items-center">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant">
             Enter The Space
          </div>
          <h2 className="font-headline text-5xl md:text-7xl font-black tracking-tighter text-on-surface leading-tight">
            Joining In
          </h2>
          <p className="text-on-surface-variant font-medium text-lg opacity-60 max-w-[240px] mx-auto leading-relaxed">
            Enter the 4-digit code from your partner.
          </p>
        </div>

        <div className="w-full space-y-12">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[32px] blur-xl opacity-20 group-focus-within:opacity-50 transition duration-1000"></div>
            <input 
              type="text" 
              maxLength={4} 
              value={code}
              onFocus={playHaptic}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError(null);
              }}
              placeholder="0000" 
              className="relative w-full h-24 bg-surface-container-high/80 backdrop-blur-3xl border-2 border-white/5 rounded-3xl px-6 text-center text-6xl font-headline font-black tracking-[0.3em] text-primary placeholder:text-white/5 transition-all outline-none uppercase"
            />
          </div>

          <div className="space-y-4">
            {error && (
              <motion.p 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-error text-xs font-black uppercase tracking-widest text-center mb-4"
              >
                {error}
              </motion.p>
            )}

            <motion.button 
              whileHover={code.length === 4 && !isJoining ? { scale: 1.02, translateY: -4 } : {}}
              whileTap={code.length === 4 && !isJoining ? { scale: 0.98 } : {}}
              onClick={() => { playHaptic(); handleJoin(); }} 
              disabled={code.length !== 4 || isJoining}
              className={`btn-primary w-full py-6 text-2xl flex items-center justify-center gap-4 shadow-[0_25px_60px_-10px_rgba(253,144,0,0.5)] ${code.length !== 4 || isJoining ? 'opacity-50 grayscale scale-95' : ''}`}
            >
              <span className="font-headline font-black">{isJoining ? 'Verifying...' : 'Unlock Space'}</span>
              {!isJoining && <span className="material-symbols-outlined text-3xl">key</span>}
            </motion.button>
          </div>
        </div>

        <div className="mt-20 flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
          </span>
          <span className="text-[10px] text-tertiary font-black uppercase tracking-[0.2em]">Secure Node 01-A</span>
        </div>
      </div>
    </motion.main>
  );
}
