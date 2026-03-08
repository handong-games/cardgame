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
        <div className="flex items-center gap-2.5 px-3.5 py-1 bg-dark-deep/60 rounded-full border border-dark-graphite/50">
          {titleIcon && <span className="text-base">{titleIcon}</span>}
          <span className="text-gray-200 font-medium text-base">{title}</span>
          {subtitle && (
            <span className="text-sm text-gray-400 border-l border-dark-graphite/50 pl-2">{subtitle}</span>
          )}
        </div>
      );
    }

    if (mode === 'battle' && regionName) {
      return (
        <div className="flex items-center gap-2 px-3.5 py-1 bg-dark-deep/60 rounded-full border border-dark-graphite/50">
          <span className="text-base">🌲</span>
          <span className="text-[#FFF5E6]/80 font-medium text-base">{regionName}</span>
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
    <div className="w-full h-full bg-gradient-to-r from-dark-surface/90 via-dark-charcoal/90 to-dark-surface/90 backdrop-blur-sm border-b border-dark-graphite/50 px-5 py-2 shadow-card-dark">
      <div className="max-w-5xl mx-auto h-full flex items-center justify-between gap-4">
        {/* 좌측 */}
        {renderLeft()}

        {/* 중앙 */}
        {renderCenter()}

        {/* 우측: 영혼 + 오디오 + 설정 */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <motion.div
            ref={soulCounterRef}
            className="flex items-center gap-2 px-3 py-1 bg-dark-deep/60 rounded-full border border-dark-graphite/50"
            animate={soulPulse ? {
              scale: [1, 1.2, 1],
              boxShadow: ['0 0 0 rgba(192,192,192,0)', '0 0 20px rgba(192,192,192,0.5)', '0 0 0 rgba(192,192,192,0)'],
              transition: { duration: 0.3 }
            } : {}}
          >
            <img src={soulIcon} alt="소울" className="w-5 h-5 object-contain" />
            <span className="text-gray-200 font-bold text-base">{souls}</span>
          </motion.div>
          {onToggleMute && (
            <AudioControl isMuted={isMuted} onToggleMute={onToggleMute} />
          )}
          <motion.button
            onClick={onOpenSettings}
            whileHover={{ scale: 1.15, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-full bg-dark-deep/60 border border-dark-graphite/50 flex items-center justify-center cursor-pointer transition-colors hover:border-gray-400"
            title="설정"
          >
            <img src={settingsIcon} alt="설정" className="w-5 h-5 object-contain opacity-80" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
