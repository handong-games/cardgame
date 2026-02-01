import { useEffect, useState } from "react";

export function ForgottenForestScenarios() {
  const gameSummary =
    "턴제 / 코인 던지기로 행동 포인트 획득 / 행동 포인트 최대 3";
  const skillTypes = "공격=피해 중심, 방어=보호/저지, 지원=버프/회복";
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [patternKeywords, setPatternKeywords] = useState<string[]>([]);
  const [choicePressure, setChoicePressure] = useState("");
  const [counterDirection, setCounterDirection] = useState("");
  const [riskReward, setRiskReward] = useState("");
  const [nameHint, setNameHint] = useState("");
  const [committedPurpose, setCommittedPurpose] = useState("");
  const [committedKeywords, setCommittedKeywords] = useState<string[]>([]);
  const [committedPressure, setCommittedPressure] = useState("");
  const [committedCounter, setCommittedCounter] = useState("");
  const [committedRiskReward, setCommittedRiskReward] = useState("");
  const [committedNameHint, setCommittedNameHint] = useState("");
  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);
  const [keywordLoading, setKeywordLoading] = useState(false);
  const [keywordError, setKeywordError] = useState("");
  const [loadingDots, setLoadingDots] = useState("");
  const [counterLoadingDots, setCounterLoadingDots] = useState("");
  const [counterSuggestions, setCounterSuggestions] = useState<string[]>([]);
  const [counterLoading, setCounterLoading] = useState(false);
  const [counterError, setCounterError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiParsed, setAiParsed] = useState<Record<string, unknown> | null>(null);
  const [aiSaveLoading, setAiSaveLoading] = useState(false);
  const [aiSaveError, setAiSaveError] = useState("");
  const [aiSaveSuccess, setAiSaveSuccess] = useState(false);
  const [summaryReady, setSummaryReady] = useState(false);
  const canNext = purpose.trim().length > 0;
  const canNextStep2 = patternKeywords.length > 0;
  const canNextStep3 = choicePressure.trim().length > 0;
  const canNextStep4 = counterDirection.trim().length > 0;
  const canNextStep5 = riskReward.trim().length > 0;
  const canNextStep6 = nameHint.trim().length > 0;
  const showSummary = step >= 2;

  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim();
    if (!trimmed || patternKeywords.includes(trimmed)) return;
    setPatternKeywords((prev) => [...prev, trimmed]);
    setKeywordInput("");
  };

  const requestKeywordSuggestions = () => {
    const purposeText = committedPurpose || purpose.trim();
    if (!purposeText) {
      setKeywordError("목적/의도를 먼저 입력해 주세요.");
      return;
    }
    setKeywordLoading(true);
    setKeywordError("");
    setKeywordSuggestions([]);
    fetch("/api/ai/scenario/keywords", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        purpose: purposeText,
        gameSummary,
        skillTypes,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((data) => {
        const keywordsFromData = Array.isArray(data?.data?.keywords) ? data.data.keywords : [];
        if (keywordsFromData.length > 0) {
          setKeywordSuggestions(keywordsFromData.filter((item) => typeof item === "string"));
          return;
        }
        if (typeof data?.raw === "string") {
          try {
            const parsed = JSON.parse(data.raw);
            if (Array.isArray(parsed?.keywords)) {
              setKeywordSuggestions(parsed.keywords.filter((item) => typeof item === "string"));
              return;
            }
          } catch {
            // fall through to heuristic parse
          }
          const normalized = data.raw
            .replace(/```json\s*/gi, "")
            .replace(/```/g, "")
            .replace(/[\[\]"]/g, "")
            .split(/[,|\n|·|-]/)
            .map((item) => item.trim())
            .filter(Boolean);
          setKeywordSuggestions(normalized.slice(0, 8));
          return;
        }
        setKeywordError("키워드 추천에 실패했습니다.");
      })
      .catch(() => setKeywordError("키워드 추천에 실패했습니다."))
      .finally(() => setKeywordLoading(false));
  };

  const requestCounterSuggestions = () => {
    const purposeText = committedPurpose || purpose.trim();
    const pressureText = committedPressure || choicePressure.trim();
    const keywordsText = committedKeywords.length > 0 ? committedKeywords.join(", ") : "";
    if (!purposeText || !pressureText) {
      setCounterError("목적/의도와 선택 압박을 먼저 입력해 주세요.");
      return;
    }
    setCounterLoading(true);
    setCounterError("");
    setCounterSuggestions([]);
    fetch("/api/ai/scenario/counter-direction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        purpose: purposeText,
        gameSummary,
        skillTypes,
        choicePressure: pressureText,
        patternKeywords: keywordsText,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((data) => {
        const directionsFromData = Array.isArray(data?.data?.directions) ? data.data.directions : [];
        if (directionsFromData.length > 0) {
          setCounterSuggestions(directionsFromData.filter((item) => typeof item === "string"));
          return;
        }
        if (typeof data?.raw === "string") {
          try {
            const parsed = JSON.parse(data.raw);
            if (Array.isArray(parsed?.directions)) {
              setCounterSuggestions(parsed.directions.filter((item) => typeof item === "string"));
              return;
            }
          } catch {
            // fall through to heuristic parse
          }
          const normalized = data.raw
            .replace(/```json\s*/gi, "")
            .replace(/```/g, "")
            .replace(/[\[\]"]/g, "")
            .split(/[,|\n|·|-]/)
            .map((item) => item.trim())
            .filter(Boolean);
          setCounterSuggestions(normalized.slice(0, 5));
          return;
        }
        setCounterError("대응 방향 추천에 실패했습니다.");
      })
      .catch(() => setCounterError("대응 방향 추천에 실패했습니다."))
      .finally(() => setCounterLoading(false));
  };

  const handleNext = () => {
    if (step === 1 && canNext) {
      setCommittedPurpose(purpose.trim());
      setStep(2);
      return;
    }
    if (step === 2 && canNextStep2) {
      setCommittedKeywords(patternKeywords);
      setStep(3);
      return;
    }
    if (step === 3 && canNextStep3) {
      setCommittedPressure(choicePressure.trim());
      setStep(4);
      return;
    }
    if (step === 4 && canNextStep4) {
      setCommittedCounter(counterDirection.trim());
      setStep(5);
      return;
    }
    if (step === 5 && canNextStep5) {
      setCommittedRiskReward(riskReward.trim());
      setStep(6);
      return;
    }
    if (step === 6 && canNextStep6) {
      const finalPayload = {
        purpose: committedPurpose || purpose.trim(),
        patternKeywords: committedKeywords.length > 0 ? committedKeywords.join(", ") : "",
        choicePressure: committedPressure || choicePressure.trim(),
        counterDirection: committedCounter || counterDirection.trim(),
        riskReward: committedRiskReward || riskReward.trim(),
        nameHint: nameHint.trim(),
      };
      setCommittedNameHint(nameHint.trim());
      setAiLoading(true);
      setAiError("");
      setAiResult("");
      setAiParsed(null);
      setAiSaveError("");
      setAiSaveSuccess(false);
      fetch("/api/ai/scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      })
        .then((res) => {
          if (!res.ok) throw new Error("failed");
          return res.json();
        })
        .then((data) => {
          if (data?.data) {
            setAiParsed(data.data);
            setAiResult(JSON.stringify(data.data, null, 2));
            return;
          }
          if (typeof data?.raw === "string") {
            setAiResult(data.raw);
            try {
              const parsed = JSON.parse(
                data.raw.replace(/```json\s*/gi, "").replace(/```/g, "").trim(),
              );
              if (parsed && typeof parsed === "object") {
                setAiParsed(parsed as Record<string, unknown>);
              }
            } catch {
              // ignore parse error for raw text
            }
            return;
          }
          setAiResult("AI 응답이 비어 있습니다.");
        })
        .catch(() => {
          setAiError("AI 생성에 실패했습니다.");
        })
        .finally(() => setAiLoading(false));
    }
  };

  const handleSaveScenario = () => {
    if (!aiParsed) return;
    const title =
      typeof aiParsed.name === "string" && aiParsed.name.trim()
        ? aiParsed.name.trim()
        : "AI 생성 상황";
    const noteParts = [
      typeof aiParsed.purpose === "string" ? `목적: ${aiParsed.purpose}` : null,
      Array.isArray(aiParsed.pattern_keywords)
        ? `키워드: ${aiParsed.pattern_keywords.join(", ")}`
        : null,
      typeof aiParsed.choice_pressure === "string"
        ? `선택 압박: ${aiParsed.choice_pressure}`
        : null,
      typeof aiParsed.counter_skill_direction === "string"
        ? `대응 방향: ${aiParsed.counter_skill_direction}`
        : null,
    ].filter(Boolean);
    const note = noteParts.length > 0 ? noteParts.join(" / ") : null;
    const impact =
      typeof aiParsed.risk_reward === "string" && aiParsed.risk_reward.trim()
        ? aiParsed.risk_reward.trim()
        : null;

    setAiSaveLoading(true);
    setAiSaveError("");
    setAiSaveSuccess(false);
    fetch("/api/regions/forgotten-forest/scenarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, note, impact }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then(() => {
        setAiSaveSuccess(true);
      })
      .catch(() => {
        setAiSaveError("상황 저장에 실패했습니다.");
      })
      .finally(() => setAiSaveLoading(false));
  };

  useEffect(() => {
    if (showSummary) {
      const id = requestAnimationFrame(() => setSummaryReady(true));
      return () => cancelAnimationFrame(id);
    }
    setSummaryReady(false);
    return undefined;
  }, [showSummary]);

  useEffect(() => {
    if (!keywordLoading) {
      setLoadingDots("");
      return undefined;
    }
    const interval = setInterval(() => {
      setLoadingDots((prev) => (prev.length >= 3 ? "" : `${prev}.`));
    }, 400);
    return () => clearInterval(interval);
  }, [keywordLoading]);

  useEffect(() => {
    if (!counterLoading) {
      setCounterLoadingDots("");
      return undefined;
    }
    const interval = setInterval(() => {
      setCounterLoadingDots((prev) => (prev.length >= 3 ? "" : `${prev}.`));
    }, 400);
    return () => clearInterval(interval);
  }, [counterLoading]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff3d6,_#fdecef,_#e9f6ff)] text-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(248,113,113,0.18),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.18),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(251,191,36,0.16),transparent_50%)]" />
        <div className="relative mx-auto max-w-3xl px-4 pb-12 pt-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Scenario Studio
            <span className="text-lg">✦</span>
          </span>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            잊혀진 숲 · 상황 설계
          </h1>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            ChatGPT처럼 대화를 따라가며 지역 상황을 단계적으로 만들어 나갑니다.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs">
            {["대화형 입력", "상황 구조화", "결과 정리"].map((item) => (
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

      <div className={`mx-auto w-full px-4 pb-16 ${showSummary ? "max-w-6xl" : "max-w-2xl"}`}>
        <div
          className={`grid gap-6 transition-all duration-500 ${
            showSummary ? "lg:grid-cols-[minmax(0,1fr)_320px]" : ""
          }`}
        >
          <section
            className={`rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition-all duration-500 ${
              showSummary ? "lg:-translate-x-2" : ""
            }`}
          >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold uppercase tracking-[0.2em]">
              Step {step} / 6
            </span>
            <span>잊혀진 숲 · 대화형 설계</span>
          </div>

          {step === 1 && (
            <div className="mt-5 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">
                이 상황이 왜 등장하나요?
              </h2>
              <p className="text-sm text-slate-600">
                플레이어에게 어떤 선택을 강요하거나 어떤 감정을 만들고 싶은지 적어주세요.
              </p>
              <textarea
                value={purpose}
                onChange={(event) => setPurpose(event.target.value)}
                placeholder="예: 지속 피해를 통해 방어 스킬의 가치를 강조하고 싶다."
                className="h-28 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleNext}
                  className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                    canNext
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "cursor-not-allowed bg-slate-200 text-slate-500"
                  }`}
                  aria-disabled={!canNext}
                >
                  다음
                </button>
              </div>
              {!canNext && (
                <p className="text-xs text-rose-500">
                  목적/의도를 한 줄이라도 입력해 주세요.
                </p>
              )}
            </div>
          )}

            {step === 2 && (
              <div className="mt-5 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">
                핵심 패턴 키워드를 정리해요
              </h2>
              <p className="text-sm text-slate-600">
                상황의 구조를 만드는 키워드를 1~3개 정도 적어주세요.
              </p>
              <div className="flex flex-wrap gap-2">
                {patternKeywords.map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() =>
                      setPatternKeywords((prev) => prev.filter((item) => item !== keyword))
                    }
                    className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
                  >
                    {keyword} ✕
                  </button>
                ))}
                {patternKeywords.length === 0 && (
                  <span className="text-xs text-slate-400">아직 키워드가 없어요.</span>
                )}
              </div>
                <div className="flex flex-wrap gap-2">
                  <input
                  value={keywordInput}
                  onChange={(event) => setKeywordInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddKeyword();
                    }
                  }}
                  placeholder="예: 지속 피해, 시간 제한, 선택 압박"
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                />
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-400"
                  >
                    키워드 추가
                  </button>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500">AI 추천 키워드</p>
                  </div>
                  <button
                    type="button"
                    onClick={requestKeywordSuggestions}
                    className="mt-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-500 hover:border-slate-400"
                    disabled={keywordLoading}
                  >
                    {keywordLoading ? "AI 추천 생성 중" : "AI 추천 생성하기"}
                  </button>
                  {keywordLoading && (
                    <p className="mt-2 text-xs text-slate-400">불러오는 중{loadingDots}</p>
                  )}
                  {keywordError && <p className="mt-2 text-xs text-rose-500">{keywordError}</p>}
                  {!keywordLoading && !keywordError && keywordSuggestions.length === 0 && (
                    <p className="mt-2 text-xs text-slate-400">추천 키워드가 없습니다.</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {keywordSuggestions.map((keyword) => (
                      <button
                        key={keyword}
                        type="button"
                        onClick={() => {
                          if (!patternKeywords.includes(keyword)) {
                            setPatternKeywords((prev) => [...prev, keyword]);
                          }
                        }}
                        className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 hover:border-emerald-300"
                      >
                        + {keyword}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-400"
                >
                  이전
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                    canNextStep2
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "cursor-not-allowed bg-slate-200 text-slate-500"
                  }`}
                  aria-disabled={!canNextStep2}
                >
                  다음
                </button>
              </div>
              {!canNextStep2 && (
                <p className="text-xs text-rose-500">
                  최소 1개의 키워드를 추가해 주세요.
                </p>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="mt-5 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">
                플레이어에게 어떤 선택 압박을 주나요?
              </h2>
              <p className="text-sm text-slate-600">
                제한, 시간 압박, 자원 소모 등 선택의 긴장을 구체적으로 적어주세요.
              </p>
              <textarea
                value={choicePressure}
                onChange={(event) => setChoicePressure(event.target.value)}
                placeholder="예: 매 턴 선택해야 하는 스킬 수가 줄어들어 핵심 스킬만 남게 된다."
                className="h-28 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              />
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-400"
                >
                  이전
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                    canNextStep3
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "cursor-not-allowed bg-slate-200 text-slate-500"
                  }`}
                  aria-disabled={!canNextStep3}
                >
                  다음
                </button>
              </div>
              {!canNextStep3 && (
                <p className="text-xs text-rose-500">
                  선택 압박을 한 줄이라도 입력해 주세요.
                </p>
              )}
            </div>
          )}

            {step === 4 && (
              <div className="mt-5 space-y-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  어떤 대응 스킬 방향을 유도하나요?
              </h2>
              <p className="text-sm text-slate-600">
                방어/회복/폭딜/지속딜 등 플레이어가 선택해야 할 대응을 적어주세요.
              </p>
                <textarea
                  value={counterDirection}
                  onChange={(event) => setCounterDirection(event.target.value)}
                  placeholder="예: 방어 스킬로 피해를 흡수하거나, 빠르게 마무리하는 폭딜 스킬을 선택해야 한다."
                  className="h-28 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                />
                <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500">AI 추천 대응 방향</p>
                  </div>
                  <button
                    type="button"
                    onClick={requestCounterSuggestions}
                    className="mt-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-500 hover:border-slate-400"
                    disabled={counterLoading}
                  >
                    {counterLoading ? "AI 추천 생성 중" : "AI 추천 생성하기"}
                  </button>
                  {counterLoading && (
                    <p className="mt-2 text-xs text-slate-400">
                      불러오는 중{counterLoadingDots}
                    </p>
                  )}
                  {counterError && <p className="mt-2 text-xs text-rose-500">{counterError}</p>}
                  {!counterLoading && !counterError && counterSuggestions.length === 0 && (
                    <p className="mt-2 text-xs text-slate-400">추천이 없습니다.</p>
                  )}
                  <div className="mt-3 grid gap-2">
                    {counterSuggestions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setCounterDirection(item)}
                        className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-left text-xs font-semibold text-amber-700 hover:border-amber-300"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                  onClick={() => setStep(3)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-400"
                >
                  이전
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                    canNextStep4
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "cursor-not-allowed bg-slate-200 text-slate-500"
                  }`}
                  aria-disabled={!canNextStep4}
                >
                  다음
                </button>
              </div>
              {!canNextStep4 && (
                <p className="text-xs text-rose-500">
                  대응 스킬 방향을 한 줄이라도 입력해 주세요.
                </p>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="mt-5 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">
                어떤 리스크와 리워드를 제시하나요?
              </h2>
              <p className="text-sm text-slate-600">
                손해와 보상의 교환을 명확히 적어주세요.
              </p>
              <textarea
                value={riskReward}
                onChange={(event) => setRiskReward(event.target.value)}
                placeholder="예: 고딜 스킬은 버프를 받지만, 실패 시 큰 패널티가 따른다."
                className="h-28 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              />
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-400"
                >
                  이전
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                    canNextStep5
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "cursor-not-allowed bg-slate-200 text-slate-500"
                  }`}
                  aria-disabled={!canNextStep5}
                >
                  다음
                </button>
              </div>
              {!canNextStep5 && (
                <p className="text-xs text-rose-500">
                  리스크/리워드를 한 줄이라도 입력해 주세요.
                </p>
              )}
            </div>
          )}

          {step === 6 && (
            <div className="mt-5 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">
                상황 이름 힌트를 정리해요
              </h2>
              <p className="text-sm text-slate-600">
                분위기나 핵심 이미지를 떠올릴 수 있는 이름 힌트를 적어주세요.
              </p>
              <input
                value={nameHint}
                onChange={(event) => setNameHint(event.target.value)}
                placeholder="예: 덩굴의 고집, 약해진 치유"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              />
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-400"
                >
                  이전
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                    canNextStep6
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "cursor-not-allowed bg-slate-200 text-slate-500"
                  }`}
                  aria-disabled={!canNextStep6 || aiLoading}
                  disabled={!canNextStep6 || aiLoading}
                >
                  {aiLoading ? "생성 중..." : "완료"}
                </button>
              </div>
              {!canNextStep6 && (
                <p className="text-xs text-rose-500">
                  이름 힌트를 한 줄이라도 입력해 주세요.
                </p>
              )}
              {aiError && <p className="text-xs text-rose-500">{aiError}</p>}
              {aiResult && (
                <pre className="mt-2 max-h-72 overflow-auto rounded-2xl border border-slate-200 bg-white/80 p-3 text-xs text-slate-700">
                  {aiResult}
                </pre>
              )}
              {aiParsed && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveScenario}
                    className="rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-emerald-300"
                    disabled={aiSaveLoading}
                  >
                    {aiSaveLoading ? "저장 중..." : "상황 추가"}
                  </button>
                  {aiSaveError && <span className="text-xs text-rose-500">{aiSaveError}</span>}
                  {aiSaveSuccess && (
                    <span className="text-xs text-emerald-600">상황이 추가되었습니다.</span>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {showSummary && (
          <aside
            className={`sticky top-6 h-fit rounded-3xl border border-white/60 bg-white/80 p-5 text-left shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition-all duration-500 ${
              summaryReady ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
            }`}
          >
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Scenario Snapshot
            </h3>
            <div className="mt-3 grid gap-3 text-sm text-slate-600">
              {!committedPurpose &&
                committedKeywords.length === 0 &&
                !committedPressure &&
                !committedCounter &&
                !committedRiskReward &&
                !committedNameHint && (
                  <p className="rounded-2xl border border-dashed border-slate-200 bg-white/60 px-4 py-3 text-xs text-slate-400">
                    아직 입력된 항목이 없습니다.
                  </p>
                )}
              {committedPurpose && (
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <span className="text-xs uppercase text-slate-400">목적/의도</span>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{committedPurpose}</p>
                </div>
              )}
              {committedKeywords.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <span className="text-xs uppercase text-slate-400">패턴 키워드</span>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
                    {committedKeywords.map((keyword) => (
                      <span key={keyword} className="rounded-full border border-slate-200 px-2 py-1">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {committedPressure && (
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <span className="text-xs uppercase text-slate-400">선택 압박</span>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{committedPressure}</p>
                </div>
              )}
              {committedCounter && (
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <span className="text-xs uppercase text-slate-400">대응 방향</span>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{committedCounter}</p>
                </div>
              )}
              {committedRiskReward && (
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <span className="text-xs uppercase text-slate-400">리스크/리워드</span>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{committedRiskReward}</p>
                </div>
              )}
              {committedNameHint && (
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <span className="text-xs uppercase text-slate-400">이름 힌트</span>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{committedNameHint}</p>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
      </div>
    </div>
  );
}


