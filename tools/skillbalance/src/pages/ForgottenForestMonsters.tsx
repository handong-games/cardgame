import { useEffect, useState, type FormEvent } from "react";

const sectionTitle = "text-sm uppercase tracking-[0.3em] text-slate-500";

interface ScenarioItem {
  id: number;
  title: string;
  note: string | null;
  impact: string | null;
}

interface MonsterItem {
  id: number;
  name: string;
  role: string;
  pattern: string;
  notes: string | null;
  scenarioIds: number[];
}

const defaultPattern = `[
  [{ "type": "attack", "stage": 2 }]
]`;

export function ForgottenForestMonsters() {
  const [scenarios, setScenarios] = useState<ScenarioItem[]>([]);
  const [monsters, setMonsters] = useState<MonsterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [pattern, setPattern] = useState(defaultPattern);
  const [notes, setNotes] = useState("");
  const [selectedScenarioIds, setSelectedScenarioIds] = useState<number[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editPattern, setEditPattern] = useState(defaultPattern);
  const [editNotes, setEditNotes] = useState("");
  const [editScenarioIds, setEditScenarioIds] = useState<number[]>([]);

  const fetchAll = () =>
    Promise.all([
      fetch("/api/regions/forgotten-forest/scenarios")
        .then((res) => {
          if (!res.ok) throw new Error("failed");
          return res.json();
        })
        .then((data: ScenarioItem[]) => setScenarios(data)),
      fetch("/api/regions/forgotten-forest/monsters")
        .then((res) => {
          if (!res.ok) throw new Error("failed");
          return res.json();
        })
        .then((data: MonsterItem[]) => setMonsters(data)),
    ]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchAll()
      .then(() => {
        if (active) setError("");
      })
      .catch(() => {
        if (active) setError("몬스터 목록을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !role.trim() || !pattern.trim()) return;
    fetch("/api/regions/forgotten-forest/monsters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        role: role.trim(),
        pattern: pattern.trim(),
        notes: notes.trim() || null,
        scenarioIds: selectedScenarioIds,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then(() => fetchAll())
      .then(() => {
        setName("");
        setRole("");
        setPattern(defaultPattern);
        setNotes("");
        setSelectedScenarioIds([]);
      })
      .catch(() => setError("몬스터 저장에 실패했습니다."));
  };

  const handleEditStart = (item: MonsterItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditRole(item.role);
    setEditPattern(item.pattern);
    setEditNotes(item.notes ?? "");
    setEditScenarioIds(item.scenarioIds ?? []);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditName("");
    setEditRole("");
    setEditPattern(defaultPattern);
    setEditNotes("");
    setEditScenarioIds([]);
  };

  const handleEditSave = () => {
    if (editingId === null || !editName.trim() || !editRole.trim() || !editPattern.trim()) return;
    fetch(`/api/regions/forgotten-forest/monsters/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName.trim(),
        role: editRole.trim(),
        pattern: editPattern.trim(),
        notes: editNotes.trim() || null,
        scenarioIds: editScenarioIds,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then(() => fetchAll())
      .then(() => handleEditCancel())
      .catch(() => setError("몬스터 수정에 실패했습니다."));
  };

  const handleDelete = (id: number) => {
    fetch(`/api/regions/forgotten-forest/monsters/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then(() => fetchAll())
      .catch(() => setError("몬스터 삭제에 실패했습니다."));
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff3d6,_#fdecef,_#e9f6ff)] px-6 py-10 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-2xl">
          <p className={sectionTitle}>FORGOTTEN FOREST</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-50">
            잊혀진 숲 · 몬스터 설계
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            선택한 상황에 맞춰 몬스터 패턴을 설계하고, 상황과 몬스터를 연결합니다.
          </p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6">
          <p className={sectionTitle}>NEW MONSTER</p>
          <form className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]" onSubmit={handleCreate}>
            <div className="space-y-3">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="몬스터 이름"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              />
              <input
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder="역할 (예: 상황 압박, 딜 체크)"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              />
              <textarea
                value={pattern}
                onChange={(event) => setPattern(event.target.value)}
                placeholder="패턴 JSON"
                className="h-36 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none"
              />
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="메모"
                className="h-20 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none"
              />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">연결할 상황</p>
              <div className="grid gap-2 md:grid-cols-2">
                {scenarios.map((item) => {
                  const active = selectedScenarioIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setSelectedScenarioIds((prev) =>
                          prev.includes(item.id)
                            ? prev.filter((value) => value !== item.id)
                            : [...prev, item.id],
                        )
                      }
                      className={`rounded-xl border px-3 py-2 text-left text-xs transition ${
                        active
                          ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-200"
                          : "border-slate-200 bg-white/60 text-slate-600 hover:border-slate-200"
                      }`}
                    >
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 text-[10px] text-slate-500">{item.note ?? ""}</p>
                    </button>
                  );
                })}
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-300"
              >
                몬스터 추가
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6">
          <p className={sectionTitle}>MONSTER LIST</p>
          {loading && <p className="mt-3 text-sm text-slate-500">불러오는 중...</p>}
          {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
          {!loading && !error && (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {monsters.map((monster) => {
                const scenarioLabels = scenarios.filter((item) =>
                  monster.scenarioIds.includes(item.id),
                );
                return (
                  <div
                    key={monster.id}
                    className="rounded-2xl border border-slate-200 bg-white/60 p-4"
                  >
                    {editingId === monster.id ? (
                      <div className="space-y-3">
                        <input
                          value={editName}
                          onChange={(event) => setEditName(event.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                        />
                        <input
                          value={editRole}
                          onChange={(event) => setEditRole(event.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                        />
                        <textarea
                          value={editPattern}
                          onChange={(event) => setEditPattern(event.target.value)}
                          className="h-28 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900"
                        />
                        <textarea
                          value={editNotes}
                          onChange={(event) => setEditNotes(event.target.value)}
                          className="h-16 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900"
                        />
                        <div className="grid gap-2 md:grid-cols-2">
                          {scenarios.map((item) => {
                            const active = editScenarioIds.includes(item.id);
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() =>
                                  setEditScenarioIds((prev) =>
                                    prev.includes(item.id)
                                      ? prev.filter((value) => value !== item.id)
                                      : [...prev, item.id],
                                  )
                                }
                                className={`rounded-xl border px-3 py-2 text-left text-xs transition ${
                                  active
                                    ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-200"
                                    : "border-slate-200 bg-white/60 text-slate-600 hover:border-slate-200"
                                }`}
                              >
                                <p className="font-semibold">{item.title}</p>
                                <p className="mt-1 text-[10px] text-slate-500">
                                  {item.note ?? ""}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleEditSave}
                            className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-semibold text-slate-900"
                          >
                            저장
                          </button>
                          <button
                            type="button"
                            onClick={handleEditCancel}
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-slate-900">
                          {monster.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          역할: {monster.role}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                          {monster.notes ?? "메모 없음"}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500">
                          {scenarioLabels.length === 0 && <span>연결된 상황 없음</span>}
                          {scenarioLabels.map((item) => (
                            <span
                              key={item.id}
                              className="rounded-full border border-slate-200 px-2 py-1"
                            >
                              {item.title}
                            </span>
                          ))}
                        </div>
                        <details className="mt-3 text-xs text-slate-500">
                          <summary className="cursor-pointer">패턴 보기</summary>
                          <pre className="mt-2 max-h-40 overflow-auto rounded-xl bg-slate-900 p-3 text-[11px] text-slate-100">
                            {monster.pattern}
                          </pre>
                        </details>
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditStart(monster)}
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:border-slate-500"
                          >
                            수정
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(monster.id)}
                            className="rounded-full border border-rose-400/40 px-3 py-1 text-xs text-rose-300 hover:border-rose-300"
                          >
                            삭제
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}


