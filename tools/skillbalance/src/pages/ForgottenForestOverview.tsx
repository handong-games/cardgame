import { useEffect, useState } from "react";

const sectionTitle = "text-sm uppercase tracking-[0.3em] text-slate-500";

interface RegionInfo {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export function ForgottenForestOverview() {
  const [region, setRegion] = useState<RegionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch("/api/regions/forgotten-forest")
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((data: RegionInfo) => {
        if (active) {
          setRegion(data);
          setError("");
        }
      })
      .catch(() => {
        if (active) setError("지역 정보를 불러오지 못했습니다.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff3d6,_#fdecef,_#e9f6ff)] px-6 py-10 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-2xl">
          <p className={sectionTitle}>FORGOTTEN FOREST</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-50">
            잊혀진 숲 · 개요
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            지역이 먼저 “상황(몬스터 역할)”을 정의하고, 그 상황을 기준으로 몬스터와
            스킬을 설계합니다.
          </p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6">
          <p className={sectionTitle}>REGION SUMMARY</p>
          {loading && <p className="mt-3 text-sm text-slate-500">불러오는 중...</p>}
          {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
          {!loading && !error && region && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white/60 p-5">
              <p className="text-lg font-semibold text-slate-900">{region.name}</p>
              <p className="mt-2 text-sm text-slate-600">{region.description}</p>
              <div className="mt-4 grid gap-3 text-xs text-slate-500 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white/60 p-3">
                  <p className="text-[10px] uppercase text-slate-500">Step 1</p>
                  <p className="mt-2 text-sm text-slate-700">상황 정의</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white/60 p-3">
                  <p className="text-[10px] uppercase text-slate-500">Step 2</p>
                  <p className="mt-2 text-sm text-slate-700">몬스터 설계</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white/60 p-3">
                  <p className="text-[10px] uppercase text-slate-500">Step 3</p>
                  <p className="mt-2 text-sm text-slate-700">스킬 설계</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}


