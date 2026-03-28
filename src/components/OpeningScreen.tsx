export function OpeningScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="opening-screen">
      <div className="magical-portal">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="portal-svg">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <linearGradient id="wandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <linearGradient id="magicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
          
          {/* Outer Ring */}
          <circle cx="100" cy="100" r="85" fill="none" stroke="url(#magicGradient)" strokeWidth="3" strokeDasharray="15 15" className="spin-slow" filter="url(#glow)"/>
          
          {/* Inner magical runes (abstract shapes) */}
          <circle cx="100" cy="100" r="70" fill="none" stroke="url(#wandGradient)" strokeWidth="2" strokeDasharray="30 10 5 10" className="spin-fast-reverse" filter="url(#glow)"/>
          
          {/* Central Star */}
          <polygon points="100,30 115,75 160,80 125,110 135,160 100,130 65,160 75,110 40,80 85,75" fill="none" stroke="#e0f2fe" strokeWidth="2" className="pulse-star" filter="url(#glow)"/>
          
          <polygon points="100,10 110,65 170,80 120,95 100,150 80,95 30,80 90,65" fill="#e0f2fe" opacity="0.3" className="pulse-star-reverse" filter="url(#glow)"/>
        </svg>
      </div>

      <div className="opening-characters">
        <img src={`${import.meta.env.BASE_URL}assets/mor/mor_sprite.png`} alt="Mor" className="opening-sprite mor-seq" />
        <img src={`${import.meta.env.BASE_URL}assets/hila/hila_sprite.png`} alt="Hila" className="opening-sprite hila-seq" />
      </div>
      
      <div className="titles">
        <h1 className="game-title">נרניה</h1>
        <h2 className="game-subtitle">מסע האחיות להצלת המלכה</h2>
      </div>
      
      <button className="start-button" onClick={onStart}>
        התחל הרפתקה
      </button>
    </div>
  );
}
