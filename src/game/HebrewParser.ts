export type ActionType = 'GO' | 'TAKE' | 'USE' | 'LOOK' | 'SWITCH' | 'HINT' | 'TALK' | 'UNKNOWN';

export interface ParsedCommand {
  action: ActionType;
  target: string;
  originalText: string;
}

export class HebrewParser {
  static parse(input: string): ParsedCommand {
    const text = input.trim().toLowerCase();
    const words = text.split(/\s+/);
    if (words.length === 0) return { action: 'UNKNOWN', target: '', originalText: text };

    const verb = words[0];
    const target = words.slice(1).join(' ');

    let action: ActionType = 'UNKNOWN';

    // Map Hebrew verbs to actions
    switch (verb) {
      case 'לך':
      case 'לכי':
      case 'סע':
      case 'תתקדם':
      case 'תתקדמי':
        action = 'GO';
        break;
      case 'קח':
      case 'קחי':
      case 'אסוף':
      case 'אספי':
        action = 'TAKE';
        break;
      case 'השתמש':
      case 'השתמשי':
      case 'תפעיל':
      case 'תפעילי':
        action = 'USE';
        break;
      case 'הסתכל':
      case 'הסתכלי':
      case 'בחן':
      case 'תאר':
      case 'סביבה':
        action = 'LOOK';
        break;
      case 'רמז':
      case 'עזרה':
      case 'הצילו':
      case 'רמזים':
        action = 'HINT';
        break;
      case 'דבר':
      case 'דברי':
      case 'שוחח':
      case 'שוחחי':
      case 'אמור':
      case 'אמרי':
      case 'ענה':
      case 'עני':
        action = 'TALK';
        break;
      case 'החלף':
      case 'החליפי':
      case 'שנה':
      case 'שני':
        if (target.includes('אחות') || target === 'מור' || target === 'הילה') {
          action = 'SWITCH';
        } else {
          action = 'UNKNOWN';
        }
        break;
    }

    // Default to 'GO' if typing just a direction
    if (['צפון', 'דרום', 'מזרח', 'מערב'].includes(verb)) {
      return { action: 'GO', target: verb, originalText: text };
    }

    return { action, target, originalText: text };
  }
}
