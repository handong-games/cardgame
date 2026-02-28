import { useState } from 'react'
import { Link } from 'react-router-dom'

type TabType = 'essence' | 'prompt' | 'workflow'

export default function Guide() {
  const [activeTab, setActiveTab] = useState<TabType>('essence')

  const tabs = [
    { id: 'essence' as TabType, label: '비주얼 에센스', icon: '🎨' },
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
      {activeTab === 'essence' && <VisualEssenceGuide />}
      {activeTab === 'prompt' && <PromptGuide />}
      {activeTab === 'workflow' && <WorkflowGuide />}
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
              <p className="text-slate-400 text-sm mt-1">전체적인 아트 스타일, 분위기 정의 - v4.0 Dark Frame Edition</p>
              <pre className="text-xs text-slate-500 bg-slate-950 p-3 rounded mt-2 overflow-x-auto">
{`flat color illustration style,
hard edge cel shading with clean defined color blocks,
bold clean outlines in near-black,
muted desaturated dark fantasy color palette,
earthy tones with burgundy ochre navy accents,
stylized character illustration,
solid white background for clean extraction,
no border no frame,
strong rim light along character edges from behind,
soft key light from upper-left illuminating face`}
              </pre>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-medium text-blue-400">Layer 2: 에셋 타입별 속성 (필수)</h4>
              <p className="text-slate-400 text-sm mt-1">캐릭터/몬스터에 따라 완전히 다른 레이어 적용</p>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <pre className="text-xs text-emerald-400 bg-slate-950 p-2 rounded overflow-x-auto">
{`[캐릭터]
2.5-3 head body ratio,
rosy blushing cheeks,
confident expression,
facing right diagonal`}
                </pre>
                <pre className="text-xs text-red-400 bg-slate-950 p-2 rounded overflow-x-auto">
{`[몬스터]
tier-based ratio,
NO blush on cheeks,
menacing expression,
facing left diagonal`}
                </pre>
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-medium text-purple-400">Layer 3: 티어/클래스 수정자</h4>
              <p className="text-slate-400 text-sm mt-1">등급이나 클래스에 따른 세부 조정</p>
              <div className="grid grid-cols-4 gap-2 mt-2 text-xs">
                <div className="bg-slate-950 p-2 rounded">
                  <span className="text-amber-400">Player</span>
                  <p className="text-slate-500">gold glow #FFD700</p>
                </div>
                <div className="bg-slate-950 p-2 rounded">
                  <span className="text-gray-400">Tier 1</span>
                  <p className="text-slate-500">silver glow #C0C0C0</p>
                </div>
                <div className="bg-slate-950 p-2 rounded">
                  <span className="text-purple-400">Tier 2</span>
                  <p className="text-slate-500">purple glow #6B4B8C</p>
                </div>
                <div className="bg-slate-950 p-2 rounded">
                  <span className="text-red-400">Tier 3</span>
                  <p className="text-slate-500">red glow #8B0000</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-amber-500">
              <h4 className="font-medium text-amber-400">Layer 4: 지역 수정자</h4>
              <p className="text-slate-400 text-sm mt-1">지역별 색상 팔레트</p>
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                <div className="bg-slate-950 p-2 rounded">
                  <span className="text-green-400">Forest</span>
                  <p className="text-slate-500">#2D5A3D, #6B4423</p>
                </div>
                <div className="bg-slate-950 p-2 rounded">
                  <span className="text-gray-400">Dungeon</span>
                  <p className="text-slate-500">#5A5F6B, #6B8E9F</p>
                </div>
                <div className="bg-slate-950 p-2 rounded">
                  <span className="text-red-400">Castle</span>
                  <p className="text-slate-500">#8B4049, #B8860B</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-red-500">
              <h4 className="font-medium text-red-400">Layer 5: 네거티브 프롬프트 (필수)</h4>
              <p className="text-slate-400 text-sm mt-1">제외할 요소 - 에셋 타입별로 정반대!</p>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <pre className="text-xs text-emerald-400 bg-slate-950 p-2 rounded overflow-x-auto">
{`[캐릭터 네거티브]
dark gothic horror scary,
no blush on cheeks,
scary fierce expression,
facing left, back view,
photorealistic 3D render`}
                </pre>
                <pre className="text-xs text-red-400 bg-slate-950 p-2 rounded overflow-x-auto">
{`[몬스터 네거티브]
rosy blushing cheeks,
cute adorable kawaii,
chibi SD proportions,
facing right, back view,
photorealistic 3D render`}
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
                <code className="text-amber-300">flat color illustration style</code>
                <p className="text-slate-500 text-xs mt-1">플랫 컬러 일러스트 스타일 (v4.0)</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg">
                <code className="text-amber-300">hard edge cel shading</code>
                <p className="text-slate-500 text-xs mt-1">하드 엣지 셀쉐이딩</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg">
                <code className="text-amber-300">bold clean outlines in near-black</code>
                <p className="text-slate-500 text-xs mt-1">니어블랙 볼드 외곽선</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg">
                <code className="text-amber-300">solid white background for clean extraction</code>
                <p className="text-slate-500 text-xs mt-1">깔끔한 추출용 흰색 배경</p>
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
                <code className="text-emerald-300">muted desaturated dark fantasy color palette</code>
                <p className="text-slate-500 text-xs mt-1">채도 낮은 다크 판타지 색조</p>
              </div>
              <div className="bg-emerald-900/20 p-3 rounded-lg border border-emerald-800/50">
                <code className="text-emerald-300">2.5-3 head body ratio</code>
                <p className="text-slate-500 text-xs mt-1">2.5~3등신 SD 비율</p>
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

      {/* 프롬프트 라이브러리 연결 */}
      <section className="bg-gradient-to-r from-emerald-900/30 to-slate-800 rounded-xl p-6 border border-emerald-700/50">
        <h3 className="text-xl font-semibold text-emerald-400 mb-3">실전 프롬프트 라이브러리</h3>
        <p className="text-slate-300 text-sm mb-4">
          게임의 모든 에셋에 대한 복사-붙여넣기 가능한 프롬프트와 이미지 생성 기능은 별도 페이지에서 관리합니다.
        </p>
        <Link
          to="/prompts"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          프롬프트 라이브러리 바로가기 →
        </Link>
      </section>

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
            { step: 2, title: '명령어 실행', desc: '/gen-character, /gen-monster, /gen-background 중 선택하여 실행합니다.', icon: '⌨️' },
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
                <span>플랫 셀쉐이딩 채색 (v4.0)</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-600" disabled />
                <span>흰색 배경 (추출용)</span>
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
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-600" disabled />
                <span>잉크/가우슈 스타일 (v4.0 몬스터)</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-slate-200 mb-3">🖼️ 공통 체크</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-600" disabled />
                <span>다크 프레임 (#1E1E24) 테두리</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-600" disabled />
                <span>2:3 세로형 캔버스 비율</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-600" disabled />
                <span>흰색 배경 (추출용)</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-600" disabled />
                <span>림 라이트 + 키 라이트 조명</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-600" disabled />
                <span>v4.0 Dark Frame Edition 스타일</span>
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

function VisualEssenceGuide() {
  const mainPalette = [
    { role: 'Card BG Start', name: 'Dark Charcoal', hex: '#1E1E24', usage: '카드 배경 그라데이션 시작' },
    { role: 'Card BG End', name: 'Dark Deep', hex: '#2A2A32', usage: '카드 배경 그라데이션 끝' },
    { role: 'Card Border', name: 'Dark Graphite', hex: '#4A4A55', usage: '카드 테두리, 구분선' },
    { role: 'HP/Panel BG', name: 'Dark Surface', hex: '#16161C', usage: 'HP바 컨테이너, 패널 배경' },
    { role: 'Gen BG', name: 'White', hex: '#FFFFFF', usage: '생성용 흰색 배경 (AI 생성 시)' },
  ]

  const accentPalette = [
    { role: 'Primary', name: 'Warm Highlight', hex: '#D4A574', usage: '하이라이트, 역광, 보상' },
    { role: 'Secondary', name: 'Metal Gray', hex: '#5A5F6B', usage: '금속, 중립 요소' },
    { role: 'Accent', name: 'Warm Blush', hex: '#C4867A', usage: '볼 홍조, 악센트' },
  ]

  const tierColors = [
    { tier: 'Player', usage: '플레이어 캐릭터', hex: '#FFD700', glow: '#FFF8DC', shadow: '#B8860B' },
    { tier: 'Tier 1', usage: '일반 몬스터', hex: '#C0C0C0', glow: '#E8E8E8', shadow: '#808080' },
    { tier: 'Tier 2', usage: '정예 몬스터', hex: '#6B4B8C', glow: '#9370DB', shadow: '#3D2952' },
    { tier: 'Tier 3', usage: '보스 몬스터', hex: '#8B0000', glow: '#DC143C', shadow: '#4A0000' },
  ]

  const essenceTable = [
    { element: '렌더링', style: '플랫 컬러 + 하드 엣지 셀쉐이딩', keyword: 'flat color illustration style' },
    { element: '색상', style: '채도 낮은 다크 판타지 팔레트', keyword: 'muted desaturated dark fantasy color palette' },
    { element: '비율', style: '캐릭터 2.5~3등신 / 몬스터 티어별', keyword: '2.5-3 head body ratio' },
    { element: '선 작업', style: '니어블랙 볼드 클린 외곽선', keyword: 'bold clean outlines in near-black' },
    { element: '배경', style: '흰색 배경 (추출용)', keyword: 'solid white background for clean extraction' },
    { element: '조명', style: '림 라이트 + 좌상단 키 라이트', keyword: 'strong rim light, soft key light from upper-left' },
  ]

  const characterKeywords = `flat color illustration style,
hard edge cel shading with clean defined color blocks,
bold clean outlines in near-black (#1A1A1E),
muted desaturated dark fantasy color palette,
solid white background for clean extraction,
strong rim light along character edges from behind,
soft key light from upper-left illuminating face`

  const monsterKeywords = `hand-drawn ink illustration style,
pen and ink sketch base with visible line work,
variable line weight with organic imperfect strokes,
gouache and ink wash coloring with controlled color application,
muted earthy color palette (35-55% saturation),
solid white background for clean extraction,
moody atmospheric lighting from upper-left,
subtle rim light highlighting creature silhouette edges`

  const backgroundKeywords = `layered silhouette background,
dark muted color palette,
strong vignette effect darker edges,
low saturation restrained colors,
minimal atmospheric scene,
wide 16:9 aspect ratio,
no characters no creatures`

  return (
    <div className="space-y-8">
      {/* 핵심 비전 */}
      <section className="bg-gradient-to-r from-slate-900/50 to-amber-900/30 rounded-xl p-8 border border-slate-600">
        <h2 className="text-2xl font-bold text-amber-400 mb-4">핵심 비전</h2>
        <blockquote className="text-2xl font-semibold text-white mb-4 border-l-4 border-amber-500 pl-4">
          "다크 실루엣 배경 위의 극적인 카드 게임 아트"
        </blockquote>
        <p className="text-slate-300 text-lg">
          <span className="text-emerald-400 font-medium">Slay the Spire</span>의 전략적 덱빌딩 + 
          <span className="text-amber-400 font-medium"> Dice & Fold</span>의 동화적 아트가 만난 로그라이크 카드 RPG
        </p>
      </section>

      {/* 확정 에센스 조합 */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-emerald-400 mb-2">확정 에센스 조합</h3>
        <p className="text-amber-400 font-medium mb-4">"Dark Frame Edition" v4.0</p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">요소</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">확정 스타일</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">핵심 키워드</th>
              </tr>
            </thead>
            <tbody>
              {essenceTable.map((row, i) => (
                <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-3 px-4 text-slate-200 font-medium">{row.element}</td>
                  <td className="py-3 px-4 text-slate-300">{row.style}</td>
                  <td className="py-3 px-4">
                    <code className="text-amber-300 bg-slate-900 px-2 py-1 rounded text-xs">{row.keyword}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 카드 UI 팔레트 */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-emerald-400 mb-4">카드 UI 팔레트</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {mainPalette.map((color) => (
            <div key={color.role} className="text-center">
              <div 
                className="w-full h-20 rounded-lg mb-2 border border-slate-600 shadow-lg"
                style={{ backgroundColor: color.hex }}
              />
              <p className="text-xs text-slate-400">{color.role}</p>
              <p className="text-sm text-slate-200 font-medium">{color.name}</p>
              <code className="text-xs text-amber-400">{color.hex}</code>
            </div>
          ))}
        </div>

        <h4 className="text-sm font-medium text-slate-400 mb-3 mt-6">이펙트/악센트 색상</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accentPalette.map((color) => (
            <div key={color.role} className="flex items-center gap-3 bg-slate-900 p-3 rounded-lg">
              <div 
                className="w-10 h-10 rounded-lg border border-slate-600 flex-shrink-0"
                style={{ backgroundColor: color.hex }}
              />
              <div>
                <p className="text-sm text-slate-200 font-medium">{color.name}</p>
                <code className="text-xs text-amber-400">{color.hex}</code>
                <p className="text-xs text-slate-500 mt-0.5">{color.usage}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 티어별 악센트 색상 */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-emerald-400 mb-4">티어별 악센트 색상</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tierColors.map((tier) => (
            <div key={tier.tier} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
              <div 
                className="w-full h-12 rounded-lg mb-3 border border-slate-600 relative overflow-hidden"
                style={{ backgroundColor: tier.hex, boxShadow: `0 0 12px ${tier.glow}` }}
              />
              <p className="text-slate-200 font-medium">{tier.tier}</p>
              <p className="text-xs text-slate-400 mb-2">{tier.usage}</p>
              <div className="flex gap-1 flex-wrap">
                <code className="text-xs text-amber-400 bg-slate-950 px-1.5 py-0.5 rounded">{tier.hex}</code>
                <code className="text-xs text-emerald-400 bg-slate-950 px-1.5 py-0.5 rounded">{tier.glow}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 마스터 스타일 키워드 — 에셋 타입별 */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-emerald-400 mb-4">마스터 스타일 키워드</h3>
        <p className="text-slate-400 text-sm mb-4">에셋 타입별로 다른 마스터 키워드를 사용합니다. 복사하여 사용하세요.</p>
        
        <div className="space-y-4">
          <div className="relative">
            <h4 className="text-sm font-medium text-emerald-400 mb-2">캐릭터 마스터</h4>
            <pre className="bg-slate-900 p-4 rounded-lg text-sm text-emerald-300 overflow-x-auto whitespace-pre-wrap border border-slate-700">
              {characterKeywords}
            </pre>
            <button 
              onClick={() => navigator.clipboard.writeText(characterKeywords)}
              className="absolute top-8 right-2 px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white text-xs rounded transition-colors"
            >
              복사
            </button>
          </div>

          <div className="relative">
            <h4 className="text-sm font-medium text-red-400 mb-2">몬스터 마스터</h4>
            <pre className="bg-slate-900 p-4 rounded-lg text-sm text-red-300 overflow-x-auto whitespace-pre-wrap border border-slate-700">
              {monsterKeywords}
            </pre>
            <button 
              onClick={() => navigator.clipboard.writeText(monsterKeywords)}
              className="absolute top-8 right-2 px-3 py-1 bg-red-700 hover:bg-red-600 text-white text-xs rounded transition-colors"
            >
              복사
            </button>
          </div>

          <div className="relative">
            <h4 className="text-sm font-medium text-purple-400 mb-2">배경 마스터</h4>
            <pre className="bg-slate-900 p-4 rounded-lg text-sm text-purple-300 overflow-x-auto whitespace-pre-wrap border border-slate-700">
              {backgroundKeywords}
            </pre>
            <button 
              onClick={() => navigator.clipboard.writeText(backgroundKeywords)}
              className="absolute top-8 right-2 px-3 py-1 bg-purple-700 hover:bg-purple-600 text-white text-xs rounded transition-colors"
            >
              복사
            </button>
          </div>
        </div>
      </section>

      {/* 캔버스 비율 */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-emerald-400 mb-4">캔버스 비율 규칙</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
            <h4 className="text-sm font-medium text-slate-200 mb-2">캐릭터/몬스터</h4>
            <p className="text-amber-400 text-lg font-bold">2:3 세로형</p>
            <p className="text-slate-500 text-xs mt-1">512x768, 1024x1536</p>
          </div>
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
            <h4 className="text-sm font-medium text-slate-200 mb-2">배경</h4>
            <p className="text-amber-400 text-lg font-bold">16:9 가로형</p>
            <p className="text-slate-500 text-xs mt-1">1920x1080</p>
          </div>
        </div>
      </section>

      {/* 방향 규칙 */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-emerald-400 mb-4">방향 규칙</h3>
        <p className="text-slate-400 text-sm mb-6">캐릭터와 몬스터가 서로 마주보는 구도를 위해 방향이 반대입니다.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-900/30 rounded-lg p-6 border border-emerald-700/50 text-center">
            <div className="text-6xl mb-4">↗</div>
            <h4 className="text-emerald-400 font-semibold text-lg mb-2">캐릭터</h4>
            <p className="text-slate-300">우측 대각선 방향</p>
            <p className="text-slate-500 text-sm mt-2">"전진, 희망" + 볼 홍조 있음</p>
            <code className="text-xs text-emerald-300 mt-3 block">body facing right diagonal direction</code>
          </div>
          
          <div className="bg-red-900/30 rounded-lg p-6 border border-red-700/50 text-center">
            <div className="text-6xl mb-4">↖</div>
            <h4 className="text-red-400 font-semibold text-lg mb-2">몬스터</h4>
            <p className="text-slate-300">좌측 대각선 방향</p>
            <p className="text-slate-500 text-sm mt-2">"대립, 위협" + 볼 홍조 없음</p>
            <code className="text-xs text-red-300 mt-3 block">body facing left diagonal direction</code>
          </div>
        </div>
      </section>

      {/* 금지 사항 */}
      <section className="bg-red-950/30 rounded-xl p-6 border border-red-900/50">
        <h3 className="text-xl font-semibold text-red-400 mb-4">금지 사항</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded border-2 border-red-500 bg-black" />
            </div>
            <div>
              <p className="text-red-400 font-medium">순수 검정/흰색</p>
              <p className="text-slate-400 text-sm">→ 따뜻한 어스톤 사용</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded border-2 border-red-500" style={{ background: 'linear-gradient(45deg, #ff00ff, #00ffff)' }} />
            </div>
            <div>
              <p className="text-red-400 font-medium">네온/차가운 색상</p>
              <p className="text-slate-400 text-sm">→ 머스타드/버건디/네이비 톤</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded border-2 border-red-500" style={{ background: 'linear-gradient(45deg, #ff0000, #ff6600)' }} />
            </div>
            <div>
              <p className="text-red-400 font-medium">과도한 채도</p>
              <p className="text-slate-400 text-sm">→ 40~60% 채도 유지</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded border-2 border-red-500" style={{ background: 'linear-gradient(135deg, #555, #888)' }} />
            </div>
            <div>
              <p className="text-red-400 font-medium">3D/포토리얼리스틱</p>
              <p className="text-slate-400 text-sm">→ 2D 일러스트 스타일 유지</p>
            </div>
          </div>
        </div>
      </section>

      {/* 피해야 할 스타일 */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-emerald-400 mb-4">피해야 할 스타일</h3>
        
        <div className="flex flex-wrap gap-2">
          {[
            '3D 렌더링, 포토리얼리스틱',
            '애니메 샤프 라인, 만화 스타일',
            '픽셀 아트, 벡터 플랫 디자인',
            '네온 색상, 차가운 톤',
            '과도한 채도 (60% 이상)',
            '순수 검정/흰색 사용',
          ].map((item, i) => (
            <span key={i} className="px-3 py-1 bg-red-900/30 border border-red-800/50 rounded-full text-red-300 text-sm">
              {item}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
