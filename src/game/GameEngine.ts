import { HebrewParser } from './HebrewParser';
import { initialPlayerState, initialRooms } from './GameData';
import { PlayerState, Room } from './GameModels';

export class GameEngine {
  public state: PlayerState;
  public rooms: Map<string, Room>;
  public lastAnimAction: 'NONE' | 'GO' | 'TAKE' | 'MAGIC' | 'SWITCH' | 'MAGIC_BURN_THORNS' = 'NONE';

  constructor() {
    this.state = JSON.parse(JSON.stringify(initialPlayerState));
    this.rooms = new Map(initialRooms.map(r => [r.id, JSON.parse(JSON.stringify(r))]));
  }

  public getCurrentRoom(): Room {
    const room = this.rooms.get(this.state.currentRoomId)!;
    
    // Self-healing patch: Force inject thorns if HMR erased them from cached memory
    if (this.state.currentRoomId === 'forest' && room.exits.some(e => e.locked) && !room.objects.find(o => o.id === 'thorns')) {
      room.objects.push({ 
        id: 'thorns', name: 'קוצים', description: 'ערימת קוצים תלולים', isTakeable: false, imagePath: import.meta.env.BASE_URL + 'assets/npc/thorns.png'
      });
    }

    return room;
  }

  public getSisterName(): string {
    return this.state.activeSister === 'Mor' ? 'מור' : 'הילה';
  }

  public processInput(input: string): string {
    const parsed = HebrewParser.parse(input);
    const room = this.getCurrentRoom();
    
    this.lastAnimAction = 'NONE'; // Default

    if (parsed.action === 'UNKNOWN') {
      return `לא הבנתי את הפקודה: '${input}'. נסי לומר 'לכי צפונה', 'קחי שרביט', או 'דברי קוסם'.`;
    }

    switch (parsed.action) {
      case 'GO':
        return this.handleGo(parsed.target, room);
      case 'TAKE':
        return this.handleTake(parsed.target, room);
      case 'USE':
        return this.handleUse(parsed.target, room);
      case 'LOOK':
        return this.handleLook(room);
      case 'HINT':
        return this.handleHint(room);
      case 'TALK':
        return this.handleTalk(parsed.target, room);
      case 'SWITCH':
        return this.handleSwitch();
      default:
        return 'פעולה לא חוקית.';
    }
  }

  public cleanupAnimations() {
    // remove objects that completed their take or destroy animation
    for (const room of this.rooms.values()) {
      room.objects = room.objects.filter(o => !o.isBeingTaken && !o.isBeingDestroyed);
    }
  }

  private handleGo(direction: string, room: Room): string {
    const validDirections = ['צפון', 'דרום', 'מזרח', 'מערב'];
    let dirToUse = validDirections.find(d => direction.includes(d));
    if (!dirToUse && validDirections.includes(direction)) dirToUse = direction;

    if (!dirToUse) {
      return `לאן את רוצה ללכת? (צפון, דרום, מזרח, מערב)`;
    }

    const exit = room.exits.find(e => e.direction === dirToUse);
    if (!exit) {
      return `אי אפשר ללכת לכיוון ${dirToUse} מכאן.`;
    }

    if (exit.locked) {
      return exit.lockedDescription || `הדרך לכיוון ${dirToUse} חסומה.`;
    }

    this.lastAnimAction = 'GO';
    this.state.currentRoomId = exit.targetRoomId;
    const newRoom = this.getCurrentRoom();
    return `הלכת לכיוון ${dirToUse}.\n\n--- ${newRoom.name} ---\n${newRoom.description}`;
  }

  private handleTake(target: string, room: Room): string {
    if (!target) return 'מה את רוצה לקחת?';

    const objIndex = room.objects.findIndex(o => target.includes(o.name) || o.name.includes(target));
    if (objIndex === -1) {
      return `אני לא רואה כאן '${target}'.`;
    }

    const obj = room.objects[objIndex];
    if (!obj.isTakeable || obj.isBeingTaken) {
      return `אי אפשר לקחת את ה${obj.name}.`;
    }

    // Levitation constraint for gold key
    if (obj.id === 'gold_key' && this.state.activeSister !== 'Hila') {
      return `המפתח גבוה מדי בשביל מור. אולי הילה תוכל בעזרת יכולת הריחוף שלה? (החלף אחות)`;
    }

    this.lastAnimAction = 'TAKE';
    obj.isBeingTaken = true; // Mark for animation
    this.state.inventory.push(obj.id);
    
    if (obj.id === 'wand') {
      this.state.unlockedAbilities.mor.push('magic_fire');
      return `לקחת את ה${obj.name}! מור כעת יכולה להשתמש בקסם אש! (הקלידי: "השתמשי שרביט" או "השתמשי אש")`;
    }

    return `לקחת את ה${obj.name}.`;
  }

  private handleUse(target: string, room: Room): string {
    if (!target) return 'במה תרצי להשתמש?';

    // Cage vent toggle via levitation
    if ((target.includes('ריחוף') || target.includes('כנפיים') || target.includes('לעוף')) && room.id === 'dungeon' && !this.state.queenRescued) {
      if (this.state.activeSister !== 'Hila') {
        return 'רק הילה יודעת לרחף אל פתח האוורור!';
      }
      this.lastAnimAction = 'MAGIC';
      this.state.cageVentOpen = true;
      return 'הילה ריחפה אל ראש כלוב הגביש ופתחה את פתח האוורור! עכשיו אפשר להחליף אחות כדי להשתמש באש!';
    }

    // Hitting thorns or cage with fire wand
    if (target.includes('אש') || target.includes('קסם') || target.includes('שרביט') || target.includes('קוצים')) {
      if (!this.state.inventory.includes('wand')) {
        return 'כדי לעשות את זה, את חייבת קודם לאסוף את שרביט האש! הקלידי: "קחי שרביט".';
      }

      if (this.state.activeSister !== 'Mor') {
        return 'רק מור יודעת להשתמש בשרביט ובקסם האש! הקלידי "החליפי אחות" ואז נסי שוב.';
      }
      
      // Unconditionally evaluate forest logic to defeat HMR React cache!
      if (room.id === 'forest') {
        const northExit = room.exits.find(e => e.direction === 'צפון');
        if (northExit) northExit.locked = false;
        
        const thorns = room.objects.find(o => o.id === 'thorns');
        if (thorns) thorns.isBeingDestroyed = true;

        this.lastAnimAction = 'MAGIC_BURN_THORNS';
        return 'מור ירתה כדור אש ענק! הקוצים נשרפו והדרך צפונה פנויה כעת!';
      } else if (room.id === 'dungeon' && !this.state.queenRescued) {
        this.lastAnimAction = 'MAGIC';
        if (!this.state.cageVentOpen) {
          return 'מור ירתה אש על הכלוב, אבל הוא קפוא וחזק מדי. נראה שיש פתח אוורור למעלה שהילה יכולה להגיע אליו כדי לפתוח אותו...';
        } else {
          this.state.queenRescued = true;
          room.description = 'ניצחתן! מלכת הפיות עומדת במרכז החדר ההרוס מכלוב הגביש. הצלתן את נרניה!';
          if (room.npc) room.npc.dialogue = '"תודה שהצלתן אותי גיבורות יקרות! הישארו אצלי בטירה כאורחות כבוד."';
          return 'מור ירתה כדור אש ענק היישר לתוך פתח האוורור! כלוב הגביש התנפץ לרסיסים! 🎉 הצלתן את נרניה והמלכה חופשיה! (רמז: הקלידו "דברי מלכה" כדי לסיים את ההרפתקה)';
        }
      } else {
        this.lastAnimAction = 'MAGIC';
        return 'יריית אש פגעה באוויר. שום דבר חשוב לא קרה.';
      }
    }

    // Using gold key to open dungeon gate (now wizard hall)
    if (target.includes('מפתח')) {
      if (!this.state.inventory.includes('gold_key')) {
        return 'כדי לפתוח את השער, עליך להחזיק במפתח זהב קודם! נסי להשתמש ב"קחי מפתח".';
      }

      // Unconditionally evaluate castle gates logic to defeat HMR React cache!
      if (room.id === 'castle_gates') {
        const northExit = room.exits.find(e => e.direction === 'צפון');
        if (northExit) northExit.locked = false;

        // Visually update the castle background to be open
        room.imagePath = import.meta.env.BASE_URL + 'assets/backgrounds/castle_open.png';
        room.description = 'חזית טירת הקוסם האפל. דלת העץ הכבדה עומדת פתוחה לרווחה אל תוך אפלת המסדרון!';
        
        return 'השתמשת במפתח מזהב! דלת העץ הכבדה נפתחה בחריקה אל תוך האפלה. הדרך צפונה פנויה.';
      }
    }

    return 'אי אפשר להשתמש בזה כרגע או שלא לקחת את החפץ המתאים.';
  }

  private handleTalk(target: string, room: Room): string {
    if (!room.npc) return 'אין כאן עם מי לדבר.';
    
    // Check riddle
    if (room.npc.riddleAnswer && !this.state.wizardDefeated) {
      if (target.includes(room.npc.riddleAnswer)) {
        this.state.wizardDefeated = true;
        const northExit = room.exits.find(e => e.direction === 'צפון');
        if (northExit && northExit.locked && northExit.requiredItem === 'defeat_wizard') {
          northExit.locked = false;
        }

        // Alter the core room state visually and descriptively
        room.description = 'הקוסם האפל הובס ונעלם מהאולם! השער הכבד שהגן על הצינוק צפונה עומד כעת פתוח לרווחה.';
        room.imagePath = import.meta.env.BASE_URL + 'assets/backgrounds/wizard_interior_open.png';
        room.npc = undefined; // Permanently remove the wizard sprite from the room

        return 'ענית נכון! הקוסם צורח: "אני לא מאמין! פתרתן את החידה שלי! ארררר!" והוא מתפוגג לחלוטין בענן עשן שחור. מולכן, שערי הברזל הכבדים נפתחים בחריקה. הדרך לצינוק פנויה!';
      } else {
         return `הקוסם האפל צוחק: "חה חה! ${target} זו תשובה שגויה. נסו שוב: קלה כמו נוצה, אבל גם הענק הכי חזק לא יוכל להחזיק אותי להרבה זמן. מה אני?"`;
      }
    }

    if (room.npc.id === 'queen' && this.state.queenRescued) {
      this.state.talkedToSavedQueen = true;
      return 'המלכה מחייכת אליכן בחום: "תודה מקרב לב, גיבורות נרניה! מור, הילה, האומץ שלכן שבר סוף סוף את הקללה האפלה. בזכותכן, הקסם הטהור חזר לממלכה. בואו, הגיע הזמן שנחזור הביתה!"';
    }

    return `[${room.npc.name}]: ${room.npc.dialogue}`;
  }

  private handleLook(room: Room): string {
    let desc = `--- ${room.name} ---\n${room.description}`;
    if (room.objects.length > 0) {
      desc += `\nאת רואה כאן: ${room.objects.map(o => o.name).join(', ')}.`;
    }
    if (room.npc) {
      if (room.id !== 'wizard_hall' || !this.state.wizardDefeated) {
         desc += `\n${room.npc.name} נמצאת כאן! (אפשר ולפעמים צריך "לדבר" איתם)`;
      }
    }
    return desc;
  }

  private handleHint(room: Room): string {
    if (room.hint) {
      return `💡 רמז: ${room.hint}`;
    }
    return 'אין לי רמזים נוספים לתת לך כרגע.';
  }

  private handleSwitch(): string {
    this.lastAnimAction = 'SWITCH';
    this.state.activeSister = this.state.activeSister === 'Mor' ? 'Hila' : 'Mor';
    const newSister = this.getSisterName();
    return `החלפת דמות. עכשיו את משחקת בתור ${newSister}!`;
  }
}
