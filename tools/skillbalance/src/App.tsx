import { useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { monsters as baseMonsters } from "./data/monsters";
import type { Monster } from "./data/monsters";
import { baseSkills, extraSkills } from "./data/skills";
import type { Skill } from "./data/skills";
import { Dashboard } from "./pages/Dashboard";
import { MonsterDetail } from "./pages/MonsterDetail";

const defaultSkills = [...baseSkills, ...extraSkills];

const formatJson = (value: unknown) => JSON.stringify(value, null, 2);

function App() {
  const [maxCoin, setMaxCoin] = useState(3);
  const [skillCount, setSkillCount] = useState(4);
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);
  const [monsters, setMonsters] = useState<Monster[]>(baseMonsters);
  const [showEditor, setShowEditor] = useState(false);
  const [skillJson, setSkillJson] = useState(formatJson(defaultSkills));
  const [monsterJson, setMonsterJson] = useState(formatJson(baseMonsters));
  const [parseError, setParseError] = useState("");

  const activeSkills = useMemo(() => {
    if (skillCount <= 3) return baseSkills;
    if (skillCount === 4) return [...baseSkills, skills[3] ?? extraSkills[0]];
    return skills.slice(0, 5);
  }, [skillCount, skills]);

  const handleApplyJson = () => {
    try {
      const parsedSkills = JSON.parse(skillJson) as Skill[];
      const parsedMonsters = JSON.parse(monsterJson) as Monster[];
      if (!Array.isArray(parsedSkills) || !Array.isArray(parsedMonsters)) {
        throw new Error("invalid array");
      }
      setSkills(parsedSkills);
      setMonsters(parsedMonsters);
      setParseError("");
    } catch (error) {
      setParseError("JSON 파싱 실패: 배열 형식인지 확인해줘.");
    }
  };

  const handleReset = () => {
    setSkills(defaultSkills);
    setMonsters(baseMonsters);
    setSkillJson(formatJson(defaultSkills));
    setMonsterJson(formatJson(baseMonsters));
    setParseError("");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Dashboard
            maxCoin={maxCoin}
            skillCount={skillCount}
            activeSkills={activeSkills}
            monsters={monsters}
            showEditor={showEditor}
            skillJson={skillJson}
            monsterJson={monsterJson}
            parseError={parseError}
            onMaxCoinChange={setMaxCoin}
            onSkillCountChange={setSkillCount}
            onToggleEditor={() => setShowEditor((prev) => !prev)}
            onReset={handleReset}
            onSkillJsonChange={setSkillJson}
            onMonsterJsonChange={setMonsterJson}
            onApplyJson={handleApplyJson}
          />
        }
      />
      <Route
        path="/monster/:id"
        element={
          <MonsterDetail
            monsters={monsters}
            skills={activeSkills}
            maxCoin={maxCoin}
          />
        }
      />
    </Routes>
  );
}

export default App;
