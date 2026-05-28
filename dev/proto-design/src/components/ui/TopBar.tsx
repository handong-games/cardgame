import { motion } from 'framer-motion';
import type { RefObject } from 'react';
import settingsIcon from '@assets/icons/settings.png';
import hpIcon from '@assets/icons/icon-hp.png';
import coinPouchIcon from '@assets/coins/coin-pouch.png';
import soulIcon from '@assets/icons/icon-soul.png';

type TopBarMode = 'battle' | 'shop' | 'event';

interface TopBarProps {
  mode?: TopBarMode;
  regionName?: string;
  title?: string;
  subtitle?: string;
  titleIcon?: string;
  hp?: number;
  maxHp?: number;
  souls: number;
  coinCount?: number;
  soulPulse?: boolean;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onOpenSettings?: () => void;
  soulCounterRef?: RefObject<HTMLDivElement | null>;
}

export function TopBar({
  mode = 'battle',
  regionName,
  title,
  subtitle,
  titleIcon,
  hp,
  maxHp,
  souls,
  coinCount,
  soulPulse = false,
  isMuted: _isMuted = false,
  onToggleMute: _onToggleMute,
  onOpenSettings,
  soulCounterRef,
}: TopBarProps) {
  const renderCenter = () => {
    if (title) {
      return (
        <div className="flex items-center gap-2.5 px-3.5 py-1 rounded-full border" style={{ backgroundColor: 'rgba(232,220,210,0.54)', borderColor: 'rgba(107,78,61,0.14)' }}>
          {titleIcon && <span className="text-base">{titleIcon}</span>}
          <span className="font-medium text-base" style={{ color: '#3A3040' }}>{title}</span>
          {subtitle && (
            <span className="text-sm border-l pl-2" style={{ color: '#6A6070', borderColor: 'rgba(58,48,64,0.15)' }}>{subtitle}</span>
          )}
        </div>
      );
    }

    if (mode === 'battle' && regionName) {
      return null;
    }

    return null;
  };

  return (
    <div className="pointer-events-none relative h-full w-full">
      <motion.div
        ref={soulCounterRef}
        className="group pointer-events-auto absolute left-0 top-0 flex h-[68px] w-[490px] items-center gap-8 pl-7 pr-24 text-[#1E1E24]"
        style={{
          backgroundColor: 'rgba(240,240,240,0.92)',
          clipPath: 'polygon(0 0, calc(100% - 40px) 0, 100% 14px, calc(100% - 34px) 100%, 0 100%)',
        }}
        animate={soulPulse ? {
          scale: [1, 1.03, 1],
          transition: { duration: 0.3 }
        } : {}}
      >
        {hp !== undefined && maxHp !== undefined && (
          <div className="flex items-center gap-2.5 text-[21px] font-black tracking-[0.02em]">
            <img src={hpIcon} alt="HP" className="h-7 w-7 object-contain" />
            <span>{hp} / {maxHp}</span>
          </div>
        )}
        {coinCount !== undefined && (
          <div className="flex items-center gap-2.5 text-[21px] font-black tracking-[0.02em]">
            <img src={coinPouchIcon} alt="코인" className="h-8 w-8 object-contain" />
            <span>{coinCount}</span>
          </div>
        )}
        <div className="flex items-center gap-2.5 text-[21px] font-black tracking-[0.02em]">
          <img src={soulIcon} alt="소울" className="h-7 w-7 object-contain" />
          <span>{souls}</span>
        </div>
        {mode === 'battle' && regionName && (
          <div className="pointer-events-none absolute left-4 top-[74px] z-50 hidden rounded-lg border border-[#F0E8D8]/18 bg-[#1E1E24]/92 px-3 py-2 text-xs text-[#F0E8D8] shadow-[0_10px_24px_rgba(0,0,0,0.28)] group-hover:block">
            <div className="font-bold">🌲 사냥터: {regionName}</div>
            <div className="mt-0.5 text-[#F0E8D8]/68">현재 전투가 진행되는 사냥터입니다.</div>
          </div>
        )}
      </motion.div>

      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="pointer-events-auto">
          {renderCenter()}
        </div>
      </div>

      <div className="pointer-events-auto absolute right-5 top-1/2 flex -translate-y-1/2 items-center justify-end gap-2.5">
          <motion.button
            onClick={onOpenSettings}
            whileHover={{ scale: 1.15, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors"
            style={{ backgroundColor: 'rgba(232,220,210,0.54)', border: '1px solid rgba(107,78,61,0.14)' }}
            title="설정"
          >
            <img src={settingsIcon} alt="설정" className="w-5 h-5 object-contain opacity-80" />
          </motion.button>
      </div>
    </div>
  );
}
