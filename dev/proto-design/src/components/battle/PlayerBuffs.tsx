import type { ActiveBuff } from '../../types';
import { getBuffDefinition } from '../../utils/buffSystem';
import statusStrengthIcon from '@assets/icons/status-strength.png';

const BUFF_ICONS: Record<string, string> = {
  strength: statusStrengthIcon,
  strength_long: statusStrengthIcon,
};

interface PlayerBuffsProps {
  buffs: ActiveBuff[];
}

export function PlayerBuffs({ buffs }: PlayerBuffsProps) {
  if (buffs.length === 0) return null;

  return (
    <div
      className="flex flex-wrap justify-center gap-2 mt-1 px-3 py-2 rounded-xl border"
      style={{
        background: 'linear-gradient(to bottom, rgba(240,232,216,0.88), rgba(232,220,210,0.72))',
        borderColor: 'rgba(106,80,128,0.16)',
        boxShadow: '0 6px 14px rgba(58,48,64,0.12)',
      }}
    >
      {buffs.map((activeBuff, index) => {
        const buffDef = getBuffDefinition(activeBuff.buffId);
        if (!buffDef) return null;

        return (
            <div
              key={`${activeBuff.buffId}-${index}`}
              className="relative group"
            >
              {/* 버프 아이콘 */}
              <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-white font-bold text-sm shadow-sm" style={{ backgroundColor: '#C9A86C', borderColor: '#F6E7D6' }}>
                {BUFF_ICONS[activeBuff.buffId] ? (
                  <img src={BUFF_ICONS[activeBuff.buffId]} alt={buffDef.name} className="w-5 h-5 object-contain" />
                ) : (
                  buffDef.name.charAt(0)
                )}
              </div>

            {/* 스택 수 (스택 가능한 버프일 경우) */}
            {activeBuff.stacks > 1 && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {activeBuff.stacks}
              </div>
            )}

            {/* 툴팁 */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" style={{ backgroundColor: 'rgba(58,48,64,0.95)', border: '1px solid rgba(246,231,214,0.18)', color: '#FFF5E6' }}>
                <div className="font-bold mb-1" style={{ color: '#C9A86C' }}>{buffDef.name}</div>
                <div className="text-[#E8DCD2]">{buffDef.description}</div>
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
