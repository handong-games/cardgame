import { useMemo, useState, useEffect } from "react";

interface WeightItem {
  id: number;
  label: string;
  value: number;
  description: string;
}

export function TargetWeights() {
  const [weights, setWeights] = useState<WeightItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const average = useMemo(() => {
    if (weights.length === 0) return 0;
    return weights.reduce((sum, item) => sum + item.value, 0) / weights.length;
  }, [weights]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetch("/api/target-weights")
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((data: WeightItem[]) => {
        if (active) setWeights(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setError("가중치 목록을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleChange = (id: number, value: number) => {
    setWeights((prev) => prev.map((item) => (item.id === id ? { ...item, value } : item)));
    fetch(`/api/target-weights/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    }).catch(() => {
      setError("가중치 저장에 실패했습니다.");
    });
  };

  return (
    <div className="skill-ui min-h-screen bg-[radial-gradient(circle_at_top,_#fff3d6,_#fdecef,_#e9f6ff)] px-6 py-10 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Target Weights</p>
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">대상 가중치 테이블</h1>
          <p className="mt-2 text-sm text-slate-600">
            대상 범위에 따라 기대치 계산에 곱해지는 가중치를 관리합니다.
          </p>
        </header>

        <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">가중치 목록</h2>
            <span className="text-xs text-slate-500">평균 {average.toFixed(2)}</span>
          </div>
          {loading && <p className="mt-3 text-xs text-slate-500">불러오는 중...</p>}
          {error && <p className="mt-3 text-xs text-rose-500">{error}</p>}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {weights.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200/70 bg-white/90 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">{item.label}</h3>
                  <span className="text-xs text-slate-500">{item.value.toFixed(2)}</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">{item.description}</p>
                <input
                  type="range"
                  min={0.5}
                  max={3}
                  step={0.1}
                  value={item.value}
                  onChange={(event) => handleChange(item.id, Number(event.target.value))}
                  className="mt-4 w-full accent-amber-500"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

