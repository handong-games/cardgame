import { useState } from 'react';
import { motion } from 'framer-motion';
import { GameButton } from '../ui/GameButton';
import type { Skill, ShopItem } from '../../types';

interface ShopReplaceModalProps {
  newItem: ShopItem;
  currentSkills: Skill[];
  onReplace: (oldSkillId: string) => void;
  onCancel: () => void;
}

export function ShopReplaceModal({ newItem, currentSkills, onReplace, onCancel }: ShopReplaceModalProps) {
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  const newSkill = newItem.skill;
  if (!newSkill) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="bg-gray-800 rounded-2xl border-2 border-red-500/50 p-6 max-w-lg w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-red-400 mb-1">스킬 슬롯이 가득 찼습니다</h3>
          <p className="text-sm text-gray-400">교체할 스킬을 선택하세요</p>
        </div>

        {/* 새 스킬 표시 */}
        <div className="mb-4 p-3 rounded-lg bg-amber-900/30 border border-amber-500/30 text-center">
          <span className="text-sm text-amber-300">새 스킬</span>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-2xl">{newSkill.icon}</span>
            <span className="text-amber-400 font-bold">{newSkill.name}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">{newSkill.description}</p>
        </div>

        {/* 현재 스킬 목록 */}
        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
          {currentSkills.map((skill) => (
            <motion.div
              key={skill.id}
              onClick={() => setSelectedSkillId(skill.id === selectedSkillId ? null : skill.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                skill.id === selectedSkillId
                  ? 'bg-red-900/40 border-2 border-red-500'
                  : 'bg-gray-700/50 border-2 border-transparent hover:border-gray-600'
              }`}
            >
              <span className="text-2xl">{skill.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm">{skill.name}</div>
                <div className="text-xs text-gray-400 truncate">{skill.description}</div>
              </div>
              {skill.id === selectedSkillId && (
                <span className="text-red-400 text-sm font-bold shrink-0">교체</span>
              )}
            </motion.div>
          ))}
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <GameButton variant="secondary" className="flex-1" onClick={onCancel}>
            취소
          </GameButton>
          <GameButton
            variant="danger"
            className="flex-1"
            onClick={selectedSkillId ? () => onReplace(selectedSkillId) : undefined}
            disabled={!selectedSkillId}
          >
            교체하기
          </GameButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
