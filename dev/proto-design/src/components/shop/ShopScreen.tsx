import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { GameButton } from '../ui/GameButton';
import { TopBar } from '../ui/TopBar';
import { ShopConfirmModal } from './ShopConfirmModal';
import { ShopReplaceModal } from './ShopReplaceModal';
import { getRandomDialogue } from '../../data/shop';
import { useSettingsStore } from '../../stores/settingsStore';
import { useAudio } from '../../hooks/useAudio';
import type { ShopItem } from '../../types';
import soulIcon from '@assets/icons/icon-soul.png';
import forestBg from '@assets/backgrounds/sunny-forest-day.png';
import skillFrameImg from '@assets/frames/skill-frame.png';
import merchantImg from '@assets/npcs/npc_wandering-merchant.png';
import { SKILL_IMAGES } from '../../data/skillImages';

/** 타입 뱃지 색상 매핑 */
const TYPE_BADGE: Record<string, { label: string; color: string }> = {
  skill: { label: '스킬', color: 'bg-[#D4A574]/20 text-[#D4A574]' },
  loot: { label: '전리품', color: 'bg-[#6B4B8C]/20 text-purple-400' },
  slot_expansion: { label: '확장', color: 'bg-blue-500/20 text-blue-400' },
  coin: { label: '코인', color: 'bg-amber-500/20 text-amber-300' },
};

function ShopItemCard({
  item,
  playerSouls,
  index,
  onSelect,
}: {
  item: ShopItem;
  playerSouls: number;
  index: number;
  onSelect: (item: ShopItem) => void;
}) {
  const canAfford = playerSouls >= item.price;
  const isSold = item.sold;

  const skillImg = item.type === 'skill' && item.skill
    ? SKILL_IMAGES[item.skill.skillKey]
    : undefined;

  const icon =
    item.type === 'skill' && item.skill ? item.skill.icon :
    item.type === 'loot' && item.loot ? item.loot.emoji :
    item.type === 'coin' ? '🪙' :
    '📦';

  const name =
    item.type === 'skill' && item.skill ? item.skill.name :
    item.type === 'loot' && item.loot ? item.loot.name :
    item.type === 'coin' ? `코인 +${item.coinCount ?? 1}` :
    '슬롯 확장';

  const description =
    item.type === 'skill' && item.skill ? item.skill.description :
    item.type === 'loot' && item.loot ? item.loot.description :
    item.type === 'coin' ? '다음 전투부터 토스할 코인 +1' :
    '스킬 슬롯 +1';

  const isRare = item.type === 'loot' && item.loot?.rarity === 'rare';
  const badge = TYPE_BADGE[item.type] ?? TYPE_BADGE.skill;

  const borderColor = isSold
    ? 'border-gray-600'
    : isRare
      ? 'border-[#6B4B8C] hover:border-purple-400'
      : 'border-[#4A4A55] hover:border-[#D4A574]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05 }}
      whileHover={!isSold ? { scale: 1.07, y: -6, boxShadow: '0 12px 28px rgba(0,0,0,0.5)' } : undefined}
      whileTap={!isSold ? { scale: 0.97 } : undefined}
      onClick={!isSold ? () => onSelect(item) : undefined}
      className={`relative w-44 rounded-xl border-2 overflow-hidden transition-shadow ${borderColor} ${
        isSold
          ? 'opacity-40 cursor-not-allowed'
          : 'cursor-pointer shadow-card-dark'
      }`}
      style={{ background: 'linear-gradient(to bottom, #1E1E24, #2A2A32)' }}
    >
      <div className="absolute top-2 left-2 z-10">
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${badge.color}`}>
          {badge.label}
        </span>
      </div>

      {isRare && !isSold && (
        <motion.div
          className="absolute inset-0 z-0 rounded-xl pointer-events-none"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ boxShadow: 'inset 0 0 20px rgba(107,75,140,0.3)' }}
        />
      )}

      {isSold && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60">
          <div className="w-full h-0.5 bg-red-500/60 absolute top-1/2 -rotate-12" />
          <span className="text-2xl font-black text-red-500/80 -rotate-12">SOLD</span>
        </div>
      )}

      <div className="flex items-center justify-center py-6 bg-[#121218] relative z-[1]">
        {skillImg ? (
          <img src={skillImg} alt={name} className="w-16 h-16 object-contain drop-shadow-lg" />
        ) : (
          <span className="text-4xl">{icon}</span>
        )}
      </div>

      <div className="px-3 py-2 border-t border-[#4A4A55]/60 relative z-[1]">
        <div className="text-sm font-bold text-[#FFF5E6] text-center truncate">{name}</div>
        <div className="text-xs text-gray-400 text-center mt-1 line-clamp-2 leading-tight">{description}</div>
      </div>

      <div className={`px-3 py-2 text-center border-t border-[#4A4A55]/60 relative z-[1] ${
        !isSold && !canAfford ? 'bg-red-900/30' : ''
      }`}>
        <span className={`text-sm font-bold ${
          isSold ? 'text-gray-500' : canAfford ? 'gold-text' : 'text-red-400'
        }`}>
          {item.price} <img src={soulIcon} alt="소울" className="inline w-5 h-5 object-contain -mt-0.5" />
        </span>
      </div>
    </motion.div>
  );
}

export function ShopScreen() {
  const { shop, player, purchaseShopItem, replaceSkillForShop, cancelReplace, closeShop } = useGameStore();
  const [confirmItem, setConfirmItem] = useState<ShopItem | null>(null);
  const [showReplace, setShowReplace] = useState(false);
  const [merchantText, setMerchantText] = useState(shop?.merchantDialogue ?? '');
  const { isMuted, toggleMute } = useAudio();

  if (!shop) return null;

  const skillItems = shop.items.filter(i => i.type === 'skill');
  const lootItems = shop.items.filter(i => i.type === 'loot');
  const coinItems = shop.items.filter(i => i.type === 'coin');
  const slotItem = shop.items.find(i => i.type === 'slot_expansion');
  const otherItems = [...coinItems, ...(slotItem ? [slotItem] : [])];

  const pendingItem = shop.pendingPurchaseItemId
    ? shop.items.find(i => i.id === shop.pendingPurchaseItemId)
    : null;
  const totalCoinCount = player.coinInventory.reduce((sum, coin) => sum + coin.count, 0);

  const handleSelectItem = (item: ShopItem) => {
    if (item.sold) return;
    if (player.souls < item.price) {
      setMerchantText(getRandomDialogue('insufficient'));
      return;
    }
    setConfirmItem(item);
  };

  const handleConfirmPurchase = () => {
    if (!confirmItem) return;
    const result = purchaseShopItem(confirmItem.id);
    setConfirmItem(null);

    if (result.needsReplace) {
      setShowReplace(true);
    } else if (result.success) {
      setMerchantText(getRandomDialogue('purchase'));
    } else if (result.reason) {
      setMerchantText(result.reason);
    }
  };

  const handleReplace = (oldSkillId: string) => {
    replaceSkillForShop(oldSkillId);
    setShowReplace(false);
    setMerchantText(getRandomDialogue('purchase'));
  };

  const handleCancelReplace = () => {
    cancelReplace();
    setShowReplace(false);
  };

  const handleClose = () => {
    closeShop();
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* 배경 레이어 */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${forestBg})` }} />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)' }} />

      {/* Zone A: 상단 HUD */}
      <div className="absolute top-0 left-0 w-full h-[72px] z-20">
        <TopBar
          mode="shop"
          title="떠돌이 상점"
          titleIcon="🛒"
          hp={player.hp}
          maxHp={player.maxHp}
          souls={player.souls}
          coinCount={totalCoinCount}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onOpenSettings={useSettingsStore.getState().open}
        />
      </div>

      {/* Zone B: 상인 + 상품 진열 */}
      <div
          className="absolute top-[72px] left-0 w-full z-10 flex"
          style={{ bottom: '160px' }}
      >
        {/* 좌측: 상인 영역 (1/6) — 말풍선+상인 세로 중앙 배치 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative w-1/6 min-w-[220px] h-full flex flex-col items-center justify-center bg-[#16161C]/40 border-r border-[#4A4A55]/30 px-3"
        >
          {/* 말풍선 */}
          <motion.div
            key={merchantText}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-4 w-[210px] bg-gradient-to-b from-[#2A2218] to-[#1E1E24] border border-[#D4A574]/40 rounded-xl px-3 py-2.5 text-center"
          >
            <span className="text-[#FFF5E6]/80 text-sm italic leading-snug">&ldquo;{merchantText}&rdquo;</span>
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0"
              style={{ borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '8px solid rgba(212,165,116,0.4)' }}
            />
          </motion.div>

          {/* 상인 이미지 */}
          <motion.div
            className="relative w-56 h-80 shrink-0"
            whileHover={{ rotate: [-2, 2, -2, 0] }}
            transition={{ duration: 0.5 }}
          >
            <img src={merchantImg} alt="떠돌이 상인" className="w-full h-full object-contain drop-shadow-lg" />
            <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: '0 0 48px rgba(212,165,116,0.36)' }} />
          </motion.div>
        </motion.div>

        {/* 우측: 상품 영역 (5/6) */}
        <div className="flex-1 h-full overflow-y-auto">
          <div className="min-h-full flex flex-col items-center justify-center px-6 py-4">
            {skillItems.length > 0 && (
              <div className="mb-6 w-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D4A574]/40" />
                  <h2 className="text-sm font-bold text-[#D4A574]/80 uppercase tracking-wider">⚔️ 스킬</h2>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D4A574]/40" />
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                  {skillItems.map((item, idx) => (
                    <ShopItemCard
                      key={item.id}
                      item={item}
                      playerSouls={player.souls}
                      index={idx}
                      onSelect={handleSelectItem}
                    />
                  ))}
                </div>
              </div>
            )}

            {lootItems.length > 0 && (
              <div className="mb-6 w-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent to-purple-400/40" />
                  <h2 className="text-sm font-bold text-purple-400/80 uppercase tracking-wider">🎒 전리품</h2>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent to-purple-400/40" />
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                  {lootItems.map((item, idx) => (
                    <ShopItemCard
                      key={item.id}
                      item={item}
                      playerSouls={player.souls}
                      index={skillItems.length + idx}
                      onSelect={handleSelectItem}
                    />
                  ))}
                </div>
              </div>
            )}

            {otherItems.length > 0 && (
              <div className="mb-6 w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-blue-400/40" />
                <h2 className="text-sm font-bold text-blue-400/80 uppercase tracking-wider">➕ 기타</h2>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-blue-400/40" />
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                {otherItems.map((item, idx) => (
                  <ShopItemCard
                    key={item.id}
                    item={item}
                    playerSouls={player.souls}
                    index={skillItems.length + lootItems.length + idx}
                    onSelect={handleSelectItem}
                  />
                ))}
              </div>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Zone C: 장착 스킬 + 나가기 */}
      <div className="absolute bottom-0 left-0 w-full h-[160px] z-20 bg-[#16161C]/90 backdrop-blur-sm">
        <div className="gold-divider" />
        <div className="h-full flex items-center justify-center gap-6 px-8">
          <span className="text-xs text-gray-500">장착 ({player.skills.length}/{player.maxSkillSlots})</span>
          <div className="flex items-center gap-3">
            {player.skills.map((skill) => {
              const skillImg = SKILL_IMAGES[skill.skillKey];
              return (
                <div key={skill.id} className="relative w-20 h-24" title={skill.name}>
                  <img src={skillFrameImg} alt="" className="absolute inset-0 w-full h-full object-contain opacity-70" />
                  {skillImg ? (
                    <img src={skillImg} alt={skill.name} className="absolute inset-0 w-3/4 h-3/4 m-auto object-contain" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl">{skill.icon}</span>
                    </div>
                  )}
                  <div className="absolute bottom-0.5 left-0 right-0 text-center">
                    <span className="text-[9px] text-gray-300 bg-dark-surface/80 px-1 py-0.5 rounded truncate inline-block max-w-full">
                      {skill.name}
                    </span>
                  </div>
                </div>
              );
            })}
            {Array.from({ length: player.maxSkillSlots - player.skills.length }).map((_, i) => (
              <div key={`empty-${i}`} className="w-20 h-24 rounded-xl border border-dashed border-[#4A4A55]/60 flex items-center justify-center">
                <span className="text-lg text-gray-600">+</span>
              </div>
            ))}
          </div>
          <div className="absolute right-8">
            <GameButton variant="secondary" size="lg" onClick={handleClose}>
              나가기 →
            </GameButton>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {confirmItem && (
          <ShopConfirmModal
            item={confirmItem}
            playerSouls={player.souls}
            onConfirm={handleConfirmPurchase}
            onCancel={() => setConfirmItem(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReplace && pendingItem && (
          <ShopReplaceModal
            newItem={pendingItem}
            currentSkills={player.skills}
            onReplace={handleReplace}
            onCancel={handleCancelReplace}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
