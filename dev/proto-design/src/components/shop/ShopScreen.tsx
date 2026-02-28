import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { ShopConfirmModal } from './ShopConfirmModal';
import { ShopReplaceModal } from './ShopReplaceModal';
import { getRandomDialogue } from '../../data/shop';
import type { ShopItem } from '../../types';

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

  const icon =
    item.type === 'skill' && item.skill ? item.skill.icon :
    item.type === 'loot' && item.loot ? item.loot.emoji :
    '📦';

  const name =
    item.type === 'skill' && item.skill ? item.skill.name :
    item.type === 'loot' && item.loot ? item.loot.name :
    '슬롯 확장';

  const description =
    item.type === 'skill' && item.skill ? item.skill.description :
    item.type === 'loot' && item.loot ? item.loot.description :
    '스킬 슬롯 +1';

  const rarityBorder =
    item.type === 'loot' && item.loot?.rarity === 'rare'
      ? 'border-purple-500 hover:border-purple-400'
      : 'border-amber-500/60 hover:border-amber-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05 }}
      whileHover={!isSold ? { scale: 1.05, y: -4 } : undefined}
      whileTap={!isSold ? { scale: 0.97 } : undefined}
      onClick={!isSold ? () => onSelect(item) : undefined}
      className={`relative w-36 rounded-xl border-2 bg-gray-800 overflow-hidden transition-shadow ${
        isSold
          ? 'opacity-40 cursor-not-allowed border-gray-600'
          : `cursor-pointer shadow-lg hover:shadow-xl ${rarityBorder}`
      }`}
    >
      {/* SOLD 오버레이 */}
      {isSold && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
          <span className="text-2xl font-black text-red-500 -rotate-12">SOLD</span>
        </div>
      )}

      {/* 아이콘 */}
      <div className="flex items-center justify-center py-5 text-4xl bg-gray-850">
        {icon}
      </div>

      {/* 이름 + 설명 */}
      <div className="px-2 py-2 border-t border-gray-700">
        <div className="text-sm font-bold text-white text-center truncate">{name}</div>
        <div className="text-xs text-gray-400 text-center mt-1 line-clamp-2 leading-tight">{description}</div>
      </div>

      {/* 가격 */}
      <div className={`px-2 py-1.5 text-center border-t border-gray-700 ${
        !isSold && !canAfford ? 'bg-red-900/20' : 'bg-gray-800'
      }`}>
        <span className={`text-sm font-bold ${
          isSold ? 'text-gray-500' : canAfford ? 'text-purple-400' : 'text-red-400'
        }`}>
          {item.price} 👻
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

  if (!shop) return null;

  const skillItems = shop.items.filter(i => i.type === 'skill');
  const lootItems = shop.items.filter(i => i.type === 'loot');
  const slotItem = shop.items.find(i => i.type === 'slot_expansion');

  const pendingItem = shop.pendingPurchaseItemId
    ? shop.items.find(i => i.id === shop.pendingPurchaseItemId)
    : null;

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
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* 상단 바 */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👻</span>
          <span className="text-xl font-bold text-purple-400">{player.souls}</span>
          <span className="text-gray-500 text-sm">소울</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClose}
          className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors font-medium"
        >
          나가기 →
        </motion.button>
      </div>

      {/* 상인 영역 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-4"
      >
        <span className="text-5xl">🧙‍♂️</span>
        <motion.div
          key={merchantText}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-gray-300 text-lg italic"
        >
          &ldquo;{merchantText}&rdquo;
        </motion.div>
      </motion.div>

      {/* 상품 목록 */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {/* 스킬 섹션 */}
        {skillItems.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-amber-400/80 uppercase tracking-wider mb-3">⚔️ 스킬</h2>
            <div className="flex flex-wrap gap-3 justify-center">
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

        {/* 전리품 + 슬롯 확장 섹션 */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-purple-400/80 uppercase tracking-wider mb-3">🎒 전리품 & 기타</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {lootItems.map((item, idx) => (
              <ShopItemCard
                key={item.id}
                item={item}
                playerSouls={player.souls}
                index={skillItems.length + idx}
                onSelect={handleSelectItem}
              />
            ))}
            {slotItem && (
              <ShopItemCard
                item={slotItem}
                playerSouls={player.souls}
                index={skillItems.length + lootItems.length}
                onSelect={handleSelectItem}
              />
            )}
          </div>
        </div>

        {/* 현재 장착 스킬 표시 */}
        <div className="border-t border-gray-700 pt-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
            장착 스킬 ({player.skills.length}/{player.maxSkillSlots})
          </h2>
          <div className="flex gap-2 justify-center flex-wrap">
            {player.skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700"
              >
                <span className="text-lg">{skill.icon}</span>
                <span className="text-xs text-gray-300">{skill.name}</span>
              </div>
            ))}
            {Array.from({ length: player.maxSkillSlots - player.skills.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center justify-center w-20 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700/50 border-dashed"
              >
                <span className="text-xs text-gray-600">빈 슬롯</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 구매 확인 모달 */}
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

      {/* 스킬 교체 모달 */}
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
