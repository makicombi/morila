import { useState, useEffect } from 'react';

export function EpilogueScreen({ onRestart }: { onRestart: () => void }) {
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Transition to the celebration phase after 6 seconds of reading
    const t = setTimeout(() => setShowCelebration(true), 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="story-screen epilogue-bg">
      {!showCelebration ? (
        <div className="story-content fade-out-late">
          <h1>אפילוג</h1>
          <p className="story-text">
            כדור האש ריסק את כלוב הגביש לרסיסים דקים.<br/>
            הקוסם האפל נמלט אל הצללים, ומלכת הפיות שוחררה לחופשי!<br/><br/>
            אור זהוב וזוהר שטף את ממלכת נרניה, והיער המקולל חזר לפרוח.<br/>
            מור והילה הוכתרו כגיבורות אגדיות, ושמן נחקק בספרי ההיסטוריה לנצח.
          </p>
        </div>
      ) : (
        <div className="celebration-content fade-in">
          <div className="victory-text">המלכה ניצלה! ניצחתן!</div>
          <div className="celebration-characters">
            <img src="/assets/mor/mor_sprite.png" className="celeb-mor jump-joy" alt="Mor celebrating" />
            <img src="/assets/hila/hila_sprite.png" className="celeb-hila jump-joy-delayed" alt="Hila celebrating" />
          </div>
          <button className="start-button restart-btn" onClick={onRestart}>
            שחקו שוב
          </button>
        </div>
      )}
    </div>
  );
}
