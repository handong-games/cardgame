import { useMemo, useState } from 'react';

type EffectType =
  | 'damage'
  | 'block'
  | 'heal'
  | 'draw'
  | 'energy'
  | 'buff'
  | 'debuff';

interface EffectItem {
  id: string;
  type: EffectType;
  value: number;
  duration: number;
  chance: number;
}

const EFFECT_OPTIONS: Record<EffectType, { label: string; unit: string; color: string }> = {
  damage: { label: '피해', unit: '데미지', color: 'text-rose-600' },
  block: { label: '방어', unit: '방어력', color: 'text-sky-600' },
  heal: { label: '회복', unit: 'HP', color: 'text-emerald-600' },
  draw: { label: '드로우', unit: '장', color: 'text-indigo-600' },
  energy: { label: '에너지', unit: '점', color: 'text-amber-600' },
  buff: { label: '버프', unit: '턴', color: 'text-purple-600' },
  debuff: { label: '디버프', unit: '턴', color: 'text-slate-600' },
};

const ELEMENTS = ['불', '물', '번개', '바람', '대지', '빛', '어둠'];

const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export function SkillCreateScreen() {
  const [skillName, setSkillName] = useState('균열의 파동');
  const [skillDesc, setSkillDesc] = useState('여러 속성을 조합해 전장을 흔드는 스킬');
  const [skillType, setSkillType] = useState('공격');
  const [target, setTarget] = useState('적');
  const [rarity, setRarity] = useState('레어');
  const [cost, setCost] = useState(2);
  const [cooldown, setCooldown] = useState(0);
  const [elements, setElements] = useState<string[]>(['번개']);
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>(['연계', '광역']);
  const [effects, setEffects] = useState<EffectItem[]>([
    { id: makeId(), type: 'damage', value: 14, duration: 0, chance: 100 },
  ]);

  const skillPreview = useMemo(() => {
    return {
      name: skillName,
      description: skillDesc,
      type: skillType,
      target,
      rarity,
      cost,
      cooldown,
      elements,
      keywords,
      effects: effects.map((effect) => ({
        type: effect.type,
        value: effect.value,
        duration: effect.duration || undefined,
        chance: effect.chance !== 100 ? effect.chance : undefined,
      })),
    };
  }, [skillName, skillDesc, skillType, target, rarity, cost, cooldown, elements, keywords, effects]);

  const handleEffectChange = (id: string, patch: Partial<EffectItem>) => {
    setEffects((prev) => prev.map((effect) => (effect.id === id ? { ...effect, ...patch } : effect)));
  };

  const handleEffectRemove = (id: string) => {
    setEffects((prev) => prev.filter((effect) => effect.id !== id));
  };

  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim();
    if (!trimmed || keywords.includes(trimmed)) return;
    setKeywords((prev) => [...prev, trimmed]);
    setKeywordInput('');
  };

  return (
    <div className="skill-ui min-h-screen bg-[radial-gradient(circle_at_top,_#fff3d6,_#fdecef,_#e9f6ff)] text-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.2),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(244,63,94,0.12),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-12">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Skill Studio
                <span className="text-lg">✦</span>
              </span>
              <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                스킬 생성 스테이지
              </h1>
              <p className="mt-3 text-sm text-slate-600 sm:text-base">
                원하는 구성 요소를 조합해 한 장의 스킬 카드를 만드세요. 비용, 타겟, 효과를 자유롭게 설계합니다.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-xs">
                {['조합형 빌더', '실시간 미리보기', '효과 스택 관리'].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200/60 bg-white/80 px-3 py-1 font-semibold text-slate-500"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    현재 조합
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{skillName}</p>
                  <p className="mt-1 text-xs text-slate-500">{skillDesc}</p>
                </div>
                <div className="rounded-2xl bg-slate-900 px-4 py-2 text-center text-xs text-white">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">cost</p>
                  <p className="text-xl font-bold">{cost}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">{rarity}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{skillType}</span>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-600">대상: {target}</span>
              </div>
              <div className="mt-4 border-t border-dashed border-slate-200 pt-4 text-xs text-slate-500">
                {elements.length > 0 ? `속성 ${elements.join(', ')}` : '속성 없음'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-lg font-bold text-slate-900">기본 정보</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-600">
                스킬 이름
                <input
                  value={skillName}
                  onChange={(event) => setSkillName(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                />
              </label>
              <label className="text-sm font-semibold text-slate-600">
                스킬 타입
                <select
                  value={skillType}
                  onChange={(event) => setSkillType(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                >
                  {['공격', '방어', '지원', '유틸리티'].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold text-slate-600 sm:col-span-2">
                스킬 설명
                <textarea
                  value={skillDesc}
                  onChange={(event) => setSkillDesc(event.target.value)}
                  className="mt-2 h-20 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                />
              </label>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <h2 className="text-lg font-bold text-slate-900">비용/대상</h2>
              <div className="mt-4 grid gap-4">
                <label className="text-sm font-semibold text-slate-600">
                  코스트
                  <input
                    type="range"
                    min={0}
                    max={5}
                    value={cost}
                    onChange={(event) => setCost(Number(event.target.value))}
                    className="mt-3 w-full accent-amber-500"
                  />
                  <span className="mt-2 inline-flex items-center gap-2 text-xs text-slate-500">
                    현재 코스트 <strong className="text-slate-900">{cost}</strong>
                  </span>
                </label>
                <label className="text-sm font-semibold text-slate-600">
                  쿨다운
                  <input
                    type="number"
                    min={0}
                    max={9}
                    value={cooldown}
                    onChange={(event) => setCooldown(Number(event.target.value))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                  />
                </label>
                <label className="text-sm font-semibold text-slate-600">
                  대상
                  <select
                    value={target}
                    onChange={(event) => setTarget(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                  >
                    {['적', '아군', '전체', '자기 자신'].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-semibold text-slate-600">
                  희귀도
                  <select
                    value={rarity}
                    onChange={(event) => setRarity(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                  >
                    {['커먼', '언커먼', '레어', '에픽', '레전더리'].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <h2 className="text-lg font-bold text-slate-900">속성 조합</h2>
              <p className="mt-2 text-xs text-slate-500">클릭해서 원하는 속성을 켜고 끌 수 있어요.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {ELEMENTS.map((element) => {
                  const active = elements.includes(element);
                  return (
                    <button
                      type="button"
                      key={element}
                      onClick={() =>
                        setElements((prev) =>
                          active ? prev.filter((item) => item !== element) : [...prev, element],
                        )
                      }
                      className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                        active
                          ? 'bg-slate-900 text-white shadow-[0_6px_16px_rgba(15,23,42,0.2)]'
                          : 'border border-slate-200 bg-white text-slate-500 hover:border-slate-400'
                      }`}
                    >
                      {element}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">효과 조합</h2>
              <button
                type="button"
                onClick={() =>
                  setEffects((prev) => [
                    ...prev,
                    { id: makeId(), type: 'damage', value: 8, duration: 0, chance: 100 },
                  ])
                }
                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                + 효과 추가
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {effects.map((effect, index) => (
                <div
                  key={effect.id}
                  className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-400">Effect {index + 1}</span>
                    {effects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleEffectRemove(effect.id)}
                        className="text-xs text-rose-500 hover:text-rose-600"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-4">
                    <label className="text-xs font-semibold text-slate-500">
                      타입
                      <select
                        value={effect.type}
                        onChange={(event) =>
                          handleEffectChange(effect.id, { type: event.target.value as EffectType })
                        }
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:border-slate-400 focus:outline-none"
                      >
                        {Object.entries(EFFECT_OPTIONS).map(([key, option]) => (
                          <option key={key} value={key}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs font-semibold text-slate-500">
                      수치
                      <input
                        type="number"
                        min={0}
                        value={effect.value}
                        onChange={(event) =>
                          handleEffectChange(effect.id, { value: Number(event.target.value) })
                        }
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:border-slate-400 focus:outline-none"
                      />
                    </label>
                    <label className="text-xs font-semibold text-slate-500">
                      지속 턴
                      <input
                        type="number"
                        min={0}
                        value={effect.duration}
                        onChange={(event) =>
                          handleEffectChange(effect.id, { duration: Number(event.target.value) })
                        }
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:border-slate-400 focus:outline-none"
                      />
                    </label>
                    <label className="text-xs font-semibold text-slate-500">
                      확률 (%)
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={effect.chance}
                        onChange={(event) =>
                          handleEffectChange(effect.id, { chance: Number(event.target.value) })
                        }
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:border-slate-400 focus:outline-none"
                      />
                    </label>
                  </div>
                  <p className={`mt-3 text-xs font-semibold ${EFFECT_OPTIONS[effect.type].color}`}>
                    {EFFECT_OPTIONS[effect.type].label} {effect.value}
                    {EFFECT_OPTIONS[effect.type].unit}
                    {effect.duration > 0 ? ` · ${effect.duration}턴 지속` : ''}
                    {effect.chance !== 100 ? ` · 확률 ${effect.chance}%` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-lg font-bold text-slate-900">키워드 태그</h2>
            <p className="mt-2 text-xs text-slate-500">콤보나 시너지를 설명하는 태그를 추가하세요.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => setKeywords((prev) => prev.filter((item) => item !== keyword))}
                  className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
                >
                  {keyword} ✕
                </button>
              ))}
              {keywords.length === 0 && (
                <span className="text-xs text-slate-400">아직 추가된 키워드가 없어요.</span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <input
                value={keywordInput}
                onChange={(event) => setKeywordInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleAddKeyword();
                  }
                }}
                placeholder="태그 입력"
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-400"
              >
                태그 추가
              </button>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-900/10 bg-slate-900 p-6 text-white shadow-[0_25px_80px_rgba(15,23,42,0.25)]">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Preview</p>
              <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                {rarity}
              </span>
            </div>
            <h3 className="mt-4 text-2xl font-bold">{skillName}</h3>
            <p className="mt-2 text-sm text-slate-300">{skillDesc}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {elements.length > 0 ? (
                elements.map((element) => (
                  <span key={element} className="rounded-full bg-white/10 px-3 py-1">
                    {element}
                  </span>
                ))
              ) : (
                <span className="text-slate-400">속성 없음</span>
              )}
            </div>
            <div className="mt-4 space-y-2 text-xs text-slate-200">
              {effects.map((effect) => (
                <div key={effect.id} className="flex items-center justify-between">
                  <span>{EFFECT_OPTIONS[effect.type].label}</span>
                  <span className="text-slate-100">
                    {effect.value}
                    {EFFECT_OPTIONS[effect.type].unit}
                    {effect.duration > 0 ? ` · ${effect.duration}턴` : ''}
                    {effect.chance !== 100 ? ` · ${effect.chance}%` : ''}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
              {[
                { label: '코스트', value: cost },
                { label: '쿨다운', value: cooldown },
                { label: '대상', value: target },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-white/10 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-lg font-bold text-slate-900">JSON 미리보기</h2>
            <pre className="mt-4 max-h-[360px] overflow-auto rounded-2xl bg-slate-900 px-4 py-3 text-xs text-slate-100">
              {JSON.stringify(skillPreview, null, 2)}
            </pre>
          </div>
        </aside>
      </div>
    </div>
  );
}
