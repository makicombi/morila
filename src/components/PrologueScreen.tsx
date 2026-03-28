 

export function PrologueScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="story-screen prologue-bg">
      <div className="story-content">
        <h1>ההקדמה</h1>
        <p className="story-text">
          הרחק מכאן, מעבר לגבולות הדמיון, שוכנת ממלכת נרניה.<br/>
          שנים רבות של שלום הופרעו כאשר קוסם אפל ואכזר חטף את מלכת הפיות וקילל את היער.<br/><br/>
          כעת, התקווה האחרונה של נרניה מונחת על כתפיהן של שתי אחיות אמיצות:<br/>
          מור, האוחזת בקסם האש, והילה, השולטת בכוח הריחוף.<br/><br/>
          המסע שלהן מתחיל עכשיו...
        </p>
        <button className="start-button mt-8" onClick={onStart}>
          היכנסו לנרניה
        </button>
      </div>
    </div>
  );
}
