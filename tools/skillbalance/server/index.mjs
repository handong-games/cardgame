import express from "express";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "skillbalance.sqlite");

fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    element TEXT,
    tags TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS triggers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS target_weights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL UNIQUE,
    value REAL NOT NULL,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS regions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS region_scenarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    region_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    note TEXT,
    impact TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS region_monsters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    region_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    pattern TEXT NOT NULL,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS monster_scenarios (
    monster_id INTEGER NOT NULL,
    scenario_id INTEGER NOT NULL,
    PRIMARY KEY (monster_id, scenario_id),
    FOREIGN KEY (monster_id) REFERENCES region_monsters(id) ON DELETE CASCADE,
    FOREIGN KEY (scenario_id) REFERENCES region_scenarios(id) ON DELETE CASCADE
  );
`);

const count = db.prepare("SELECT COUNT(*) as count FROM skills").get();
if (count.count === 0) {
  const seed = [
    {
      class: "전사",
      name: "강철 베기",
      description: "단일 적에게 강한 베기 피해를 준다.",
      type: "공격",
      element: "대지",
      tags: "근접,출혈",
    },
    {
      class: "전사",
      name: "방패 돌진",
      description: "적을 밀쳐내며 방어막을 얻는다.",
      type: "방어",
      element: "빛",
      tags: "밀치기,방어",
    },
    {
      class: "전사",
      name: "전장의 함성",
      description: "아군의 공격력을 잠시 상승시킨다.",
      type: "지원",
      element: "바람",
      tags: "버프,광역",
    },
    {
      class: "마법사",
      name: "불꽃 구체",
      description: "폭발하는 화염구로 광역 피해를 준다.",
      type: "공격",
      element: "불",
      tags: "광역,화염",
    },
    {
      class: "마법사",
      name: "빙결 장막",
      description: "적의 공격을 둔화시키는 얼음 장막을 펼친다.",
      type: "방어",
      element: "물",
      tags: "감속,방어",
    },
    {
      class: "마법사",
      name: "마나 충전",
      description: "에너지를 회복하고 다음 주문을 강화한다.",
      type: "지원",
      element: "번개",
      tags: "에너지,강화",
    },
    {
      class: "도적",
      name: "암습",
      description: "그림자에서 적을 찌르고 추가 피해를 준다.",
      type: "공격",
      element: "어둠",
      tags: "치명,은신",
    },
    {
      class: "도적",
      name: "연막",
      description: "연막을 펼쳐 회피 확률을 높인다.",
      type: "방어",
      element: "바람",
      tags: "회피,은신",
    },
    {
      class: "도적",
      name: "독 칼날",
      description: "독을 묻혀 지속 피해를 입힌다.",
      type: "공격",
      element: "어둠",
      tags: "지속,중독",
    },
  ];

  const insert = db.prepare(
    "INSERT INTO skills (class, name, description, type, element, tags) VALUES (@class, @name, @description, @type, @element, @tags)",
  );
  const insertMany = db.transaction((items) => {
    for (const item of items) insert.run(item);
  });
  insertMany(seed);
}

const triggerCount = db.prepare("SELECT COUNT(*) as count FROM triggers").get();
if (triggerCount.count === 0) {
  const triggerSeed = [
    { name: "즉발", category: "즉발", description: "사용 직후 발동" },
    { name: "턴 시작", category: "턴", description: "턴 시작 시 발동" },
    { name: "턴 종료", category: "턴", description: "턴 종료 시 발동" },
    { name: "코인 던지기 전", category: "코인", description: "코인을 던지기 직전" },
    { name: "코인 던진 후", category: "코인", description: "코인 결과 확정 후" },
    { name: "피격 전", category: "피격", description: "피격 판정 직전" },
    { name: "피격 후", category: "피격", description: "피격 처리 직후" },
    { name: "연계 성공 시", category: "연계", description: "연계 조건 만족 시" },
  ];
  const insertTrigger = db.prepare(
    "INSERT INTO triggers (name, category, description) VALUES (@name, @category, @description)",
  );
  const insertTriggerMany = db.transaction((items) => {
    for (const item of items) insertTrigger.run(item);
  });
  insertTriggerMany(triggerSeed);
}

const weightCount = db.prepare("SELECT COUNT(*) as count FROM target_weights").get();
if (weightCount.count === 0) {
  const weightSeed = [
    { label: "적 - 단일 대상", value: 1.0, description: "단일 적 대상으로 표준 기대치" },
    { label: "적 - 전체 대상", value: 2.2, description: "광역 피해 기준" },
    { label: "아군 - 본인", value: 0.9, description: "자가 버프/회복 기준" },
    { label: "아군 - 단일 대상", value: 1.0, description: "단일 아군 지원 기준" },
    { label: "아군 - 전체 대상", value: 1.7, description: "전체 아군 지원 기준" },
  ];
  const insertWeight = db.prepare(
    "INSERT INTO target_weights (label, value, description) VALUES (@label, @value, @description)",
  );
  const insertWeightMany = db.transaction((items) => {
    for (const item of items) insertWeight.run(item);
  });
  insertWeightMany(weightSeed);
}

const regionCount = db.prepare("SELECT COUNT(*) as count FROM regions").get();
if (regionCount.count === 0) {
  const regionSeed = [
    {
      name: "잊혀진 숲",
      slug: "forgotten-forest",
      description:
        "상황(몬스터 역할)을 먼저 정의하고, 그 상황을 기준으로 몬스터와 스킬을 설계하는 지역.",
    },
  ];
  const insertRegion = db.prepare(
    "INSERT INTO regions (name, slug, description) VALUES (@name, @slug, @description)",
  );
  const insertRegionMany = db.transaction((items) => {
    for (const item of items) insertRegion.run(item);
  });
  insertRegionMany(regionSeed);
}

const scenarioCount = db.prepare("SELECT COUNT(*) as count FROM region_scenarios").get();
if (scenarioCount.count === 0) {
  const regionId = db
    .prepare("SELECT id FROM regions WHERE slug = ?")
    .get("forgotten-forest")?.id;
  if (regionId) {
    const scenarioSeed = [
      { title: "턴당 스킬 수 제한", note: "덩굴 얽힘", impact: "고코인 가치 상승" },
      { title: "지속 피해 압박", note: "포자 독성", impact: "방어/회복 가치 상승" },
      { title: "다타 페널티 / 단타 보상", note: "나뭇가지 방패", impact: "단타 가치 상승" },
      { title: "광역 압박", note: "포식자 출현", impact: "광역 가치 상승" },
      { title: "작은 딜 무효 / 고딜 보상", note: "고목의 껍질", impact: "고딜 가치 상승" },
      { title: "타이밍 제한", note: "숲의 울림", impact: "타이밍 스킬 가치 상승" },
      { title: "회복 저하", note: "이끼 흡수", impact: "방어/즉발 가치 상승" },
      { title: "피격 후 트리거 강화", note: "수풀 기습", impact: "반응형 트리거 가치 상승" },
      { title: "상태 지속 감소", note: "정령의 간섭", impact: "즉발 가치 상승" },
    ];
    const insertScenario = db.prepare(
      "INSERT INTO region_scenarios (region_id, title, note, impact) VALUES (?, ?, ?, ?)",
    );
    const insertScenarioMany = db.transaction((items) => {
      for (const item of items) {
        insertScenario.run(regionId, item.title, item.note, item.impact);
      }
    });
    insertScenarioMany(scenarioSeed);
  }
}

const app = express();
app.use(express.json());

app.get("/api/classes", (_req, res) => {
  const rows = db.prepare("SELECT DISTINCT class FROM skills ORDER BY class ASC").all();
  res.json(rows.map((row) => row.class));
});

app.get("/api/skills", (req, res) => {
  const className = req.query.class ? String(req.query.class) : null;
  if (className) {
    const rows = db
      .prepare(
        "SELECT id, class, name, description, type, element, tags FROM skills WHERE class = ? ORDER BY name ASC",
      )
      .all(className);
    res.json(rows);
    return;
  }
  const rows = db
    .prepare("SELECT id, class, name, description, type, element, tags FROM skills ORDER BY class, name")
    .all();
  res.json(rows);
});

app.post("/api/skills", (req, res) => {
  const { class: className, name, description, type, element, tags } = req.body ?? {};
  if (!className || !name || !description || !type) {
    res.status(400).json({ error: "class, name, description, type are required" });
    return;
  }
  const info = db
    .prepare(
      "INSERT INTO skills (class, name, description, type, element, tags) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .run(className, name, description, type, element ?? null, tags ?? null);
  res.json({ id: info.lastInsertRowid });
});

app.get("/api/triggers", (_req, res) => {
  const rows = db
    .prepare("SELECT id, name, category, description FROM triggers ORDER BY category, name")
    .all();
  res.json(rows);
});

app.post("/api/triggers", (req, res) => {
  const { name, category, description } = req.body ?? {};
  if (!name || !category) {
    res.status(400).json({ error: "name and category are required" });
    return;
  }
  const info = db
    .prepare("INSERT INTO triggers (name, category, description) VALUES (?, ?, ?)")
    .run(name, category, description ?? "");
  res.json({ id: info.lastInsertRowid });
});

app.delete("/api/triggers/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "invalid id" });
    return;
  }
  db.prepare("DELETE FROM triggers WHERE id = ?").run(id);
  res.json({ ok: true });
});

app.get("/api/target-weights", (_req, res) => {
  const rows = db
    .prepare("SELECT id, label, value, description FROM target_weights ORDER BY id ASC")
    .all();
  res.json(rows);
});

app.put("/api/target-weights/:id", (req, res) => {
  const id = Number(req.params.id);
  const { value, description } = req.body ?? {};
  if (!Number.isFinite(id) || typeof value !== "number") {
    res.status(400).json({ error: "invalid id or value" });
    return;
  }
  db.prepare("UPDATE target_weights SET value = ?, description = ? WHERE id = ?").run(
    value,
    description ?? "",
    id,
  );
  res.json({ ok: true });
});

app.get("/api/regions", (_req, res) => {
  const rows = db.prepare("SELECT id, name, slug, description FROM regions ORDER BY id ASC").all();
  res.json(rows);
});

app.get("/api/regions/:slug", (req, res) => {
  const slug = String(req.params.slug);
  const row = db
    .prepare("SELECT id, name, slug, description FROM regions WHERE slug = ?")
    .get(slug);
  if (!row) {
    res.status(404).json({ error: "region not found" });
    return;
  }
  res.json(row);
});

app.get("/api/regions/:slug/scenarios", (req, res) => {
  const slug = String(req.params.slug);
  const region = db
    .prepare("SELECT id FROM regions WHERE slug = ?")
    .get(slug);
  if (!region) {
    res.status(404).json({ error: "region not found" });
    return;
  }
  const rows = db
    .prepare(
      "SELECT id, title, note, impact FROM region_scenarios WHERE region_id = ? ORDER BY id ASC",
    )
    .all(region.id);
  res.json(rows);
});

app.post("/api/regions/:slug/scenarios", (req, res) => {
  const slug = String(req.params.slug);
  const { title, note, impact } = req.body ?? {};
  if (!title) {
    res.status(400).json({ error: "title is required" });
    return;
  }
  const region = db
    .prepare("SELECT id FROM regions WHERE slug = ?")
    .get(slug);
  if (!region) {
    res.status(404).json({ error: "region not found" });
    return;
  }
  const info = db
    .prepare(
      "INSERT INTO region_scenarios (region_id, title, note, impact) VALUES (?, ?, ?, ?)",
    )
    .run(region.id, title, note ?? null, impact ?? null);
  res.json({ id: info.lastInsertRowid });
});

app.put("/api/regions/:slug/scenarios/:id", (req, res) => {
  const slug = String(req.params.slug);
  const id = Number(req.params.id);
  const { title, note, impact } = req.body ?? {};
  if (!Number.isFinite(id) || !title) {
    res.status(400).json({ error: "invalid id or title" });
    return;
  }
  const region = db
    .prepare("SELECT id FROM regions WHERE slug = ?")
    .get(slug);
  if (!region) {
    res.status(404).json({ error: "region not found" });
    return;
  }
  db.prepare(
    "UPDATE region_scenarios SET title = ?, note = ?, impact = ? WHERE id = ? AND region_id = ?",
  ).run(title, note ?? null, impact ?? null, id, region.id);
  res.json({ ok: true });
});

app.delete("/api/regions/:slug/scenarios/:id", (req, res) => {
  const slug = String(req.params.slug);
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "invalid id" });
    return;
  }
  const region = db
    .prepare("SELECT id FROM regions WHERE slug = ?")
    .get(slug);
  if (!region) {
    res.status(404).json({ error: "region not found" });
    return;
  }
  db.prepare("DELETE FROM region_scenarios WHERE id = ? AND region_id = ?").run(
    id,
    region.id,
  );
  res.json({ ok: true });
});

app.get("/api/regions/:slug/monsters", (req, res) => {
  const slug = String(req.params.slug);
  const region = db
    .prepare("SELECT id FROM regions WHERE slug = ?")
    .get(slug);
  if (!region) {
    res.status(404).json({ error: "region not found" });
    return;
  }
  const monsters = db
    .prepare(
      "SELECT id, name, role, pattern, notes FROM region_monsters WHERE region_id = ? ORDER BY id ASC",
    )
    .all(region.id);
  const scenarioStmt = db.prepare(
    "SELECT scenario_id FROM monster_scenarios WHERE monster_id = ?",
  );
  const payload = monsters.map((monster) => ({
    ...monster,
    scenarioIds: scenarioStmt
      .all(monster.id)
      .map((row) => row.scenario_id),
  }));
  res.json(payload);
});

app.post("/api/regions/:slug/monsters", (req, res) => {
  const slug = String(req.params.slug);
  const { name, role, pattern, notes, scenarioIds } = req.body ?? {};
  if (!name || !role || !pattern) {
    res.status(400).json({ error: "name, role, pattern are required" });
    return;
  }
  const region = db
    .prepare("SELECT id FROM regions WHERE slug = ?")
    .get(slug);
  if (!region) {
    res.status(404).json({ error: "region not found" });
    return;
  }
  const insertMonster = db.prepare(
    "INSERT INTO region_monsters (region_id, name, role, pattern, notes) VALUES (?, ?, ?, ?, ?)",
  );
  const insertLink = db.prepare(
    "INSERT OR IGNORE INTO monster_scenarios (monster_id, scenario_id) VALUES (?, ?)",
  );
  const monsterId = db.transaction(() => {
    const info = insertMonster.run(
      region.id,
      name,
      role,
      pattern,
      notes ?? null,
    );
    const id = info.lastInsertRowid;
    if (Array.isArray(scenarioIds)) {
      scenarioIds.forEach((scenarioId) => {
        if (Number.isFinite(scenarioId)) {
          insertLink.run(id, Number(scenarioId));
        }
      });
    }
    return id;
  })();
  res.json({ id: monsterId });
});

app.put("/api/regions/:slug/monsters/:id", (req, res) => {
  const slug = String(req.params.slug);
  const id = Number(req.params.id);
  const { name, role, pattern, notes, scenarioIds } = req.body ?? {};
  if (!Number.isFinite(id) || !name || !role || !pattern) {
    res.status(400).json({ error: "invalid id or payload" });
    return;
  }
  const region = db
    .prepare("SELECT id FROM regions WHERE slug = ?")
    .get(slug);
  if (!region) {
    res.status(404).json({ error: "region not found" });
    return;
  }
  const update = db.prepare(
    "UPDATE region_monsters SET name = ?, role = ?, pattern = ?, notes = ? WHERE id = ? AND region_id = ?",
  );
  const clearLinks = db.prepare("DELETE FROM monster_scenarios WHERE monster_id = ?");
  const insertLink = db.prepare(
    "INSERT OR IGNORE INTO monster_scenarios (monster_id, scenario_id) VALUES (?, ?)",
  );
  db.transaction(() => {
    update.run(name, role, pattern, notes ?? null, id, region.id);
    clearLinks.run(id);
    if (Array.isArray(scenarioIds)) {
      scenarioIds.forEach((scenarioId) => {
        if (Number.isFinite(scenarioId)) {
          insertLink.run(id, Number(scenarioId));
        }
      });
    }
  })();
  res.json({ ok: true });
});

app.delete("/api/regions/:slug/monsters/:id", (req, res) => {
  const slug = String(req.params.slug);
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "invalid id" });
    return;
  }
  const region = db
    .prepare("SELECT id FROM regions WHERE slug = ?")
    .get(slug);
  if (!region) {
    res.status(404).json({ error: "region not found" });
    return;
  }
  db.prepare("DELETE FROM region_monsters WHERE id = ? AND region_id = ?").run(
    id,
    region.id,
  );
  res.json({ ok: true });
});

app.post("/api/ai/scenario", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "GEMINI_API_KEY not set" });
    return;
  }
  const {
    purpose,
    patternKeywords,
    choicePressure,
    counterDirection,
    riskReward,
    nameHint,
  } = req.body ?? {};
  const model = process.env.GEMINI_MODEL || "gemini-3-flash-preview";
  const prompt = `너는 게임 디자이너다. 아래 입력을 기반으로 상황 템플릿을 JSON으로 채워라.
필드: name, purpose, pattern_keywords(배열), choice_pressure, counter_skill_direction, risk_reward.
반드시 JSON만 출력해라. 다른 텍스트 금지.
입력:
- purpose: ${purpose ?? ""}
- pattern_keywords: ${patternKeywords ?? ""}
- choice_pressure: ${choicePressure ?? ""}
- counter_skill_direction: ${counterDirection ?? ""}
- risk_reward: ${riskReward ?? ""}
- name_hint: ${nameHint ?? ""}
`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { temperature: 0.6 },
    });
    const text = typeof response?.text === "string" ? response.text : "";
    const sanitized = text
      .replace(/```json\s*/gi, "")
      .replace(/```/g, "")
      .trim();
    try {
      const parsed = JSON.parse(sanitized);
      res.json({ ok: true, data: parsed });
    } catch {
      res.json({ ok: true, raw: text });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console
    console.error("gemini request error", message);
    res.status(500).json({ error: "gemini request error", details: message });
  }
});

app.post("/api/ai/scenario/keywords", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "GEMINI_API_KEY not set" });
    return;
  }
  const { purpose, gameSummary, skillTypes } = req.body ?? {};
  const model = process.env.GEMINI_MODEL || "gemini-3-flash-preview";
  const prompt = `너는 게임 디자이너다. 아래 목적/의도에 맞는 상황 패턴 키워드 5개를 추천해라.
반드시 JSON만 출력해라. 다른 텍스트 금지.
형식: {"keywords":["키워드1","키워드2","키워드3","키워드4","키워드5"]}
게임 요약: ${gameSummary ?? ""}
스킬 유형: ${skillTypes ?? ""}
목적/의도: ${purpose ?? ""}`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { temperature: 0.7 },
    });
    const text = typeof response?.text === "string" ? response.text : "";
    const sanitized = text
      .replace(/```json\s*/gi, "")
      .replace(/```/g, "")
      .trim();
    try {
      const parsed = JSON.parse(sanitized);
      res.json({ ok: true, data: parsed });
    } catch {
      res.json({ ok: true, raw: text });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console
    console.error("gemini request error", message);
    res.status(500).json({ error: "gemini request error", details: message });
  }
});

app.post("/api/ai/scenario/counter-direction", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "GEMINI_API_KEY not set" });
    return;
  }
  const { purpose, gameSummary, skillTypes, choicePressure, patternKeywords } = req.body ?? {};
  const model = process.env.GEMINI_MODEL || "gemini-3-flash-preview";
  const prompt = `너는 게임 디자이너다. 아래 입력을 바탕으로 대응 스킬 방향을 3가지 제안해라.
반드시 JSON만 출력해라. 다른 텍스트 금지.
형식: {"directions":["방향1","방향2","방향3"]}
게임 요약: ${gameSummary ?? ""}
스킬 유형: ${skillTypes ?? ""}
목적/의도: ${purpose ?? ""}
패턴 키워드: ${patternKeywords ?? ""}
선택 압박: ${choicePressure ?? ""}`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { temperature: 0.6 },
    });
    const text = typeof response?.text === "string" ? response.text : "";
    const sanitized = text
      .replace(/```json\s*/gi, "")
      .replace(/```/g, "")
      .trim();
    try {
      const parsed = JSON.parse(sanitized);
      res.json({ ok: true, data: parsed });
    } catch {
      res.json({ ok: true, raw: text });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console
    console.error("gemini request error", message);
    res.status(500).json({ error: "gemini request error", details: message });
  }
});

const port = process.env.PORT || 5178;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Skillbalance API listening on http://localhost:${port}`);
});
