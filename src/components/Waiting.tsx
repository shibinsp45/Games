import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, getDoc, deleteField } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../utils/firebaseErrors';
import { motion } from 'motion/react';
import { playHaptic, playSuccess } from '../utils/haptics';

interface Props {
  onNext: () => void;
  roomId: string | null;
  user: User;
}

import { QUESTIONS } from '../constants';

export default function Waiting({ onNext, roomId, user }: Props) {
  const [roomData, setRoomData] = useState<any>(null);
  const [hostData, setHostData] = useState<any>(null);
  const [guestData, setGuestData] = useState<any>(null);
  const [isReadying, setIsReadying] = useState(false);

  useEffect(() => {
    if (!roomId) return;
    const unsubscribe = onSnapshot(doc(db, 'rooms', roomId), async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRoomData(data);

        // Fetch host data if not already fetched
        if (data.hostId && !hostData) {
          const hSnap = await getDoc(doc(db, 'users', data.hostId));
          if (hSnap.exists()) setHostData(hSnap.data());
        }

        // Fetch guest data if present and not already fetched
        if (data.guestId && !guestData) {
          const gSnap = await getDoc(doc(db, 'users', data.guestId));
          if (gSnap.exists()) setGuestData(gSnap.data());
        }

        // If status is playing, proceed to game
        if (data.status === 'playing') {
          onNext();
        }

        // If both are ready and I am the host, start the game
        if (data.hostReady && data.guestReady && data.hostId === user.uid && data.status === 'waiting') {
          try {
            const nextQuestion = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
            await updateDoc(doc(db, 'rooms', roomId), {
              status: 'playing',
              currentQuestion: nextQuestion,
              hostAnswer: deleteField(),
              guestAnswer: deleteField(),
              hostReady: deleteField(),
              guestReady: deleteField()
            });
          } catch (err) {
            handleFirestoreError(err, OperationType.UPDATE, `rooms/${roomId}`);
          }
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `rooms/${roomId}`);
    });
    return () => unsubscribe();
  }, [roomId, hostData, guestData, user.uid, onNext]);

  const handleReady = async () => {
    if (!roomId || !roomData || isReadying) return;
    setIsReadying(true);
    try {
      const isHost = roomData.hostId === user.uid;
      await updateDoc(doc(db, 'rooms', roomId), {
        [isHost ? 'hostReady' : 'guestReady']: true
      });
      playSuccess();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `rooms/${roomId}`);
    } finally {
      setIsReadying(false);
    }
  };

  const isHost = roomData?.hostId === user.uid;
  const amIReady = isHost ? roomData?.hostReady : roomData?.guestReady;
  const isPartnerReady = isHost ? roomData?.guestReady : roomData?.hostReady;

  return (
    <motion.main 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="pt-24 pb-32 px-6 flex flex-col items-center justify-center min-h-screen relative z-10"
    >
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -z-10"></div>
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-secondary/10 blur-[120px] rounded-full -z-10"></div>

      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tighter mb-4 text-on-surface">
          Waiting for Duo
        </h2>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-full border border-outline-variant/20 shadow-xl">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          <p className="text-sm font-label font-medium text-on-surface-variant">
            {roomData?.guestId ? 'Partner joined! Get ready.' : 'Waiting for partner...'}
          </p>
        </div>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* You Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-br from-primary to-orange-600 rounded-xl blur opacity-25 transition duration-1000"></div>
          <div className="relative bg-surface-container-highest/60 backdrop-blur-2xl p-8 rounded-xl border border-white/5 flex flex-col items-center justify-center min-h-[400px] shadow-2xl overflow-hidden">
            {amIReady && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-4 right-4 bg-tertiary-container text-on-tertiary-container text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest"
              >
                Ready
              </motion.div>
            )}
            <div className="w-48 h-48 mb-8 relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"></div>
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="You Avatar" 
                  className="w-full h-full object-cover rounded-full relative z-10 drop-shadow-[0_20px_50px_rgba(253,144,0,0.4)]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-surface-container-high flex items-center justify-center relative z-10">
                  <span className="material-symbols-outlined text-6xl text-primary">person</span>
                </div>
              )}
              {amIReady && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-2 -right-2 bg-tertiary text-on-tertiary p-2 rounded-full shadow-[0_0_20px_rgba(0,227,253,0.5)] z-20"
                >
                  <span className="material-symbols-outlined text-3xl font-bold" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
                </motion.div>
              )}
            </div>
            <h3 className="text-2xl font-headline font-bold text-on-surface mb-1">You</h3>
            <p className="text-on-surface-variant font-label text-sm uppercase tracking-widest">{isHost ? 'Host' : 'Guest'}</p>
          </div>
        </div>

        {/* Partner Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-br from-secondary to-purple-800 rounded-xl blur opacity-10 transition duration-1000"></div>
          <div className="relative bg-surface-container-low/40 backdrop-blur-xl p-8 rounded-xl border border-dashed border-outline-variant/30 flex flex-col items-center justify-center min-h-[400px] shadow-2xl overflow-hidden">
            {isPartnerReady && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-4 right-4 bg-tertiary-container text-on-tertiary-container text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest"
              >
                Ready
              </motion.div>
            )}
            <div className="w-48 h-48 mb-8 relative flex items-center justify-center">
              {!roomData?.guestId ? (
                <>
                  <div className="absolute w-32 h-32 bg-secondary/10 rounded-full avatar-pulse"></div>
                  <div className="absolute w-44 h-44 bg-secondary/5 rounded-full avatar-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="w-40 h-40 rounded-full bg-surface-container-high/50 flex items-center justify-center border-2 border-dashed border-secondary/30">
                    <span className="material-symbols-outlined text-6xl text-secondary/30 animate-pulse">person_add</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-secondary/20 rounded-full blur-3xl"></div>
                  {((isHost ? guestData?.photoURL : hostData?.photoURL)) ? (
                    <img 
                      src={(isHost ? guestData?.photoURL : hostData?.photoURL)} 
                      alt="Partner Avatar" 
                      className="w-full h-full object-cover rounded-full relative z-10 drop-shadow-[0_20px_50px_rgba(166,140,255,0.4)]"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-surface-container-high flex items-center justify-center relative z-10">
                      <span className="material-symbols-outlined text-6xl text-secondary">person</span>
                    </div>
                  )}
                  {isPartnerReady && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-2 -right-2 bg-tertiary text-on-tertiary p-2 rounded-full shadow-[0_0_20px_rgba(0,227,253,0.5)] z-20"
                    >
                      <span className="material-symbols-outlined text-3xl font-bold" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
                    </motion.div>
                  )}
                </>
              )}
            </div>
            <h3 className="text-2xl font-headline font-bold text-on-surface mb-1">
              {roomData?.guestId ? (isHost ? guestData?.name : hostData?.name) : 'Partner'}
            </h3>
            <p className="text-secondary font-label text-sm uppercase tracking-widest">
              {!roomData?.guestId ? <span className="animate-pulse">Joining...</span> : (isHost ? 'Guest' : 'Host')}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 w-full max-w-sm flex flex-col items-center">
        <motion.button 
          whileHover={(!roomData?.guestId || amIReady || isReadying) ? {} : { scale: 1.02 }}
          whileTap={(!roomData?.guestId || amIReady || isReadying) ? {} : { scale: 0.95 }}
          onClick={() => { playHaptic(); handleReady(); }} 
          disabled={!roomData?.guestId || amIReady || isReadying}
          className={`btn-primary w-full py-5 text-xl flex items-center justify-center gap-3 ${(!roomData?.guestId || amIReady || isReadying) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {amIReady ? 'Ready!' : 'I am Ready'}
          {!amIReady && <span className="material-symbols-outlined">check_circle</span>}
        </motion.button>
        <p className="mt-4 text-xs font-label text-outline text-center">
          {!roomData?.guestId ? 'Waiting for your partner to join the room.' : 'Both players must be ready to start.'}
        </p>
      </div>
    </motion.main>
  );
}
