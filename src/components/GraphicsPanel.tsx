import React from 'react';
import { Room } from '../game/GameModels';

interface Props {
  currentRoom: Room;
  activeSister: 'Mor' | 'Hila';
  inventory: string[];
  animAction: string;
}

const ItemDisplay: Record<string, string> = {
  wand: '🔥 שרביט אש',
  gold_key: '🔑 מפתח זהב'
};

export function GraphicsPanel({ currentRoom, activeSister, inventory, animAction }: Props) {
  const sisterSprite = activeSister === 'Mor' ? import.meta.env.BASE_URL + 'assets/mor/mor_sprite.png' : import.meta.env.BASE_URL + 'assets/hila/hila_sprite.png';

  const idleClass = activeSister === 'Mor' ? 'anim-mor-bob' : 'anim-hila-float';
  const actionClass = animAction === 'MAGIC' ? 'anim-magic-cast'
                    : animAction === 'TAKE' ? 'anim-take-bounce'
                    : animAction === 'GO' ? 'anim-walk-transition'
                    : animAction === 'SWITCH' ? 'anim-switch-flash'
                    : '';
  
  const finalSpriteClass = `sprite sprite-player ${actionClass || idleClass}`;

  return (
    <div 
      className="graphics-panel"
      style={{ backgroundImage: `url(${currentRoom.imagePath})` }}
    >
      <div className="graphics-overlay"></div>
      
      <div className="hud-container">
        <div className="hud-badge">{currentRoom.name}</div>
        <div className="hud-badge" style={{ color: activeSister === 'Mor' ? '#f43f5e' : '#8b5cf6' }}>
          אחות פעילה: {activeSister === 'Mor' ? 'מור' : 'הילה'}
        </div>
      </div>

      <div className="inventory-panel">
        <div className="inventory-title">תיק חפצים:</div>
        <div className="inventory-slots">
          {inventory.length === 0 ? (
            <span className="empty-text">ריק</span>
          ) : (
            inventory.map((item) => (
              <div key={item} className="inventory-item">
                {ItemDisplay[item] || item}
              </div>
            ))
          )}
        </div>
      </div>

      {currentRoom.npc && (
        <img 
          src={currentRoom.npc.imagePath} 
          alt={currentRoom.npc.name} 
          className="sprite sprite-npc" 
        />
      )}

      {/* Fallback image processing - we will generate these later */}
      <img 
        src={sisterSprite} 
        alt={activeSister} 
        className={finalSpriteClass}
        onError={(e) => {
          // Fallback to sample photos if sprites aren't generated yet
          const target = e.target as HTMLImageElement;
          target.src = activeSister === 'Mor' ? import.meta.env.BASE_URL + 'assets/mor/mor_cowgirl.jpg' : import.meta.env.BASE_URL + 'assets/hila/hila_cake.jpg';
          target.style.borderRadius = '20px'; // Make it look a bit nicer if it's a square photo
        }}
      />
      {/* Render Room Objects */}
      {currentRoom.objects.map(obj => {
        if (!obj.imagePath) return null;
        
        let customStyle: React.CSSProperties = {
          left: `${obj.xPercent}%`, 
          bottom: `${obj.yPercent}%`,
          transform: 'translateX(-50%)'
        };

        // Immersive horizontal barricade styling for thorns
        if (obj.id === 'thorns') {
          customStyle.width = '100vw'; 
          customStyle.height = '30vh'; 
          customStyle.bottom = '0px'; 
          customStyle.objectFit = 'contain';
          customStyle.display = 'block';
          customStyle.zIndex = 20;
        }

        let animClass = obj.isBeingTaken ? 'anim-item-disappear' : 'anim-item-idle';
        if (obj.id === 'thorns') {
          animClass = obj.isBeingDestroyed ? 'anim-item-burn' : ''; 
        }
        
        return (
          <React.Fragment key={obj.id}>
            <img 
              src={obj.imagePath} 
              alt={obj.name}
              className={`sprite sprite-object ${animClass}`}
              style={customStyle}
            />
          </React.Fragment>
        );
      })}

      {/* Globally Decoupled Event Animations! Unbreakable img tags */}
      {animAction === 'MAGIC_BURN_THORNS' && (
        <>
          <img src={`${import.meta.env.BASE_URL}assets/npc/fireball.png`} className="shooting-fireball" alt="fireball" />
          <img src={`${import.meta.env.BASE_URL}assets/npc/fire.png`} className="fire-effect" alt="bonfire" />
        </>
      )}

    </div>
  );
}
