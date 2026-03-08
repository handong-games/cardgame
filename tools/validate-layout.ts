import { existsSync, readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { ZONE_CONTRACTS, LAYOUT_ELEMENTS, type LayoutElement, type ZoneContract } from './layout-contract'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PROTO_ROOT = resolve(__dirname, '../dev/proto-design')
const DESIGN_DOC_PATH = resolve(__dirname, '../projects/gamedesign/docs/배틀씬-UI-레이아웃-설계서.md')

type SyncStatus = 'match' | 'partial' | 'missing'

interface ElementResult {
  element: LayoutElement
  fileExists: boolean
  componentFound: boolean
  patternFound: boolean
  dimensionResults: DimensionResult[]
  status: SyncStatus
  detail: string
}

interface DimensionResult {
  key: string
  specValue: number
  actualValue: number | null
  tolerance: number
  matched: boolean
}

interface ZoneResult {
  zone: ZoneContract
  cssFound: boolean
  detail: string
}

function checkZones(battleScreenContent: string): ZoneResult[] {
  return ZONE_CONTRACTS.map(zone => {
    const cssFound = battleScreenContent.includes(zone.cssPattern)
    return {
      zone,
      cssFound,
      detail: cssFound
        ? `${zone.cssPattern} 확인됨`
        : `${zone.cssPattern} 미발견`,
    }
  })
}

function extractDimensionValue(content: string, key: string): number | null {
  const patterns = [
    new RegExp(`${escapeRegex(key)}(\\d+)px\\]`),
    new RegExp(`${escapeRegex(key)}(\\d+)\\]`),
    new RegExp(`height:\\s*['"]?(\\d+)`),
    new RegExp(`width:\\s*['"]?(\\d+)`),
  ]

  for (const pattern of patterns) {
    const match = content.match(pattern)
    if (match) return parseInt(match[1], 10)
  }
  return null
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function checkElement(element: LayoutElement): ElementResult {
  const filePath = resolve(PROTO_ROOT, element.protoFile)
  const fileExists = existsSync(filePath)

  if (!fileExists) {
    return {
      element,
      fileExists: false,
      componentFound: false,
      patternFound: false,
      dimensionResults: [],
      status: 'missing',
      detail: `파일 없음: ${element.protoFile}`,
    }
  }

  const content = readFileSync(filePath, 'utf-8')

  const componentFound = element.protoComponent
    ? content.includes(`function ${element.protoComponent}`) ||
      content.includes(`const ${element.protoComponent}`)
    : true

  const patternFound = element.protoSearchPattern
    ? content.includes(element.protoSearchPattern)
    : true

  const dimensionResults: DimensionResult[] = (element.dimensionChecks ?? []).map(check => {
    const actualValue = extractDimensionValue(content, check.key)
    const tolerance = check.tolerance ?? 0
    const matched = actualValue !== null &&
      Math.abs(actualValue - check.specValue) <= tolerance
    return {
      key: check.key,
      specValue: check.specValue,
      actualValue,
      tolerance,
      matched,
    }
  })

  const hasDimensionIssues = dimensionResults.some(d => !d.matched)
  const hasNotes = !!element.notes

  let status: SyncStatus = 'match'
  if (!componentFound || !patternFound) {
    status = 'missing'
  } else if (hasDimensionIssues || hasNotes) {
    status = 'partial'
  }

  const details: string[] = []
  if (componentFound && element.protoComponent) {
    details.push(`${element.protoComponent} 확인`)
  }
  if (patternFound && element.protoSearchPattern) {
    details.push(`'${element.protoSearchPattern}' 패턴 확인`)
  }
  if (!componentFound) {
    details.push(`${element.protoComponent} 미발견`)
  }
  if (!patternFound) {
    details.push(`'${element.protoSearchPattern}' 패턴 미발견`)
  }
  for (const d of dimensionResults) {
    if (d.matched) {
      details.push(`${d.key}${d.actualValue}px = 설계 ${d.specValue}px`)
    } else if (d.actualValue !== null) {
      details.push(`${d.key}${d.actualValue}px ≠ 설계 ${d.specValue}px`)
    }
  }
  if (element.notes) {
    details.push(element.notes)
  }

  return {
    element,
    fileExists,
    componentFound,
    patternFound,
    dimensionResults,
    status,
    detail: details.join(', '),
  }
}

function statusIcon(status: SyncStatus): string {
  switch (status) {
    case 'match': return '✅'
    case 'partial': return '⚠️'
    case 'missing': return '❌'
  }
}

function printReport(
  zoneResults: ZoneResult[],
  elementResults: ElementResult[],
): void {
  const now = new Date().toISOString().split('T')[0]
  console.log('')
  console.log(`배틀 레이아웃 동기화 검증 (${now})`)
  console.log('='.repeat(52))

  console.log('')
  console.log('[존 구조]')
  for (const zr of zoneResults) {
    const icon = zr.cssFound ? '✅' : '⚠️'
    console.log(`  ${icon} Zone ${zr.zone.id} (${zr.zone.name}): ${zr.detail}`)
  }

  const zones = ['A', 'B', 'C'] as const
  for (const zone of zones) {
    const zoneElements = elementResults.filter(r => r.element.zone === zone)
    if (zoneElements.length === 0) continue

    const zoneName = ZONE_CONTRACTS.find(z => z.id === zone)?.name ?? zone
    console.log('')
    console.log(`[Zone ${zone}: ${zoneName}]`)
    for (const er of zoneElements) {
      console.log(`  ${statusIcon(er.status)} ${er.element.label} — ${er.detail}`)
    }
  }

  const matchCount = elementResults.filter(r => r.status === 'match').length
  const partialCount = elementResults.filter(r => r.status === 'partial').length
  const missingCount = elementResults.filter(r => r.status === 'missing').length

  console.log('')
  console.log(`요약: ✅ ${matchCount} | ⚠️ ${partialCount} | ❌ ${missingCount}`)
  console.log('')
}

function generateAppendixC(
  elementResults: ElementResult[],
): string {
  const now = new Date().toISOString().split('T')[0]
  const lines: string[] = [
    '## 부록 C: 레이아웃 동기화 검증 매트릭스',
    '',
    `> 자동 생성: \`npx tsx tools/validate-layout.ts\` (최종 검증일: ${now})`,
    '',
  ]

  const zones = ['A', 'B', 'C'] as const
  const zoneNames: Record<string, string> = { A: '상단 HUD', B: '전투 무대', C: '액션 바' }

  for (const zone of zones) {
    const zoneElements = elementResults.filter(r => r.element.zone === zone)
    if (zoneElements.length === 0) continue

    lines.push(`### Zone ${zone}: ${zoneNames[zone]}`)
    lines.push('')
    lines.push('| 설계서 ID | 설계서 설명 | proto-design 파일 | proto-design 구현 | 일치 |')
    lines.push('|:----------|:----------|:-----------------|:-----------------|:-----|')

    for (const er of zoneElements) {
      const statusStr = statusIcon(er.status)
      const specDesc = `${er.element.label} (${er.element.spec.w}×${er.element.spec.h})`
      const protoFile = `\`${er.element.protoFile.split('/').pop()}\``
      lines.push(`| ${er.element.id.toUpperCase()} | ${specDesc} | ${protoFile} | ${er.detail} | ${statusStr} |`)
    }
    lines.push('')
  }

  const matchCount = elementResults.filter(r => r.status === 'match').length
  const partialCount = elementResults.filter(r => r.status === 'partial').length
  const missingCount = elementResults.filter(r => r.status === 'missing').length

  lines.push(`**전체**: ✅ ${matchCount} | ⚠️ ${partialCount} | ❌ ${missingCount}`)
  lines.push('')

  return lines.join('\n')
}

function updateDesignDoc(appendixContent: string): boolean {
  if (!existsSync(DESIGN_DOC_PATH)) {
    console.log(`설계서 미발견: ${DESIGN_DOC_PATH}`)
    return false
  }

  const doc = readFileSync(DESIGN_DOC_PATH, 'utf-8')

  const appendixStart = doc.indexOf('## 부록 C: 레이아웃 동기화 검증 매트릭스')
  if (appendixStart === -1) {
    const updatedDoc = doc.trimEnd() + '\n\n---\n\n' + appendixContent
    writeFileSync(DESIGN_DOC_PATH, updatedDoc, 'utf-8')
    console.log('부록 C 추가 완료 (신규)')
    return true
  }

  const nextSection = doc.indexOf('\n## ', appendixStart + 1)
  const endOfAppendix = nextSection !== -1 ? nextSection : doc.length

  const updatedDoc = doc.slice(0, appendixStart) + appendixContent + doc.slice(endOfAppendix)
  writeFileSync(DESIGN_DOC_PATH, updatedDoc, 'utf-8')
  console.log('부록 C 갱신 완료')
  return true
}

function main() {
  const args = process.argv.slice(2)
  const shouldUpdateDoc = args.includes('--update-doc')

  const battleScreenPath = resolve(PROTO_ROOT, 'src/components/screens/BattleScreen.tsx')
  const battleScreenContent = existsSync(battleScreenPath)
    ? readFileSync(battleScreenPath, 'utf-8')
    : ''

  const zoneResults = checkZones(battleScreenContent)
  const elementResults = LAYOUT_ELEMENTS.map(checkElement)

  printReport(zoneResults, elementResults)

  if (shouldUpdateDoc) {
    const appendixContent = generateAppendixC(elementResults)
    updateDesignDoc(appendixContent)
  }

  const hasMissing = elementResults.some(r => r.status === 'missing')
  process.exit(hasMissing ? 1 : 0)
}

main()
