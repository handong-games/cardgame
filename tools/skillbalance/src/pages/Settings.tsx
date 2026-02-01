export function Settings() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff3d6,_#fdecef,_#e9f6ff)] px-6 py-10 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">SETTINGS</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">설정</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            게임 메타 정보, AI 프롬프트 기본값, 화면 기본 설정을 관리합니다.
          </p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6">
          <p className="text-sm font-semibold text-slate-700">설정 준비 중</p>
          <p className="mt-2 text-xs text-slate-500">
            이후 단계에서 전투 구조 요약, 스킬 유형 설명, AI 프롬프트 기본값을
            편집할 수 있도록 확장할 예정입니다.
          </p>
        </section>
      </div>
    </div>
  );
}
