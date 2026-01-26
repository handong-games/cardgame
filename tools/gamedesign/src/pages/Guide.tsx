import { useState } from 'react'

type TabType = 'skills' | 'prompt' | 'workflow'

export default function Guide() {
  const [activeTab, setActiveTab] = useState<TabType>('skills')

  const tabs = [
    { id: 'skills' as TabType, label: '스킬 사용 가이드', icon: '🎨' },
    { id: 'prompt' as TabType, label: '프롬프트 가이드', icon: '✨' },
    { id: 'workflow' as TabType, label: '워크플로우', icon: '🔄' },
  ]

  return (
    <div className="space-y-6">
      {/* 탭 네비게이션 */}
      <div className="flex gap-2 border-b border-slate-700 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'skills' && <SkillsGuide />}
      {activeTab === 'prompt' && <PromptGuide />}
      {activeTab === 'workflow' && <WorkflowGuide />}
    </div>
  )
}

function SkillsGuide() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-emerald-400 mb-4">이미지 생성 스킬 사용 가이드</h2>
        <p className="text-slate-300 mb-6">
          Claude Code에서 슬래시 명령어를 사용하여 게임 에셋 이미지를 생성할 수 있습니다.
          각 스킬은 특정 유형의 이미지를 생성하도록 최적화되어 있습니다.
        </p>
      </section>

      {/* 캐릭터 생성 */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-emerald-400 mb-4">
          🎭 /gen-character - 캐릭터 카드 생성
        </h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-slate-200 mb-2">기본 사용법</h4>
            <pre className="bg-slate-900 p-4 rounded-lg text-sm text-slate-300 overflow-x-auto">
{`/gen-character [클래스]

예시:
/gen-character warrior
/gen-character paladin
/gen-character mage`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium text-slate-200 mb-2">옵션</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-900 p-3 rounded-lg">
                <code className="text-emerald-400">--expression</code>
                <p className="text-slate-400 mt-1">표정 지정 (brave, gentle, happy)</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg">
                <code className="text-emerald-400">--pose</code>
                <p className="text-slate-400 mt-1">포즈 지정 (standing, waving, fighting)</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg">
                <code className="text-emerald-400">--hair</code>
                <p className="text-slate-400 mt-1">머리색 지정 (blonde, brown, black)</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg">
                <code className="text-emerald-400">--weapon</code>
                <p className="text-slate-400 mt-1">무기 변경 (sword, axe, mace)</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-900/30 border border-amber-700/50 p-4 rounded-lg">
            <p className="text-amber-200 text-sm">
              <strong>방향 규칙:</strong> 캐릭터는 항상 우측 대각선 방향을 향하도록 생성됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* 몬스터 생성 */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-red-400 mb-4">
          👹 /gen-monster - 몬스터 카드 생성 (악당 스타일)
        </h3>

        <div className="space-y-4">
          <div className="bg-red-900/20 border border-red-700/50 p-3 rounded-lg mb-4">
            <p className="text-red-200 text-sm">
              <strong>스타일:</strong> 몬스터는 캐릭터와 달리 <strong>악당/적대적 스타일</strong>로 생성됩니다.
              빛나는 눈, 날카로운 이빨, 위협적 표정이 특징입니다.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-slate-200 mb-2">기본 사용법</h4>
            <pre className="bg-slate-900 p-4 rounded-lg text-sm text-slate-300 overflow-x-auto">
{`/gen-monster [몬스터명] [옵션]

예시:
/gen-monster goblin
/gen-monster slime --region forest --tier 1
/gen-monster dragon --region castle --tier 3`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium text-slate-200 mb-2">옵션</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-900 p-3 rounded-lg">
                <code className="text-red-400">--region</code>
                <p className="text-slate-400 mt-1">지역 (forest, dungeon, castle)</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg">
                <code className="text-red-400">--tier</code>
                <p className="text-slate-400 mt-1">티어 (1: 일반, 2: 정예, 3: 보스)</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg">
                <code className="text-red-400">--expression</code>
                <p className="text-slate-400 mt-1">표정 (feral, cunning, dominating)</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg">
                <code className="text-red-400">--color</code>
                <p className="text-slate-400 mt-1">주색 (dark-green, blood-red, purple)</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-slate-200 mb-2">티어별 표현</h4>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="bg-yellow-900/20 p-3 rounded-lg border border-yellow-700/30">
                <span className="text-yellow-400 font-medium">Tier 1</span>
                <p className="text-slate-400 text-xs mt-1">야생적, 악의적 (feral, malicious)</p>
              </div>
              <div className="bg-orange-900/20 p-3 rounded-lg border border-orange-700/30">
                <span className="text-orange-400 font-medium">Tier 2</span>
                <p className="text-slate-400 text-xs mt-1">교활하고 계산적 (cunning)</p>
              </div>
              <div className="bg-red-900/20 p-3 rounded-lg border border-red-700/30">
                <span className="text-red-400 font-medium">Tier 3</span>
                <p className="text-slate-400 text-xs mt-1">압도적, 지배적 (dominating)</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-900/30 border border-amber-700/50 p-4 rounded-lg">
            <p className="text-amber-200 text-sm">
              <strong>방향 규칙:</strong> 몬스터는 항상 <strong>좌측 대각선 ↖</strong> 방향을 향하도록 생성됩니다.
              (캐릭터와 마주보는 구도)
            </p>
          </div>
        </div>
      </section>

      {/* 배경 생성 */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-emerald-400 mb-4">
          🏞️ /gen-background - 배경 이미지 생성
        </h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-slate-200 mb-2">기본 사용법</h4>
            <pre className="bg-slate-900 p-4 rounded-lg text-sm text-slate-300 overflow-x-auto">
{`/gen-background [장면] [옵션]

예시:
/gen-background forest-battle
/gen-background dungeon-entrance --time night
/gen-background castle-throne --mood dramatic`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium text-slate-200 mb-2">옵션</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-900 p-3 rounded-lg">
                <code className="text-emerald-400">--time</code>
                <p className="text-slate-400 mt-1">시간대 (day, sunset, night)</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg">
                <code className="text-emerald-400">--mood</code>
                <p className="text-slate-400 mt-1">분위기 (peaceful, tense, dramatic)</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg">
                <code className="text-emerald-400">--weather</code>
                <p className="text-slate-400 mt-1">날씨 (clear, foggy, rainy)</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg">
                <code className="text-emerald-400">--elements</code>
                <p className="text-slate-400 mt-1">추가 요소 지정</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function PromptGuide() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-emerald-400 mb-4">프롬프트 작성 마스터 가이드</h2>
        <p className="text-slate-300 mb-6">
          일관성 있고 퀄리티 높은 게임 에셋 이미지를 생성하기 위한 완벽한 프롬프트 작성 가이드입니다.
          레이어 시스템, 스타일 차이, 핵심 키워드를 숙지하면 전문가 수준의 이미지를 생성할 수 있습니다.
        </p>
      </section>

      {/* 캐릭터 vs 몬스터 스타일 차이 */}
      <section className="bg-gradient-to-r from-emerald-900/20 to-red-900/20 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-4">⚔️ 캐릭터 vs 몬스터 스타일 차이</h3>
        <p className="text-slate-300 text-sm mb-4">
          캐릭터와 몬스터는 완전히 다른 스타일로 디자인됩니다. 이 차이를 명확히 이해해야 일관된 결과물을 얻을 수 있습니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-900/30 p-5 rounded-lg border border-emerald-600/50">
            <h4 className="font-bold text-emerald-400 mb-3 text-lg">🦸 캐릭터 (귀여운 SD 스타일)</h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-emerald-300 font-medium">분위기:</span>
                <span className="text-slate-300 ml-2">따뜻한 동화 (warm cozy fairy tale)</span>
              </div>
              <div>
                <span className="text-emerald-300 font-medium">비율:</span>
                <span className="text-slate-300 ml-2">SD 비율 2-2.5등신 (big head small body)</span>
              </div>
              <div>
                <span className="text-emerald-300 font-medium">표정:</span>
                <span className="text-slate-300 ml-2">친근하고 귀여움 (adorable friendly)</span>
              </div>
              <div>
                <span className="text-emerald-300 font-medium">눈:</span>
                <span className="text-slate-300 ml-2">크고 둥근 눈 (large expressive round eyes)</span>
              </div>
              <div>
                <span className="text-emerald-300 font-medium">볼:</span>
                <span className="text-slate-300 ml-2">양 볼에 홍조 필수 (rosy blushing cheeks)</span>
              </div>
              <div>
                <span className="text-emerald-300 font-medium">방향:</span>
                <span className="text-slate-300 ml-2">우측 대각선 ↗</span>
              </div>
            </div>
          </div>

          <div className="bg-red-900/30 p-5 rounded-lg border border-red-600/50">
            <h4 className="font-bold text-red-400 mb-3 text-lg">👹 몬스터 (악당 스타일)</h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-red-300 font-medium">분위기:</span>
                <span className="text-slate-300 ml-2">어두운 동화 (dark fairytale)</span>
              </div>
              <div>
                <span className="text-red-300 font-medium">비율:</span>
                <span className="text-slate-300 ml-2">위협적 비율 (exaggerated threatening)</span>
              </div>
              <div>
                <span className="text-red-300 font-medium">표정:</span>
                <span className="text-slate-300 ml-2">적대적 악당 (villainous antagonistic)</span>
              </div>
              <div>
                <span className="text-red-300 font-medium">눈:</span>
                <span className="text-slate-300 ml-2">빛나는 날카로운 눈 (glowing piercing eyes)</span>
              </div>
              <div>
                <span className="text-red-300 font-medium">이빨:</span>
                <span className="text-slate-300 ml-2">날카로운 이빨 노출 (sharp teeth fangs visible)</span>
              </div>
              <div>
                <span className="text-red-300 font-medium">방향:</span>
                <span className="text-slate-300 ml-2">좌측 대각선 ↖</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 레이어 시스템 */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-emerald-400 mb-4">📚 5레이어 프롬프트 시스템</h3>

        <div className="space-y-4">
          <p className="text-slate-300 text-sm">
            프롬프트는 5개 레이어로 구성됩니다. 각 레이어를 순서대로 조합하면 일관된 결과물을 얻을 수 있습니다.
          </p>

          <div className="space-y-3">
            <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-emerald-500">
              <h4 className="font-medium text-emerald-400">Layer 1: 마스터 스타일 베이스 (필수)</h4>
              <p className="text-slate-400 text-sm mt-1">전체적인 아트 스타일, 분위기, 카드 형태 정의</p>
              <pre className="text-xs text-slate-500 bg-slate-950 p-3 rounded mt-2 overflow-x-auto">
{`hand-drawn storybook illustration style,
pencil sketch with watercolor coloring,
vintage aged parchment card border,
rounded rectangle card shape,
worn torn vintage paper corners,
textured beige paper background`}
              </pre>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-medium text-blue-400">Layer 2: 에셋 타입별 속성 (필수)</h4>
              <p className="text-slate-400 text-sm mt-1">캐릭터/몬스터에 따라 완전히 다른 레이어 적용</p>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <pre className="text-xs text-emerald-400 bg-slate-950 p-2 rounded overflow-x-auto">
{`[캐릭터]
cute SD proportions,
rosy blushing cheeks,
adorable expression,
facing right diagonal`}
                </pre>
                <pre className="text-xs text-red-400 bg-slate-950 p-2 rounded overflow-x-auto">
{`[몬스터]
threatening proportions,
glowing piercing eyes,
villainous expression,
facing left diagonal`}
                </pre>
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-medium text-purple-400">Layer 3: 티어/클래스 수정자</h4>
              <p className="text-slate-400 text-sm mt-1">등급이나 클래스에 따른 세부 조정</p>
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                <div className="bg-slate-950 p-2 rounded">
                  <span className="text-yellow-400">Tier 1</span>
                  <p className="text-slate-500">simple, small, basic</p>
                </div>
                <div className="bg-slate-950 p-2 rounded">
                  <span className="text-orange-400">Tier 2</span>
                  <p className="text-slate-500">medium, decorated</p>
                </div>
                <div className="bg-slate-950 p-2 rounded">
                  <span className="text-red-400">Tier 3</span>
                  <p className="text-slate-500">imposing, majestic</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-amber-500">
              <h4 className="font-medium text-amber-400">Layer 4: 지역/테마 수정자</h4>
              <p className="text-slate-400 text-sm mt-1">지역별 색상과 장식 요소</p>
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                <div className="bg-slate-950 p-2 rounded">
                  <span className="text-green-400">Forest</span>
                  <p className="text-slate-500">green, brown, moss</p>
                </div>
                <div className="bg-slate-950 p-2 rounded">
                  <span className="text-gray-400">Dungeon</span>
                  <p className="text-slate-500">gray, blue, stone</p>
                </div>
                <div className="bg-slate-950 p-2 rounded">
                  <span className="text-red-400">Castle</span>
                  <p className="text-slate-500">red, gold, royal</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-red-500">
              <h4 className="font-medium text-red-400">Layer 5: 네거티브 프롬프트 (필수)</h4>
              <p className="text-slate-400 text-sm mt-1">제외할 요소 - 캐릭터와 몬스터가 정반대!</p>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <pre className="text-xs text-emerald-400 bg-slate-950 p-2 rounded overflow-x-auto">
{`[캐릭터 네거티브]
--negative
scary menacing dark,
sharp teeth fangs,
glowing eyes,
facing left`}
                </pre>
                <pre className="text-xs text-red-400 bg-slate-950 p-2 rounded overflow-x-auto">
{`[몬스터 네거티브]
--negative
cute adorable kawaii,
rosy blushing cheeks,
chibi SD proportions,
facing right`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 키워드 사전 */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-emerald-400 mb-4">📖 핵심 키워드 사전</h3>

        <div className="space-y-6">
          {/* 공통 스타일 */}
          <div>
            <h4 className="font-medium text-white mb-3 flex items-center gap-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
              공통 스타일 키워드
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-900 p-3 rounded-lg">
                <code className="text-amber-300">hand-drawn storybook illustration</code>
                <p className="text-slate-500 text-xs mt-1">동화책 일러스트 스타일</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg">
                <code className="text-amber-300">pencil sketch with watercolor</code>
                <p className="text-slate-500 text-xs mt-1">연필 스케치 + 수채화 채색</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg">
                <code className="text-amber-300">vintage aged parchment border</code>
                <p className="text-slate-500 text-xs mt-1">낡은 양피지 테두리</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg">
                <code className="text-amber-300">worn torn vintage paper corners</code>
                <p className="text-slate-500 text-xs mt-1">빈티지한 닳은 모서리</p>
              </div>
            </div>
          </div>

          {/* 캐릭터 전용 */}
          <div>
            <h4 className="font-medium text-emerald-400 mb-3 flex items-center gap-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
              캐릭터 전용 키워드
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="bg-emerald-900/20 p-3 rounded-lg border border-emerald-800/50">
                <code className="text-emerald-300">warm cozy fairy tale atmosphere</code>
                <p className="text-slate-500 text-xs mt-1">따뜻하고 포근한 동화 분위기</p>
              </div>
              <div className="bg-emerald-900/20 p-3 rounded-lg border border-emerald-800/50">
                <code className="text-emerald-300">cute chibi SD proportions</code>
                <p className="text-slate-500 text-xs mt-1">귀여운 SD 2등신 비율</p>
              </div>
              <div className="bg-emerald-900/20 p-3 rounded-lg border border-emerald-800/50">
                <code className="text-emerald-300">rosy blushing cheeks on both sides</code>
                <p className="text-slate-500 text-xs mt-1">양 볼의 분홍 홍조 (필수!)</p>
              </div>
              <div className="bg-emerald-900/20 p-3 rounded-lg border border-emerald-800/50">
                <code className="text-emerald-300">large expressive round eyes</code>
                <p className="text-slate-500 text-xs mt-1">크고 표현력 있는 둥근 눈</p>
              </div>
            </div>
          </div>

          {/* 몬스터 전용 */}
          <div>
            <h4 className="font-medium text-red-400 mb-3 flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              몬스터 전용 키워드
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="bg-red-900/20 p-3 rounded-lg border border-red-800/50">
                <code className="text-red-300">dark fairytale medieval fantasy</code>
                <p className="text-slate-500 text-xs mt-1">어두운 중세 판타지 동화</p>
              </div>
              <div className="bg-red-900/20 p-3 rounded-lg border border-red-800/50">
                <code className="text-red-300">exaggerated threatening proportions</code>
                <p className="text-slate-500 text-xs mt-1">과장된 위협적 비율</p>
              </div>
              <div className="bg-red-900/20 p-3 rounded-lg border border-red-800/50">
                <code className="text-red-300">glowing piercing intense eyes</code>
                <p className="text-slate-500 text-xs mt-1">빛나는 날카로운 눈</p>
              </div>
              <div className="bg-red-900/20 p-3 rounded-lg border border-red-800/50">
                <code className="text-red-300">sharp teeth fangs visible</code>
                <p className="text-slate-500 text-xs mt-1">날카로운 이빨/송곳니 노출</p>
              </div>
              <div className="bg-red-900/20 p-3 rounded-lg border border-red-800/50">
                <code className="text-red-300">villainous antagonistic expression</code>
                <p className="text-slate-500 text-xs mt-1">악당스러운 적대적 표정</p>
              </div>
              <div className="bg-red-900/20 p-3 rounded-lg border border-red-800/50">
                <code className="text-red-300">angular sharp body shapes</code>
                <p className="text-slate-500 text-xs mt-1">각지고 날카로운 실루엣</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 방향 키워드 */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-emerald-400 mb-4">🧭 방향 키워드 (매우 중요!)</h3>
        <p className="text-slate-300 text-sm mb-4">
          캐릭터와 몬스터가 마주보는 구도를 위해 방향이 반대입니다. <strong className="text-amber-400">반드시 지켜야 합니다!</strong>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-900/30 p-5 rounded-lg border border-emerald-700/50">
            <h4 className="font-medium text-emerald-300 mb-3 text-lg">캐릭터 → 우측 대각선 ↗</h4>
            <pre className="text-sm text-slate-300 bg-slate-900 p-3 rounded">
{`body facing right diagonal direction,
three-quarter view angled to right,
character looking toward front-right`}
            </pre>
            <div className="mt-3 text-xs text-slate-400">
              <strong>네거티브에 추가:</strong> facing left, looking left, back view
            </div>
          </div>

          <div className="bg-red-900/30 p-5 rounded-lg border border-red-700/50">
            <h4 className="font-medium text-red-300 mb-3 text-lg">몬스터 → 좌측 대각선 ↖</h4>
            <pre className="text-sm text-slate-300 bg-slate-900 p-3 rounded">
{`body facing left diagonal direction,
three-quarter view angled to left,
creature looking toward front-left`}
            </pre>
            <div className="mt-3 text-xs text-slate-400">
              <strong>네거티브에 추가:</strong> facing right, looking right, back view
            </div>
          </div>
        </div>
      </section>

      {/* 색상 팔레트 가이드 */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-emerald-400 mb-4">🎨 색상 팔레트 가이드</h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-emerald-400 mb-3">캐릭터 색상 (따뜻하고 친근함)</h4>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded">
                <div className="w-4 h-4 rounded" style={{backgroundColor: '#FFB6C1'}}></div>
                <span className="text-xs text-slate-300">볼 홍조 #FFB6C1</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded">
                <div className="w-4 h-4 rounded" style={{backgroundColor: '#FFD700'}}></div>
                <span className="text-xs text-slate-300">팔라딘 골드 #FFD700</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded">
                <div className="w-4 h-4 rounded" style={{backgroundColor: '#B85450'}}></div>
                <span className="text-xs text-slate-300">전사 레드 #B85450</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-red-400 mb-3">몬스터 색상 (어둡고 위협적)</h4>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded">
                <div className="w-4 h-4 rounded" style={{backgroundColor: '#FFD700'}}></div>
                <span className="text-xs text-slate-300">빛나는 눈 #FFD700</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded">
                <div className="w-4 h-4 rounded" style={{backgroundColor: '#DC143C'}}></div>
                <span className="text-xs text-slate-300">크림슨 눈 #DC143C</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded">
                <div className="w-4 h-4 rounded" style={{backgroundColor: '#7CFC00'}}></div>
                <span className="text-xs text-slate-300">독 그린 #7CFC00</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded">
                <div className="w-4 h-4 rounded" style={{backgroundColor: '#8B0000'}}></div>
                <span className="text-xs text-slate-300">블러드 레드 #8B0000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 실전 예시 */}
      <PromptExamples />

      {/* 일관성 유지 팁 */}
      <section className="bg-gradient-to-r from-amber-900/30 to-slate-800 rounded-xl p-6 border border-amber-700/50">
        <h3 className="text-xl font-semibold text-amber-400 mb-4">💡 일관성 유지를 위한 황금 규칙</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-3">
            <h4 className="font-medium text-white">✅ 반드시 지킬 것</h4>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                <span>레이어 순서 유지 (스타일 → 에셋 → 티어 → 지역 → 네거티브)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                <span>캐릭터/몬스터 스타일 구분 명확히</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                <span>방향 키워드 정확히 지정</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                <span>네거티브 프롬프트 항상 포함</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                <span>동일한 카드 프레임 스타일 유지</span>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-white">❌ 피해야 할 것</h4>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>캐릭터에 menacing/scary 키워드 사용</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>몬스터에 cute/adorable 키워드 사용</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>상충되는 키워드 조합 (cute + menacing)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>realistic, 3D render, CGI 키워드</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>cold colors, blue dominant (차가운 색조)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

type ExampleCategory = 'character' | 'monster-t1' | 'monster-t2' | 'monster-t3' | 'background'

interface PromptExample {
  id: string
  name: string
  nameEn: string
  prompt: string
  negative: string
}

const PROMPT_EXAMPLES: Record<ExampleCategory, PromptExample[]> = {
  'character': [
    {
      id: 'warrior',
      name: '전사',
      nameEn: 'Warrior',
      prompt: `hand-drawn storybook illustration style,
pencil sketch with watercolor coloring,
vintage aged parchment card border,
rounded rectangle card shape,
worn torn vintage paper corners,
textured beige paper background,

cute chibi SD proportions 2-2.5 head ratio,
adorable brave warrior character,
steel armor with red accents,
short sword and round shield,
rosy blushing cheeks on both sides,
large expressive round eyes,
confident friendly smile,
body facing right diagonal direction,
three-quarter view angled to right,
warm cozy fairy tale atmosphere`,
      negative: `scary menacing dark, sharp teeth fangs, glowing eyes, facing left, looking left, back view, realistic, 3D render, CGI, cold colors, blue dominant`
    },
    {
      id: 'paladin',
      name: '팔라딘',
      nameEn: 'Paladin',
      prompt: `hand-drawn storybook illustration style,
pencil sketch with watercolor coloring,
vintage aged parchment card border,
rounded rectangle card shape,
worn torn vintage paper corners,
textured beige paper background,

cute chibi SD proportions 2-2.5 head ratio,
adorable noble paladin character,
golden shining plate armor,
holy sword with glowing runes,
rosy blushing cheeks on both sides,
large expressive gentle round eyes,
serene confident smile,
body facing right diagonal direction,
three-quarter view angled to right,
warm divine holy light atmosphere`,
      negative: `scary menacing dark, sharp teeth fangs, glowing red eyes, facing left, looking left, back view, realistic, 3D render, evil corrupted, dark colors`
    }
  ],
  'monster-t1': [
    {
      id: 'poison-slime',
      name: '독슬라임',
      nameEn: 'Poison Slime',
      prompt: `hand-drawn storybook illustration style,
pencil sketch with watercolor coloring,
vintage aged parchment card border,
rounded rectangle card shape,
dark fairytale medieval fantasy,

menacing slime creature,
toxic green translucent body,
glowing yellow-green core,
acidic bubbles on surface,
sharp angular body shape,
piercing glowing yellow eyes,
feral malicious expression,
dripping corrosive slime,
body facing left diagonal direction,
three-quarter view angled to left,
ominous forest background hints`,
      negative: `cute adorable kawaii, rosy blushing cheeks, chibi SD proportions, friendly smile, facing right, looking right, pastel colors, warm atmosphere`
    },
    {
      id: 'venom-shroom',
      name: '독버섯',
      nameEn: 'Venom Shroom',
      prompt: `hand-drawn storybook illustration style,
pencil sketch with watercolor coloring,
vintage aged parchment card border,
dark fairytale medieval fantasy,

menacing mushroom creature,
toxic purple spotted cap,
glowing spore particles,
gnarled twisted stem body,
sharp teeth visible in mouth,
piercing toxic green eyes,
villainous cunning expression,
poisonous aura emanating,
body facing left diagonal direction,
three-quarter view angled to left,
decaying forest floor setting`,
      negative: `cute adorable kawaii, rosy blushing cheeks, chibi SD proportions, friendly smile, facing right, looking right, pastel colors, playful innocent`
    },
    {
      id: 'wicked-goblin',
      name: '사악한 고블린',
      nameEn: 'Wicked Goblin',
      prompt: `hand-drawn storybook illustration style,
pencil sketch with watercolor coloring,
vintage aged parchment card border,
dark fairytale medieval fantasy,

menacing small goblin creature,
sickly green wrinkled skin,
pointed ears and sharp nose,
crude rusty dagger weapon,
sharp teeth fangs visible,
glowing yellow malicious eyes,
feral wicked grin expression,
hunched predatory posture,
body facing left diagonal direction,
three-quarter view angled to left,
shadowy forest ambush setting`,
      negative: `cute adorable kawaii, rosy blushing cheeks, chibi SD proportions, friendly smile, facing right, looking right, clean bright colors`
    }
  ],
  'monster-t2': [
    {
      id: 'cunning-foxwolf',
      name: '교활한 늑대여우',
      nameEn: 'Cunning Foxwolf',
      prompt: `hand-drawn storybook illustration style,
pencil sketch with watercolor coloring,
vintage aged parchment card border,
dark fairytale medieval fantasy,

menacing fox-wolf hybrid creature,
sleek dark crimson fur,
multiple flowing tails with fire tips,
sharp angular facial features,
calculating intelligent eyes,
glowing amber piercing gaze,
cunning predatory smirk,
medium-sized threatening build,
battle scars on fur,
body facing left diagonal direction,
three-quarter view angled to left,
moonlit forest clearing setting`,
      negative: `cute adorable kawaii, rosy blushing cheeks, chibi SD proportions, friendly playful, facing right, looking right, soft fluffy appearance`
    },
    {
      id: 'rotting-golem',
      name: '썩은 골렘',
      nameEn: 'Rotting Golem',
      prompt: `hand-drawn storybook illustration style,
pencil sketch with watercolor coloring,
vintage aged parchment card border,
dark fairytale medieval fantasy,

menacing corrupted moss golem,
decaying stone and rotting plants,
glowing toxic green cracks,
twisted gnarled tree limbs,
hollow burning eye sockets,
eerie green flame eyes,
slow menacing presence,
medium imposing figure,
fungal growths covering body,
body facing left diagonal direction,
three-quarter view angled to left,
swamp forest environment`,
      negative: `cute adorable kawaii, rosy blushing cheeks, chibi SD proportions, friendly nature spirit, facing right, looking right, vibrant healthy green`
    }
  ],
  'monster-t3': [
    {
      id: 'corrupted-king',
      name: '부패의 왕',
      nameEn: 'Corrupted Mushroom King',
      prompt: `hand-drawn storybook illustration style,
pencil sketch with watercolor coloring,
vintage aged parchment card border,
dark fairytale medieval fantasy,

imposing corrupted mushroom monarch,
massive twisted crown of fungi,
toxic spore cloud surrounding,
throne made of dead trees,
multiple glowing eyes,
dominating overwhelming presence,
ancient evil wisdom expression,
dark purple and sickly green palette,
reality-warping aura effects,
large boss-tier monster proportions,
body facing left diagonal direction,
three-quarter view angled to left,
corrupted forest throne room setting`,
      negative: `cute adorable kawaii, rosy blushing cheeks, chibi SD proportions, friendly smile, facing right, looking right, small weak, pastel colors, healthy forest`
    },
    {
      id: 'yokai-gumiho',
      name: '요괴 구미호',
      nameEn: 'Yokai Nine-Tailed Fox',
      prompt: `hand-drawn storybook illustration style,
pencil sketch with watercolor coloring,
vintage aged parchment card border,
dark fairytale medieval fantasy,

majestic malevolent nine-tailed fox spirit,
nine flowing spectral tails,
ethereal ghostly flame aura,
ancient demonic beauty,
piercing crimson glowing eyes,
dominating seductive menace expression,
sharp elegant claws and fangs,
supernatural proportions,
soul orbs floating nearby,
dark purple and blood red palette,
large boss-tier monster size,
body facing left diagonal direction,
three-quarter view angled to left,
haunted moonlit shrine setting`,
      negative: `cute adorable kawaii, rosy blushing cheeks, chibi SD proportions, friendly playful fox, facing right, looking right, small cute tails, warm friendly atmosphere`
    }
  ],
  'background': [
    {
      id: 'forest-battle',
      name: '숲 전투 배경',
      nameEn: 'Forest Battle',
      prompt: `hand-drawn storybook illustration style,
pencil sketch with watercolor coloring,
wide panoramic landscape format,
dark fairytale forest clearing,
ancient twisted trees surrounding,
dramatic lighting through canopy,
mystical fog effects,
battle-scarred ground,
fallen leaves and debris,
tense dramatic atmosphere,
deep greens and earth browns,
amber sunset light filtering through,
no characters or creatures visible,
empty scene ready for card game`,
      negative: `characters, creatures, monsters, people, modern elements, buildings, technology, bright cheerful, cute cartoon style`
    },
    {
      id: 'dungeon-entrance',
      name: '던전 입구',
      nameEn: 'Dungeon Entrance',
      prompt: `hand-drawn storybook illustration style,
pencil sketch with watercolor coloring,
wide panoramic landscape format,
ominous dungeon entrance,
ancient stone archway,
carved runes glowing faintly,
descending stone stairs,
cobwebs and cracks in stone,
eerie blue-green torchlight,
mysterious fog from within,
cold oppressive atmosphere,
gray stone and dark shadows,
hints of treasure beyond,
no characters or creatures visible,
empty scene ready for card game`,
      negative: `characters, creatures, monsters, people, modern elements, bright sunlight, cheerful atmosphere, cute style, colorful`
    }
  ]
}

function PromptExamples() {
  const [selectedCategory, setSelectedCategory] = useState<ExampleCategory>('character')
  const [selectedExample, setSelectedExample] = useState<string>('warrior')

  const categories = [
    { id: 'character' as ExampleCategory, label: '캐릭터', icon: '🦸', color: 'emerald' },
    { id: 'monster-t1' as ExampleCategory, label: '몬스터 T1', icon: '👹', color: 'yellow' },
    { id: 'monster-t2' as ExampleCategory, label: '몬스터 T2', icon: '👺', color: 'orange' },
    { id: 'monster-t3' as ExampleCategory, label: '몬스터 T3', icon: '🐉', color: 'red' },
    { id: 'background' as ExampleCategory, label: '배경', icon: '🏞️', color: 'blue' },
  ]

  const currentExamples = PROMPT_EXAMPLES[selectedCategory]
  const currentExample = currentExamples.find(e => e.id === selectedExample) || currentExamples[0]

  const handleCategoryChange = (category: ExampleCategory) => {
    setSelectedCategory(category)
    setSelectedExample(PROMPT_EXAMPLES[category][0].id)
  }

  const getCategoryColor = (category: ExampleCategory) => {
    const cat = categories.find(c => c.id === category)
    return cat?.color || 'slate'
  }

  return (
    <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-xl font-semibold text-emerald-400 mb-4">📝 실전 프롬프트 예시</h3>
      <p className="text-slate-300 text-sm mb-6">
        버튼을 클릭하여 다양한 에셋의 실제 프롬프트 예시를 확인할 수 있습니다.
        각 프롬프트는 5레이어 시스템을 적용한 완성 형태입니다.
      </p>

      {/* 카테고리 선택 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === cat.id
                ? cat.color === 'emerald' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
                : cat.color === 'yellow' ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-900/50'
                : cat.color === 'orange' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50'
                : cat.color === 'red' ? 'bg-red-600 text-white shadow-lg shadow-red-900/50'
                : 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <span className="mr-2">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* 에셋 선택 */}
      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-slate-700">
        {currentExamples.map((example) => (
          <button
            key={example.id}
            onClick={() => setSelectedExample(example.id)}
            className={`px-3 py-1.5 rounded text-sm transition-all ${
              selectedExample === example.id
                ? 'bg-slate-600 text-white ring-2 ring-slate-400'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
          >
            {example.name}
            <span className="text-slate-500 ml-1 text-xs">({example.nameEn})</span>
          </button>
        ))}
      </div>

      {/* 프롬프트 표시 */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h4 className={`font-medium ${
              getCategoryColor(selectedCategory) === 'emerald' ? 'text-emerald-400' :
              getCategoryColor(selectedCategory) === 'red' ? 'text-red-400' :
              getCategoryColor(selectedCategory) === 'orange' ? 'text-orange-400' :
              getCategoryColor(selectedCategory) === 'yellow' ? 'text-yellow-400' :
              'text-blue-400'
            }`}>
              ✅ 프롬프트 (Prompt)
            </h4>
            <span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
              {currentExample.name} - {currentExample.nameEn}
            </span>
          </div>
          <pre className="bg-slate-900 p-4 rounded-lg text-sm text-slate-300 overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto">
            {currentExample.prompt}
          </pre>
        </div>

        <div>
          <h4 className="font-medium text-red-400 mb-2">❌ 네거티브 프롬프트 (Negative)</h4>
          <pre className="bg-red-950/30 border border-red-900/50 p-4 rounded-lg text-sm text-red-200 overflow-x-auto whitespace-pre-wrap">
            {currentExample.negative}
          </pre>
        </div>
      </div>

      {/* 복사 버튼 */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => navigator.clipboard.writeText(currentExample.prompt)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-sm rounded-lg transition-colors"
        >
          📋 프롬프트 복사
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(currentExample.negative)}
          className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
        >
          📋 네거티브 복사
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(`${currentExample.prompt}\n\n--negative\n${currentExample.negative}`)}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
        >
          📋 전체 복사
        </button>
      </div>
    </section>
  )
}

function WorkflowGuide() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-emerald-400 mb-4">이미지 생성 워크플로우</h2>
        <p className="text-slate-300 mb-6">
          에셋 이미지 생성의 전체 프로세스를 단계별로 안내합니다.
        </p>
      </section>

      {/* 워크플로우 다이어그램 */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-emerald-400 mb-6">🔄 생성 프로세스</h3>

        <div className="space-y-4">
          {[
            { step: 1, title: '디자인 문서 확인', desc: '생성할 에셋의 디자인 사양을 확인합니다.', icon: '📋' },
            { step: 2, title: '스킬 명령어 실행', desc: '/gen-character, /gen-monster, /gen-background 중 선택하여 실행합니다.', icon: '⌨️' },
            { step: 3, title: '프롬프트 자동 조합', desc: '레이어 시스템이 자동으로 프롬프트를 조합합니다.', icon: '🔧' },
            { step: 4, title: '이미지 생성', desc: 'AI가 이미지를 생성합니다.', icon: '🎨' },
            { step: 5, title: '검증 체크리스트', desc: '생성된 이미지가 디자인 사양에 맞는지 확인합니다.', icon: '✅' },
            { step: 6, title: '저장 및 정리', desc: 'assets/ 폴더에 적절한 카테고리로 저장합니다.', icon: '💾' },
          ].map((item, index) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-xl">
                {item.icon}
              </div>
              <div className="flex-1 bg-slate-900 p-4 rounded-lg">
                <h4 className="font-medium text-slate-200">
                  Step {item.step}: {item.title}
                </h4>
                <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
              </div>
              {index < 5 && (
                <div className="flex-shrink-0 w-12 flex justify-center">
                  <div className="w-0.5 h-8 bg-slate-700 mt-12"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 검증 체크리스트 */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-emerald-400 mb-4">✅ 검증 체크리스트</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-emerald-400 mb-3">🦸 캐릭터 체크</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-600" disabled />
                <span>SD 비율 (2-2.5 등신)</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-600" disabled />
                <span>양 볼에 홍조</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-600" disabled />
                <span>따뜻하고 친근한 표정</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-600" disabled />
                <span>우측 대각선 방향 ↗</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-600" disabled />
                <span>수채화 느낌 채색</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-red-400 mb-3">👹 몬스터 체크</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-600" disabled />
                <span>위협적 비율 (과장된 특징)</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-600" disabled />
                <span>빛나는/날카로운 눈</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-600" disabled />
                <span>적대적/악당스러운 표정</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-600" disabled />
                <span>좌측 대각선 방향 ↖</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-600" disabled />
                <span>볼 홍조 없음!</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-slate-200 mb-3">🖼️ 카드 프레임</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-600" disabled />
                <span>낡은 양피지 테두리</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-600" disabled />
                <span>둥근 사각형 형태</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-600" disabled />
                <span>빈티지 닳은 모서리</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-600" disabled />
                <span>질감 있는 베이지 배경</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-600" disabled />
                <span>스토리북 느낌 유지</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 파일 저장 규칙 */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-emerald-400 mb-4">📁 파일 저장 규칙</h3>

        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-lg">
            <h4 className="font-medium text-slate-200 mb-2">폴더 구조</h4>
            <pre className="text-sm text-slate-400">
{`assets/
├── backgrounds/     # 배경 이미지
├── characters/      # 캐릭터 카드
├── monsters/        # 몬스터 카드
└── ui/              # UI 요소
    ├── frames/      # 카드 프레임
    ├── coins/       # 코인 아이콘
    ├── icons/       # 기타 아이콘
    └── buttons/     # 버튼`}
            </pre>
          </div>

          <div className="bg-slate-900 p-4 rounded-lg">
            <h4 className="font-medium text-slate-200 mb-2">파일명 규칙</h4>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• 소문자와 하이픈 사용: <code className="text-amber-300">warrior-basic.png</code></li>
              <li>• 버전 표기: <code className="text-amber-300">slime-v2.png</code></li>
              <li>• 상태 표기: <code className="text-amber-300">paladin-wounded.png</code></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
