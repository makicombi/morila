import { useState, useEffect, useRef } from 'react';
import { useGame } from './hooks/useGame';
import { GraphicsPanel } from './components/GraphicsPanel';
import { ConsolePanel } from './components/ConsolePanel';
import { OpeningScreen } from './components/OpeningScreen';
import { PrologueScreen } from './components/PrologueScreen';
import { EpilogueScreen } from './components/EpilogueScreen';
import { speakText } from './utils/audio';

type GamePhase = 'OPENING' | 'PROLOGUE' | 'PLAYING' | 'EPILOGUE';

function App() {
  const [phase, setPhase] = useState<GamePhase>('OPENING');
  const { currentRoom, playerState, logs, animAction, processCommand } = useGame();
  
  const bgMusicRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (phase === 'PLAYING' && playerState.queenRescued && playerState.talkedToSavedQueen) {
      // 9 second delay to allow the player to read the Queen's final dialogue and hear the TTS read it
      const timer = setTimeout(() => {
        setPhase('EPILOGUE');
      }, 9000);
      return () => clearTimeout(timer);
    }
  }, [playerState.queenRescued, playerState.talkedToSavedQueen, phase]);

  useEffect(() => {
    // Start background music as soon as the user interacts and leaves OPENING screen
    if (phase !== 'OPENING' && bgMusicRef.current) {
      bgMusicRef.current.volume = 0.4;
      bgMusicRef.current.play().catch(err => console.error("Auto-play prevented:", err));
    }
  }, [phase]);

  const renderPhase = () => {
    if (phase === 'OPENING') return <OpeningScreen onStart={() => setPhase('PROLOGUE')} />;
    if (phase === 'PROLOGUE') return <PrologueScreen onStart={() => {
      setPhase('PLAYING');
      speakText(`הגעתן אל ${currentRoom.name}. ${currentRoom.description}`);
    }} />;
    if (phase === 'EPILOGUE') return <EpilogueScreen onRestart={() => window.location.reload()} />;

    return (
      <div className="app-container">
        <GraphicsPanel 
          currentRoom={currentRoom} 
          activeSister={playerState.activeSister}
          inventory={playerState.inventory}
          animAction={animAction}
        />
        <ConsolePanel 
          logs={logs} 
          onCommand={processCommand} 
        />
      </div>
    );
  };

  return (
    <>
      <audio ref={bgMusicRef} src="/assets/sounds/narnia_theme_placeholder.mp3" loop />
      {renderPhase()}
    </>
  );
}

export default App;
