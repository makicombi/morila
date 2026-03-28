import { Room, PlayerState } from './GameModels';

export const initialRooms: Room[] = [
  {
    id: 'start',
    name: 'שערי נרניה',
    description: 'אתן עומדות מול שערי נרניה הקסומים. השער עצום ונעול. מולכן יש יער חשוך. רק כוחות מיוחדים יעזרו לכן להיכנס. הילת פיות קסומה מרחפת באוויר.',
    exits: [
      { direction: 'צפון', targetRoomId: 'forest' }
    ],
    objects: [],
    hint: 'אפשר תמיד לבדוק את הסביבה בעזרת הפקודה "הסתכלי". נסו ללכת לכיוון שהשער נמצא בו (לדוגמה: "לכי צפונה").',
    imagePath: '/assets/backgrounds/gates.png'
  },
  {
    id: 'forest',
    name: 'יער הפטריות הזוהרות',
    description: 'היער מואר באור כחלחל מהפטריות. יש כאן שרביט קסמים קטן שמונח על אבן. מצפון רואים את טירת הקוסם האפל, אך השביל חסום בקוצים ענקיים.',
    exits: [
      { direction: 'דרום', targetRoomId: 'start' },
      { direction: 'צפון', targetRoomId: 'castle_gates', locked: true, requiredItem: 'שרביט אש', lockedDescription: 'הקוצים חוסמים את הדרך. אולי מור יכולה להשתמש בקסם אש כדי לשרוף אותם?' }
    ],
    objects: [
      { id: 'wand', name: 'שרביט אש', description: 'שרביט עתיק שיכול לירות כדורי אש.', isTakeable: true, imagePath: '/assets/npc/wand.png', xPercent: 40, yPercent: 15 },
      { id: 'thorns', name: 'קוצים גדולים', description: 'ערימת קוצים תלולים חוסמת לחלוטין את הדרך.', isTakeable: false, imagePath: '/assets/npc/thorns.png', xPercent: 50, yPercent: 40 }
    ],
    hint: 'כדי לעבור את הקוצים, צריך קסם חזק. האם אספתן את כל מה שיש ביער? אולי מור יכולה להשתמש בו?',
    imagePath: '/assets/backgrounds/forest.png'
  },
  {
    id: 'castle_gates',
    name: 'חזית טירת הקוסם האפל',
    description: 'הגעתן לטירה! הדלת הראשית פתוחה למחצה. מפתח זהב תלוי על קיר גבוה מדי.',
    exits: [
      { direction: 'דרום', targetRoomId: 'forest' },
      { direction: 'צפון', targetRoomId: 'wizard_hall', locked: true, requiredItem: 'מפתח מזהב', lockedDescription: 'דלת הטירה הפנימית נעולה. צריך למצוא דרך להגיע למפתח ולפתוח אותה.' }
    ],
    objects: [
      { id: 'gold_key', name: 'מפתח מזהב', description: 'מפתח נוצץ שתלוי גבוה. הילה אולי יכולה לרחף אליו!', isTakeable: true, imagePath: '/assets/npc/gold_key.png', xPercent: 70, yPercent: 60 }
    ],
    hint: 'המפתח מונח גבוה, רק מישהי שיכולה לרחף תגיע אליו. נסו פקודות כמו "החליפי אחות" ואז לקחת אותו.',
    imagePath: '/assets/backgrounds/castle.png'
  },
  {
    id: 'wizard_hall',
    name: 'אולם היצור האפל',
    description: 'נכנסתן פנימה. בחדר המפלצתי עומד הקוסם האפל! הוא חוסם בגופו את כניסת הצינוק.',
    exits: [
      { direction: 'דרום', targetRoomId: 'castle_gates' },
      { direction: 'צפון', targetRoomId: 'dungeon', locked: true, requiredItem: 'defeat_wizard', lockedDescription: 'הקוסם לא ייתן לכן לעבור בחיים!' }
    ],
    objects: [],
    npc: {
      id: 'wizard',
      name: 'הקוסם האפל',
      imagePath: '/assets/npc/dark_wizard.png',
      dialogue: '"חושבות שתוכלו לעבור אותי?! אם תפתרו את החידה שלי אתן אתן לכן לעבור ללא קרב: קלה כמו נוצה, אבל גם הענק הכי חזק לא יוכל להחזיק אותי להרבה זמן. מה אני?"',
      riddle: 'קלה כמו נוצה...',
      riddleAnswer: 'נשימה'
    },
    hint: 'חכמותיי, תענו לו על החידה בעזרת הפקודה "עני <התשובה>". התשובה היא נשימה.',
    imagePath: '/assets/backgrounds/wizard_interior.png'
  },
  {
    id: 'dungeon',
    name: 'צינוק המלכה',
    description: 'במרכז החדר נמצאת מלכת הפיות כלואה בכלוב גביש צף וקפוא! הכלוב חזק מדי לניפוץ מבחוץ. יש לו פתח אוורור למעלה. הילה צריכה לרחף כדי לפתוח אותו, ומור תצטרך להשתמש בשרביט האש כדי לירות אש פנימה!',
    exits: [
      { direction: 'דרום', targetRoomId: 'wizard_hall' }
    ],
    objects: [],
    npc: {
      id: 'queen',
      name: 'מלכת הפיות',
      imagePath: '/assets/npc/fairy_queen.png',
      dialogue: '"מור, הילה! הקסם של הכלוב קר! פתחו את פתח האוורור וזרקו פנימה קסם חם!"'
    },
    hint: 'ראשית, החליפו להילה והשתמשו בפקודה "השתמשי ריחוף" או "תפעילי ריחוף" כדי לפתוח. אחר כך, החליפי למור והקלידי "השתמשי שרביט" לירות אל תוך הכלוב.',
    imagePath: '/assets/backgrounds/dungeon.png'
  }
];

export const initialPlayerState: PlayerState = {
  currentRoomId: 'start',
  activeSister: 'Mor',
  inventory: [],
  unlockedAbilities: {
    mor: [],
    hila: ['ריחוף']
  },
  wizardDefeated: false,
  cageVentOpen: false,
  queenRescued: false,
  talkedToSavedQueen: false
};
