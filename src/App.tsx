import React, { useState } from 'react';
import Onboarding from './components/Onboarding';
import Invite from './components/Invite';
import Join from './components/Join';
import Waiting from './components/Waiting';
import Game from './components/Game';
import Match from './components/Match';
import GameOver from './components/GameOver';
import Layout from './components/Layout';

export type Screen = 'onboarding' | 'invite' | 'join' | 'waiting' | 'game' | 'match' | 'game-over';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding': return <Onboarding onNext={() => setCurrentScreen('invite')} onJoin={() => setCurrentScreen('join')} />;
      case 'invite': return <Invite onNext={() => setCurrentScreen('waiting')} />;
      case 'join': return <Join onNext={() => setCurrentScreen('waiting')} />;
      case 'waiting': return <Waiting onNext={() => setCurrentScreen('game')} />;
      case 'game': return <Game onNext={() => setCurrentScreen('match')} />;
      case 'match': return <Match onNext={() => setCurrentScreen('game-over')} onDashboard={() => setCurrentScreen('onboarding')} />;
      case 'game-over': return <GameOver onPlayAgain={() => setCurrentScreen('game')} onChangeCategory={() => setCurrentScreen('onboarding')} />;
      default: return <Onboarding onNext={() => setCurrentScreen('invite')} onJoin={() => setCurrentScreen('join')} />;
    }
  };

  return (
    <Layout currentScreen={currentScreen} setCurrentScreen={setCurrentScreen}>
      {renderScreen()}
    </Layout>
  );
}
