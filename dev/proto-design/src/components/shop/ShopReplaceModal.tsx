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

  const selectedSkill = selectedSkillId ? currentSkills.find(s => s.id === selectedSkillId) : null;

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
        className="bg-[#1E1E24] rounded-2xl border-2 border-[#C45555]/40 p-6 max-w-lg w-full mx-4"
        style={{ boxShadow: '0 0 30px rgba(196,85,85,0.1), 0 8px 32px rgba(0,0,0,0.5)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-[#C45555] mb-1">스킬 슬롯이 가득 찼습니다</h3>
          <p className="text-sm text-[#FFF5E6]/50">교체할 스킬을 선택하세요</p>
        </div>

        <div className="mb-4 p-3 rounded-xl bg-[#D4A574]/10 border border-[#D4A574]/40 text-center">
          <span className="text-sm text-[#D4A574]">새 스킬</span>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-2xl">{newSkill.icon}</span>
            <span className="text-[#D4A574] font-bold">{newSkill.name}</span>
          </div>
          <p className="text-sm text-[#FFF5E6]/60 mt-1">{newSkill.description}</p>
        </div>

        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 flex items-center gap-3 p-3 rounded-xl bg-[#16161C] border border-[#4A4A55]"
          >
            <div className="flex-1 text-center">
              <span className="text-xs text-[#C45555] block mb-1">제거</span>
              <span className="text-2xl">{selectedSkill.icon}</span>
              <span className="text-xs text-gray-400 block mt-1">{selectedSkill.name}</span>
            </div>
            <span className="text-[#D4A574] text-xl">→</span>
            <div className="flex-1 text-center">
              <span className="text-xs text-[#6B9E78] block mb-1">추가</span>
              <span className="text-2xl">{newSkill.icon}</span>
              <span className="text-xs text-[#D4A574] block mt-1">{newSkill.name}</span>
            </div>
          </motion.div>
        )}

        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
          {currentSkills.map((skill) => (
            <motion.div
              key={skill.id}
              onClick={() => setSelectedSkillId(skill.id === selectedSkillId ? null : skill.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                skill.id === selectedSkillId
                  ? 'bg-[#C45555]/15 border-2 border-[#C45555]'
                  : 'bg-[#2A2A32] border-2 border-[#4A4A55] hover:border-[#4A4A55]/80'
              }`}
              style={skill.id === selectedSkillId ? { boxShadow: '0 0 12px rgba(196,85,85,0.3)' } : undefined}
            >
              <span className="text-2xl">{skill.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[#FFF5E6] text-sm">{skill.name}</div>
                <div className="text-xs text-gray-400 truncate">{skill.description}</div>
              </div>
              {skill.id === selectedSkillId && (
                <span className="text-[#C45555] text-sm font-bold shrink-0">✕ 교체</span>
              )}
            </motion.div>
          ))}
        </div>

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
