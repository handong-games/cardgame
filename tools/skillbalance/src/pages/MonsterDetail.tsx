import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import type { Monster } from "../data/monsters";
import type { Skill } from "../data/skills";
import { computeScenarioDetails, simulate, type CoinScenario } from "../lib/sim";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
);

const sectionTitle = "text-sm uppercase tracking-[0.3em] text-slate-400";

interface MonsterDetailProps {
  monsters: Monster[];
  skills: Skill[];
  maxCoin: number;
}

export function MonsterDetail({ monsters, skills, maxCoin }: MonsterDetailProps) {
  const { id } = useParams();
  const monster = monsters.find((item) => item.id === id);
  const [coinScenario, setCoinScenario] = useState<CoinScenario>("max");
  const [preferenceWeight, setPreferenceWeight] = useState(1);

  const details = useMemo(() => {
    if (!monster) return null;
    return computeScenarioDetails(monster, skills, maxCoin);
  }, [monster, skills, maxCoin]);

  const integratedScenario = useMemo(() => {
    if (!monster) return null;
    const coinBudget = coinScenario === "max" ? maxCoin : 1;
    return simulate(
      monster,
      skills,
      coinBudget,
      coinScenario,
      20,
      preferenceWeight,
    );
  }, [monster, skills, maxCoin, coinScenario, preferenceWeight]);

  if (!monster || !details) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-400">몬스터를 찾을 수 없습니다.</p>
          <Link
            to="/"
            className="mt-4 inline-flex rounded-full border border-slate-600 px-4 py-2 text-sm text-slate-200"
          >
            돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const minScenario = details.minScenario;
  const maxScenario = details.maxScenario;

  const minChart = {
    labels: minScenario.turns.map((_, index) => `T${index}`),
    datasets: [
      {
        label: "몬스터 HP",
        data: minScenario.turns,
        borderColor: "rgba(94, 234, 212, 0.9)",
        backgroundColor: "rgba(94, 234, 212, 0.25)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "플레이어 HP",
        data: minScenario.playerTurns,
        borderColor: "rgba(125, 211, 252, 0.9)",
        backgroundColor: "rgba(125, 211, 252, 0.15)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const maxChart = {
    labels: maxScenario.turns.map((_, index) => `T${index}`),
    datasets: [
      {
        label: "몬스터 HP",
        data: maxScenario.turns,
        borderColor: "rgba(248, 113, 113, 0.9)",
        backgroundColor: "rgba(248, 113, 113, 0.25)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "플레이어 HP",
        data: maxScenario.playerTurns,
        borderColor: "rgba(125, 211, 252, 0.9)",
        backgroundColor: "rgba(125, 211, 252, 0.15)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const integratedChart = integratedScenario
    ? {
        labels: integratedScenario.turns.map((_, index) => `T${index}`),
        datasets: [
          {
            label: "몬스터 HP",
            data: integratedScenario.turns,
            borderColor: "rgba(248, 113, 113, 0.9)",
            backgroundColor: "rgba(248, 113, 113, 0.25)",
            tension: 0.3,
            fill: true,
          },
          {
            label: "플레이어 HP",
            data: integratedScenario.playerTurns,
            borderColor: "rgba(125, 211, 252, 0.9)",
            backgroundColor: "rgba(125, 211, 252, 0.15)",
            tension: 0.3,
            fill: true,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#e2e8f0" },
      },
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(148, 163, 184, 0.12)" },
      },
      y: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(148, 163, 184, 0.12)" },
      },
    },
  };

  const patternRows = monster.pattern.map((actions, index) => ({
    turn: index + 1,
    actions: actions.map((action) => {
      const stage = action.stage ?? 0;
      const hits = action.hits ?? 1;
      switch (action.type) {
        case "attack":
          return `공격 ${stage}${hits > 1 ? ` x${hits}` : ""}`;
        case "defend":
          return `방어 ${stage}`;
        case "heal":
          return `회복 ${stage}`;
        case "poison":
          return `중독 ${stage} (${action.duration ?? 0}턴)`;
        case "hallucination":
          return `환각 ${stage}`;
        case "bind":
          return `속박 ${stage}`;
        case "evade":
          return "회피";
        case "attackDebuff":
          return `공격력 ${stage}`;
        case "monsterBuff":
          return `공격력 +${stage} (${action.duration ?? 0}턴)`;
        case "skillCostUp":
          return `스킬 비용 +${stage} (${action.duration ?? 0}턴)`;
        case "reactiveShield":
          return `피격 시 방어 +${stage} (${action.duration ?? 0}턴)`;
        default:
          return action.type;
      }
    }),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <Link
            to="/"
            className="text-xs uppercase tracking-[0.4em] text-slate-400"
          >
            돌아가기
          </Link>
          <h1 className="mt-4 text-3xl font-semibold">{monster.name}</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">
            Pool {monster.pool}
          </p>
          <p className="mt-2 text-sm text-slate-300">
            코인 최대({maxCoin}) / 최소(1) 시나리오에 따른 킬 턴과 진행 흐름을
            비교한다.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            T0은 턴 시작 시점으로, 아무 행동도 하지 않은 상태다.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            플레이어 HP는 기본 50, 방어/회복 미적용 기준으로 계산된다.
          </p>
        </header>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <p className={sectionTitle}>MONSTER STATS</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-950/60 p-4">
              <p className="text-xs text-slate-400">HP</p>
              <p className="mt-2 text-2xl font-semibold">{monster.hp}</p>
            </div>
            <div className="rounded-2xl bg-slate-950/60 p-4">
              <p className="text-xs text-slate-400">피해감소 단계</p>
              <p className="mt-2 text-2xl font-semibold">
                {monster.damageReduceStage}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-950/60 p-4">
              <p className="text-xs text-slate-400">패턴 길이</p>
              <p className="mt-2 text-2xl font-semibold">
                {monster.pattern.length}턴
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-xs text-slate-400">턴별 행동</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              {patternRows.map((row) => (
                <li key={row.turn} className="flex flex-col gap-1 md:flex-row">
                  <span className="text-xs text-slate-400">T{row.turn}</span>
                  <span className="text-slate-200">
                    {row.actions.join(" / ") || "-"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <p className={sectionTitle}>MIN TURN (MAX COIN)</p>
            <p className="mt-3 text-sm text-slate-200">
              킬 턴: {minScenario.killTurn}턴
            </p>
            <p className="mt-2 text-xs text-slate-400">사용 조합</p>
            <p className="text-sm text-slate-100">{minScenario.comboSummary}</p>
            <div className="mt-4 rounded-2xl bg-slate-950/70 p-4">
              <Line data={minChart} options={chartOptions} />
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <p className={sectionTitle}>MAX TURN (MIN COIN)</p>
            <p className="mt-3 text-sm text-slate-200">
              킬 턴: {maxScenario.killTurn}턴
            </p>
            <p className="mt-2 text-xs text-slate-400">사용 조합</p>
            <p className="text-sm text-slate-100">{maxScenario.comboSummary}</p>
            <div className="mt-4 rounded-2xl bg-slate-950/70 p-4">
              <Line data={maxChart} options={chartOptions} />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <p className={sectionTitle}>INTEGRATED VIEW</p>
          <p className="mt-3 text-sm text-slate-300">
            코인 시나리오와 전략을 선택해 몬스터/플레이어 HP 변화를 한 번에 본다.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-slate-300">코인 시나리오</label>
              <select
                value={coinScenario}
                onChange={(event) =>
                  setCoinScenario(event.target.value as CoinScenario)
                }
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              >
                <option value="max">최대 코인</option>
                <option value="min">최소 코인</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-300">
                전략 가중치 ({preferenceWeight.toFixed(2)})
              </label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={preferenceWeight}
                onChange={(event) =>
                  setPreferenceWeight(Number(event.target.value))
                }
                className="mt-3 w-full"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>플레이어 피해 최소화</span>
                <span>몬스터 HP 빠르게 감소</span>
              </div>
            </div>
          </div>
          {integratedScenario && (
            <>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-200">
                <span>킬 턴: {integratedScenario.killTurn}턴</span>
                <span>사용 조합: {integratedScenario.comboSummary}</span>
              </div>
              <div className="mt-4 rounded-2xl bg-slate-950/70 p-4">
                <Line data={integratedChart ?? minChart} options={chartOptions} />
              </div>
            </>
          )}
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <p className={sectionTitle}>TURN LOG</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs text-slate-400">최소 턴 진행</p>
              <ul className="mt-3 space-y-3 text-sm text-slate-200">
                {minScenario.steps.map((step) => (
                  <li key={`min-${step.turn}`}>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>T{step.turn}</span>
                      <span>HP {step.hpAfter.toFixed(1)}</span>
                    </div>
                    <p className="mt-1 text-slate-300">
                      행동: {step.actions.join(" / ") || "-"}
                    </p>
                    <p className="mt-1 text-slate-200">
                      조합: {step.combo} · 피해 {step.damage}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs text-slate-400">최대 턴 진행</p>
              <ul className="mt-3 space-y-3 text-sm text-slate-200">
                {maxScenario.steps.map((step) => (
                  <li key={`max-${step.turn}`}>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>T{step.turn}</span>
                      <span>HP {step.hpAfter.toFixed(1)}</span>
                    </div>
                    <p className="mt-1 text-slate-300">
                      행동: {step.actions.join(" / ") || "-"}
                    </p>
                    <p className="mt-1 text-slate-200">
                      조합: {step.combo} · 피해 {step.damage}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
