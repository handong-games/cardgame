import { useMemo, useState } from "react";
import type { Monster } from "../data/monsters";
import type { Skill } from "../data/skills";

const sectionTitle = "text-sm uppercase tracking-[0.3em] text-slate-500";

interface MonsterSynergyProps {
  monsters: Monster[];
  activeSkills: Skill[];
}

export function MonsterSynergy({ monsters, activeSkills }: MonsterSynergyProps) {
  const [selectedMonsterId, setSelectedMonsterId] = useState(
    monsters[0]?.id ?? "",
  );

  const selectedMonster = useMemo(
    () => monsters.find((monster) => monster.id === selectedMonsterId),
    [monsters, selectedMonsterId],
  );

  const skillLimitScore = useMemo(() => {
    if (!selectedMonster) return 0;
    return selectedMonster.pattern.reduce((sum, actions) => {
      return (
        sum +
        actions.reduce((inner, action) => {
          if (action.type !== "bind") return inner;
          return inner + Math.max(1, action.stage ?? 1);
        }, 0)
      );
    }, 0);
  }, [selectedMonster]);

  const skillValueShifts = useMemo(() => {
    const score = skillLimitScore;
    return activeSkills.map((skill) => {
      let trend: "up" | "down" | "flat" = "flat";
      if (score <= 0) {
        trend = skill.cost >= 2 ? "down" : "up";
      } else if (score >= 3) {
        trend = skill.cost >= 2 ? "up" : skill.cost === 0 ? "down" : "flat";
      } else {
        trend = skill.cost >= 2 ? "up" : skill.cost === 0 ? "down" : "flat";
      }
      return {
        skill,
        trend,
      };
    });
  }, [activeSkills, skillLimitScore]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff3d6,_#fdecef,_#e9f6ff)] px-6 py-10 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-2xl">
          <p className={sectionTitle}>MONSTER MATCHUP</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-50">
            몬스터별 스킬 가치 변동
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            몬스터 패턴이 만들어내는 환경에 따라 스킬 가치가 어떻게 움직이는지
            빠르게 확인한다. (스킬 수 제한 압박 기반)
          </p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6">
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="rounded-2xl border border-slate-200 bg-white/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                MONSTER
              </p>
              <label className="mt-3 block text-sm text-slate-600">
                기준 몬스터 선택
              </label>
              <select
                value={selectedMonsterId}
                onChange={(event) => setSelectedMonsterId(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
              >
                {monsters.map((monster) => (
                  <option key={monster.id} value={monster.id}>
                    {monster.name}
                  </option>
                ))}
              </select>
              <div className="mt-4 rounded-xl border border-slate-200 bg-white/80 p-3">
                <p className="text-xs uppercase text-slate-500">스킬 제한 압박</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {skillLimitScore}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  구속(bind) 패턴을 기반으로 산출됨
                </p>
              </div>
              {selectedMonster && (
                <div className="mt-4 rounded-xl border border-slate-200 bg-white/80 p-3 text-xs text-slate-500">
                  <div className="flex items-center justify-between">
                    <span>풀</span>
                    <span className="text-slate-700">{selectedMonster.pool}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>HP</span>
                    <span className="text-slate-700">{selectedMonster.hp}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {skillValueShifts.map(({ skill, trend }) => {
                const badge =
                  trend === "up"
                    ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                    : trend === "down"
                      ? "border-rose-400/40 bg-rose-400/10 text-rose-200"
                      : "border-slate-200/60 bg-amber-50/60 text-slate-700";
                const label =
                  trend === "up" ? "상승" : trend === "down" ? "하락" : "보합";
                return (
                  <div
                    key={skill.name}
                    className="rounded-2xl border border-slate-200 bg-white/60 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {skill.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          코인 {skill.cost} · {skill.role}
                        </p>
                      </div>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs ${badge}`}
                      >
                        {label}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                      스킬 제한 압박이 높을수록 고코인 스킬 가치가 상승한다.
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


