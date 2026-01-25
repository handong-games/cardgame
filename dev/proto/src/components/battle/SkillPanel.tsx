import { SkillSlot } from '../common/SkillSlot';
import type { Skill, SkillState, Player, Enemy, PreviewEffects, CoinTossResult } from '../../types';
import { calculatePreviewEffects } from '../../utils/skillSystem';

interface SkillPanelProps {
  skills: Skill[];
  skillStates: SkillState[];
  lastTossResults: CoinTossResult[];  // coins 대체
  isPlayerTurn: boolean;
  player: Player;
  enemy?: Enemy | null;
  hoveredSkill: Skill | null;
  onUseSkill: (skillId: string) => void;
  onSkillHover: (skill: Skill | null) => void;
  // 드래그 관련 props
  onSkillDragStart?: (skill: Skill, e: React.MouseEvent, rect: DOMRect) => void;
  draggingSkillId?: string | null;
}

export function SkillPanel({
  skills,
  skillStates,
  lastTossResults,
  isPlayerTurn,
  player,
  enemy,
  hoveredSkill,
  onUseSkill,
  onSkillHover,
  onSkillDragStart,
  draggingSkillId,
}: SkillPanelProps) {
  // 호버된 스킬의 프리뷰 효과 계산
  const getPreviewEffects = (skill: Skill): PreviewEffects | undefined => {
    if (hoveredSkill?.id !== skill.id) return undefined;
    return calculatePreviewEffects(player, skill, enemy);
  };

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap px-4 py-1">
      {skills.map((skill) => {
        const skillState = skillStates.find(s => s.skillId === skill.id);
        return (
          <SkillSlot
            key={skill.id}
            skill={skill}
            skillState={skillState}
            lastTossResults={lastTossResults}
            isPlayerTurn={isPlayerTurn}
            previewEffects={getPreviewEffects(skill)}
            onUse={onUseSkill}
            onHover={onSkillHover}
            onDragStart={onSkillDragStart}
            isDragging={draggingSkillId === skill.id}
          />
        );
      })}

      {skills.length === 0 && (
        <div className="text-slate-500 text-sm py-4">
          스킬이 없습니다
        </div>
      )}
    </div>
  );
}
