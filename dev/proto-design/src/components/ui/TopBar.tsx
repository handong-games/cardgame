import { motion } from 'framer-motion';
import type { ReactNode, RefObject } from 'react';
import { AudioControl } from './AudioControl';
import settingsIcon from '@assets/icons/settings.png';
import soulIcon from '@assets/icons/icon-soul.png';

type TopBarMode = 'battle' | 'shop' | 'event';

interface TopBarProps {
  mode?: TopBarMode;
  regionName?: string;
  title?: string;
  subtitle?: string;
  titleIcon?: string;
  leftContent?: ReactNode;
  souls: number;
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
  leftContent,
  souls,
  soulPulse = false,
  isMuted = false,
  onToggleMute,
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
      return (
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full border" style={{ backgroundColor: 'rgba(232,220,210,0.54)', borderColor: 'rgba(107,78,61,0.14)' }}>
          <span className="text-base">🌲</span>
          <span className="font-medium text-base" style={{ color: '#3A3040' }}>{regionName}</span>
        </div>
      );
    }

    return null;
  };

  const renderLeft = () => {
    if (leftContent) {
      return <div className="flex items-center gap-1.5 flex-shrink-0">{leftContent}</div>;
    }

    return <div className="flex items-center gap-1.5 flex-shrink-0" />;
  };

  return (
    <div className="w-full h-full backdrop-blur-sm border-b px-5 py-2" style={{ background: 'linear-gradient(to bottom, rgba(110,98,90,0.82), rgba(94,82,76,0.78))', borderColor: 'rgba(240,232,216,0.18)', boxShadow: '0 4px 14px rgba(28,20,28,0.18)' }}>
      <div className="relative h-full w-full flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center justify-start">
          {renderLeft()}
        </div>

        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="pointer-events-auto">
            {renderCenter()}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2.5">
          <motion.div
            ref={soulCounterRef}
            className="flex items-center gap-2 px-3 py-1 rounded-full border"
            style={{ backgroundColor: 'rgba(232,220,210,0.54)', borderColor: 'rgba(107,78,61,0.14)' }}
            animate={soulPulse ? {
              scale: [1, 1.2, 1],
              boxShadow: ['0 0 0 rgba(192,192,192,0)', '0 0 20px rgba(192,192,192,0.5)', '0 0 0 rgba(192,192,192,0)'],
              transition: { duration: 0.3 }
            } : {}}
          >
            <img src={soulIcon} alt="소울" className="w-5 h-5 object-contain" />
            <span className="font-bold text-base" style={{ color: '#3A3040' }}>{souls}</span>
          </motion.div>
          {onToggleMute && (
            <AudioControl isMuted={isMuted} onToggleMute={onToggleMute} />
          )}
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
    </div>
  );
}
