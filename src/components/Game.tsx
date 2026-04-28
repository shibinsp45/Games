import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../utils/firebaseErrors';
import { motion } from 'motion/react';
import { playHaptic, playSuccess } from '../utils/haptics';

interface Props {
  onNext: () => void;
  roomId: string | null;
  user: User;
}

export default function Game({ onNext, roomId, user }: Props) {
  const [answer, setAnswer] = useState('');
  const [roomData, setRoomData] = useState<any>(null);
  const [isLocking, setIsLocking] = useState(false);

  useEffect(() => {
    if (!roomId) return;
    const unsubscribe = onSnapshot(doc(db, 'rooms', roomId), async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRoomData(data);

        const isHost = data.hostId === user.uid;
        const myAnswer = isHost ? data.hostAnswer : data.guestAnswer;
        
        if (!myAnswer) {
          setAnswer('');
          setIsLocking(false);
        }

        // If both have answered and status is playing, update status to match
        if (data.hostAnswer && data.guestAnswer && data.status === 'playing') {
          // Only host updates to avoid race conditions
          if (data.hostId === user.uid) {
            try {
              await updateDoc(doc(db, 'rooms', roomId), {
                status: 'match'
              });
            } catch (err) {
              handleFirestoreError(err, OperationType.UPDATE, `rooms/${roomId}`);
            }
          }
        }

        if (data.status === 'match') {
          onNext();
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `rooms/${roomId}`);
    });
    return () => unsubscribe();
  }, [roomId, user.uid, onNext]);

  const handleLockAnswer = async () => {
    if (!roomId || !roomData || isLocking || !answer.trim()) return;
    setIsLocking(true);
    try {
      const isHost = roomData.hostId === user.uid;
      await updateDoc(doc(db, 'rooms', roomId), {
        [isHost ? 'hostAnswer' : 'guestAnswer']: answer.trim()
      });
      playSuccess();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `rooms/${roomId}`);
      setIsLocking(false); // Only reset if failed, otherwise we wait for transition
    }
  };

  const isHost = roomData?.hostId === user.uid;
  const myAnswer = isHost ? roomData?.hostAnswer : roomData?.guestAnswer;
  const partnerAnswer = isHost ? roomData?.guestAnswer : roomData?.hostAnswer;

  return (
    <motion.main 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: "circOut" }}
      className="min-h-screen pt-24 pb-36 px-6 flex flex-col items-center max-w-lg mx-auto overflow-hidden relative z-10"
    >
      <div className="fixed top-[-10%] left-[-10%] w-[120%] h-[50%] bg-primary/20 rounded-full blur-[140px] -z-10 animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[120%] h-[50%] bg-secondary/20 rounded-full blur-[140px] -z-10 animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      <div className="w-full flex justify-between items-center mb-16 relative z-20">
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-2xl border border-primary/30 flex items-center justify-center bg-surface-container-high/40 backdrop-blur-3xl shadow-[0_10px_25px_rgba(253,144,0,0.2)]">
            <span className="text-2xl font-headline font-black text-primary">
              {isHost ? roomData?.hostScore || 0 : roomData?.guestScore || 0}
            </span>
          </div>
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-on-surface-variant/60">YOU</span>
        </div>
        
        <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl">
          <span className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_10px_rgba(0,227,253,1)]"></span>
          <span className="text-[11px] font-headline font-black text-on-surface-variant uppercase tracking-widest">Round {(roomData?.totalRounds || 0) + 1}</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-2xl border border-secondary/30 flex items-center justify-center bg-surface-container-high/40 backdrop-blur-3xl shadow-[0_10px_25px_rgba(166,140,255,0.2)]">
            <span className="text-2xl font-headline font-black text-secondary">
              {isHost ? roomData?.guestScore || 0 : roomData?.hostScore || 0}
            </span>
          </div>
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-on-surface-variant/60">THEM</span>
        </div>
      </div>

      <div className="w-full relative group mb-12">
        <div className="absolute -inset-2 bg-gradient-to-r from-primary to-secondary rounded-[40px] blur-2xl opacity-10 transition duration-1000 group-hover:opacity-20"></div>
        <div className="relative glass-card rounded-[40px] p-10 min-h-[350px] flex flex-col items-center justify-center text-center border-t border-white/20">
          <div className="mb-10 inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 shadow-xl">
             <span className="text-5xl">❔</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-headline font-black leading-[0.9] text-on-surface tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            {roomData?.currentQuestion || "Waiting for question..."}
          </h2>
          <div className="mt-12 flex flex-col items-center gap-2">
            <div className="flex gap-1">
               <div className={`w-3 h-3 rounded-full ${roomData?.hostAnswer ? 'bg-primary' : 'bg-white/10'}`}></div>
               <div className={`w-3 h-3 rounded-full ${roomData?.guestAnswer ? 'bg-secondary' : 'bg-white/10'}`}></div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/40">Sync Status</span>
          </div>
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 w-full px-8 pb-10 pt-12 bg-gradient-to-t from-background via-background to-transparent z-50">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="relative group">
            <textarea 
              rows={2}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={!!myAnswer || isLocking}
              placeholder={myAnswer ? "Sealed with a kiss..." : "Your honest truth..."} 
              className="w-full bg-white/5 backdrop-blur-3xl border-2 border-white/10 rounded-3xl p-8 font-headline font-bold text-2xl text-on-surface placeholder:text-on-surface-variant/30 transition-all focus:border-primary outline-none resize-none shadow-2xl disabled:opacity-50"
              onFocus={() => playHaptic()}
            />
            {myAnswer && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-sm rounded-3xl pointer-events-none border-2 border-primary/20">
                 <span className="material-symbols-outlined text-4xl text-primary animate-pulse">verified</span>
              </div>
            )}
          </div>
          
          <motion.button 
            whileHover={(!answer.trim() || !!myAnswer || isLocking) ? {} : { scale: 1.02, translateY: -4 }}
            whileTap={(!answer.trim() || !!myAnswer || isLocking) ? {} : { scale: 0.98 }}
            onClick={() => { playHaptic(); handleLockAnswer(); }}
            disabled={!answer.trim() || !!myAnswer || isLocking}
            className={`btn-primary w-full py-6 text-2xl flex items-center justify-center gap-4 shadow-[0_25px_60px_-10px_rgba(253,144,0,0.5)] ${(!answer.trim() || !!myAnswer || isLocking) ? 'opacity-50 grayscale scale-95' : ''}`}
          >
            <span className="font-headline font-black">
              {myAnswer ? 'Waiting for Sync' : (isLocking ? 'Locking...' : 'Lock Answer')}
            </span>
            <span className="material-symbols-outlined text-3xl">
              {myAnswer ? 'hourglass_empty' : 'lock_open'}
            </span>
          </motion.button>
        </div>
      </footer>
    </motion.main>
  );
}
