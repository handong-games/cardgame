import type { ActiveBuff } from '../../types';
import { getBuffDefinition } from '../../utils/buffSystem';
import badgeAuraOfDevotion from '@assets/badges/badge-aura-of-devotion.png';
import badgeCharge from '@assets/badges/badge-charge.png';
import badgeEvasion from '@assets/badges/badge-evasion.png';
import badgeFocus from '@assets/badges/badge-focus.png';
import badgeHardening from '@assets/badges/badge-hardening.png';
import badgeJusticeAura from '@assets/badges/badge-justice-aura.png';
import badgePoison from '@assets/badges/badge-poison.png';
import badgeRegeneration from '@assets/badges/badge-regeneration.png';
import badgeRootBind from '@assets/badges/badge-root-bind.png';
import badgeSpore from '@assets/badges/badge-spore.png';
import badgeStrength from '@assets/badges/badge-strength.png';
import badgeThorns from '@assets/badges/badge-thorns.png';
import badgeVulnerable from '@assets/badges/badge-vulnerable.png';
import badgeWeak from '@assets/badges/badge-weak.png';

const BUFF_ICONS: Record<string, string> = {
  aura_of_devotion: badgeAuraOfDevotion,
  bind: badgeRootBind,
  charge: badgeCharge,
  evasion: badgeEvasion,
  focus: badgeFocus,
  guardian_aura: badgeAuraOfDevotion,
  hardening: badgeHardening,
  justice_aura: badgeJusticeAura,
  poison: badgePoison,
  regeneration: badgeRegeneration,
  root_bind: badgeRootBind,
  spore: badgeSpore,
  strength: badgeStrength,
  strength_long: badgeStrength,
  thorns: badgeThorns,
  vulnerable: badgeVulnerable,
  weak: badgeWeak,
};

interface PlayerBuffsProps {
  buffs: ActiveBuff[];
}

export function PlayerBuffs({ buffs }: PlayerBuffsProps) {
  if (buffs.length === 0) return null;

  return (
    <div className="mt-1 flex w-[var(--character-card-width)] flex-wrap justify-start gap-1.5">
      {buffs.map((activeBuff, index) => {
        const buffDef = getBuffDefinition(activeBuff.buffId);
        if (!buffDef) return null;
        const badgeImage = BUFF_ICONS[activeBuff.buffId];

        return (
            <div
              key={`${activeBuff.buffId}-${index}`}
              className="relative group"
            >
              <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-[4px]">
                {badgeImage ? (
                  <img src={badgeImage} alt={buffDef.name} className="h-full w-full object-contain" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-[#181320] text-xs font-bold text-[#D8B84C]">
                    {buffDef.name.charAt(0)}
                  </span>
                )}
              </div>

            {/* 스택 수 (스택 가능한 버프일 경우) */}
            {activeBuff.stacks > 1 && (
              <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#3A3040] text-[10px] font-bold text-[#F0E8D8]">
                {activeBuff.stacks}
              </div>
            )}

            {/* 툴팁 */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" style={{ backgroundColor: 'rgba(58,48,64,0.95)', border: '1px solid rgba(246,231,214,0.18)', color: '#FFF5E6' }}>
                <div className="font-bold mb-1" style={{ color: '#C9A86C' }}>{buffDef.name}</div>
                <div className="text-[#E8DCD2]">{buffDef.description}</div>
                {activeBuff.stacks > 1 && (
                  <div className="mt-1 text-[#D8B84C]">
                    스택: {activeBuff.stacks}
                  </div>
                )}
                {activeBuff.remainingDuration !== 'combat' && (
                  <div className="mt-1 text-[#B9AFB5]">
                    남은 턴: {activeBuff.remainingDuration}
                  </div>
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
