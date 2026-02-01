import { useEffect, useMemo, useState } from "react";

type TriggerCategory = "즉발" | "턴" | "코인" | "피격" | "연계" | "기타";

interface TriggerItem {
  id: number;
  name: string;
  category: TriggerCategory;
  description: string;
}

export function TriggerManager() {
  const [triggers, setTriggers] = useState<TriggerItem[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<TriggerCategory>("즉발");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetch("/api/triggers")
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((data: TriggerItem[]) => {
        if (active) setTriggers(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setError("트리거 목록을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<TriggerCategory, TriggerItem[]>();
    triggers.forEach((trigger) => {
      const list = map.get(trigger.category) ?? [];
      list.push(trigger);
      map.set(trigger.category, list);
    });
    return map;
  }, [triggers]);

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setLoading(true);
    setError("");
    fetch("/api/triggers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: trimmed,
        category,
        description: description.trim(),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((payload: { id: number }) => {
        setTriggers((prev) => [
          ...prev,
          { id: payload.id, name: trimmed, category, description: description.trim() },
        ]);
        setName("");
        setDescription("");
      })
      .catch(() => setError("트리거를 추가하지 못했습니다."))
      .finally(() => setLoading(false));
  };

  const handleRemove = (id: number) => {
    setLoading(true);
    setError("");
    fetch(`/api/triggers/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        setTriggers((prev) => prev.filter((item) => item.id !== id));
      })
      .catch(() => setError("트리거를 삭제하지 못했습니다."))
      .finally(() => setLoading(false));
  };

  return (
    <div className="skill-ui min-h-screen bg-[radial-gradient(circle_at_top,_#fff3d6,_#fdecef,_#e9f6ff)] px-6 py-10 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Trigger Library</p>
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">트리거 목록 관리</h1>
          <p className="mt-2 text-sm text-slate-600">
            스킬의 발동 조건을 관리합니다. 카테고리를 분류하고 필요한 트리거를 추가하세요.
          </p>
        </header>

        <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">새 트리거</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4">
              <label className="text-xs uppercase text-slate-500">이름</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                placeholder="예: 코인 앞면 2개 이상"
              />
              <label className="mt-4 block text-xs uppercase text-slate-500">설명</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="mt-2 h-20 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                placeholder="언제 발동하는지 간단히 기록"
              />
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4">
              <label className="text-xs uppercase text-slate-500">카테고리</label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as TriggerCategory)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              >
                {["즉발", "턴", "코인", "피격", "연계", "기타"].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAdd}
                className="mt-6 w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                disabled={loading}
              >
                트리거 추가
              </button>
            </div>
          </div>
          {error && <p className="mt-3 text-xs text-rose-500">{error}</p>}
        </section>

        <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">카테고리별 목록</h2>
          {loading && <p className="mt-3 text-xs text-slate-500">불러오는 중...</p>}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {Array.from(grouped.entries()).map(([group, items]) => (
              <div key={group} className="rounded-2xl border border-slate-200/70 bg-white/90 p-4">
                <h3 className="text-sm font-semibold text-slate-900">{group}</h3>
                <div className="mt-3 space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="rounded-xl border border-slate-200 bg-white px-3 py-3">
                      <div className="flex items-center justify-between text-sm text-slate-700">
                        <span className="font-semibold">{item.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          className="text-xs text-rose-500 hover:text-rose-600"
                        >
                          삭제
                        </button>
                      </div>
                      {item.description && (
                        <p className="mt-2 text-xs text-slate-500">{item.description}</p>
                      )}
                    </div>
                  ))}
                  {items.length === 0 && <p className="text-xs text-slate-500">등록된 항목이 없습니다.</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

