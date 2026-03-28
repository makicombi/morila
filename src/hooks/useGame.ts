import { useState, useRef } from 'react';
import { GameEngine } from '../game/GameEngine';
import { Room, PlayerState } from '../game/GameModels';
import { speakText } from '../utils/audio';

export interface GameLog {
  id: number;
  text: string;
  type: 'system' | 'user' | 'error';
}

let nextLogId = 0;

export function useGame() {
  const engineRef = useRef<GameEngine>(new GameEngine());
  const [currentRoom, setCurrentRoom] = useState<Room>(engineRef.current.getCurrentRoom());
  const [playerState, setPlayerState] = useState<PlayerState>(engineRef.current.state);
  const [animAction, setAnimAction] = useState<string>('NONE');
  const [logs, setLogs] = useState<GameLog[]>([
    { id: nextLogId++, text: 'ברוכות הבאות להרפתקה בנרניה! הקלידי פקודות בתיבת הטקסט ("לכי צפונה", "קחי חפץ"...).', type: 'system' },
    { id: nextLogId++, text: `\n--- ${engineRef.current.getCurrentRoom().name} ---\n${engineRef.current.getCurrentRoom().description}`, type: 'system' }
  ]);

  const processCommand = (input: string) => {
    if (!input.trim()) return;

    setLogs(prev => [...prev, { id: nextLogId++, text: `> ${input}`, type: 'user' }]);

    const currentRoomIdBefore = currentRoom.id;
    const response = engineRef.current.processInput(input);
    const roomAfter = engineRef.current.getCurrentRoom();
    
    // Play general UI sounds
    if (response.includes('הלכת לכיוון')) {
      new Audio('/assets/sounds/step_placeholder.mp3').play().catch(() => {});
    } else if (response.includes('צורף') || response.includes('לקחת')) {
      new Audio('/assets/sounds/success_chime_placeholder.mp3').play().catch(() => {});
    }

    // Capture the graphical action state to trigger animations
    const currentAction = engineRef.current.lastAnimAction;
    setAnimAction(currentAction);
    
    // Play magic sound effects ONLY if the engine processed a true magic spell cast
    if (currentAction === 'MAGIC' || currentAction === 'MAGIC_BURN_THORNS') {
      const spellSfx = new Audio('/assets/sounds/magic_spell_placeholder.mp3');
      spellSfx.volume = 1.0;
      spellSfx.play().catch(e => console.error("SFX auto-play blocked:", e));

      // After the 1-second fireball travel time, unleash the 5-second burning sequence audio
      if (currentAction === 'MAGIC_BURN_THORNS') {
        setTimeout(() => {
          const burnSfx = new Audio('/assets/sounds/thorn_burning.mp3');
          burnSfx.volume = 0.9;
          burnSfx.play().catch(e => console.error("SFX blocked:", e));
        }, 1000);
      }
    }

    // Speak the response text aloud (Hebrew TTS)
    let textToSpeak = response;
    if (roomAfter.id !== currentRoomIdBefore) {
      textToSpeak += `. הגעתן אל ${roomAfter.name}. ${roomAfter.description}`;
    }
    speakText(textToSpeak);

    if (currentAction !== 'NONE') {
      const timeoutMs = currentAction === 'MAGIC_BURN_THORNS' ? 6500 : 1500;
      setTimeout(() => {
        setAnimAction('NONE'); // Reset class after animation duration
        engineRef.current.cleanupAnimations(); // Actually remove items from room
        setCurrentRoom(engineRef.current.getCurrentRoom());
        setPlayerState({...engineRef.current.state}); // trigger re-render
      }, timeoutMs);
    }

    setLogs(prev => [...prev, { id: nextLogId++, text: response, type: 'system' }]);
    setCurrentRoom(engineRef.current.getCurrentRoom());
    setPlayerState({...engineRef.current.state}); // trigger round 1 render
  };

  return {
    currentRoom,
    playerState,
    logs,
    animAction,
    processCommand
  };
}
