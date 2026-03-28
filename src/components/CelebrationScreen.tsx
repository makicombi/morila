export function CelebrationScreen() {
  return (
    <div className="celebration-screen">
      <div className="victory-text">המלכה ניצלה! ניצחתן!</div>
      <div className="victory-subtext">מור והילה אמיצות הלב הצילו את נרניה מידי הקוסם האפל.</div>
      
      <div className="celebration-characters">
        <img src="/assets/mor/mor_sprite.png" className="celeb-mor jump-joy" alt="Mor celebrating" />
        <img src="/assets/hila/hila_sprite.png" className="celeb-hila jump-joy-delayed" alt="Hila celebrating" />
      </div>

      <button className="start-button restart-btn" onClick={() => window.location.reload()}>
        שחקו שוב
      </button>
    </div>
  );
}
