import { motion } from 'framer-motion';
import { GameButton } from '../ui/GameButton';
import type { ShopItem } from '../../types';
import soulIcon from '@assets/icons/icon-soul.png';
import cardFrame from '@assets/frames/frame-player.png';

interface ShopConfirmModalProps {
  item: ShopItem;
  playerSouls: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ShopConfirmModal({ item, playerSouls, onConfirm, onCancel }: ShopConfirmModalProps) {
  const canAfford = playerSouls >= item.price;

  const itemName =
    item.type === 'skill' && item.skill ? item.skill.name :
    item.type === 'loot' && item.loot ? item.loot.name :
    '스킬 슬롯 확장';

  const itemIcon =
    item.type === 'skill' && item.skill ? item.skill.icon :
    item.type === 'loot' && item.loot ? item.loot.emoji :
    '📦';

  const itemDesc =
    item.type === 'skill' && item.skill ? item.skill.description :
    item.type === 'loot' && item.loot ? item.loot.effectDescription :
    '스킬 슬롯을 1칸 확장합니다 (최대 6칸)';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="bg-[#1E1E24] rounded-2xl border-2 border-[#D4A574]/50 p-6 w-80"
        style={{ boxShadow: '0 0 30px rgba(212,165,116,0.15), 0 8px 32px rgba(0,0,0,0.5)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="relative w-24 h-24 mx-auto mb-4"
        >
          <img src={cardFrame} alt="" className="absolute inset-0 w-full h-full object-contain" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">{itemIcon}</span>
          </div>
        </motion.div>

        <h3 className="text-xl font-bold text-[#D4A574] text-center mb-2 text-shadow-gold">
          {itemName}
        </h3>

        <p className="text-sm text-[#FFF5E6]/70 text-center mb-4 leading-relaxed">
          {itemDesc}
        </p>

        <div className="gold-divider mb-4" />

        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-[#FFF5E6]/50">가격:</span>
          <span className={`text-lg font-bold ${canAfford ? 'gold-text' : 'text-red-400'}`}>
            {item.price}
          </span>
          <img src={soulIcon} alt="소울" className="inline w-6 h-6 object-contain" />
          <span className="text-[#FFF5E6]/40 text-sm">
            (보유: {playerSouls})
          </span>
        </div>

        <div className="w-full mb-6">
          <div className="h-1.5 rounded-full bg-[#16161C] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${canAfford ? 'bg-[#D4A574]' : 'bg-red-500'}`}
              style={{ width: `${Math.min((playerSouls / Math.max(item.price, 1)) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <GameButton variant="secondary" className="flex-1" onClick={onCancel}>
            취소
          </GameButton>
          <GameButton
            variant="primary"
            className="flex-1"
            onClick={canAfford ? onConfirm : undefined}
            disabled={!canAfford}
          >
            {canAfford ? '구매' : '소울 부족'}
          </GameButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
