export type ExampleCategory = 'frame' | 'character' | 'companion' | 'forest' | 'dungeon' | 'castle' | 'background' | 'ui' | 'skillIcon' | 'npc'

export interface PromptExample {
  id: string
  name: string
  nameEn: string
  gameplanId?: string    // gameplan 명세서 ID (예: MON_F01, CLS_W)
  designStatus?: 'confirmed' | 'draft' | 'undesigned' | 'concept'
  group?: string  // 티어 또는 맵 구분: 'T1', 'T2', 'T3', '모험동굴', '성정원' 등
  prompt: string
  negative: string
}

const joinPrompt = (...lines: Array<string | false | null | undefined>) =>
  lines.filter(Boolean).join(',\n')

const PROMPT_CUTOUT_READY_BACKGROUND = 'cutout-ready asset background: keep the designed subject isolated with a crisp silhouette, no environment, no scene, no texture, no drop shadow, no contact shadow; use a single flat pure white #FFFFFF matte background as the final output; do not draw a checkerboard transparency pattern; for OpenAI GPT image models use API background="opaque" with PNG output'

const PROMPT_WATERMARK_SAFE_MARGIN = 'leave generous outer canvas padding, especially toward the lower-right edge, so the Gemini watermark area can sit on clean empty removable background outside the main designed image area, and keep the lower-right area around 10 percent of the canvas naturally simple, open, flat, and low-detail within the same background so any Gemini watermark area does not overlap important subject matter, but do not create any separate empty square, blank box, pale panel, placeholder rectangle, framed patch, isolated background block, pale circle, round seal, orb, dot, or watermark-like corner shape there'

const PROMPT_NO_BOX_ARTIFACTS = 'no empty square, no blank box, no placeholder panel, no inset rectangle, no isolated lower-right block, no framed patch, no UI-like box artifact, no lower-right circle, no pale circle, no orb, no seal, no stamp mark, no watermark-like corner shape'

const applyPromptWatermarkSafeMargin = (prompt: string) => joinPrompt(
  prompt,
  PROMPT_CUTOUT_READY_BACKGROUND,
  PROMPT_WATERMARK_SAFE_MARGIN,
  PROMPT_NO_BOX_ARTIFACTS,
)

const applyNegativeNoBoxArtifacts = (negative: string) => `${negative},
empty square, blank box, placeholder panel, inset rectangle, isolated lower-right block, framed patch, UI box artifact,
lower-right circle, pale circle, round seal, orb, dot, stamp mark, watermark-like corner shape,
checkerboard transparency pattern, fake transparency grid, painted checker grid, gray checker pattern,
scene background, environmental backdrop, floor shadow, contact shadow, drop shadow in empty outer canvas areas`

const mapPromptExamplesWithSafeMargin = (source: Record<ExampleCategory, PromptExample[]>): Record<ExampleCategory, PromptExample[]> => {
  const result = {} as Record<ExampleCategory, PromptExample[]>

  for (const category of Object.keys(source) as ExampleCategory[]) {
    result[category] = source[category].map((example) => ({
      ...example,
      prompt: applyPromptWatermarkSafeMargin(example.prompt),
      negative: applyNegativeNoBoxArtifacts(example.negative),
    }))
  }

  return result
}

type RegionKey = 'forest' | 'dungeon' | 'castle'

export const FRAME_NEGATIVE = `character illustration, person, creature, monster,
inner rectangle, inner box, inset square, inset rectangle,
secondary panel, secondary frame, framed center panel, portrait window,
dark inner parchment box, darker center panel, recessed center area,
coin edge pattern, ridged border, gear teeth,
sun emblem, moon symbol, celestial decorations,
bright vibrant colors, neon glow, saturated colors,
chrome metal, glossy plastic, photorealistic 3D render,
complex ornate decorations, baroque style, royal filigree overload,
modern minimalist flat vector, sci-fi HUD, cyberpunk UI,
anime style, cartoon style,
watercolor bleeding, paint splatters,
text, letters, numbers, words,
multiple frames, tilted angle, perspective distortion`

export const NAMEPLATE_NEGATIVE = `character illustration, person, creature, monster,
complete card frame, full portrait card, tall vertical frame,
portrait window, inset portrait panel, attached full card border,
coin edge pattern, ridged border, gear teeth,
sun emblem, moon symbol, celestial decorations,
bright vibrant colors, neon glow, saturated colors,
chrome metal, glossy plastic, photorealistic 3D render,
complex ornate decorations, baroque style, royal filigree overload,
modern minimalist flat vector, sci-fi HUD, cyberpunk UI,
anime style, cartoon style,
watercolor bleeding, paint splatters,
text, letters, numbers, words,
multiple nameplates, tilted angle, perspective distortion`

export const CHARACTER_NEGATIVE = `realistic, photorealistic, 3D render, CGI,
anime manga style,
extreme chibi 1 to 2 head ratio, baby proportions,
pure black, pure white background, neon colors, high saturation above 60 percent,
gore, blood, horror, grotesque, scary, dark atmosphere,
tonal layering, soft shading, gradient shading, cel-shading,
visible brushwork, brush strokes, paint texture, paper grain, gouache texture,
detailed eyes with highlights and reflections, large expressive eyes,
complex accessories, ornate decoration, detailed armor, intricate patterns,
lavender tint, purple ambient light, blue color cast, cool color cast on skin,
complex detailed background, white background,
facing left, looking left, back view,
full body, legs, feet, shoes, ground, floor,
ornate heavy armor, giant oversized weapons, complex weapon designs,
oval crop, elliptical crop, rounded bottom edge, vignette fade at bottom,
blurry low quality,
watercolor, watercolor wash, watercolor blending, soft color transitions,
color bleeding between regions, gradient fills within shapes,
painted texture, artistic rendering, impressionist style,
multiple tonal values per region, ambient occlusion shading,
soft diffused edges between color zones`

export const MONSTER_NEGATIVE = `realistic, photorealistic, 3D render, CGI,
anime manga style,
pure black background, neon colors, high saturation above 60 percent,
gore, blood, horror, grotesque, scary, dark atmosphere,
tonal layering, soft shading, gradient shading, cel-shading,
visible brushwork, brush strokes, paint texture, paper grain, gouache texture,
detailed eyes with highlights and reflections, large expressive eyes,
visible pupils, visible irises, realistic eyeballs, glossy eye reflections,
complex accessories, ornate decoration, intricate patterns,
lavender tint, purple ambient light, cool color cast on skin,
complex detailed background,
facing right, looking right,
full body, legs, feet, ground, floor,
cute mascot comedy tone, slapstick expression,
oval crop, elliptical crop, rounded bottom edge, vignette fade at bottom,
blurry low quality,
watercolor, watercolor wash, watercolor blending, soft color transitions,
color bleeding between regions, gradient fills within shapes,
painted texture, artistic rendering, impressionist style,
multiple tonal values per region, ambient occlusion shading,
soft diffused edges between color zones`

export const BG_NEGATIVE = `characters, people, figures, creatures,
realistic, photorealistic, 3D render, CGI,
anime manga style, cartoon style,
pure black, pure white, neon colors, high saturation above 60 percent,
gore, blood, horror, grotesque, scary, pitch-black horror darkness,
sharp hard edges, harsh lighting, crushed blacks,
complex cluttered composition,
text, letters, numbers, watermark,
blurry low quality`

const SKILL_FRAME_NEGATIVE = `${FRAME_NEGATIVE},
vertical portrait rectangle, 2:3 tall card ratio,
tall narrow frame silhouette, rectangular non-square frame,
off-center icon window, asymmetric padding,
secondary outer frame, double frame stack,
decorative parchment panels, torn paper inserts,
diagonal bands, crossing lines, corner ornaments,
background clutter inside the frame body,
white square panel, plain white box, bright white center block`

export const UI_NEGATIVE = `character illustration, person, creature, monster, animal,
3D render, photorealistic, hyper detailed, CGI,
anime style, cartoon style, manga,
watercolor bleeding, paint splatters, heavy texture,
complex ornate decorations, baroque style,
dark horror scary gothic,
blurry low quality, noisy, grainy,
multiple objects, cluttered composition,
neon glow, overly bright, saturated neon colors,
text, letters, numbers, watermark`

export const BRANDING_NEGATIVE = `character illustration, person, creature, monster, animal,
3D render, photorealistic, hyper detailed, CGI,
anime style, cartoon style, manga,
watercolor bleeding, paint splatters, heavy texture,
complex ornate decorations, baroque style,
dark horror scary gothic,
blurry low quality, noisy, grainy,
multiple emblems, cluttered composition,
neon glow, overly bright, saturated neon colors,
illegible typography, distorted letters, warped wordmark, watermark`

const SKILL_ICON_NEGATIVE = `${UI_NEGATIVE},
background badge, circular background, emblem ring, border frame,
lower-right square, lower-right rectangle, lower-right box, pale gray square, pale gray rectangle, pale gray box,
lower-right circle, lower-right orb, lower-right dot, pale gray circle, white circle, round seal, stamp mark,
separate background shape, isolated background mark, watermark-like corner shape, corner artifact,
multiple symbols, extra prop, secondary icon,
motion trail, slash effect, spark particles, energy burst, glow aura,
gradient fill, multicolor split, metallic shine, glossy highlight,
perspective angle, tilted icon, isometric view,
tiny decorative details, texture overlay,
outline-only drawing, complex line art, multiple color regions, shaded volume, inner shadow, cast shadow,
small fragments, debris, cracks with loose pieces, ornamental cuts, complex patterning`

export const NPC_NEGATIVE = `realistic, photorealistic, 3D render, CGI,
anime manga style,
pure black, pure white background, neon colors, high saturation above 60 percent,
gore, blood, horror, grotesque, scary, dark atmosphere,
tonal layering, soft shading, gradient shading, cel-shading,
visible brushwork, brush strokes, paint texture, paper grain, gouache texture,
detailed eyes with highlights and reflections, large expressive eyes,
complex accessories, ornate decoration, intricate patterns,
lavender tint, purple ambient light, cool color cast on skin,
complex detailed background, white background,
facing left, looking left, back view,
full body, legs, feet, shoes, ground, floor,
royal throne pose, combat-ready aggression,
oval crop, elliptical crop, rounded bottom edge, vignette fade at bottom,
blurry low quality`

const CHARACTER_RENDER_BASE = [
  'simple flat color illustration with clean solid fills and no gradients',
  'bust portrait from mid-chest upward with a clean straight horizontal cut at the bottom edge',
  'centered composition with moderate headroom above the head',
  'character fills most of the frame',
  'designed to sit inside a 240x360 card frame with an inner portrait window around 216x288 pixels',
  'main character silhouette should read around 96x122 pixels within the card frame',
  'card game character portrait for cozy fantasy card game',
  'super-deformed chibi proportions around 2 to 2.5 head body ratio',
  'flat coloring with only 3 to 5 colors per character and no shading or tonal layering',
  'single color uniform weight outline in warm dark tone',
  'muted warm pastel colors strictly 40 to 55 percent saturation',
  'silhouette-driven character design recognizable from shape alone',
  'only 1 to 2 iconic props maximum',
  'tiny simplified eyes with no visible pupils or irises, paired with short simple line eyebrows and no nose detail',
  'body facing right at three-quarter angle looking toward right side',
  'solid cream parchment background #F0E8D8',
  'no border no frame',
  'vertical portrait 2:3 aspect ratio',
  'strictly flat color fills with hard boundaries between each color region',
  'each color region is a single solid tone with no internal variation',
  'zero gradients zero shading zero tonal layering within any shape',
]

const COMPANION_RENDER_BASE = [
  'simple flat color illustration with clean solid fills and no gradients',
  'companion creature bust portrait from mid-chest upward with a clean straight horizontal cut at the bottom edge',
  'centered composition with moderate headroom above the head',
  'creature fills most of the frame',
  'card game companion portrait for cozy fantasy card game',
  'flat coloring with only 3 to 5 colors per creature and no shading or tonal layering',
  'single color uniform weight outline in warm dark tone',
  'muted warm pastel colors strictly 40 to 55 percent saturation',
  'silhouette-driven creature design recognizable from shape alone',
  'small simple dot eyes',
  'solid cream parchment background #F0E8D8',
  'no border no frame',
  'square 1:1 aspect ratio',
  'close-up bust and face composition optimized for circular crop',
  'creature fills the frame without clipping ears or wings',
  'body facing right at three-quarter angle',
  'looking toward viewer with slight right tilt',
]

const REGION_PALETTE_LINE: Record<RegionKey, string> = {
  forest: 'forest region palette anchored in muted mint, sage green, lavender, cream, and soft moss tones',
  dungeon: 'dungeon region palette anchored in muted sky blue, ice blue, lavender, silver, and soft slate tones',
  castle: 'castle region palette anchored in muted dusty rose, lavender, gold, warm cream, and soft blush tones',
}

function createPortraitFramePrompt(subject: string, accentLines: string[], detailLines: string[], outputLine: string) {
  return joinPrompt(
    `game card frame design for ${subject}`,
    'empty frame template without character or monster illustration',
    'vertical portrait 2:3 ratio',
    'cozy pastel card frame for v6.0 Lavender Mist',
    'extremely simple single-surface parchment card with almost no decorative structure',
    'the whole card should read as one continuous aged parchment sheet #F0E8D8',
    'use one unified parchment surface across the full card with no separate center panel and no inset portrait window',
    'aged parchment texture must stay soft, even, and continuous across the entire card face',
    'outermost edge should feel slightly rough and softly torn like thin old parchment, kept extremely restrained and clean',
    'soft rounded corners 10 to 12px radius',
    'minimal design with no corner decorations, no ornaments, and no extra panels',
    'exact full-card frame silhouette matching a clean 2:3 card ratio from top to bottom',
    'character identity color band should be a single thin continuous line embedded directly on the same parchment surface, not a separate frame layer',
    'color band inset should stay consistent on all four sides at roughly 4 to 5 percent of card width from the outer edge',
    'color band thickness should remain narrow and uniform at roughly 1.5 to 2.5 percent of card width on every side',
    'bottom border thickness and side border thickness should remain visually identical',
    ...accentLines,
    'card interior should remain a calm even parchment field with no localized hotspot or corner glow',
    'inside the card frame should stay visually empty and open with no extra plaques, bars, boxes, inset panels, attached banners, or recessed areas',
    'do not create any extra inner rectangle, inner box, inset square, framed panel, or secondary window inside the card',
    'do not create any darker parchment rectangle, inner mat, centered panel, or double-framed portrait area',
    'no horizontal divider line, separator band, or crossbar should appear anywhere inside the frame body',
    'do not add any extra pink horizontal line or lower inner stripe near the bottom area inside the pink band',
    'keep all parchment texture subtle and evenly distributed across inside and outside surfaces',
    'avoid any visible value step between center area and surrounding area',
    'very subtle cream-tone vignette at edges',
    'smooth center-to-edge transition that keeps the full card reading as one material',
    'lower frame edge should remain a clean uninterrupted frame boundary with no integrated ribbon or plaque',
    ...detailLines,
    'clean empty single-surface area for portrait insertion',
    'area outside the outer frame edge must remain solid white with no shadow, glow, texture, or color spill',
    'professional game UI asset',
    '2D clean digital illustration',
    'aged parchment paper texture overlay',
    'isolated on solid white background',
    outputLine,
  )
}

function createNameplatePrompt(subject: string, detailLines: string[], outputLine: string) {
  return joinPrompt(
    `game UI parchment ribbon nameplate design for ${subject}`,
    'standalone nameplate asset without full card frame or portrait illustration',
    'wide horizontal ribbon banner only',
    'main card nameplate proportions around 200x44 pixels',
    'aged parchment cream paper #F0E8D8',
    'thin parchment border #d8cdb8 around the central panel',
    'soft folded ribbon ends on both sides',
    'center rectangular label panel with clean readable interior',
    'subtle paper overlap and inner shadow only, no heavy 3D depth',
    'minimalist cozy pastel fantasy UI for v6.0 Lavender Mist',
    'designed to sit at the lower edge of a 240x360 portrait card',
    'keep the center panel clean for later name text placement',
    'no text no letters no numbers inside the plate',
    ...detailLines,
    'professional game UI asset',
    '2D clean digital illustration',
    'aged parchment paper texture overlay',
    'isolated on solid white background',
    outputLine,
  )
}

function createCompanionFramePrompt(accentLines: string[], detailLines: string[]) {
  return joinPrompt(
    'game UI frame design for fantasy RPG companion creature',
    'empty circular frame template without creature illustration',
    'perfect circle shape 1:1 ratio',
    'cozy pastel companion medallion frame for v6.0 Lavender Mist',
    'aged parchment cream outer ring #F0E8D8',
    'parchment texture inner ring with warm cream base',
    'perfectly round border no corners',
    ...accentLines,
    'smooth radial gradient center with soft cream edge separation',
    ...detailLines,
    'clean empty circular center area for bust portrait insertion',
    'area outside the outer ring edge must remain solid white with no shadow, glow, texture, or color spill',
    'professional game UI asset',
    '2D clean digital illustration',
    'aged parchment paper texture overlay',
    'isolated on solid white background',
    'output resolution 512x512 pixels',
    'final usage 96x96 pixels after downscaling',
  )
}

function createSkillFramePrompt(accentLines: string[], detailLines: string[]) {
  return joinPrompt(
    'game card frame design for fantasy RPG skill card',
    'empty frame template without skill illustration',
    'strict square 1:1 ratio',
    'cozy pastel skill card frame for v6.0 Lavender Mist',
    'extremely simple single-surface parchment skill frame with card-frame-like material feel',
    'the whole frame should read as one continuous aged parchment sheet #F0E8D8',
    'aged parchment texture must stay soft, even, and continuous across the full frame face',
    'soft rounded corners 10 to 12px radius',
    'single compact square frame only with no second outer frame',
    'equal visual weight on all four sides with balanced square framing',
    'outer edge should feel slightly worn like old parchment but remain very restrained and clean',
    'use a thicker continuous accent band embedded directly on the same parchment surface, not a separate glowing frame layer',
    'the accent line should follow the same card-frame logic as character and monster frames',
    'the accent band must keep identical position and thickness on top, bottom, left, and right edges',
    'accent band inset should stay close to the outer boundary on all four sides at roughly 2 to 3 percent of frame width from the outer edge',
    'accent band thickness should be clearly visible and uniform at roughly 4 to 6 percent of frame width',
    ...accentLines,
    'there should be no inner square, no icon well, and no inset rectangle inside the frame',
    'the full interior should remain one calm open parchment field for icon placement',
    'inside the frame should remain naturally empty with no white square insert, no center box, and no extra framing',
    'outside and inside should read as one continuous parchment surface with no internal panel separation',
    'keep all parchment texture subtle and evenly distributed across the whole frame face',
    'avoid visible material contrast jumps anywhere inside the frame',
    'avoid obvious glow effects and keep the frame calm, matte, and soft',
    'only a faint readable edge separation near the outer border',
    'very subtle cream-tone vignette at edges',
    ...detailLines,
    'clean empty center area for skill icon insertion',
    'area outside the outer frame edge must remain solid white with no shadow, glow, texture, or color spill',
    'professional game UI asset',
    '2D clean digital illustration',
    'aged parchment paper texture overlay',
    'isolated on solid white background',
    'output resolution 512x512 pixels',
    'final usage 140x140 pixels after downscaling',
  )
}

function createCharacterPrompt(...details: string[]) {
  return joinPrompt(
    ...CHARACTER_RENDER_BASE,
    ...details,
    'single character illustration only',
  )
}

function createLockedCharacterSilhouettePrompt() {
  return joinPrompt(
    ...CHARACTER_RENDER_BASE,
    'locked character placeholder silhouette for character selection screen',
    'single flat dark lavender-gray silhouette only, no visible face, no eyes, no skin color, no costume color details',
    'generic unknown adventurer bust silhouette, shared common silhouette for every locked character',
    'simple hooded head-and-shoulders outline only, no class-specific weapon, no staff, no dagger, no hat, no unique hair shape',
    'soft muted silhouette color around #6A6070 on solid cream parchment background #F0E8D8',
    'slightly mysterious but cozy, not scary, not hostile, not realistic',
    'designed to sit inside the character select card as an unavailable locked class preview',
    'clear readable bust silhouette at small UI size, matching the game character card style',
    'single locked character silhouette only',
  )
}

function createCompanionPrompt(...details: string[]) {
  return joinPrompt(
    ...COMPANION_RENDER_BASE,
    ...details,
    'single creature illustration only',
  )
}

function createMonsterPrompt(region: RegionKey, tierLine: string, ...details: string[]) {
  return joinPrompt(
    'simple flat color illustration with clean solid fills and no gradients',
    'bust portrait of fantasy creature or monster from mid-chest upward with a clean straight horizontal cut at the bottom edge',
    'centered composition with moderate headroom above the head',
    'creature fills most of the frame',
    'designed to sit inside a 240x360 monster card frame with an inner portrait window around 216x288 pixels',
    'main monster silhouette should read around 92x118 pixels within the card frame',
    'card game monster portrait for cozy fantasy card game',
    'super-deformed chibi proportions around 2 to 2.5 head body ratio',
    'flat coloring with only 3 to 5 colors per creature and no shading or tonal layering',
    'single color uniform weight outline with ' + (region === 'forest' ? 'mint-green' : region === 'dungeon' ? 'sky-blue' : 'rose') + ' undertone',
    'muted warm pastel colors strictly 40 to 55 percent saturation',
    'silhouette-driven monster design recognizable from shape alone',
    'tiny simplified eyes with no visible pupils or irises, paired with short simple line eyebrows',
    'cute and charming monster design that is not scary or threatening',
    'isolated on pure solid white background for easy background removal and cutout workflow',
    'no border no frame',
    'vertical portrait 2:3 aspect ratio',
    'strictly flat color fills with hard boundaries between each color region',
    'each color region is a single solid tone with no internal variation',
    'zero gradients zero shading zero tonal layering within any shape',
    tierLine,
    REGION_PALETTE_LINE[region],
    'body facing left at three-quarter angle opposing the hero',
    ...details,
    'single creature illustration only',
  )
}

function createBackgroundPrompt(...details: string[]) {
  return joinPrompt(
    'simple stylized fantasy background illustration for card battle UI',
    'very large simple shape language with extremely minimal detail',
    'flat matte color blocks with only slight soft separation between layers',
    'noticeably darker muted pastel environment with clear foreground, midground, and background separation',
    'no watercolor look, no painterly brushwork, no visible brush texture, no washed pigment blending',
    'clean readable layered scenery designed more like simplified game background art than painted illustration',
    'background should stay visually behind characters, monsters, cards, and skill effects at all times',
    'no characters no creatures no cards',
    'subdued warm diffused lighting with clearly lowered overall brightness and restrained highlights',
    'wide landscape 16:9 aspect ratio',
    'cozy but darker fantasy mood optimized for gameplay readability and foreground contrast',
    'center area intentionally kept open, darker, and visually quiet for cards and UI',
    ...details,
  )
}

// UI 에셋 공통 스타일 베이스 (내부 사용)
const UI_ICON_STYLE = joinPrompt(
  'game UI icon for v6.0 Lavender Mist pastel fantasy card game',
  'ultra-simple skill icon symbol design with one centered motif only, similar in simplicity to the Fighting Spirit clenched fist icon',
  'icon must be readable from silhouette alone, the player should understand the feeling immediately at a glance',
  'all skill icons must use the exact same single neutral pastel color: warm greige gray #B8B2A8',
  'one solid color only, no secondary accent color, no per-skill color variation unless absolutely necessary for one tiny cutout asset',
  'flat matte vector-like filled silhouette, not an illustration, not a rendered object',
  'use bold primitive shapes with very few parts, preferably one single connected shape',
  'maximum one essential internal cut or notch, otherwise keep it as a plain filled shape',
  'single centered symbol, square 1:1 composition',
  'clean minimal design readable at very small size around 32 pixels',
  'consistent visual language across all skill icons with the same simplicity level as simple mobile game ability icons',
  'no parchment texture, no paper grain, no beige backdrop, no badge background',
  'do not place any separate square, rectangle, box, circle, orb, seal, stamp, pale mark, or watermark-like shape in the lower-right corner',
  'the lower-right corner must remain pure solid white background with no extra shape or isolated background artifact',
  'isolated on pure solid white background',
  'output 256x256 pixels',
)

function createSkillIconPrompt(symbolLine: string, detailLine: string) {
  return joinPrompt(
    UI_ICON_STYLE,
    symbolLine,
    'use warm greige gray #B8B2A8 for this icon, identical to every other skill icon',
    'single bold filled silhouette or emblem shape only',
    'extremely restrained geometry with no extra decorative strokes or small details',
    'avoid realistic object detail; simplify the idea into the fewest possible shapes',
    'keep the icon visually calm, plain, and consistent with other skill icons',
    'only the centered symbol may be drawn; no extra background marks anywhere outside the symbol',
    detailLine,
  )
}

const UI_COIN_STYLE = joinPrompt(
  'fantasy card game gemstone coin asset for v6.0 Lavender Mist',
  'clean digital illustration with soft colored outlines',
  'circular translucent gemstone coin design with polished faceted surface',
  'muted pastel highlights with subtle depth and parchment texture overlay',
  'isolated on solid white background',
  'output 256x256 pixels',
)

const UI_BUTTON_STYLE = joinPrompt(
  'game UI button for v6.0 Lavender Mist pastel fantasy card game',
  'single-surface parchment interface element with calm matte finish',
  'soft capsule or rounded rectangle shape with gently aged paper edges',
  'cream parchment base #F0E8D8 with warm beige and soft brown support tones',
  'no red accent, no weapon icon, no aggressive warning styling',
  'end-turn button mood should feel quiet, elegant, and readable rather than dangerous or flashy',
  'subtle depth through soft paper shading only, not glossy UI shine',
  'thin muted brown border close to parchment tone',
  'no text no letters no numbers',
  'clean professional game asset readable on pastel backgrounds',
  'isolated on solid white background',
  'output 512x192 pixels',
)

const UI_NODE_STYLE = joinPrompt(
  'game map node badge for v6.0 Lavender Mist pastel fantasy card game',
  'clean digital illustration with colored outlines and parchment texture',
  'small circular badge design, 1:1 ratio',
  'clean minimal readability at 24px',
  'isolated on solid white background',
  'output 128x128 pixels',
)

const SKILL_ICON_PROMPTS: PromptExample[] = [
  {
    id: 'icon-skill-basic-strike',
    name: '기본 공격',
    nameEn: 'Basic Strike',
    group: '스킬 아이콘',
    prompt: createSkillIconPrompt(
      'single plain sword silhouette pointing upward, simplified into one bold shape',
      'starter attack emblem that reads instantly as attack with no flourish',
    ),
    negative: SKILL_ICON_NEGATIVE
  },
  {
    id: 'icon-skill-defense',
    name: '방어',
    nameEn: 'Defense',
    group: '스킬 아이콘',
    prompt: createSkillIconPrompt(
      'single plain shield silhouette with one simple center bar cut only',
      'defense emblem that reads instantly as protection with stable symmetry',
    ),
    negative: SKILL_ICON_NEGATIVE
  },
  {
    id: 'icon-skill-fighting-spirit',
    name: '투지',
    nameEn: 'Fighting Spirit',
    group: '스킬 아이콘',
    prompt: createSkillIconPrompt(
      'single clenched fist silhouette, bold and compact like a simple punch icon',
      'determination emblem that reads instantly as fighting spirit with no explosive energy cues',
    ),
    negative: SKILL_ICON_NEGATIVE
  },
  {
    id: 'icon-skill-combo-strike',
    name: '연속 베기',
    nameEn: 'Combo Strike',
    group: '스킬 아이콘',
    prompt: createSkillIconPrompt(
      'two short parallel blade silhouettes fused into one compact emblem',
      'double-hit attack icon that reads as repeated strike with no motion trails',
    ),
    negative: SKILL_ICON_NEGATIVE
  },
  {
    id: 'icon-skill-cleave',
    name: '분산 공격',
    nameEn: 'Cleave',
    group: '스킬 아이콘',
    prompt: createSkillIconPrompt(
      'single broad crescent blade silhouette spanning left to right',
      'wide attack emblem that reads as area sweep without sparks or radiating effects',
    ),
    negative: SKILL_ICON_NEGATIVE
  },
  {
    id: 'icon-skill-weakening-strike',
    name: '약화 공격',
    nameEn: 'Weakening Strike',
    group: '스킬 아이콘',
    prompt: createSkillIconPrompt(
      'single sword silhouette with one small notch cut near the tip only',
      'weakening attack emblem that reads as damaged power with one restrained broken cue',
    ),
    negative: SKILL_ICON_NEGATIVE
  },
  {
    id: 'icon-skill-weakening-blow',
    name: '약화의 일격',
    nameEn: 'Weakening Blow',
    group: '스킬 아이콘',
    prompt: createSkillIconPrompt(
      'single blunt hammer silhouette with one shallow notch mark only',
      'heavy weakening strike emblem kept blocky, blunt, and simple',
    ),
    negative: SKILL_ICON_NEGATIVE
  },
  {
    id: 'icon-skill-charge',
    name: '차지',
    nameEn: 'Charge Attack',
    group: '스킬 아이콘',
    prompt: createSkillIconPrompt(
      'single bold lightning bolt silhouette, one connected zigzag shape',
      'charge emblem that reads instantly as stored power with no sparks or aura',
    ),
    negative: SKILL_ICON_NEGATIVE
  },
  {
    id: 'icon-skill-vulnerable-strike',
    name: '취약 공격',
    nameEn: 'Vulnerable Strike',
    group: '스킬 아이콘',
    prompt: createSkillIconPrompt(
      'single target mark silhouette with one vertical split through center only',
      'vulnerable debuff emblem using one broken target shape only',
    ),
    negative: SKILL_ICON_NEGATIVE
  },
  {
    id: 'icon-skill-desperate-strike',
    name: '절망의 일격',
    nameEn: 'Desperate Strike',
    group: '스킬 아이콘',
    prompt: createSkillIconPrompt(
      'single simple skull-like mask silhouette with one straight blade cut through it',
      'last-resort attack emblem kept stark, flat, and minimal',
    ),
    negative: SKILL_ICON_NEGATIVE
  },
  {
    id: 'icon-skill-focus',
    name: '집중',
    nameEn: 'Focus',
    group: '스킬 아이콘',
    prompt: createSkillIconPrompt(
      'single eye silhouette with one small center pupil cut only',
      'focus emblem that reads instantly as attention with no rays or aura',
    ),
    negative: SKILL_ICON_NEGATIVE
  },
  {
    id: 'icon-skill-regenerative-defense',
    name: '재생 방어',
    nameEn: 'Regenerative Defense',
    group: '스킬 아이콘',
    prompt: createSkillIconPrompt(
      'single shield silhouette with one small leaf cut at center only',
      'regenerative defense emblem with one restrained organic cue',
    ),
    negative: SKILL_ICON_NEGATIVE
  },
  {
    id: 'icon-skill-weakening-defense',
    name: '약화 방어',
    nameEn: 'Weakening Defense',
    group: '스킬 아이콘',
    prompt: createSkillIconPrompt(
      'single shield silhouette with one small downward notch mark only',
      'weakening defense emblem with a plain downward cue only',
    ),
    negative: SKILL_ICON_NEGATIVE
  },
  {
    id: 'icon-skill-desperate-shield',
    name: '절망의 방패',
    nameEn: 'Desperate Shield',
    group: '스킬 아이콘',
    prompt: createSkillIconPrompt(
      'single shield silhouette with one bold center split only',
      'last-resort defense emblem without swirl, debris, or extra fragments',
    ),
    negative: SKILL_ICON_NEGATIVE
  },
]


// ========================================
// PROMPT_EXAMPLES - 새 구조 (6개 카테고리)
// ========================================
const BASE_PROMPT_EXAMPLES: Record<ExampleCategory, PromptExample[]> = {
  // ========================================
  // ========================================
  'frame': [
    {
      id: 'frame-player',
      name: '플레이어 프레임',
      nameEn: 'Player Frame',
      group: '캐릭터 프레임',
      prompt: createPortraitFramePrompt(
        'fantasy RPG hero card',
        [
          'single uniform rose-quartz color band #E8B4B8 used as the hero identity accent',
          'the rose-quartz band must keep identical position and thickness on top, bottom, left, and right edges',
        ],
        [
          'simple parchment card with slight worn-paper edge character only',
          'minimalist adventurer design with no ornate filigree or royal emblems',
          'frame should complement pastel character art in cozy lavender world',
          'cozy pastel adventure atmosphere for Lavender Mist card game',
        ],
        'output resolution 512x682 pixels, final usage 180x240 pixels after downscaling',
      ),
      negative: FRAME_NEGATIVE
    },
    {
      id: 'frame-t1',
      name: 'T1 프레임 (일반)',
      nameEn: 'Tier 1 Frame',
      group: '캐릭터 프레임',
      prompt: createPortraitFramePrompt(
        'common fantasy RPG monster card',
        [
          'single uniform muted-silver color band #B8B8C8 used as the tier 1 identity accent',
          'the muted-silver band must keep identical position and thickness on top, bottom, left, and right edges',
        ],
        [
          'match the player card frame layout exactly: same 2:3 silhouette, same 3 to 5px outer frame feel, same 10px corner language, and same 12px-style inner inset spacing discipline',
          'use the player frame as the structural reference for all spacing, margins, band placement, and overall balance',
          'replace the player rose-quartz inner band with muted silver #B8B8C8 for tier 1 identity',
          'quiet practical common-enemy treatment with the lightest visual weight among monster tiers',
          'no boss accents, no elite prestige cues, no ornamental hierarchy marks, only a restrained silver distinction',
          'same cozy readable world as the player frame but clearly more neutral and utilitarian',
        ],
        'output resolution 512x682 pixels, final usage 180x240 pixels after downscaling',
      ),
      negative: FRAME_NEGATIVE
    },
    {
      id: 'frame-t2',
      name: 'T2 프레임 (정예)',
      nameEn: 'Tier 2 Frame',
      group: '캐릭터 프레임',
      prompt: createPortraitFramePrompt(
        'elite fantasy RPG enemy card',
        [
          'single uniform muted-gold color band #C8B888 used as the tier 2 identity accent',
          'the muted-gold band must keep identical position and thickness on top, bottom, left, and right edges',
        ],
        [
          'match the player card frame layout exactly: same 2:3 silhouette, same 3 to 5px outer frame feel, same 10px corner language, and same 12px-style inner inset spacing discipline',
          'use the player frame as the structural reference for all spacing, margins, band placement, and overall balance',
          'replace the player rose-quartz inner band with muted gold #C8B888 for tier 2 identity',
          'slightly heavier and more premium than tier 1 while remaining clearly in the same family as the player frame',
          'subtle elite presence through firmer frame weight and slightly richer parchment contrast, not through extra ornaments',
          'minimalist elite treatment with no crown motifs, spikes, medals, or decorative authority symbols',
        ],
        'output resolution 512x682 pixels, final usage 180x240 pixels after downscaling',
      ),
      negative: `${FRAME_NEGATIVE},
cute friendly, cheerful bright`
    },
    {
      id: 'frame-t3',
      name: 'T3 프레임 (보스)',
      nameEn: 'Tier 3 Frame',
      group: '캐릭터 프레임',
      prompt: createPortraitFramePrompt(
        'boss fantasy RPG enemy card',
        [
          'single uniform muted-rose color band #C89098 used as the tier 3 identity accent',
          'the muted-rose band must keep identical position and thickness on top, bottom, left, and right edges',
        ],
        [
          'match the player card frame layout exactly: same 2:3 silhouette, same 3 to 5px outer frame feel, same 10px corner language, and same 12px-style inner inset spacing discipline',
          'use the player frame as the structural reference for all spacing, margins, band placement, and overall balance',
          'replace the player rose-quartz inner band with muted rose #C89098 for tier 3 identity',
          'heaviest visual weight among monster tiers with deeper corner density and firmer border authority while preserving clean readability',
          'boss presence should feel ancient and important without horror, gore, or chaotic ornament overload',
          'allow only a very restrained boss distinction such as tiny ancient inset cues, while keeping the silhouette mostly identical to the player frame',
        ],
        'output resolution 512x682 pixels, final usage 180x240 pixels after downscaling',
      ),
      negative: `${FRAME_NEGATIVE},
cute friendly, cheerful bright`
    },
    {
      id: 'nameplate-player',
      name: '플레이어 네임플레이트',
      nameEn: 'Player Nameplate',
      group: '카드 네임플레이트',
      prompt: createNameplatePrompt(
        'fantasy RPG hero card',
        [
          'soft rose-quartz edge tint #E8B4B8 kept very restrained',
          'warm cozy adventurer mood matching player card identity',
          'balanced parchment ribbon with clean readability for class name text',
        ],
        'output resolution 256x64 pixels, final usage 200x44 pixels after downscaling',
      ),
      negative: NAMEPLATE_NEGATIVE
    },
    {
      id: 'nameplate-monster',
      name: '몬스터 네임플레이트',
      nameEn: 'Monster Nameplate',
      group: '카드 네임플레이트',
      prompt: createNameplatePrompt(
        'fantasy RPG monster card',
        [
          'same exact silhouette and dimensions as the player nameplate for shared card UI consistency',
          'neutral parchment treatment that fits tier 1, tier 2, and tier 3 monster cards equally well',
          'clear readable center panel for monster name text without horror styling or metallic plaques',
        ],
        'output resolution 256x64 pixels, final usage 200x44 pixels after downscaling',
      ),
      negative: NAMEPLATE_NEGATIVE
    },
    {
      id: 'frame-companion',
      name: '동료 프레임',
      nameEn: 'Companion Frame',
      group: '캐릭터 프레임',
      prompt: createCompanionFramePrompt(
        [
          'warm gold glow accent #C9A86C',
          'soft warm gold rim light effect around the circular border',
        ],
        [
          'warm inviting magical aura tuned for friendly companions rather than combat elites',
          'minimalist medallion surface with no decorative motifs',
          'minimalist natural design with gentle parchment charm',
        ],
      ),
      negative: `${FRAME_NEGATIVE},
multiple frames, tilted angle,
red purple gold accent colors,
scary dark menacing`
    },
    {
      id: 'skill-frame-attack',
      name: '공격 스킬 프레임',
      nameEn: 'Attack Skill Frame',
      group: '스킬 카드 프레임',
      prompt: createSkillFramePrompt(
        [
          'single uniform muted pastel-rose accent band #D4A0A0 used as the attack frame identity accent',
          'the pastel-rose band must remain thick, continuous, and close to the outer edge on all four sides',
        ],
        [
          'forward-leaning combat energy suitable for strike and damage icons',
          'calm parchment-first presentation that matches the current battle scene better than flashy combat VFX styling',
          'clean aggressive readability without flames, skull overload, or weapon clutter',
        ],
      ),
      negative: SKILL_FRAME_NEGATIVE
    },
    {
      id: 'skill-frame-defense',
      name: '방어 스킬 프레임',
      nameEn: 'Defense Skill Frame',
      group: '스킬 카드 프레임',
      prompt: createSkillFramePrompt(
        [
          'single uniform muted pastel-sky accent band #A0B8D4 used as the defense frame identity accent',
          'the pastel-sky band must remain thick, continuous, and close to the outer edge on all four sides',
        ],
        [
          'stable guarded mood suitable for shields, armor, and defensive timing',
          'calm readable structure with no ornate heraldry or glossy chrome finish',
          'keep the frame visually quieter than the icon so it harmonizes with the soft battle UI',
        ],
      ),
      negative: SKILL_FRAME_NEGATIVE
    },
    {
      id: 'skill-frame-buff',
      name: '버프 스킬 프레임',
      nameEn: 'Buff Skill Frame',
      group: '스킬 카드 프레임',
      prompt: createSkillFramePrompt(
        [
          'single uniform muted pastel-sage accent band #A0C8A0 used as the buff frame identity accent',
          'the pastel-sage band must remain thick, continuous, and close to the outer edge on all four sides',
        ],
        [
          'uplifting supportive mood suitable for focus, resolve, and enhancement effects',
          'gentle natural growth energy without royal luxury or flashy sparkle clutter',
          'maintain soft parchment simplicity so buff frames do not overpower the battlefield',
        ],
      ),
      negative: SKILL_FRAME_NEGATIVE
    },
    {
      id: 'skill-frame-utility',
      name: '유틸 스킬 프레임',
      nameEn: 'Utility Skill Frame',
      group: '스킬 카드 프레임',
      prompt: createSkillFramePrompt(
        [
          'single uniform muted pastel-lavender accent band #B8A0D4 used as the utility frame identity accent',
          'the pastel-lavender band must remain thick, continuous, and close to the outer edge on all four sides',
        ],
        [
          'clever versatile mood suitable for coin control, setup, and tactical manipulation',
          'neutral understated design that stays readable beside louder attack and buff frames',
          'preserve understated parchment balance consistent with the current battle scene mood',
        ],
      ),
      negative: SKILL_FRAME_NEGATIVE
    },
    {
      id: 'frame-reward-choice',
      name: '보상 선택 프레임',
      nameEn: 'Reward Choice Frame',
      group: '보상 프레임',
      prompt: joinPrompt(
        'game card frame design for reward selection in a cozy dark fantasy deckbuilder',
        'empty vertical reward card frame without illustration or text',
        'vertical 2:3 ratio',
        'Lavender Mist visual DNA with premium parchment material feel',
        'single-surface aged parchment frame #F0E8D8 with soft dusty-gold and muted lavender support accents',
        'clean celebratory feeling suitable for post-battle reward choice without looking luxurious or noisy',
        'clear central area for reward illustration or reward icon placement',
        'restrained elegant border logic with no inner box, no inset panel, and no extra plaque',
        'subtle reward importance through calm gold-lavender emphasis only',
        'professional game UI asset',
        '2D clean digital illustration',
        'isolated on solid white background',
        'output resolution 512x768 pixels',
      ),
      negative: FRAME_NEGATIVE
    },
    {
      id: 'frame-next-choice-card-front',
      name: '다음 선택지 카드 앞면',
      nameEn: 'Next Choice Card Front',
      group: '선택지 카드',
      prompt: joinPrompt(
        'front face design for a next destination choice card in a cozy dark fantasy roguelike deckbuilder',
        'complete vertical 2:3 card front asset for choosing the next route after battle',
        'concept: a quiet gray wayfinder card that matches the same physical parchment-card texture and premium frame language as the character card, but uses a muted gray and gray-purple palette instead of warm cream character tones',
        'same frame feeling as the character card: soft worn edges, thick rounded card border, muted printed-game-card finish, but keep the interior cleaner and flatter than parchment',
        'gray-toned Lavender Mist palette with warm gray parchment, muted slate gray, dusty gray-purple, and dark lavender outline only',
        'simple centered composition with only one icon medallion and one nameplate, both grouped tightly around the visual center of the card, no lower section at all',
        'icon area: one large circular destination node icon medallion placed just slightly above the exact center of the card, not near the top, sized for monster, shop, event, rest, village, or boss symbol placement',
        'name area: one simple horizontal nameplate directly below the medallion, close to the icon and still near the card center, aligned on the same central vertical axis',
        'no description panel, no lower text field, no reward area, no risk area, no secondary information block',
        'remove the entire lower information area concept completely, do not create a bottom panel, bottom blank field, bottom parchment surface, or bottom decorative space',
        'no cracked background, no vein-like branching lines, no map-path lines, no fracture pattern anywhere on the card',
        'the card should read immediately as a next destination choice card through icon plus name only',
        'background should be clean smooth muted gray with only the card frame and the central icon-and-name unit',
        'premium matte gray card front, readable at small gameplay size, suitable for a dark battle scene overlay',
        'no written text in the image, only one name-safe blank plate for later UI label placement',
        'no character illustration and no monster illustration, focus only on the reusable card front UI design for icon and name',
        'do not place any seal, stamp, coin, pearl, bubble, white circle, pale circle, or round watermark-like mark in the lower-right corner',
        'lower-right corner must remain part of the same parchment card surface with no isolated circular shape and no bright white spot',
        'minimal restrained border logic with no heavy ornament, no filigree, no glossy shine, no gold emphasis, and no sci-fi HUD styling',
        'professional game UI asset',
        '2D clean digital illustration',
        'isolated on solid white background',
        'output resolution 512x768 pixels',
      ),
      negative: `${FRAME_NEGATIVE},
description panel, lower text field, lower information area, bottom panel, bottom blank field, bottom parchment surface, bottom decorative space, reward hint area, risk hint area, secondary information box, multiple label plates, written text, letters, numbers, cracked background, crack lines, vein lines, branching path motif, map-path lines, fracture pattern, lower parchment grain, lower paper texture, bottom decorative texture, bottom path lines,
white circle, pale circle, circular white seal, round white stamp, white orb, white bubble, isolated circular mark, lower-right white circle, lower-right seal, lower-right round spot`
    },
    {
      id: 'frame-status-tooltip-badge',
      name: '상태이상 툴팁/배지 프레임',
      nameEn: 'Status Tooltip and Badge Frame',
      group: '상태 프레임',
      prompt: joinPrompt(
        'status effect tooltip and badge frame set for fantasy battle UI',
        'one compact horizontal tooltip plate and one small badge frame designed in the same family',
        'cozy Lavender Mist dark fantasy UI with parchment-first material language',
        'soft cream parchment base #F0E8D8 with restrained jewel-tone accent pockets for poison, spore, vulnerable, and strength variants',
        'minimal clean border structure, high readability at small size, no extra ornament',
        'badge should feel compact and symbolic, tooltip should feel stable and readable',
        'clear icon-safe area and text-safe area with no inset rectangle or placeholder box',
        'professional game UI asset',
        '2D clean digital illustration',
        'isolated on solid white background',
        'output resolution 512x256 pixels',
      ),
      negative: FRAME_NEGATIVE
    },
    {
      id: 'frame-accessory-slot',
      name: '액세서리 슬롯 프레임',
      nameEn: 'Accessory Slot Frame',
      group: '장신구 프레임',
      prompt: joinPrompt(
        'accessory slot frame for character side equipment display in a fantasy battle HUD',
        'small medallion-like slot frame with either circular or softly rounded-square silhouette',
        'Lavender Mist style, cozy pastel dark fantasy, parchment-metal hybrid material feel',
        'muted bronze, cream parchment, and soft lavender-gray accent tones',
        'collectible relic feeling with very restrained embossed edge only',
        'clean center opening for accessory icon placement and excellent readability at 40 to 56 pixels',
        'no heavy ornament, no crown motif, no extra chains or hanging parts',
        'professional game UI asset',
        '2D clean digital illustration',
        'isolated on solid white background',
        'output resolution 256x256 pixels',
      ),
      negative: FRAME_NEGATIVE
    },
    {
      id: 'frame-node-medallion',
      name: '노드 중앙 메달리온',
      nameEn: 'Node Medallion Frame',
      group: '노드 프레임',
      prompt: joinPrompt(
        'destination node icon medallion background for route selection cards',
        'small circular emblem plate for monster, shop, event, rest, boss, and village icons',
        'cozy Lavender Mist dark fantasy UI with aged parchment medallion material',
        'soft cream center, restrained colored rim, and subtle inset glow tuned for dark battle scenes',
        'premium matte finish with minimal geometry and strong icon readability at small size',
        'no filigree, no extra panel, no layered badge stack, no banner attachment',
        'professional game UI asset',
        '2D clean digital illustration',
        'isolated on solid white background',
        'output resolution 256x256 pixels',
      ),
      negative: FRAME_NEGATIVE
    }
  ],

  'character': [
    {
      id: 'warrior',
      name: '전사',
      nameEn: 'Warrior',
      gameplanId: 'CLS_W',
      designStatus: 'confirmed',
      prompt: createCharacterPrompt(
        'rose-quartz toned vest (#E8B4B8) over cream shirt with slightly darker trim for readable torso separation',
        'short spiky warm-brown hair with bold messy silhouette and clear outer contour readable at small card size',
        'small sword hilt at shoulder kept simple and unmistakable',
        'brave beginner adventurer with friendly but focused expression, face and shoulders scaled large for immediate card readability',
      ),
      negative: CHARACTER_NEGATIVE
    },
    {
      id: 'mage',
      name: '마법사',
      nameEn: 'Mage',
      gameplanId: 'CLS_M',
      designStatus: 'undesigned',
      prompt: createCharacterPrompt(
        'young apprentice mage class character with wise gentle expression and tiny simplified eyes',
        'amethyst-toned robe (#B8A0D0) with cream parchment collar and one dark lavender sash for clear torso separation',
        'long flowing dark-violet hair forming a clean recognizable silhouette under a simple pointed wide-brim wizard hat',
        'small wooden staff tip visible near the shoulder with one muted gold crystal accent (#C9A86C), no large spell effects',
        'soft mystical but cozy appearance, scholarly calm personality, readable as mage even at small character select size',
      ),
      negative: CHARACTER_NEGATIVE
    },
    {
      id: 'rogue',
      name: '도적',
      nameEn: 'Rogue',
      gameplanId: 'CLS_R',
      designStatus: 'undesigned',
      prompt: createCharacterPrompt(
        'young rogue scout class character with sly friendly smirk and tiny simplified eyes',
        'emerald-toned hooded cloak (#A0C8B0) over muted leather-brown shoulder wrap for clear class identity',
        'short choppy dark hair peeking from an oversized sage-green hood with a sharp agile silhouette',
        'small dagger handle visible near the shoulder, kept simple and non-threatening, no blood, no aggressive pose',
        'nimble stealthy but charming appearance, playful confident personality, readable as rogue even at small character select size',
      ),
      negative: CHARACTER_NEGATIVE
    },
    {
      id: 'character-locked-silhouette',
      name: '잠금 캐릭터 공통 실루엣',
      nameEn: 'Locked Character Common Silhouette',
      designStatus: 'undesigned',
      group: '캐릭터 선택 잠금',
      prompt: createLockedCharacterSilhouettePrompt(),
      negative: CHARACTER_NEGATIVE
    },
  ],

  // ========================================
  // 3. COMPANION - 동료 (3종)
  // ========================================
  'companion': [
    {
      id: 'moss-fairy',
      name: '이끼 요정',
      nameEn: 'Moss Fairy',
      prompt: createCompanionPrompt(
        'tiny fairy creature in soft moss green (#7AB88A)',
        'small translucent wings',
        'leaf-shaped ears',
      ),
      negative: CHARACTER_NEGATIVE
    },
    {
      id: 'wild-wolf',
      name: '야생 늑대',
      nameEn: 'Wild Wolf',
      prompt: createCompanionPrompt(
        'small wolf pup with gray-brown fur (#8B7D6B)',
        'small alert ears',
      ),
      negative: CHARACTER_NEGATIVE
    },
    {
      id: 'forest-owl',
      name: '숲 올빼미',
      nameEn: 'Forest Owl',
      prompt: createCompanionPrompt(
        'small rounded owl with brown-beige feathers (#D2B48C)',
        'tufted ear feathers',
      ),
      negative: CHARACTER_NEGATIVE
    }
  ],

  // 5. FOREST - gameplan 몬스터-명세서 기반 (8종) — docs/specific/몬스터-명세서.md
  'forest': [
    {
      id: 'goblin',
      name: '고블린',
      nameEn: 'Goblin',
      gameplanId: 'MON_F01',
      designStatus: 'confirmed',
      group: 'T1',
      prompt: createMonsterPrompt(
        'forest',
        'common enemy creature',
        'small goblin with moss-green skin (#7AB88A) and slightly darker ear and cheek accents for silhouette separation',
        'pointy ears and one tiny worn wooden dagger held close to the body as a secondary prop only',
        'hunched sneaky silhouette with oversized head and shoulders for strong small-card readability',
      ),
      negative: MONSTER_NEGATIVE
    },
    {
      id: 'poison-spider',
      name: '독거미',
      nameEn: 'Poison Spider',
      gameplanId: 'MON_F02',
      designStatus: 'confirmed',
      group: 'T1',
      prompt: createMonsterPrompt(
        'forest',
        'common enemy creature',
        'round poison spider with brown body and purple markings (#9A80B8)',
        'tiny simplified face with a few small dot eyes and barely visible cute fangs',
        'compact rounded silhouette that feels readable and more curious than scary',
      ),
      negative: MONSTER_NEGATIVE
    },
    {
      id: 'spore-parasite',
      name: '버섯 기생체',
      nameEn: 'Spore Parasite',
      gameplanId: 'MON_F03',
      designStatus: 'confirmed',
      group: 'T1',
      prompt: createMonsterPrompt(
        'forest',
        'common enemy creature',
        'mushroom creature with large mauve cap (#9A80B8) on small body',
        'a few floating spore dots',
        'shambling rounded silhouette',
      ),
      negative: MONSTER_NEGATIVE
    },
    {
      id: 'thorn-vine',
      name: '가시 덩굴',
      nameEn: 'Thorn Vine',
      gameplanId: 'MON_F04',
      designStatus: 'confirmed',
      group: 'T2',
      prompt: createMonsterPrompt(
        'forest',
        'elite enemy creature',
        'vine plant monster with coiling green stems (#A0C8B0)',
        'sharp thorns and tendril arms',
        'coiled strike silhouette',
      ),
      negative: MONSTER_NEGATIVE
    },
    {
      id: 'golem',
      name: '골렘',
      nameEn: 'Golem',
      gameplanId: 'MON_F05',
      designStatus: 'confirmed',
      group: 'T2',
      prompt: createMonsterPrompt(
        'forest',
        'elite enemy creature',
        'round stone golem in muted silver (#9898A8)',
        'moss patches (#7AB88A) on shoulders',
        'heavy solid silhouette',
      ),
      negative: MONSTER_NEGATIVE
    },
    {
      id: 'wolf',
      name: '늑대',
      nameEn: 'Wolf',
      gameplanId: 'MON_F06',
      designStatus: 'draft',
      group: 'T2',
      prompt: createMonsterPrompt(
        'forest',
        'elite enemy creature',
        'wolf with silver-brown fur (#9898A8)',
        'howling pose with head tilted up',
        'alert predator silhouette',
      ),
      negative: MONSTER_NEGATIVE
    },
    {
      id: 'rotten-tree',
      name: '썩은 나무',
      nameEn: 'Rotten Tree',
      gameplanId: 'MON_F07',
      designStatus: 'confirmed',
      group: 'T2',
      prompt: createMonsterPrompt(
        'forest',
        'elite enemy creature',
        'rotting tree creature in muted brown (#C8B888)',
        'sleepy dark eye hollows and branch arms',
        'broad trunk silhouette with calm heavy presence',
      ),
      negative: MONSTER_NEGATIVE
    },
    {
      id: 'ancient-grove-lord-p1',
      name: '고대 수목군주 (Phase 1)',
      nameEn: 'Ancient Grove Lord - Phase 1',
      gameplanId: 'BOSS_F01',
      designStatus: 'draft',
      group: 'T3',
      prompt: createMonsterPrompt(
        'forest',
        'legendary boss creature, imposing presence',
        'humanoid tree guardian in muted brown bark (#C8B888)',
        'moss and vines (#7AB88A) on shoulders, soft gold eyes (#C9A86C)',
        'tall dignified silhouette with calm ancient authority',
      ),
      negative: MONSTER_NEGATIVE
    },
    {
      id: 'ancient-grove-lord-p2',
      name: '고대 수목군주 (Phase 2)',
      nameEn: 'Ancient Grove Lord - Phase 2',
      gameplanId: 'BOSS_F01',
      designStatus: 'draft',
      group: 'T3',
      prompt: createMonsterPrompt(
        'forest',
        'legendary boss creature, imposing presence',
        'awakened tree creature with gently opened bark seams revealing muted gold glow (#C9A86C)',
        'clear gold eyes (#C9A86C) and spreading branches with readable layered shapes',
        'expanded powerful silhouette larger than phase 1 while staying cozy-fantasy readable',
      ),
      negative: MONSTER_NEGATIVE
    }
  ],

  // 6. DUNGEON
  'dungeon': [
    {
      id: 'tiny-skeleton',
      name: '꼬마 해골',
      nameEn: 'Tiny Skeleton',
      designStatus: 'concept',
      group: 'T1',
      prompt: createMonsterPrompt(
        'dungeon',
        'common enemy creature',
        'small skeleton with cream bones (#E8E4D9)',
        'oversized helmet and tiny wooden sword',
        'wobbly brittle silhouette',
      ),
      negative: MONSTER_NEGATIVE
    },
    {
      id: 'golden-golem',
      name: '황금 골렘',
      nameEn: 'Golden Golem',
      designStatus: 'concept',
      group: 'T2',
      prompt: createMonsterPrompt(
        'dungeon',
        'elite enemy creature',
        'treasure golem made of gold coins and plates (#C9A86C)',
        'heavy coin-stacked head',
        'bulky treasure guardian silhouette',
      ),
      negative: MONSTER_NEGATIVE
    },
    {
      id: 'ancient-dungeon-king',
      name: '던전의 고대왕',
      nameEn: 'Ancient Dungeon King',
      designStatus: 'concept',
      group: 'T3',
      prompt: createMonsterPrompt(
        'dungeon',
        'legendary boss creature, imposing presence',
        'skeleton king with cream bones (#E8E4D9) and gold crown (#C9A86C)',
        'faded purple robe and scepter',
        'regal imposing silhouette',
      ),
      negative: MONSTER_NEGATIVE
    }
  ],

  // 7. CASTLE
  'castle': [
    {
      id: 'butler-armor',
      name: '집사 갑옷',
      nameEn: 'Butler Armor',
      designStatus: 'concept',
      group: 'T2',
      prompt: createMonsterPrompt(
        'castle',
        'elite enemy creature',
        'empty butler armor in silver (#9898A8) with rose accents',
        'visor glow and serving tray',
        'polite bowing silhouette',
      ),
      negative: MONSTER_NEGATIVE
    },
    {
      id: 'vampire-count',
      name: '뱀파이어 백작',
      nameEn: 'Vampire Count',
      designStatus: 'concept',
      group: 'T3',
      prompt: createMonsterPrompt(
        'castle',
        'legendary boss creature, imposing presence',
        'vampire count in muted rose attire (#C07878)',
        'flowing cape and small fangs',
        'aristocratic silhouette with wine glass',
      ),
      negative: MONSTER_NEGATIVE
    }
  ],

  // 8. BACKGROUND
  'background': [
    {
      id: 'sunny-forest-day',
      name: '햇살 숲 - 낮',
      nameEn: 'Sunny Forest - Day',
      group: '숲',
      prompt: createBackgroundPrompt(
        'forest region tier 1 navigation and battle background',
        'deeper mint, sage green, muted cream, and dim lavender palette in darker broad flat masses',
        'quiet forest clearing with a dim open center lane reserved for combat silhouettes and UI readability',
        'left and right foreground trunks should frame the scene as simple solid silhouettes',
        'midground tree groups and distant background should stay clearly separated with simple layer steps and almost no leaf detail',
        'calm shadowed woodland mood with clean understated scenery and no painted atmosphere',
      ),
      negative: BG_NEGATIVE
    },
    {
      id: 'sunny-forest-dusk',
      name: '햇살 숲 - 황혼',
      nameEn: 'Sunny Forest - Dusk',
      group: '숲',
      prompt: createBackgroundPrompt(
        'forest region tier 1 navigation background at dusk',
        'dark muted mint-olive, dusty lavender, and restrained amber palette in simple flat groups',
        'layered tree silhouettes with clean readable shapes and minimal branch detail',
        'longer dusk shadows and only a very light atmospheric fade, not a painted haze',
        'calm twilight atmosphere with quiet tension, darker overall value balance, and simple scene structure',
      ),
      negative: BG_NEGATIVE
    },
    {
      id: 'treasure-room',
      name: '보물 창고',
      nameEn: 'Treasure Room',
      group: '던전',
      prompt: createBackgroundPrompt(
        'dungeon region tier 1 treasure chamber background',
        'dark slate blue, silver-lavender, and muted gold palette in restrained flat areas',
        'arched stone forms and treasure silhouettes suggested with very large simple shapes only',
        'small dim warm gold accent near the center for discovery mood without glow-heavy effects or bright hotspots',
        'old hidden chamber feeling that stays clean, sparse, readable, understated, and slightly darker overall',
      ),
      negative: BG_NEGATIVE
    },
    {
      id: 'castle-garden',
      name: '성 정원',
      nameEn: 'Castle Garden',
      group: '성',
      prompt: createBackgroundPrompt(
        'castle region tier 1 garden background',
        'dusty rose, muted lavender, aged cream, and soft gold palette in darker restrained flat blocks of color',
        'elegant hedges, terrace lines, and distant architecture hinted with very simple clean forms',
        'royal but welcoming atmosphere with minimal detail, sparse composition, and a darker quiet open center',
        'serene garden mood with gentle tension, reduced brightness, and no painterly texture emphasis',
      ),
      negative: BG_NEGATIVE
    }
  ],

  'skillIcon': SKILL_ICON_PROMPTS,

  'ui': [
    {
      id: 'brand-logo-duskfold',
      name: '게임 로고 - 더스크폴드',
      nameEn: 'Game Logo - Duskfold',
      group: '브랜딩',
      prompt: `symbolic game logo mark for a cozy dark fantasy deckbuilder,

minimal emblem only with no text and no letters,
use the exact same central motif language as the card deck back design,
main symbol should be the deck back center emblem itself adapted into a standalone logo mark,
one bold sun disk and one clear crescent moon combined inside a very simple circular frame,
the emblem should feel like it was directly lifted from the center of the card back with no extra ornament added,
avoid vague celestial abstraction and avoid any shape that breaks consistency with the card back motif,
subtle folded-card geometry may remain only if it matches the existing card back center emblem,
extremely restrained composition with large negative space,
muted pastel palette using dark lavender, muted cream, moon-purple, and dusty rose only,
flat matte graphic design, plain vector-like silhouette, no shine, no gloss, no gemstone feeling,
should feel elegant, calm, simple, iconic, and fully consistent with the card deck back identity,
must sit naturally over the current dark battle background without overpowering characters, monsters, cards, or skill effects,
high legibility at small size`,
      negative: BRANDING_NEGATIVE
    },
    {
      id: 'brand-card-back-duskfold',
      name: '카드덱 뒷면 - 더스크폴드',
      nameEn: 'Card Back - Duskfold',
      group: '브랜딩',
      prompt: `card deck back design for a cozy dark fantasy deckbuilder,

      vertical 2:3 fantasy card back designed to match the current dark battle scene,
      perfectly symmetrical centered composition,
      extremely simple and premium card back silhouette,
      one strong unmistakable center logo that instantly reads at small size,
      center emblem should clearly represent the sun and moon together using one fused minimal symbol,
      center logo should feel more trendy, contemporary, and premium while still minimal,
      center logo combines a bold sun disk and crescent moon inside one very clean circular mark,
      logo should read like a modern game brand mark rather than a fantasy ornament,
      logo should be larger, clearer, and more visually dominant than any border or corner detail,
      minimal border system, very large calm negative space, and no text,
      remove all corner icons and corner motifs,
      all four corners should remain empty and quiet with no symbols or decorative marks,
      no empty square, no pale lavender blank box, no placeholder panel, and no isolated rectangular block anywhere, especially in the lower-right area,
      dusty rose border line should run as one continuous unbroken perimeter accent around the card with no gaps, detached segments, or broken corner interruptions,
      no ornate flourishes, no filigree, no dense decoration, no busy patterning,
      dark muted lavender base with muted cream linework, moon-purple support tones, and dusty rose support tones,
      flat matte ornamental graphic, plain and clean with no scene illustration, no shine, no gemstone feeling,
      should feel modern, minimal, mystical, and visually quiet behind gameplay elements,
      strong central readability, balanced geometry, extremely low clutter,
      made to harmonize with parchment cards, dark overlays, and the minimal combat UI`,
      negative: UI_NEGATIVE
    },
    {
      id: 'title-screen-background-duskfold',
      name: '게임 메인화면 대치 이미지 - 더스크폴드',
      nameEn: 'Main Menu Standoff Image - Duskfold',
      group: '타이틀/캐릭터 선택',
      prompt: joinPrompt(
        'main menu hero image for a cozy dark fantasy roguelike deckbuilder',
        '16:9 wide game main screen standoff illustration with no logo, no text, and no buttons',
        'Lavender Mist v6.0 visual DNA: a mysterious card-adventure world, cream parchment warmth, muted lavender atmosphere, dusty rose haze, restrained warm gold accents',
        'main warrior character in the strongest foreground position, supported by a mage and a rogue slightly behind on the same player side',
        'characters should match or closely resemble the in-game battle scene character style: simple readable card-battle heroes, soft pastel shapes, not realistic high-detail fantasy portraits',
        'warrior is the visual leader: sturdy rose-quartz armored silhouette, round shield and short sword, facing right toward enemies, mainly using warm gold sun symbol power',
        'mage support character uses amethyst tones, simple staff gesture, mainly channeling muted moon-purple crescent moon symbol power as restrained magical energy',
        'rogue support character uses emerald tones and a hooded agile silhouette, handling both sun and moon symbols together with a small dagger or quick dual-resource gesture',
        'enemy group on the opposite side facing left, defeated or being pushed back by combined sun and moon symbol power, non-gory and readable as a tense standoff',
        'sun and moon symbols are the key combat motif: warm gold sun disk and muted moon-purple crescent, crossing between heroes and enemies like clean magical emblems',
        'composition should feel like the moment before victory in a card battle, with heroes on the left and enemies on the right, strong diagonal tension across the center',
        'leave enough calm upper-center and lower-center negative space for a separate logo overlay and start button overlay added later by UI',
        'do not include the word Duskfold anywhere in the image, no title text, no readable typography, no letters',
        'background hints at a grand atmospheric card-adventure world with soft misty paths, drifting parchment cards, and distant forest, crystal dungeon, and castle silhouettes',
        'soft blurred environment behind the characters, low clutter, controlled contrast behind UI, readable behind title buttons and logo',
        'premium calm atmosphere, cozy but slightly mysterious, not horror, not realistic',
        'dark lavender, gray-purple, muted cream, dusty rose, mint, sky-lavender, and restrained warm gold accents',
        'professional game UI background',
        '2D clean digital illustration',
        'output resolution 1920x1080 pixels',
      ),
      negative: `realistic, photorealistic, 3D render, CGI,
anime manga style, pure black, pure white, neon colors, high saturation above 60 percent,
gore, blood, horror, grotesque, scary, pitch-black horror darkness,
sharp hard edges, harsh lighting, crushed blacks,
complex cluttered composition, overcrowded battlefield, tiny unreadable characters,
text, letters, numbers, watermark,
logo, title typography, buttons, UI panels,
blurry low quality`
    },
    {
      id: 'title-logo-duskfold-wordmark',
      name: '타이틀 로고 - 더스크폴드',
      nameEn: 'Title Logo - Duskfold Wordmark',
      group: '타이틀/캐릭터 선택',
      prompt: joinPrompt(
        'premium title logo design for a cozy dark fantasy deckbuilder called Duskfold',
        'main title wordmark area with a simple sun-and-moon emblem above or integrated very subtly',
        'should match the existing card back identity and brand logo motif',
        'muted cream lettering feel, dark lavender outline, dusty rose support accent, restrained warm gold highlight',
        'matte parchment print feeling, no glossy metal, no gemstone, no neon',
        'elegant readable fantasy game title logo for title screen overlay',
        'centered composition on pure solid white #FFFFFF background',
        'output resolution 1024x512 pixels',
      ),
      negative: BRANDING_NEGATIVE
    },
    {
      id: 'character-select-background-duskfold',
      name: '캐릭터 선택 화면 배경 - 더스크폴드',
      nameEn: 'Character Select Background - Duskfold',
      group: '타이틀/캐릭터 선택',
      prompt: joinPrompt(
        'character select screen background for a cozy dark fantasy deckbuilder',
        '16:9 wide background designed for three large character selection cards in the foreground',
        'no characters, no creatures, no portraits, no text, no icons, no card UI drawn into the image',
        'do not include the word Duskfold anywhere in the image, no title text, no readable typography, no letters',
        'Lavender Mist v6.0 style: quiet adventurer staging space before a branching multi-region journey, muted lavender depth, cream parchment warmth, dusty rose haze',
        'three soft vertical spotlight zones suggested only by gentle background lighting, aligned for warrior, locked mage, and locked rogue cards to be overlaid later',
        'clear open center and lower area for character cards and start button, with very low detail behind the card positions',
        'subtle journey preparation mood: a calm warm glow far below center, faint branching map paths into mist, and distant hints of forest, crystal dungeon, and castle regions around the edges',
        'background should feel like choosing an adventurer before entering a larger card-world, not like a single forest map',
        'soft blurred environment, low detail, low contrast behind UI, premium calm atmosphere, readable behind parchment character cards',
        'dark lavender, gray-purple, muted cream, dusty rose, mint, sky-lavender, and restrained warm gold accents',
        'professional game UI background',
        '2D clean digital illustration',
        'output resolution 1920x1080 pixels',
      ),
      negative: BG_NEGATIVE
    },
    {
      id: 'character-select-card-frame-duskfold',
      name: '캐릭터 선택 카드 프레임',
      nameEn: 'Character Select Card Frame',
      group: '타이틀/캐릭터 선택',
      prompt: joinPrompt(
        'character selection card frame for a cozy dark fantasy deckbuilder UI',
        'vertical 2:3 large selectable character card frame with space for bust portrait, class name, and short class role label',
        'same parchment-card material language as the player character card, but slightly more menu-like and premium',
        'muted cream parchment surface, soft lavender-gray border, dusty rose and restrained gold accent only',
        'clear selected and unselected visual states suggested as two coordinated variants in one asset sheet',
        'no character illustration, no text, no letters, no numbers',
        'clean readable UI asset for title-to-character-select flow',
        '2D clean digital illustration',
        'isolated on solid white background',
        'output resolution 768x512 pixels',
      ),
      negative: UI_NEGATIVE
    },

    // ---- 코인 (4종) ----
    {
      id: 'coin-heads',
      name: '코인 앞면(해)',
      nameEn: 'Sun Coin Heads',
      group: '코인',
      prompt: `${UI_COIN_STYLE},

 front face of a fantasy coin themed around the sun,
 simple flat fantasy coin face,
 very large centered sun emblem occupying most of the coin face,
 sun emblem must read instantly at small UI size,
 single bold sun disk icon with only a few very short rays,
 minimal ornamentation, no extra symbols, no decorative details,
 warm antique gold coin base color #C9A86C,
 sun emblem in a distinctly lighter pale gold ivory tone with clear natural contrast against the base,
 background slightly deeper and more muted than the sun emblem so the symbol remains immediately visible,
 flat surface with no gemstone, no translucency, no refraction,
 very subtle simple highlight only,
 clean circular rim with muted darker gold tint,
 premium readable game coin silhouette with clear sun identity`,
      negative: UI_NEGATIVE
    },
    {
      id: 'coin-tails',
      name: '코인 뒷면(달)',
      nameEn: 'Moon Coin Tails',
      group: '코인',
      prompt: `${UI_COIN_STYLE},

back face of a fantasy coin themed around the moon,
simple flat fantasy coin face,
very large centered crescent moon emblem occupying most of the coin face,
moon emblem must read instantly at small UI size,
single bold crescent moon icon with extremely simple silhouette,
minimal ornamentation, no stars, no extra symbols, no decorative details,
soft matte moon-purple base color #6A5080,
flat surface with no gemstone, no translucency, no refraction,
very subtle simple highlight only,
clean circular rim with muted moon-purple tint,
premium readable game coin silhouette with clear moon identity`,
      negative: UI_NEGATIVE
    },
    {
      id: 'coin-edge',
      name: '코인 측면',
      nameEn: 'Coin Edge',
      group: '코인',
      prompt: `fantasy card game gemstone coin edge view for v6.0 Lavender Mist,
clean digital illustration with soft colored outlines,
side strip view of a coin,
horizontal strip shape,
 sun-gold to moon-purple gradient across translucent surface,
serrated ridged pattern along the edge,
warm gold tone on left transitioning to moon-purple on right,
isolated on solid white background,
output 256x64 pixels`,
      negative: UI_NEGATIVE
    },
    {
      id: 'coin-pouch',
      name: '코인 주머니',
      nameEn: 'Coin Pouch',
      group: '코인',
      prompt: `fantasy card game coin pouch asset for v6.0 Lavender Mist,
clean digital illustration with soft colored outlines,
small adventure coin pouch designed specifically to hold sun and moon gemstone coins,
soft parchment-leather body in warm cream and muted gold #C8B888,
subtle lavender lining and braided drawstring with tiny sun-gold and moon-purple bead accents,
pouch shown empty with no visible coins,
cozy pastel travel gear feeling that matches nearby parchment UI assets,
muted lavender-cream palette with balanced sun-gold #C9A86C and moon-purple #6A5080 highlights,
clean readable silhouette with no extra trinkets, straps, or clutter,
isolated on solid white background,
output 256x256 pixels`,
      negative: UI_NEGATIVE
    },

    // ---- 버튼 (5종) ----
    {
      id: 'btn-end-turn',
      name: '턴 종료',
      nameEn: 'End Turn Button',
      group: '버튼',
      prompt: `${UI_BUTTON_STYLE},

 ultra-minimal end-turn action button with immediate readability,
 shape-first design that communicates decisive forward completion even with no text,
 compact horizontal capsule merged with a clear right-pointing wedge silhouette,
 muted crimson parchment base around #A56A72 with dusty rose highlight and restrained wine-red edge,
 one small centered chevron cut or embossed forward mark only,
 large clean negative space and almost no interior detail,
 no decorative inset frame and no ornamental texture emphasis,
 restrained soft lower shadow only for separation,
 subtle inner glow or focus emphasis around the forward mark so the button soul reads clearly on screen,
 the core action identity should feel unmistakable, centered, and emotionally present even at a glance,
 designed to feel urgent but controlled, somber, tactical, and naturally blended into the dark fantasy battle scene,
 small-size readable tactical UI asset for card battle screen`,
      negative: UI_NEGATIVE
    },
    {
      id: 'btn-coin-flip',
      name: '코인 플립',
      nameEn: 'Coin Flip Button',
      group: '버튼',
      prompt: `${UI_BUTTON_STYLE},

cream parchment background #F0E8D8 with gold accent #C9A86C,
small sun-and-moon coin symbol centered,
subtle gold glow effect around edges,
bright warm inviting feeling,
gemlike sheen highlight on top edge`,
      negative: UI_NEGATIVE
    },
    {
      id: 'btn-primary',
      name: '기본 버튼',
      nameEn: 'Primary Button',
      group: '버튼',
      prompt: `${UI_BUTTON_STYLE},

cream parchment background #F0E8D8 with gold accent gradient #C9A86C to #D8C090,
subtle smooth gradient transition,
versatile general purpose action button,
soft warm highlight on top edge,
professional understated elegance`,
      negative: UI_NEGATIVE
    },
    {
      id: 'btn-secondary',
      name: '보조 버튼',
      nameEn: 'Secondary Button',
      group: '버튼',
      prompt: `${UI_BUTTON_STYLE},

cream parchment background #F0E8D8 with light lavender accent #D8C8E8,
thin muted-lavender border outline #B8A0D4,
subdued secondary action appearance,
subtle inner bevel for minimal depth,
neutral understated design`,
      negative: UI_NEGATIVE
    },
    {
      id: 'btn-danger',
      name: '위험 버튼',
      nameEn: 'Danger Button',
      group: '버튼',
      prompt: `${UI_BUTTON_STYLE},

cream parchment background #F0E8D8 with muted rose accent #C07878,
warning destructive action appearance,
subtle warm vignette at edges,
muted rose tone evoking caution,
slightly desaturated red for pastel fantasy feel`,
      negative: UI_NEGATIVE
    },
    {
      id: 'ui-battle-progress-track',
      name: '배틀 진행 트랙 통합 시트',
      nameEn: 'Battle Progress Track Combined Sheet',
      group: '배틀 HUD',
      prompt: joinPrompt(
        'single combined image asset sheet for a cozy dark fantasy battle progress HUD',
        'all progress bar components must appear together in one image, arranged cleanly in one horizontal layout, not separate files',
        'include one complete long progress bar example plus reusable component variants: normal round node, cleared node, current position node, village house node, boss node, long thin connector line, current highlight ring, village highlight aura, boss warning aura',
        'progress bar circles must be noticeably smaller than before, compact small round nodes with strong tiny-size readability',
        'connector line must be much thinner and longer than before, elegant 2 to 4 pixel visual weight, long horizontal rail spanning most of the canvas',
        'current position node must stand out the most among normal nodes, use muted gold center, bright cream rim, thicker outer ring, and soft readable halo',
        'village node must stand out more than normal nodes, replace generic village symbol with a clear cozy small house icon, warm amber roof, cream body, tiny chimney silhouette, safe resting-point feeling',
        'boss node must stand out more than normal nodes, replace generic boss symbol with a clear ancient crown-and-horn crest icon, muted crimson and dusty rose, ominous but elegant, no skull gore',
        'boss and village nodes should be larger or brighter than normal round nodes but still smaller than the current position emphasis',
        'Lavender Mist style with muted cream parchment, dark lavender support tones, dusty gold accents, muted amber village accent, muted crimson boss accent',
        'minimal flat 2D game UI, clean silhouettes, no gradients, no heavy texture, no detailed illustration, no text labels',
        'professional game UI asset sheet, easy to crop into individual components after generation',
        'no text no letters no numbers',
        '2D clean digital illustration',
        'isolated on solid white background',
        'output resolution 2048x512 pixels',
      ),
      negative: UI_NEGATIVE
    },
    {
      id: 'ui-progress-round-marker',
      name: '진행바 일반 라운드 마커',
      nameEn: 'Progress Round Marker',
      group: '배틀 HUD',
      prompt: joinPrompt(
        'simple round marker icon for fantasy battle progress bar',
        'small circular node for a standard combat round',
        'Lavender Mist style with muted cream center and soft dusty-gold ring',
        'very simple flat shape, tiny-size readability first, no ornament',
        'calm matte game HUD icon',
        'isolated on solid white background',
        'output 128x128 pixels',
      ),
      negative: UI_NEGATIVE
    },
    {
      id: 'ui-progress-current-marker',
      name: '진행바 현재 위치 마커',
      nameEn: 'Progress Current Marker',
      group: '배틀 HUD',
      prompt: joinPrompt(
        'simple current position marker for fantasy battle progress bar',
        'small round marker with slightly stronger emphasis than a normal round node',
        'muted gold center, soft cream ring, and a very subtle highlight aura',
        'minimal flat shape with excellent tiny-size readability',
        'calm premium Lavender Mist HUD icon',
        'isolated on solid white background',
        'output 128x128 pixels',
      ),
      negative: UI_NEGATIVE
    },
    {
      id: 'ui-progress-cleared-marker',
      name: '진행바 완료 라운드 마커',
      nameEn: 'Progress Cleared Marker',
      group: '배틀 HUD',
      prompt: joinPrompt(
        'simple cleared round marker for fantasy battle progress bar',
        'small subdued circular node for completed progress',
        'soft cream-gray fill and quiet dusty border',
        'visually lighter and quieter than the current position marker',
        'minimal flat game HUD icon',
        'isolated on solid white background',
        'output 128x128 pixels',
      ),
      negative: UI_NEGATIVE
    },
    {
      id: 'ui-progress-village-marker',
      name: '진행바 마을 마커',
      nameEn: 'Progress Village Marker',
      group: '배틀 HUD',
      prompt: joinPrompt(
        'simple village marker icon for fantasy battle progress bar',
        'tiny symbolic village emblem for route progression HUD',
        'small house cluster silhouette in muted amber and cream',
        'cozy, safe, and very simple, readable at tiny size',
        'flat Lavender Mist game HUD icon',
        'isolated on solid white background',
        'output 128x128 pixels',
      ),
      negative: UI_NEGATIVE
    },
    {
      id: 'ui-progress-boss-marker',
      name: '진행바 보스 마커',
      nameEn: 'Progress Boss Marker',
      group: '배틀 HUD',
      prompt: joinPrompt(
        'simple boss marker icon for fantasy battle progress bar',
        'tiny ominous but elegant boss emblem for route HUD',
        'simplified crown-skull or ancient crest silhouette in muted crimson and dusty rose',
        'strong tiny-size readability with very restrained detail',
        'flat Lavender Mist game HUD icon',
        'isolated on solid white background',
        'output 128x128 pixels',
      ),
      negative: UI_NEGATIVE
    },
    {
      id: 'ui-progress-connector',
      name: '진행바 연결선',
      nameEn: 'Progress Connector',
      group: '배틀 HUD',
      prompt: joinPrompt(
        'simple connector segment for fantasy battle progress HUD',
        'short horizontal connector bar between progress markers',
        'muted cream to lavender-gray tone with clean flat silhouette',
        'minimal and elegant with tiny-size readability',
        'isolated on solid white background',
        'output 256x64 pixels',
      ),
      negative: UI_NEGATIVE
    },
    {
      id: 'ui-progress-current-ring',
      name: '진행바 현재 위치 강조 링',
      nameEn: 'Progress Current Ring',
      group: '배틀 HUD',
      prompt: joinPrompt(
        'simple emphasis ring overlay for the active progress marker',
        'tiny circular ring designed to sit behind or around the current round marker',
        'muted gold edge with a very soft calm halo',
        'minimal, elegant, and not flashy',
        'isolated on solid white background',
        'output 128x128 pixels',
      ),
      negative: UI_NEGATIVE
    },
    {
      id: 'ui-progress-boss-aura',
      name: '진행바 보스 경고 오라',
      nameEn: 'Progress Boss Aura',
      group: '배틀 HUD',
      prompt: joinPrompt(
        'simple boss arrival aura for fantasy battle progress HUD',
        'tiny ambient warning halo designed for a boss marker',
        'muted crimson rose aura with soft dark edge',
        'elegant tension rather than danger alarm, very minimal and flat',
        'isolated on solid white background',
        'output 128x128 pixels',
      ),
      negative: UI_NEGATIVE
    },
    {
      id: 'ui-skillbar-plate',
      name: '스킬바 플레이트',
      nameEn: 'Skill Bar Plate',
      group: '배틀 HUD',
      prompt: joinPrompt(
        'fantasy battle skill bar background plate for cozy dark fantasy deckbuilder',
        'wide horizontal UI plate designed to anchor multiple skill cards at the bottom HUD',
        'Lavender Mist style with parchment cream surface, muted lavender-gray backing, and soft dark fantasy atmosphere',
        'subtle embedded rhythm for 4 to 6 skill slots without explicit boxed placeholders',
        'calm matte finish, soft rounded silhouette, premium but restrained visual weight',
        'designed to make the bottom battle controls feel unified and substantial',
        'no text no letters no numbers',
        'professional game UI asset',
        '2D clean digital illustration',
        'isolated on solid white background',
        'output resolution 1280x320 pixels',
      ),
      negative: UI_NEGATIVE
    },
    {
      id: 'ui-resource-counter-plates',
      name: '자원 카운터 플레이트 세트',
      nameEn: 'Resource Counter Plate Set',
      group: '배틀 HUD',
      prompt: joinPrompt(
        'fantasy resource counter plate set for sun moon and soul resources',
        'compact horizontal parchment HUD plates designed for icon plus number display',
        'three coordinated variants in the same family, one warm gold for sun, one moon-purple for moon, one deep blue-cyan for soul',
        'clean readable number area and restrained icon seat with no inset box or glassy HUD styling',
        'cozy Lavender Mist world tone with matte parchment material and subtle premium weight',
        'professional game UI asset set',
        '2D clean digital illustration',
        'isolated on solid white background',
        'output resolution 768x256 pixels',
      ),
      negative: UI_NEGATIVE
    },
    {
      id: 'ui-hp-bar-frame',
      name: 'HP바 프레임',
      nameEn: 'HP Bar Frame',
      group: '배틀 HUD',
      prompt: joinPrompt(
        'fantasy HP bar frame asset for a cozy dark fantasy card battle UI, not an HP icon',
        'long horizontal health bar container with clear empty fill area for dynamic red health value overlay in the game engine',
        'include one complete HP bar frame only, no heart icon, no standalone health symbol, no character portrait, no text, no numbers',
        'slender rounded rectangular silhouette, compact height, readable at small HUD size',
        'dark lavender outer support frame with muted cream parchment rim and subtle dusty rose inner accent',
        'inner fill channel should be clean and uninterrupted, designed so the red HP fill can be clipped horizontally from left to right',
        'left edge may be slightly reinforced for anchoring but must not contain a separate icon medallion',
        'right edge softly tapered or rounded, premium but restrained, matching Lavender Mist battle HUD style',
        'flat 2D clean digital UI illustration, matte material, no gradients, no heavy texture, no glossy glass effect',
        'professional game UI asset, isolated on solid white background',
        'output resolution 1024x192 pixels',
      ),
      negative: UI_NEGATIVE
    },
    {
      id: 'ui-turn-phase-banner-set',
      name: '턴 단계 배너 세트',
      nameEn: 'Turn Phase Banner Set',
      group: '배틀 HUD',
      prompt: joinPrompt(
        'turn phase banner set for fantasy card battle UI',
        'three variants in one coherent family: player turn, enemy turn, destination choice',
        'elongated parchment banner with restrained dark fantasy authority and strong readability',
        'player variant with warm gold accent, enemy variant with muted crimson accent, destination variant with lavender-sky accent',
        'no text in image, only banner design with a clear center area for later UI labeling',
        'quiet premium mood that blends into the current battle scene and feels more branded than generic labels',
        'professional game UI asset set',
        '2D clean digital illustration',
        'isolated on solid white background',
        'output resolution 960x224 pixels',
      ),
      negative: UI_NEGATIVE
    },
    {
      id: 'ui-selection-ring-overlay',
      name: '선택 강조 링 오버레이',
      nameEn: 'Selection Ring Overlay',
      group: '배틀 HUD',
      prompt: joinPrompt(
        'selection highlight ring overlay for fantasy battle UI',
        'card-sized and target-sized emphasis overlay asset for hover, selected, and unavailable states',
        'minimal magical parchment-metal ring language with no center obstruction',
        'soft warm cream edge with restrained type-color accent variations suitable for dark battle scenes',
        'must feel elegant, readable, and premium rather than flashy or sci-fi',
        'professional game UI overlay asset',
        '2D clean digital illustration',
        'isolated on solid white background',
        'output resolution 512x512 pixels',
      ),
      negative: UI_NEGATIVE
    },
    {
      id: 'ui-topbar-ornament-strip',
      name: '상단바 장식 스트립',
      nameEn: 'Top Bar Ornament Strip',
      group: '배틀 HUD',
      prompt: joinPrompt(
        'top bar ornament strip for fantasy battle screen HUD',
        'long horizontal header decoration for region name, soul counter, and utility buttons',
        'Lavender Mist style with muted cream parchment band over dark lavender support layer',
        'text-safe center and side icon-safe pockets with minimal embedded ornamental logic only',
        'designed to unify the top HUD visually and feel like a branded game interface element',
        'no text no letters no numbers',
        'professional game UI asset',
        '2D clean digital illustration',
        'isolated on solid white background',
        'output resolution 1536x160 pixels',
      ),
      negative: UI_NEGATIVE
    },
    {
      id: 'ui-coin-toss-summary-panel',
      name: '코인 토스 결과 패널',
      nameEn: 'Coin Toss Summary Panel',
      group: '배틀 HUD',
      prompt: joinPrompt(
        'coin toss result summary panel for fantasy card battle UI',
        'compact horizontal feedback panel showing sun and moon outcome counts after a toss',
        'cozy Lavender Mist style with parchment cream information plate and embedded gold and moon-purple icon seats',
        'tactical readable structure, minimal dividers, and no clutter or placeholder boxes',
        'should feel like a short-lived premium HUD feedback element rather than a generic popup',
        'professional game UI asset',
        '2D clean digital illustration',
        'isolated on solid white background',
        'output resolution 960x320 pixels',
      ),
      negative: UI_NEGATIVE
    },

    // ---- 상태 아이콘 (8종) ----
    {
      id: 'icon-poison',
      name: '독',
      nameEn: 'Poison',
      group: '상태 아이콘',
      prompt: `${UI_ICON_STYLE},

skull with green liquid dripping from jaw,
muted toxic green color #7AB88A,
small droplets falling below skull,
clear poisonous atmosphere,
pastel fantasy status effect icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-spore',
      name: '포자',
      nameEn: 'Spore',
      group: '상태 아이콘',
      prompt: `${UI_ICON_STYLE},

mushroom cap releasing floating spore particles,
muted purple color #9A80B8,
small dots and particles drifting upward,
organic fungal atmosphere,
pastel fantasy status effect icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-thorns',
      name: '가시',
      nameEn: 'Thorns',
      group: '상태 아이콘',
      prompt: `${UI_ICON_STYLE},

sharp thorny vine coiling in circular shape,
muted rose color #C07878,
pointed barbs protruding outward,
sharp defensive atmosphere,
pastel fantasy status effect icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-hardening',
      name: '경화',
      nameEn: 'Hardening',
      group: '상태 아이콘',
      prompt: `${UI_ICON_STYLE},

solid rock surface with crystalline facets,
steel gray color #9898A8,
angular stone slab with crack lines,
heavy fortified atmosphere,
pastel fantasy status effect icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-evasion',
      name: '회피',
      nameEn: 'Evasion',
      group: '상태 아이콘',
      prompt: `${UI_ICON_STYLE},

wind swirl with speed lines,
cool blue color #78A8C0,
dynamic motion blur streaks,
swift agile atmosphere,
pastel fantasy status effect icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-vulnerable',
      name: '취약',
      nameEn: 'Vulnerable',
      group: '상태 아이콘',
      prompt: `${UI_ICON_STYLE},

cracked shield with broken armor fragment,
muted wine-lilac color #B868A0,
visible fracture lines across surface,
weakened exposed atmosphere,
pastel fantasy status effect icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-strength',
      name: '힘',
      nameEn: 'Strength',
      group: '상태 아이콘',
      prompt: `${UI_ICON_STYLE},

upward-pointing sword with power aura radiating,
pastel rose color #D4A0A0,
energy lines emanating from blade,
bold empowered atmosphere,
pastel fantasy status effect icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-weak',
      name: '약화',
      nameEn: 'Weak',
      group: '상태 아이콘',
      prompt: `${UI_ICON_STYLE},

broken sword with downward droop,
muted silver tone #9898A8,
wilting blade bending downward,
weakened diminished power atmosphere,
pastel fantasy status effect icon`,
      negative: UI_NEGATIVE
    },

    // ---- 리소스 아이콘 (4종) ----
    {
      id: 'icon-hp',
      name: 'HP',
      nameEn: 'Health Point',
      group: '리소스 아이콘',
      prompt: `${UI_ICON_STYLE},

heart symbol with warm inner glow,
warm rose color #E8B4B8,
smooth rounded heart shape,
subtle highlight on upper left,
pastel fantasy resource icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-defense',
      name: '방어도',
      nameEn: 'Defense',
      group: '리소스 아이콘',
      prompt: `${UI_ICON_STYLE},

shield symbol with sturdy frame,
 muted steel-blue color #A0B8D4,
heraldic shield silhouette,
subtle metallic sheen,
pastel fantasy resource icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-soul',
      name: '소울',
      nameEn: 'Soul',
      group: '리소스 아이콘',
      prompt: `${UI_ICON_STYLE},

ghostly soul flame with a denser and more spiritual presence,
outer flame silhouette in a darker deep blue-cyan tone around #6FA8C4 while keeping a ghostly flame shape,
inside the soul shape, a small white ghostly figure should feel subtly formed and inhabited,
clear spirit silhouette with thicker inner mass and a richer upward wisp shape,
mysterious sacred afterlife atmosphere with stronger soul intensity,
pastel fantasy resource icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-mini-coin',
      name: '미니 코인',
      nameEn: 'Mini Coin',
      group: '리소스 아이콘',
      prompt: `${UI_ICON_STYLE},

small circular coin with simple embossed mark,
 gold color #C9A86C,
clean flat coin silhouette,
subtle rim edge detail,
pastel fantasy resource icon`,
      negative: UI_NEGATIVE
    },

    // ---- 몬스터 의도 (5종) ----
    {
      id: 'icon-intent-attack',
      name: '공격 의도',
      nameEn: 'Attack Intent',
      group: '몬스터 의도',
      prompt: `${UI_ICON_STYLE},

two crossed swords forming an X shape,
red tint color #D4A0A0,
sharp blade edges with bold outlines,
aggressive readable atmosphere,
pastel fantasy monster intent icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-intent-defense',
      name: '방어 의도',
      nameEn: 'Defense Intent',
      group: '몬스터 의도',
      prompt: `${UI_ICON_STYLE},

shield with small plus sign overlay,
 blue-gray tint color #A0B8D4,
sturdy defensive shield silhouette,
protective guarding atmosphere,
pastel fantasy monster intent icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-intent-buff',
      name: '버프 의도',
      nameEn: 'Buff Intent',
      group: '몬스터 의도',
      prompt: `${UI_ICON_STYLE},

upward arrow with sparkle particles,
warm gold color #C9A86C,
ascending arrow with small star bursts,
empowering strengthening atmosphere,
pastel fantasy monster intent icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-intent-debuff',
      name: '디버프 의도',
      nameEn: 'Debuff Intent',
      group: '몬스터 의도',
      prompt: `${UI_ICON_STYLE},

downward arrow with dark mist wisps,
muted purple color #9A80B8,
descending arrow surrounded by fog,
soft weakening atmosphere,
pastel fantasy monster intent icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-intent-unknown',
      name: '미공개 의도',
      nameEn: 'Unknown Intent',
      group: '몬스터 의도',
      prompt: `${UI_ICON_STYLE},

large bold question mark symbol,
neutral gray color #9898A8,
thick outlined question mark centered,
mysterious uncertain atmosphere,
pastel fantasy monster intent icon`,
      negative: UI_NEGATIVE
    },

    // ---- 턴 페이즈 (4종) ----
    {
      id: 'icon-phase-start',
      name: '턴 시작',
      nameEn: 'Turn Start',
      group: '턴 페이즈',
      prompt: `${UI_ICON_STYLE},

hourglass with sand flowing through narrow center,
muted gray color #9898A8,
classic hourglass silhouette,
time passage atmosphere,
pastel fantasy turn phase icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-phase-coin',
      name: '코인 플립',
      nameEn: 'Coin Flip Phase',
      group: '턴 페이즈',
      prompt: `${UI_ICON_STYLE},

spinning coin in mid-air with motion arc,
warm gold color #C9A86C,
coin shown at angle with rotation blur,
dynamic flipping moment,
pastel fantasy turn phase icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-phase-player',
      name: '플레이어 턴',
      nameEn: 'Player Turn',
      group: '턴 페이즈',
      prompt: `${UI_ICON_STYLE},

lightning bolt symbol with electric energy,
 blue-gray color #A0B8D4,
jagged bolt shape with small sparks,
active empowered player atmosphere,
pastel fantasy turn phase icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-phase-monster',
      name: '몬스터 턴',
      nameEn: 'Monster Turn',
      group: '턴 페이즈',
      prompt: `${UI_ICON_STYLE},

monster claw slash with sharp fangs,
red color #D4A0A0,
three claw marks with pointed teeth below,
dangerous readable atmosphere,
pastel fantasy turn phase icon`,
      negative: UI_NEGATIVE
    },

    // ---- 라운드 노드 (6종) ----
    {
      id: 'icon-node-monster',
      name: '몬스터 노드',
      nameEn: 'Monster Node',
      group: '라운드 노드',
      prompt: `${UI_NODE_STYLE},

sword icon on red circular badge background #D4A0A0,
simple crossed sword silhouette,
white or cream icon on colored circle,
combat encounter node,
pastel fantasy map node icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-node-elite',
      name: '엘리트 노드',
      nameEn: 'Elite Node',
      group: '라운드 노드',
      prompt: `${UI_NODE_STYLE},

skull icon on purple circular badge background #9A80B8,
simple skull silhouette front view,
white or cream icon on colored circle,
elite dangerous encounter node,
pastel fantasy map node icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-node-shop',
      name: '상점 노드',
      nameEn: 'Shop Node',
      group: '라운드 노드',
      prompt: `${UI_NODE_STYLE},

gem or bag icon on gold circular badge background #C9A86C,
simple treasure silhouette,
white or cream icon on colored circle,
merchant shop node,
pastel fantasy map node icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-node-event',
      name: '이벤트 노드',
      nameEn: 'Event Node',
      group: '라운드 노드',
      prompt: `${UI_NODE_STYLE},

exclamation mark on cream circular badge background #F0E8D8,
bold dark-lavender exclamation symbol #6A6070,
dark icon on light cream circle,
random event encounter node,
pastel fantasy map node icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-node-boss',
      name: '보스 노드',
      nameEn: 'Boss Node',
      group: '라운드 노드',
      prompt: `${UI_NODE_STYLE},

crown icon on muted rose circular badge background #C89098,
regal crown silhouette with pointed peaks,
white or cream icon on rose circle,
final boss encounter node,
pastel fantasy map node icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-node-rest',
      name: '휴식 노드',
      nameEn: 'Rest Node',
      group: '라운드 노드',
      prompt: `${UI_NODE_STYLE},

campfire flame icon on warm pastel brown circular badge background #C8B888,
simple flame silhouette with small sparks,
white or cream icon on colored circle,
rest recovery healing node,
pastel fantasy map node icon`,
      negative: UI_NEGATIVE
    },

    // ---- 기타 (3종) ----
    {
      id: 'icon-settings',
      name: '설정',
      nameEn: 'Settings',
      group: '기타',
      prompt: `${UI_ICON_STYLE},

cogwheel gear symbol with six teeth,
cream white color #F0E8D8,
mechanical gear silhouette centered,
clean utility atmosphere,
pastel fantasy settings icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-target-cursor',
      name: '대상 커서',
      nameEn: 'Target Cursor',
      group: '기타',
      prompt: `${UI_ICON_STYLE},

crosshair reticle with outer circle,
warm gold color #C9A86C,
thin cross lines intersecting at center,
precise targeting atmosphere,
pastel fantasy cursor icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-defense-badge',
      name: '방어도 뱃지',
      nameEn: 'Defense Badge',
      group: '기타',
      prompt: `${UI_ICON_STYLE},

circular shield emblem with inner crest,
 muted lavender-blue base #7890B0 with pastel steel-blue accent #A0B8D4,
round badge shape with layered rings,
sturdy protective atmosphere,
pastel fantasy defense badge icon`,
      negative: UI_NEGATIVE
    }
  ],

  // ========================================
  // 10. NPC — 비전투 캐릭터 (상점 주인 등)
  // ========================================
  'npc': [
    {
      id: 'merchant',
      name: '떠돌이 상인',
      nameEn: 'Wandering Merchant',
      designStatus: 'undesigned',
      group: '상점',
      prompt: createCharacterPrompt(
        'wandering merchant NPC for the shop sidebar in a cozy roguelike deckbuilder',
        'friendly small traveling shopkeeper with a warm but slightly mysterious expression, not threatening and not realistic',
        'soft hooded cloak in warm greige and muted taupe tones, cream inner scarf, no dark horror styling',
        'large rounded backpack visible behind the shoulders with simple pouch silhouette and one tiny tied bundle, kept as the main readable merchant cue',
        'small coin pouch in muted antique gold #C9A86C as the only accent prop, no pile of coins and no cluttered goods display',
        'Lavender Mist v6.0 visual language: flat pastel fantasy, cozy dark fantasy mood, cream parchment background, soft muted colors, clean chibi bust portrait',
        'designed to read clearly as a shop merchant when displayed small at about 112x144 pixels in the game UI',
      ),
      negative: NPC_NEGATIVE
    }
  ]
}

export const PROMPT_EXAMPLES: Record<ExampleCategory, PromptExample[]> = mapPromptExamplesWithSafeMargin(BASE_PROMPT_EXAMPLES)
