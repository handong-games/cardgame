import skillAttackImg from '@assets/skills/W_BAS_01_basic-attack.png';
import skillDefenseImg from '@assets/skills/W_BAS_02_basic-defense.png';
import skillFightingSpiritImg from '@assets/skills/W_BAS_03_fighting-spirit.png';
import skillDesperateStrikeImg from '@assets/skills/W_ATK_02_desperate-strike.png';
import skillComboStrikeImg from '@assets/skills/W_ATK_03_combo-strike-new.png';
import skillCleaveImg from '@assets/skills/W_ATK_04_cleave.png';
import skillFocusImg from '@assets/skills/W_BUF_01_focus.png';
import skillDesperateShieldNewImg from '@assets/skills/W_DEF_02_desperate-shield-new.png';
import skillChargeImg from '@assets/skills/W_ATK_05_charge.png';
import skillWeakeningStrikeImg from '@assets/skills/W_ATK_06_weakening-strike.png';
import skillWeakeningBlowImg from '@assets/skills/W_ATK_07_weakening-blow.png';
import skillVulnerableStrikeImg from '@assets/skills/W_ATK_08_vulnerable-strike.png';
import skillRegenerativeDefenseImg from '@assets/skills/W_DEF_03_regenerative-defense.png';
import skillWeakeningDefenseImg from '@assets/skills/W_DEF_04_weakening-defense.png';

export const SKILL_IMAGES: Record<string, string> = {
  basic_strike: skillAttackImg,
  fighting_spirit: skillFightingSpiritImg,
  combo_strike: skillComboStrikeImg,
  cleave: skillCleaveImg,
  weakening_strike: skillWeakeningStrikeImg,
  weakening_blow: skillWeakeningBlowImg,
  charge_attack: skillChargeImg,
  vulnerable_strike: skillVulnerableStrikeImg,
  desperate_strike: skillDesperateStrikeImg,
  focus: skillFocusImg,
  defense: skillDefenseImg,
  regenerative_defense: skillRegenerativeDefenseImg,
  weakening_defense: skillWeakeningDefenseImg,
  desperate_shield: skillDesperateShieldNewImg,
};
