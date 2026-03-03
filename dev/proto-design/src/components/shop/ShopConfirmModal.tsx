import { motion } from 'framer-motion';
import { GameButton } from '../ui/GameButton';
import type { ShopItem } from '../../types';
import soulIcon from '@assets/icons/icon-soul.png';

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="bg-gray-800 rounded-2xl border-2 border-amber-500/50 p-6 w-80 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 아이템 아이콘 */}
        <div className="text-center mb-4">
          <span className="text-5xl">{itemIcon}</span>
        </div>

        {/* 아이템 이름 */}
        <h3 className="text-xl font-bold text-amber-400 text-center mb-2">
          {itemName}
        </h3>

        {/* 설명 */}
        <p className="text-sm text-gray-300 text-center mb-4 leading-relaxed">
          {itemDesc}
        </p>

        {/* 가격 표시 */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-gray-400">가격:</span>
          <span className={`text-lg font-bold ${canAfford ? 'text-purple-400' : 'text-red-400'}`}>
            {item.price}
          </span>
          <img src={soulIcon} alt="소울" className="inline w-5 h-5 object-contain" />
          <span className="text-gray-500 text-sm">
            (보유: {playerSouls})
          </span>
        </div>

        {/* 버튼 */}
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
