export interface GameObject {
  id: string;
  name: string;
  description: string;
  isTakeable: boolean;
  imagePath?: string;
  xPercent?: number;  // placement on screen
  yPercent?: number;  // placement on screen
  isBeingTaken?: boolean; // state flag for animation
  isBeingDestroyed?: boolean; // state flag for burning/destruction
}

export interface RoomExit {
  direction: 'צפון' | 'דרום' | 'מזרח' | 'מערב';
  targetRoomId: string;
  locked?: boolean;
  requiredItem?: string;
  lockedDescription?: string;
}

export interface NPC {
  id: string;
  name: string;
  imagePath: string;
  dialogue: string;
  riddle?: string;
  riddleAnswer?: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  exits: RoomExit[];
  objects: GameObject[];
  imagePath: string; // Used for the top UI panel
  hint?: string;
  npc?: NPC;
}

export type Sister = 'Mor' | 'Hila';

export interface PlayerState {
  currentRoomId: string;
  activeSister: 'Mor' | 'Hila';
  inventory: string[];
  unlockedAbilities: {
    mor: string[];
    hila: string[];
  };
  wizardDefeated: boolean;
  cageVentOpen: boolean;
  queenRescued: boolean;
  talkedToSavedQueen?: boolean;
}
