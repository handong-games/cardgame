import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Link } from "react-router-dom";
import type { Monster } from "../data/monsters";
import type { Skill } from "../data/skills";
import { computeRange, computeRoundRange } from "../lib/sim";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const sectionTitle = "text-sm uppercase tracking-[0.3em] text-slate-500";

const roundOptions = [
  { round: 1, options: 2, pool: "A" },
  { round: 2, options: 2, pool: "A" },
  { round: 3, options: 3, pool: "A" },
  { round: 4, options: 2, pool: "B" },
  { round: 5, options: 3, pool: "B" },
  { round: 6, options: 2, pool: "B" },
  { round: 7, options: 1, pool: "Boss" },
];

interface DashboardProps {
  maxCoin: number;
  skillCount: number;
  activeSkills: Skill[];
  monsters: Monster[];
  showEditor: boolean;
  skillJson: string;
  monsterJson: string;
  parseError: string;
  onMaxCoinChange: (value: number) => void;
  onSkillCountChange: (value: number) => void;
  onToggleEditor: () => void;
  onReset: () => void;
  onSkillJsonChange: (value: string) => void;
  onMonsterJsonChange: (value: string) => void;
  onApplyJson: () => void;
}

export function Dashboard({
  maxCoin,
  skillCount,
  activeSkills,
  monsters,
  showEditor,
  skillJson,
  monsterJson,
  parseError,
  onMaxCoinChange,
  onSkillCountChange,
  onToggleEditor,
  onReset,
  onSkillJsonChange,
  onMonsterJsonChange,
  onApplyJson,
}: DashboardProps) {
  const ranges = useMemo(
    () =>
      monsters.map((monster) => ({
        monster,
        ...computeRange(monster, activeSkills, maxCoin),
      })),
    [monsters, activeSkills, maxCoin],
  );


  const roundRanges = useMemo(() => {
    return roundOptions.map((round) => {
      const poolRanges = ranges
        .filter((range) => range.monster.pool === round.pool)
        .map((range) => ({
          minTurn: range.minTurn,
          maxTurn: range.maxTurn,
        }));
      return {
        ...round,
        ...computeRoundRange(poolRanges, round.options),
      };
    });
  }, [ranges]);

  const chartData = useMemo(
    () => ({
      labels: ranges.map((range) => range.monster.name),
      datasets: [
        {
          label: "최소 턴",
          data: ranges.map((range) => range.minTurn),
          backgroundColor: "rgba(94, 234, 212, 0.7)",
        },
        {
          label: "최대 턴",
          data: ranges.map((range) => range.maxTurn),
          backgroundColor: "rgba(248, 113, 113, 0.7)",
        },
      ],
    }),
    [ranges],
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          position: "top" as const,
          labels: { color: "#e2e8f0" },
        },
      },
      scales: {
        x: {
          ticks: { color: "#94a3b8" },
          grid: { color: "rgba(148, 163, 184, 0.15)" },
        },
        y: {
          ticks: { color: "#94a3b8", stepSize: 1 },
          grid: { color: "rgba(148, 163, 184, 0.15)" },
        },
      },
    }),
    [],
  );

  const minTurn = Math.min(...ranges.map((range) => range.minTurn));
  const maxTurn = Math.max(...ranges.map((range) => range.maxTurn));
  const bestComboShare = useMemo(() => {
    const counts = new Map<string, number>();
    ranges.forEach((range) => {
      const combo = range.minCombo;
      if (!combo || combo === "조합 없음" || combo === "회피로 무효") return;
      const skills = combo.split(" + ");
      const unique = new Set(skills);
      unique.forEach((skill) => {
        counts.set(skill, (counts.get(skill) ?? 0) + 1);
      });
    });
    const total = ranges.length || 1;
    const items = [...counts.entries()]
      .map(([skill, count]) => ({
        skill,
        count,
        percent: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
    return { total, items };
  }, [ranges]);
  const overtuningGap = useMemo(() => {
    const skillSet = new Set<string>();
    ranges.forEach((range) => {
      const combo = range.minCombo;
      if (!combo || combo === "조합 없음" || combo === "회피로 무효") return;
      combo.split(" + ").forEach((skill) => skillSet.add(skill));
    });
    const skills = [...skillSet];
    const items = skills.map((skill) => {
      const included = ranges.filter(
        (range) => range.minCombo?.split(" + ").includes(skill),
      );
      const excluded = ranges.filter(
        (range) => !range.minCombo?.split(" + ").includes(skill),
      );
      const avgIncluded =
        included.length === 0
          ? 0
          : included.reduce((sum, range) => sum + range.minTurn, 0) /
            included.length;
      const avgExcluded =
        excluded.length === 0
          ? 0
          : excluded.reduce((sum, range) => sum + range.minTurn, 0) /
            excluded.length;
      const gap = Number((avgExcluded - avgIncluded).toFixed(2));
      return {
        skill,
        avgIncluded: Number(avgIncluded.toFixed(2)),
        avgExcluded: Number(avgExcluded.toFixed(2)),
        gap,
        countIncluded: included.length,
        countExcluded: excluded.length,
      };
    });
    return items.sort((a, b) => b.gap - a.gap);
  }, [ranges]);
  const comboDiversity = useMemo(() => {
    const counts = new Map<string, number>();
    ranges.forEach((range) => {
      const combo = range.minCombo;
      if (!combo || combo === "조합 없음" || combo === "회피로 무효") return;
      counts.set(combo, (counts.get(combo) ?? 0) + 1);
    });
    const total = ranges.length || 1;
    const items = [...counts.entries()]
      .map(([combo, count]) => ({
        combo,
        count,
        share: count / total,
      }))
      .sort((a, b) => b.count - a.count);
    const topShare = items[0]?.share ?? 0;
    const entropy =
      items.length === 0
        ? 0
        : items.reduce((sum, item) => {
            const p = item.share;
            return p > 0 ? sum - p * Math.log2(p) : sum;
          }, 0);
    return {
      total,
      uniqueCombos: items.length,
      topShare: Number((topShare * 100).toFixed(1)),
      entropy: Number(entropy.toFixed(2)),
      items,
    };
  }, [ranges]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff3d6,_#fdecef,_#e9f6ff)] px-6 py-10 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-2xl">
          <p className={sectionTitle}>SKILL BALANCE LENS</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-50">
            라운드별 최소/최대 턴 추정
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            코인 최대/최소 시나리오를 기준으로 스킬 조합별 킬 턴 범위를
            계산한다. 상태이상은 보정 계수로 반영되며, 현재는 공격/방어에 직접
            영향을 주는 효과 중심으로만 산출한다.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/80 p-4">
              <p className="text-xs uppercase text-slate-500">범위</p>
              <p className="mt-2 text-2xl font-semibold">
                {minTurn}~{maxTurn}턴
              </p>
              <p className="mt-1 text-xs text-slate-500">전체 몬스터 기준</p>
            </div>
            <div className="rounded-2xl bg-white/80 p-4">
              <p className="text-xs uppercase text-slate-500">스킬 수</p>
              <p className="mt-2 text-2xl font-semibold">
                {activeSkills.length}개
              </p>
              <p className="mt-1 text-xs text-slate-500">
                기본 3 + 추가 {Math.max(0, activeSkills.length - 3)}
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 p-4">
              <p className="text-xs uppercase text-slate-500">코인</p>
              <p className="mt-2 text-2xl font-semibold">
                {maxCoin} / 1
              </p>
              <p className="mt-1 text-xs text-slate-500">최대 / 최소</p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/80 p-6">
            <p className={sectionTitle}>CONTROL</p>
            <div>
              <label className="text-sm text-slate-600">코인 최대값</label>
              <input
                type="number"
                min={1}
                max={10}
                value={maxCoin}
                onChange={(event) =>
                  onMaxCoinChange(Number(event.target.value))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">스킬 개수</label>
              <select
                value={skillCount}
                onChange={(event) =>
                  onSkillCountChange(Number(event.target.value))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value={3}>3개 (기본 스킬)</option>
                <option value={4}>4개 (기본 3 + 추가 1)</option>
                <option value={5}>5개 (전체 사용)</option>
              </select>
            </div>
            <button
              className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300"
              onClick={onToggleEditor}
            >
              JSON 편집 {showEditor ? "닫기" : "열기"}
            </button>
            <button
              className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:border-slate-400"
              onClick={onReset}
            >
              기본값 복원
            </button>
            <p className="text-xs text-slate-500">
              조건부 스킬은 코인 최대 시나리오에서만 자동 활성화로 계산됨.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6">
            <p className={sectionTitle}>TURN RANGE</p>
            <div className="mt-4 rounded-2xl bg-white/80 p-4">
              <Bar options={chartOptions} data={chartData} />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {ranges.map((range) => (
                <Link
                  key={range.monster.id}
                  to={`/monster/${range.monster.id}`}
                  className="rounded-2xl border border-slate-200 bg-white/80 p-4 transition hover:-translate-y-1 hover:border-emerald-400/60"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {range.monster.name}
                    </h3>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs text-slate-600">
                    {range.monster.pool} · {range.minTurn}~{range.maxTurn}턴
                  </span>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">최소 턴 조합</p>
                  <p className="text-sm text-slate-700">{range.minCombo}</p>
                  <p className="mt-3 text-xs text-slate-500">최대 턴 조합</p>
                  <p className="text-sm text-slate-700">{range.maxCombo}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6">
          <p className={sectionTitle}>BEST COMBO SHARE</p>
          <p className="mt-3 text-sm text-slate-600">
            몬스터별 최소 턴 콤보에 포함된 스킬의 등장 비율을 표시한다.
          </p>
          <div className="mt-4 grid gap-3">
            {bestComboShare.items.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-500">
                표시할 데이터가 없음 (콤보가 비어 있음).
              </div>
            )}
            {bestComboShare.items.map((item) => (
              <div
                key={item.skill}
                className="rounded-2xl border border-slate-200 bg-white/80 p-4"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-900">{item.skill}</span>
                  <span className="text-slate-500">
                    {item.count}/{bestComboShare.total} · {item.percent}%
                  </span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-amber-50">
                  <div
                    className="h-2 rounded-full bg-emerald-400"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6">
          <p className={sectionTitle}>OVERTUNING GAP</p>
          <p className="mt-3 text-sm text-slate-600">
            특정 스킬이 최소 턴 콤보에 포함될 때와 제외될 때의 평균 최소 턴 차이.
          </p>
          <div className="mt-4 grid gap-3">
            {overtuningGap.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-500">
                표시할 데이터가 없음 (콤보가 비어 있음).
              </div>
            )}
            {overtuningGap.map((item) => (
              <div
                key={item.skill}
                className="rounded-2xl border border-slate-200 bg-white/80 p-4"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-900">{item.skill}</span>
                  <span className="text-slate-500">
                    갭 {item.gap}턴
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  포함 {item.avgIncluded}턴 ({item.countIncluded}) · 제외{" "}
                  {item.avgExcluded}턴 ({item.countExcluded})
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6">
          <p className={sectionTitle}>COMBO DIVERSITY</p>
          <p className="mt-3 text-sm text-slate-600">
            최소 턴 콤보의 분산 정도를 확인한다. 상위 1개 점유율이 높을수록 고정
            패턴 위험이 크다.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
              <p className="text-xs uppercase text-slate-500">유니크 콤보</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {comboDiversity.uniqueCombos}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
              <p className="text-xs uppercase text-slate-500">상위 1개 점유율</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {comboDiversity.topShare}%
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
              <p className="text-xs uppercase text-slate-500">Entropy</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {comboDiversity.entropy}
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            {comboDiversity.items.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-500">
                표시할 데이터가 없음 (콤보가 비어 있음).
              </div>
            )}
            {comboDiversity.items.slice(0, 6).map((item) => (
              <div
                key={item.combo}
                className="rounded-2xl border border-slate-200 bg-white/80 p-4"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-900">
                    {item.combo}
                  </span>
                  <span className="text-slate-500">
                    {item.count}/{comboDiversity.total} ·{" "}
                    {Math.round(item.share * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6">
          <p className={sectionTitle}>ROUND RANGE</p>
          <p className="mt-3 text-sm text-slate-600">
            라운드별로 주어진 선택지 수를 기준으로, 등장 가능한 몬스터 조합 중
            가장 빠른 킬 턴(최소)과 가장 느린 킬 턴(최대)을 표시한다.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roundRanges.map((round) => (
              <div
                key={round.round}
                className="rounded-2xl border border-slate-200 bg-white/80 p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    라운드 {round.round}
                  </h3>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs text-slate-600">
                    풀 {round.pool} · 선택지 {round.options}개
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-700">
                  {round.roundMin}~{round.roundMax}턴
                </p>
              </div>
            ))}
          </div>
        </section>

        {showEditor && (
          <section className="rounded-3xl border border-slate-200 bg-white/80 p-6">
            <p className={sectionTitle}>DATA INPUT</p>
            <div className="mt-4 grid gap-6 lg:grid-cols-2">
              <div>
                <p className="text-sm text-slate-600">스킬 JSON</p>
                <textarea
                  className="mt-2 h-72 w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700"
                  value={skillJson}
                  onChange={(event) => onSkillJsonChange(event.target.value)}
                />
              </div>
              <div>
                <p className="text-sm text-slate-600">몬스터 JSON</p>
                <textarea
                  className="mt-2 h-72 w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700"
                  value={monsterJson}
                  onChange={(event) => onMonsterJsonChange(event.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900"
                onClick={onApplyJson}
              >
                적용
              </button>
              {parseError && (
                <span className="text-sm text-rose-300">{parseError}</span>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}


