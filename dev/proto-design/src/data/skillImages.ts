import skillAttackImg from '@assets/skills/W_BAS_01_basic-attack.png';
import skillAttack2Img from '@assets/skills/W_ATK_01_heavy-attack.png';
import skillDefenseImg from '@assets/skills/W_BAS_02_basic-defense.png';
import skillDefense2Img from '@assets/skills/W_DEF_01_defense-up.png';
import skillFightingSpiritImg from '@assets/skills/W_BAS_03_fighting-spirit.png';
import skillDesperateStrikeImg from '@assets/skills/W_ATK_02_desperate-strike.png';
import skillComboStrikeImg from '@assets/skills/W_ATK_03_combo-strike.png';
import skillCleaveImg from '@assets/skills/W_ATK_04_cleave.png';
import skillFocusImg from '@assets/skills/W_BUF_01_focus.png';
import skillDesperateShieldNewImg from '@assets/skills/W_DEF_02_desperate-shield-new.png';
import skillChargeImg from '@assets/skills/W_ATK_05_charge.png';

export const SKILL_IMAGES: Record<string, string> = {
  basic_strike: skillAttackImg,
  fighting_spirit: skillFightingSpiritImg,
  combo_strike: skillComboStrikeImg,
  cleave: skillCleaveImg,
  weakening_strike: skillAttack2Img,
  weakening_blow: skillAttack2Img,
  charge_attack: skillChargeImg,
  vulnerable_strike: skillAttack2Img,
  desperate_strike: skillDesperateStrikeImg,
  focus: skillFocusImg,
  defense: skillDefenseImg,
  regenerative_defense: skillDefense2Img,
  weakening_defense: skillDefense2Img,
  desperate_shield: skillDesperateShieldNewImg,
};
