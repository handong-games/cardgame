import { useMemo, useState, useEffect } from "react";

type EffectType = "damage" | "block" | "heal";

interface EffectItem {
  id: string;
  type: EffectType;
  value: number;
  duration: number;
  chance: number;
}

interface ClassSkill {
  id: number;
  class: string;
  name: string;
  description: string;
  type: string;
  element: string | null;
  tags: string | null;
}

interface TriggerItem {
  id: number;
  name: string;
  category: string;
  description: string | null;
}

const EFFECT_OPTIONS: Record<EffectType, { label: string; unit: string; color: string }> = {
  damage: { label: "피해", unit: "데미지", color: "text-rose-600" },
  block: { label: "방어", unit: "방어력", color: "text-sky-600" },
  heal: { label: "회복", unit: "HP", color: "text-emerald-600" },
 
};

const RISKS = [
  { id: "none", label: "리스크 없음", risk: 0 },
  { id: "self_damage", label: "자해 발생", risk: 3 },
  { id: "cost_up", label: "다음 턴 코스트 +1", risk: 2 },
  { id: "cooldown_up", label: "쿨다운 증가", risk: 2 },
  { id: "fail_chance", label: "확률 실패", risk: 3 },
  { id: "resource_burn", label: "자원 소모", risk: 2 },
];

const REGION_SCENARIOS: Record<
  string,
  { id: string; label: string; note: string }[]
> = {
  "잊혀진 숲": [
    { id: "vine_limit", label: "턴당 스킬 수 제한", note: "덩굴 얽힘" },
    { id: "spore_pressure", label: "지속 피해 압박", note: "포자 독성" },
    { id: "branch_shield", label: "다타 페널티 / 단타 보상", note: "나뭇가지 방패" },
    { id: "predator_swarm", label: "광역 압박", note: "포식자 출현" },
    { id: "bark_armor", label: "작은 딜 무효 / 고딜 보상", note: "고목의 껍질" },
    { id: "timing_gate", label: "타이밍 제한", note: "숲의 울림" },
    { id: "heal_dampen", label: "회복 저하", note: "이끼 흡수" },
    { id: "react_trigger", label: "피격 후 트리거 강화", note: "수풀 기습" },
    { id: "buff_decay", label: "상태 지속 감소", note: "정령의 간섭" },
  ],
};

const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export function SkillCreate() {
  const [step, setStep] = useState(1);
  const [region, setRegion] = useState("잊혀진 숲");
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [skillClass, setSkillClass] = useState("전사");
  const [skillName, setSkillName] = useState("균열의 파동");
  const [skillDesc, setSkillDesc] = useState("여러 속성을 조합해 전장을 흔드는 스킬");
  const [skillType, setSkillType] = useState("");
  const [triggerId, setTriggerId] = useState<number | "">("");
  const [riskId, setRiskId] = useState("");
  const [target, setTarget] = useState("적 - 단일 대상");
  const [cost, setCost] = useState(2);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>(["연계", "광역"]);
  const [effects, setEffects] = useState<EffectItem[]>([
    { id: makeId(), type: "damage", value: 3, duration: 0, chance: 100 },
  ]);
  const [classSkills, setClassSkills] = useState<ClassSkill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillsError, setSkillsError] = useState("");
  const [triggers, setTriggers] = useState<TriggerItem[]>([]);
  const [triggersLoading, setTriggersLoading] = useState(false);
  const [triggersError, setTriggersError] = useState("");
  const [targetWeights, setTargetWeights] = useState<Record<string, number>>({});
  const [weightsLoading, setWeightsLoading] = useState(false);


  const skillPreview = useMemo(() => {
    return {
      class: skillClass,
      name: skillName,
      description: skillDesc,
      type: skillType,
      trigger: triggerId,
      risk: riskId,
      target,
      cost,
      keywords,
      effects: effects.map((effect) => ({
        type: effect.type,
        value: effect.value,
        duration: effect.duration || undefined,
        chance: effect.chance !== 100 ? effect.chance : undefined,
      })),
    };
  }, [
    skillClass,
    skillName,
    skillDesc,
    skillType,
    triggerId,
    riskId,
    target,
    cost,
    keywords,
    effects,
  ]);

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
    setKeywordInput("");
  };

  useEffect(() => {
    let active = true;
    setSkillsLoading(true);
    setSkillsError("");
    fetch(`/api/skills?class=${encodeURIComponent(skillClass)}`)
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((data: ClassSkill[]) => {
        if (active) setClassSkills(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setSkillsError("스킬 목록을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (active) setSkillsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [skillClass]);

  useEffect(() => {
    let active = true;
    setTriggersLoading(true);
    setTriggersError("");
    fetch("/api/triggers")
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((data: TriggerItem[]) => {
        if (active) setTriggers(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setTriggersError("트리거 목록을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (active) setTriggersLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const fetchTargetWeights = () => {
    setWeightsLoading(true);
    return fetch("/api/target-weights")
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((data: { label: string; value: number }[]) => {
        const map: Record<string, number> = {};
        data.forEach((item) => {
          map[item.label] = item.value;
        });
        setTargetWeights(map);
      })
      .catch(() => {
        setTargetWeights({});
      })
      .finally(() => {
        setWeightsLoading(false);
      });
  };

  useEffect(() => {
    let active = true;
    fetchTargetWeights().catch(() => null);
    return () => {
      active = false;
    };
  }, []);

  const hasName = skillName.trim().length > 0;
  const hasDesc = skillDesc.trim().length > 0;
  const hasEffect = effects.length > 0;
  const totalSteps = 12;
  const stepTitles = [
    "상황 선택",
    "클래스 선택",
    "스킬 타입",
    "효과 설정",
    "대상 선택",
    "발동 조건",
    "리스크",
    "코스트",
    "키워드 태그",
    "스킬 이름",
    "스킬 설명",
    "검토",
  ];
  const currentTitle = stepTitles[step - 1] ?? "스킬 입력";
  const canNext = (() => {
    if (step === 1) return region.trim().length > 0 && selectedScenarios.length > 0;
    if (step === 2) return skillClass.trim().length > 0;
    if (step === 4) return hasEffect;
    if (step === 6) return triggerId !== "";
    if (step === 7) return riskId.trim().length > 0;
    if (step === 10) return hasName;
    if (step === 11) return hasDesc;
    return true;
  })();
  const nextLabel = step === totalSteps ? "완료" : step >= 4 ? "설정" : "다음";
  const errorMessage =
    (!canNext && step === 1 && "상황을 최소 1개 선택해 주세요.") ||
    (!canNext && step === 2 && "클래스를 선택해 주세요.") ||
    (!canNext && step === 4 && "최소 1개의 효과를 추가해 주세요.") ||
    (!canNext && step === 6 && "발동 조건을 선택해 주세요.") ||
    (!canNext && step === 7 && "리스크를 선택해 주세요.") ||
    (!canNext && step === 10 && "스킬 이름을 입력해 주세요.") ||
    (!canNext && step === 11 && "스킬 설명을 입력해 주세요.") ||
    "";
  const filteredClassSkills = skillType
    ? classSkills.filter((skill) => skill.type === skillType)
    : classSkills;
  const triggerConfig = triggers.find((item) => item.id === triggerId);
  const riskConfig = RISKS.find((item) => item.id === riskId);
  const totalEffectValue = effects.reduce(
    (sum, effect) => sum + effect.value * (effect.chance / 100),
    0,
  );
  const targetMultiplier = targetWeights[target] ?? 1;
  const expectedPerTurn =
    (totalEffectValue * targetMultiplier) / Math.max(1, cost + 1);
  const triggerRisk = triggerConfig?.category === "즉발" ? 0 : 2;
  const riskScore = triggerRisk + (riskConfig?.risk ?? 0);
  const riskLabel =
    riskScore <= 2 ? "낮음" : riskScore <= 5 ? "중간" : "높음";
  const targetTag = target || "대상 미선택";
  const triggerTag = triggerConfig?.name ?? "트리거 미선택";
  const riskTag = `리스크 ${riskLabel}`;
  const typeTag = skillType || "타입 미선택";
  const directionText = `${triggerTag} · ${targetTag} · ${riskTag}`;
  const directionIcons =
    `${triggerConfig?.category === "즉발" ? "⚡" : "⏱️"} ` +
    `${target.includes("전체") ? "🌐" : "🎯"} ` +
    `${riskLabel === "높음" ? "⚠️" : riskLabel === "중간" ? "⚖️" : "✅"}`;

  return (
    <div className="skill-ui min-h-screen bg-[radial-gradient(circle_at_top,_#fff3d6,_#fdecef,_#e9f6ff)] text-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.2),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(244,63,94,0.12),transparent_50%)]" />
        <div className="relative mx-auto max-w-3xl px-4 pb-10 pt-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Skill Studio
            <span className="text-lg">✦</span>
          </span>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">스킬 생성 스테이지</h1>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            스킬의 방향성은 수치가 아니라 플레이 경험입니다.
            언제 강한지, 어떤 대가를 치르는지, 어떤 패턴을 유도하는지부터 결정하세요.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs">
            {["단계형 빌더", "간단 입력", "검토 후 완료"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200/60 bg-white/80 px-3 py-1 font-semibold text-slate-500"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`mx-auto px-6 pb-16 transition-all duration-500 ${
          step >= 4 ? "max-w-6xl" : "max-w-3xl"
        }`}
      >
        <div className="">
          <section>
              <div className={`grid gap-6 ${step >= 4 ? "lg:grid-cols-[minmax(0,1fr)_320px]" : ""}`}>
                <div
                  className={`space-y-6 transition-transform duration-500 ${
                    step >= 4 ? "-translate-x-2" : "translate-x-0"
                  }`}
                >
                  <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        Step {step}/{totalSteps}
                      </p>
                      <h2 className="mt-2 text-lg font-bold text-slate-900">{currentTitle}</h2>
                      <p className="mt-2 text-xs text-slate-500">
                        {step === 1 && "스킬 가치가 올라갈 상황을 먼저 고르세요."}
                        {step === 2 && "클래스를 먼저 정하면 밸런스 기본값이 잡혀요."}
                        {step === 3 && "스킬 성격을 결정하는 타입을 고르세요."}
                        {step === 4 && "핵심 효과를 먼저 만들면 이후 선택이 쉬워져요."}
                        {step === 5 && "이 스킬이 맞출 대상 범위를 지정하세요."}
                        {step === 6 && "언제 발동할지 트리거를 정합니다."}
                        {step === 7 && "리스크를 넣어 강점과 균형을 맞춥니다."}
                        {step === 8 && "코스트는 플레이 리듬을 결정합니다."}
                        {step === 9 && "키워드는 스킬 성격을 요약합니다."}
                        {step === 10 && "마지막에 이름을 붙이면 더 자연스러워요."}
                        {step === 11 && "짧고 명확한 설명이 좋아요."}
                        {step === 12 && "전체 구성을 최종 점검합니다."}
                      </p>
                    </div>
                  </div>

            {step === 1 && (
              <div className="mt-6 space-y-6">
                <label className="text-sm font-semibold text-slate-600">
                  지역 선택
                  <select
                    value={region}
                    onChange={(event) => {
                      setRegion(event.target.value);
                      setSelectedScenarios([]);
                    }}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                  >
                    {Object.keys(REGION_SCENARIOS).map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4">
                  <h3 className="text-sm font-semibold text-slate-700">
                    상황 선택
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    이 스킬이 빛나는 상황을 고르세요. (복수 선택)
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {(REGION_SCENARIOS[region] ?? []).map((item) => {
                      const active = selectedScenarios.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            setSelectedScenarios((prev) =>
                              prev.includes(item.id)
                                ? prev.filter((value) => value !== item.id)
                                : [...prev, item.id],
                            )
                          }
                          className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                            active
                              ? "border-emerald-400/60 bg-emerald-50 text-emerald-800"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                          }`}
                        >
                          <p className="font-semibold">{item.label}</p>
                          <p className="mt-1 text-xs text-slate-500">{item.note}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="mt-6 space-y-6">
                <label className="text-sm font-semibold text-slate-600">
                  클래스를 선택하세요
                  <select
                    value={skillClass}
                    onChange={(event) => setSkillClass(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                  >
                    {["전사", "마법사", "도적"].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}

            {step === 3 && (
              <div className="mt-6 space-y-6">
                <label className="text-sm font-semibold text-slate-600">
                  스킬 타입
                  <select
                    value={skillType}
                    onChange={(event) => setSkillType(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                  >
                    <option value="">선택 안 함</option>
                    {["공격", "방어", "지원", "유틸리티"].map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}

            {step >= 4 && (
              <div className="mt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700">핵심 효과를 추가하세요</h3>
                  <button
                    type="button"
                    onClick={() =>
                      setEffects((prev) => [
                        ...prev,
                        { id: makeId(), type: "damage", value: 3, duration: 0, chance: 100 },
                      ])
                    }
                    className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    + 효과 추가
                  </button>
                </div>

                <div className="space-y-4">
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
                          수치 단계
                          <input
                            type="range"
                            min={1}
                            max={10}
                            step={1}
                            value={effect.value}
                            onChange={(event) =>
                              handleEffectChange(effect.id, { value: Number(event.target.value) })
                            }
                            className="mt-3 w-full accent-amber-500"
                          />
                          <span className="mt-2 inline-flex text-[11px] text-slate-500">
                            단계 {effect.value}
                          </span>
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
                        {effect.duration > 0 ? ` · ${effect.duration}턴 지속` : ""}
                        {effect.chance !== 100 ? ` · 확률 ${effect.chance}%` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step >= 5 && (
              <div className="mt-6 space-y-6">
                <label className="text-sm font-semibold text-slate-600">
                  대상 선택
                  <select
                    value={target}
                    onChange={(event) => setTarget(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                  >
                    {[
                      "적 - 단일 대상",
                      "적 - 전체 대상",
                      "아군 - 본인",
                      "아군 - 단일 대상",
                      "아군 - 전체 대상",
                    ].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}

            {step >= 6 && (
              <div className="mt-6 space-y-6">
                <label className="text-sm font-semibold text-slate-600">
                  발동 조건
                  <select
                    value={triggerId}
                    onChange={(event) =>
                      setTriggerId(event.target.value ? Number(event.target.value) : "")
                    }
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                  >
                    <option value="">선택 안 함</option>
                    {triggers.map((trigger) => (
                      <option key={trigger.id} value={trigger.id}>
                        {trigger.name}
                      </option>
                    ))}
                  </select>
                </label>
                {triggersLoading && <p className="text-xs text-slate-500">트리거 불러오는 중...</p>}
                {triggersError && <p className="text-xs text-rose-500">{triggersError}</p>}
              </div>
            )}

            {step >= 7 && (
              <div className="mt-6 space-y-6">
                <label className="text-sm font-semibold text-slate-600">
                  리스크 선택
                  <select
                    value={riskId}
                    onChange={(event) => setRiskId(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                  >
                    <option value="">선택 안 함</option>
                    {RISKS.map((risk) => (
                      <option key={risk.id} value={risk.id}>
                        {risk.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}

            {step >= 8 && (
              <div className="mt-6 space-y-6">
                <label className="text-sm font-semibold text-slate-600">
                  코스트
                  <input
                    type="range"
                    min={0}
                    max={5}
                    value={cost}
                    onChange={(event) => setCost(Number(event.target.value))}
                    className="mt-4 w-full accent-amber-500"
                  />
                  <span className="mt-3 inline-flex items-center gap-2 text-xs text-slate-500">
                    현재 코스트 <strong className="text-slate-900">{cost}</strong>
                  </span>
                </label>
              </div>
            )}

            {step >= 9 && (
              <div className="mt-6 space-y-6">
                <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4">
                  <h3 className="text-sm font-semibold text-slate-700">키워드 태그</h3>
                  <p className="mt-1 text-xs text-slate-500">콤보/시너지를 간단히 표시합니다.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
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
                  <div className="mt-3 flex flex-wrap gap-2">
                    <input
                      value={keywordInput}
                      onChange={(event) => setKeywordInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
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
              </div>
            )}
            {step === 12 && (
              <div className="mt-6 space-y-6">
                <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4">
                  <h3 className="text-sm font-semibold text-slate-700">최종 요약</h3>
                  <div className="mt-3 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                    <div>
                      <span className="text-xs uppercase text-slate-400">스킬명</span>
                      <p className="font-semibold text-slate-900">{skillName}</p>
                    </div>
                    <div>
                      <span className="text-xs uppercase text-slate-400">클래스</span>
                      <p className="font-semibold text-slate-900">{skillClass}</p>
                    </div>
                    <div>
                      <span className="text-xs uppercase text-slate-400">타입</span>
                      <p className="font-semibold text-slate-900">{skillType || "미선택"}</p>
                    </div>
                    <div>
                      <span className="text-xs uppercase text-slate-400">발동/리스크</span>
                      <p className="font-semibold text-slate-900">
                        {triggerConfig?.name ?? "미선택"} · {riskConfig?.label ?? "미선택"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs uppercase text-slate-400">대상/코스트</span>
                      <p className="font-semibold text-slate-900">
                        {target} · {cost}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4">
                  <h3 className="text-sm font-semibold text-slate-700">설명</h3>
                  <p className="mt-2 text-sm text-slate-600">{skillDesc}</p>
                </div>

                <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4">
                  <h3 className="text-sm font-semibold text-slate-700">JSON 미리보기</h3>
                  <pre className="mt-3 max-h-[360px] overflow-auto rounded-2xl bg-slate-900 px-4 py-3 text-xs text-slate-100">
                    {JSON.stringify(skillPreview, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-400"
                disabled={step === 1}
              >
                이전
              </button>
              <button
                type="button"
                onClick={() => {
                  if (canNext) {
                    setStep((prev) => Math.min(totalSteps, prev + 1));
                  }
                }}
                className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                  canNext
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "cursor-not-allowed bg-slate-300 text-slate-500"
                }`}
                aria-disabled={!canNext}
              >
                {nextLabel}
              </button>
            </div>
              {!canNext && errorMessage && <p className="mt-2 text-xs text-rose-500">{errorMessage}</p>}
            </div>

              {step >= 10 && (
                <div className="rounded-3xl border border-white/60 bg-white/80 p-6 text-left shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                  <h3 className="text-sm font-semibold text-slate-700">스킬 이름</h3>
                  <input
                    value={skillName}
                    onChange={(event) => setSkillName(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                    placeholder="예: 균열의 파동"
                  />
                </div>
              )}

              {step >= 11 && (
                <div className="rounded-3xl border border-white/60 bg-white/80 p-6 text-left shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                  <h3 className="text-sm font-semibold text-slate-700">스킬 설명</h3>
                  <textarea
                    value={skillDesc}
                    onChange={(event) => setSkillDesc(event.target.value)}
                    className="mt-3 h-28 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                    placeholder="스킬이 어떤 동작을 하는지 간단히 적어주세요."
                  />
                </div>
              )}

              {step >= 4 && (
                <div className="rounded-3xl border border-white/60 bg-white/80 p-6 text-left shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                  <h3 className="text-sm font-semibold text-slate-700">현재 스킬 목록 ({skillClass})</h3>
                  {skillsLoading && <p className="mt-2 text-xs text-slate-500">불러오는 중...</p>}
                  {skillsError && <p className="mt-2 text-xs text-rose-500">{skillsError}</p>}
                  {!skillsLoading && !skillsError && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {filteredClassSkills.length === 0 && (
                        <p className="text-xs text-slate-400">등록된 스킬이 없습니다.</p>
                      )}
                      {filteredClassSkills.map((skill) => (
                        <div key={skill.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{skill.type}</span>
                            {skill.element && <span>{skill.element}</span>}
                          </div>
                          <p className="mt-2 text-sm font-semibold text-slate-900">{skill.name}</p>
                          <p className="mt-2 text-xs text-slate-500">{skill.description}</p>
                          {skill.tags && <p className="mt-2 text-[11px] text-slate-400">#{skill.tags}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {step >= 4 && (
              <div className="sticky top-6 h-fit rounded-3xl border border-white/60 bg-white/80 p-5 text-left shadow-[0_20px_60px_rgba(15,23,42,0.08)] slide-in-right">
                <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Balance Snapshot
                </h3>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>가중치 기준</span>
                  <button
                    type="button"
                    onClick={() => fetchTargetWeights()}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:border-slate-400"
                    disabled={weightsLoading}
                  >
                    {weightsLoading ? "새로고침 중" : "새로고침"}
                  </button>
                </div>
                <div className="mt-3 grid gap-3 text-sm text-slate-600">
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <span className="text-xs uppercase text-slate-400">방향성 요약</span>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{directionText}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
                      {[typeTag, triggerTag, targetTag, riskTag].map((tag) => (
                        <span key={tag} className="rounded-full border border-slate-200 px-2 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-slate-400">{directionIcons}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <span className="text-xs uppercase text-slate-400">리스크</span>
                    <p className="mt-1 font-semibold text-slate-900">
                      {riskLabel} ({riskScore})
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {triggerConfig?.name ?? "발동 조건 미선택"} · {riskConfig?.label ?? "리스크 미선택"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <span className="text-xs uppercase text-slate-400">턴당 기대치</span>
                    <p className="mt-1 font-semibold text-slate-900">
                      {Number.isFinite(expectedPerTurn) ? expectedPerTurn.toFixed(2) : "0.00"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">효과 기대합 {totalEffectValue.toFixed(1)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        </div>
      </div>
    </div>
  );
}
