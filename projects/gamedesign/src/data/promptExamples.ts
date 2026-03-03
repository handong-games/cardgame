export type ExampleCategory = 'frame' | 'character' | 'companion' | 'forest' | 'dungeon' | 'castle' | 'background' | 'ui'

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

export const FRAME_NEGATIVE = `character illustration, person, creature, monster,
coin edge pattern, ridged border, gear teeth,
sun emblem, moon symbol, celestial decorations,
bright vibrant colors, neon glow, saturated colors,
3D render, photorealistic, hyper detailed,
complex ornate decorations, baroque style,
modern minimalist flat vector,
anime style, cartoon style,
watercolor bleeding, paint splatters,
text, letters, numbers, words,
multiple frames, tilted angle`

export const CHARACTER_NEGATIVE = `dark gothic horror scary,
photorealistic 3D render CGI,
cold colors blue purple dominant,
harsh shadows high contrast,
anime manga style sharp lines,
no blush on cheeks,
scary fierce expression,
shiny metallic armor,
facing left,
looking left,
back view,
realistic human proportions,
cream background, parchment texture, complex detailed background,
hand-drawn border frame, tarot card border, card frame, decorative border,
cropped body, cut off limbs, missing legs, missing feet,
blurry low quality`

export const MONSTER_NEGATIVE = `rosy blushing cheeks, facing right, looking right,
photorealistic, 3D render, CGI,
dark horror scary gothic,
cream paper, parchment texture, complex detailed background,
multiple characters,
creature too dark blending into shadows,
blurry low quality`

export const BG_NEGATIVE = `characters people figures,
dark horror scary atmosphere,
cold blue dominant colors,
photorealistic 3D render CGI,
complex cluttered composition,
cream paper texture, parchment background,
bright saturated colors,
blurry low quality`

export const UI_NEGATIVE = `character illustration, person, creature, monster, animal,
3D render, photorealistic, hyper detailed, CGI,
anime style, cartoon style, manga,
watercolor bleeding, paint splatters, heavy texture,
complex ornate decorations, baroque style,
dark horror scary gothic,
blurry low quality, noisy, grainy,
multiple objects, cluttered composition,
neon glow, overly bright, saturated neon colors`

// UI 에셋 공통 스타일 베이스 (내부 사용)
const UI_ICON_STYLE = `game UI icon for dark fantasy card game,
flat color illustration with bold near-black outlines (#1A1A1E),
single centered symbol, square 1:1 composition,
clean minimal design readable at small size,
isolated on solid white background,
output 256x256 pixels`

const UI_COIN_STYLE = `fantasy card game coin asset,
hand-drawn illustration with warm ink outlines,
circular metallic coin design,
warm tone highlights with subtle depth,
isolated on solid white background,
output 256x256 pixels`

const UI_BUTTON_STYLE = `game UI button for dark fantasy card game,
flat design with subtle gradient depth,
rounded rectangle shape with soft edges,
no text no letters no numbers,
clean professional game asset,
isolated on solid white background,
output 512x192 pixels`

const UI_NODE_STYLE = `game map node badge for dark fantasy card game,
flat color illustration, bold outlines,
small circular badge design, 1:1 ratio,
clean minimal readable at 24px,
isolated on solid white background,
output 128x128 pixels`


// ========================================
// PROMPT_EXAMPLES - 새 구조 (6개 카테고리)
// ========================================
export const PROMPT_EXAMPLES: Record<ExampleCategory, PromptExample[]> = {
  // ========================================
  // 1. FRAME - 카드 프레임 (9종)
  // ========================================
  'frame': [
    {
      id: 'frame-player',
      name: '플레이어 프레임',
      nameEn: 'Player Frame',
      group: '캐릭터 프레임',
      prompt: `game card frame design for fantasy RPG character,
empty frame template without character illustration,
vertical portrait 2:3 ratio,

dark charcoal frame background #1E1E24,
deep gray inner area #2A2A32,
soft graphite pencil texture border #4A4A55,
hand-drawn sketch edge with subtle irregularity,
rounded corners 8-12px radius,

warm golden glow accent #FFD700,
subtle golden rim light effect around border,
minimalist design no corner decorations,

near-black vignette at edges #0F0F14,
smooth gradient from center to edges,

clean empty center area for character portrait insertion,
professional game UI asset,
2D flat design,
isolated on solid white background,

output resolution 512x682 pixels,
final usage 180x240 pixels after downscaling`,
      negative: FRAME_NEGATIVE
    },
    {
      id: 'frame-t1',
      name: 'T1 프레임 (일반)',
      nameEn: 'Tier 1 Frame',
      group: '캐릭터 프레임',
      prompt: `game card frame design for fantasy RPG enemy monster,
empty frame template without monster illustration,
vertical portrait 2:3 ratio,

dark charcoal frame background #1E1E24,
deep gray inner area #2A2A32,
soft graphite pencil texture border #4A4A55,
hand-drawn sketch edge with subtle irregularity,
rounded corners 8-12px radius,

cool silver glow accent #C0C0C0,
subtle silver rim light effect around border,
minimalist design no corner decorations,

near-black vignette at edges #0F0F14,
smooth gradient from center to edges,

clean empty center area for monster portrait insertion,
professional game UI asset,
2D flat design,
isolated on solid white background,

output resolution 512x682 pixels,
final usage 180x240 pixels after downscaling`,
      negative: FRAME_NEGATIVE
    },
    {
      id: 'frame-t2',
      name: 'T2 프레임 (정예)',
      nameEn: 'Tier 2 Frame',
      group: '캐릭터 프레임',
      prompt: `game card frame design for fantasy RPG elite enemy,
empty frame template without monster illustration,
vertical portrait 2:3 ratio,

dark charcoal frame background #1E1E24,
deep gray inner area #2A2A32,
soft graphite pencil texture border #4A4A55,
hand-drawn sketch edge with subtle irregularity,
rounded corners 8-12px radius,

dirty purple glow accent #6B4B8C,
subtle purple rim light effect around border,
ominous mysterious aura,
minimalist design no corner decorations,

near-black vignette at edges #0F0F14,
smooth gradient from center to edges,

clean empty center area for monster portrait insertion,
professional game UI asset,
2D flat design,
isolated on solid white background,

output resolution 512x682 pixels,
final usage 180x240 pixels after downscaling`,
      negative: `${FRAME_NEGATIVE},
cute friendly, cheerful bright`
    },
    {
      id: 'frame-t3',
      name: 'T3 프레임 (보스)',
      nameEn: 'Tier 3 Frame',
      group: '캐릭터 프레임',
      prompt: `game card frame design for fantasy RPG boss enemy,
empty frame template without monster illustration,
vertical portrait 2:3 ratio,

dark charcoal frame background #1E1E24,
deep gray inner area #2A2A32,
soft graphite pencil texture border #4A4A55,
hand-drawn sketch edge with subtle irregularity,
rounded corners 8-12px radius,

intense crimson red glow accent #8B0000,
subtle red rim light effect around border,
dangerous powerful aura,
minimalist design no corner decorations,

near-black vignette at edges #0F0F14,
smooth gradient from center to edges,

clean empty center area for monster portrait insertion,
professional game UI asset,
2D flat design,
isolated on solid white background,

output resolution 512x682 pixels,
final usage 180x240 pixels after downscaling`,
      negative: `${FRAME_NEGATIVE},
cute friendly, cheerful bright`
    },
    {
      id: 'frame-companion',
      name: '동료 프레임',
      nameEn: 'Companion Frame',
      group: '캐릭터 프레임',
      prompt: `game card frame design for fantasy RPG companion creature,
empty frame template without creature illustration,
vertical portrait 2:3 ratio,

dark charcoal frame background #1E1E24,
deep gray inner area #2A2A32,
soft graphite pencil texture border #4A4A55,
hand-drawn sketch edge with subtle irregularity,
rounded corners 8-12px radius,

mystical cyan glow accent #00BCD4,
subtle cyan rim light effect around border,
warm inviting magical aura,
tiny leaf or vine motif on bottom edge only,
minimalist design no corner decorations,

near-black vignette at edges #0F0F14,
smooth gradient from center to edges,

clean empty center area for companion portrait insertion,
professional game UI asset,
2D flat design,
isolated on solid white background,

output resolution 512x682 pixels,
final usage 180x240 pixels after downscaling`,
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
      prompt: `game card frame design for fantasy RPG skill card,
empty frame template without skill illustration,
square 1:1 ratio,

dark charcoal frame background #1E1E24,
deep gray inner area #2A2A32,
soft graphite pencil texture border #4A4A55,
hand-drawn sketch edge with subtle irregularity,
rounded corners 8px radius,

coral red glow accent #C05050,
subtle red rim light effect around border,
minimalist design no corner decorations,

near-black vignette at edges #0F0F14,
smooth gradient from center to edges,

clean empty center area for skill icon insertion,
professional game UI asset,
2D flat design,
isolated on solid white background,

output resolution 512x512 pixels,
final usage 140x140 pixels after downscaling`,
      negative: FRAME_NEGATIVE
    },
    {
      id: 'skill-frame-defense',
      name: '방어 스킬 프레임',
      nameEn: 'Defense Skill Frame',
      group: '스킬 카드 프레임',
      prompt: `game card frame design for fantasy RPG skill card,
empty frame template without skill illustration,
square 1:1 ratio,

dark charcoal frame background #1E1E24,
deep gray inner area #2A2A32,
soft graphite pencil texture border #4A4A55,
hand-drawn sketch edge with subtle irregularity,
rounded corners 8px radius,

steel blue glow accent #4A90C0,
subtle blue rim light effect around border,
minimalist design no corner decorations,

near-black vignette at edges #0F0F14,
smooth gradient from center to edges,

clean empty center area for skill icon insertion,
professional game UI asset,
2D flat design,
isolated on solid white background,

output resolution 512x512 pixels,
final usage 140x140 pixels after downscaling`,
      negative: FRAME_NEGATIVE
    },
    {
      id: 'skill-frame-buff',
      name: '버프 스킬 프레임',
      nameEn: 'Buff Skill Frame',
      group: '스킬 카드 프레임',
      prompt: `game card frame design for fantasy RPG skill card,
empty frame template without skill illustration,
square 1:1 ratio,

dark charcoal frame background #1E1E24,
deep gray inner area #2A2A32,
soft graphite pencil texture border #4A4A55,
hand-drawn sketch edge with subtle irregularity,
rounded corners 8px radius,

warm gold glow accent #D4A574,
subtle golden rim light effect around border,
minimalist design no corner decorations,

near-black vignette at edges #0F0F14,
smooth gradient from center to edges,

clean empty center area for skill icon insertion,
professional game UI asset,
2D flat design,
isolated on solid white background,

output resolution 512x512 pixels,
final usage 140x140 pixels after downscaling`,
      negative: FRAME_NEGATIVE
    },
    {
      id: 'skill-frame-utility',
      name: '유틸 스킬 프레임',
      nameEn: 'Utility Skill Frame',
      group: '스킬 카드 프레임',
      prompt: `game card frame design for fantasy RPG skill card,
empty frame template without skill illustration,
square 1:1 ratio,

dark charcoal frame background #1E1E24,
deep gray inner area #2A2A32,
soft graphite pencil texture border #4A4A55,
hand-drawn sketch edge with subtle irregularity,
rounded corners 8px radius,

graphite glow accent #5A5F6B,
subtle gray rim light effect around border,
minimalist design no corner decorations,

near-black vignette at edges #0F0F14,
smooth gradient from center to edges,

clean empty center area for skill icon insertion,
professional game UI asset,
2D flat design,
isolated on solid white background,

output resolution 512x512 pixels,
final usage 140x140 pixels after downscaling`,
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
      prompt: `flat color illustration style,
hard edge cel shading with clean defined color blocks,
bold clean outlines in near-black,
muted desaturated dark fantasy color palette,
earthy tones with burgundy ochre navy accents,
stylized character illustration,
solid white background for clean extraction,
no border no frame,
strong rim light along character edges from behind,
soft key light from upper-left illuminating face,

vertical portrait 2:3 aspect ratio,
stylized semi-chibi proportions,
2.5 to 3 head body ratio,
full body composition showing head to feet,
character fits entirely within frame with small margin at bottom,
large expressive eyes with highlights,

subtle rosy blush on cheeks,
small circular pink blush marks,
confident charismatic expression,
slight smirk or determined smile,
body facing right at three-quarter angle,
looking toward viewer with slight right tilt,

warrior class character,
short spiky reddish-brown messy hair,
muted burgundy worn armor (#8B4049),
weathered steel metal pieces (#5A5F6B),
scratched battle-worn armor details,
NO gold decorations beginner adventurer,
simple worn leather belt (#6B4423),
naturally holding oversized old sword in hand,
brave determined expression,

white background,
single character illustration only`,
      negative: CHARACTER_NEGATIVE
    },
    {
      id: 'mage',
      name: '마법사',
      nameEn: 'Mage',
      gameplanId: 'CLS_M',
      designStatus: 'undesigned',
      prompt: `flat color illustration style,
hard edge cel shading with clean defined color blocks,
bold clean outlines in near-black,
muted desaturated dark fantasy color palette,
earthy tones with navy purple gold accents,
stylized character illustration,
solid white background for clean extraction,
no border no frame,
strong rim light along character edges from behind,
soft key light from upper-left illuminating face,

vertical portrait 2:3 aspect ratio,
stylized semi-chibi proportions,
2.5 to 3 head body ratio,
full body composition showing head to feet,
character fits entirely within frame with small margin at bottom,
large expressive eyes with highlights,

subtle rosy blush on cheeks,
small circular pink blush marks,
wise knowing expression,
mysterious slight smile,
body facing right at three-quarter angle,
looking toward viewer with slight right tilt,

mage wizard class character,
long flowing navy or violet-tinted hair,
deep navy robes with mystic purple accents (#2A3A5C, #6B4B8C),
arcane gold trim and symbols (#C9A227),
naturally holding tall magic staff with glowing crystal,
small magical sparkles floating around staff,
pointed wizard hat optional,
scholarly mystical appearance,

white background,
single character illustration only`,
      negative: CHARACTER_NEGATIVE
    },
    {
      id: 'rogue',
      name: '도적',
      nameEn: 'Rogue',
      gameplanId: 'CLS_R',
      designStatus: 'undesigned',
      prompt: `flat color illustration style,
hard edge cel shading with clean defined color blocks,
bold clean outlines in near-black,
muted desaturated dark fantasy color palette,
earthy tones with gray brown emerald accents,
stylized character illustration,
solid white background for clean extraction,
no border no frame,
strong rim light along character edges from behind,
soft key light from upper-left illuminating face,

vertical portrait 2:3 aspect ratio,
stylized semi-chibi proportions,
2.5 to 3 head body ratio,
full body composition showing head to feet,
character fits entirely within frame with small margin at bottom,
large expressive eyes with highlights,

subtle rosy blush on cheeks,
small circular pink blush marks,
sly mischievous expression,
playful confident smirk,
body facing right at three-quarter angle,
looking toward viewer with slight right tilt,

rogue thief class character,
messy dark hair peeking from under hood,
shadow gray hooded cloak (#3A3A40),
worn leather armor (#5C4033),
emerald green accents (#2D5A3D),
casually holding twin daggers in hands,
nimble agile pose,
mysterious but friendly appearance,

white background,
single character illustration only`,
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
      prompt: `flat color illustration style,
hard edge cel shading with clean defined color blocks,
bold clean outlines in near-black (#1A1A1E),
muted desaturated dark fantasy color palette,
earthy tones with green gold accents,
stylized companion creature illustration,
solid white background for clean extraction,
no border no frame,
strong rim light along creature edges from behind,
soft key light from upper-left,

vertical portrait 2:3 aspect ratio,
tiny cute proportions,
2 head body ratio,
full body composition showing head to feet,
creature fits entirely within frame with small margin,
large expressive sparkling eyes,

subtle rosy blush on cheeks,
small circular pink blush marks,
gentle happy healing expression,
warm nurturing smile,
body facing right at three-quarter angle,
looking toward viewer with slight right tilt,

small fairy companion creature,
tiny humanoid body covered in soft moss (#4A6741),
delicate translucent wings with green shimmer,
leaf-shaped ears,
small flower crown on head,
gentle healing green aura glow (#7CFC00),
floating slightly above ground,
tiny sparkles around body,
adorable forest healer appearance,

solid white background,
single creature illustration only`,
      negative: CHARACTER_NEGATIVE
    },
    {
      id: 'wild-wolf',
      name: '야생 늑대',
      nameEn: 'Wild Wolf',
      prompt: `flat color illustration style,
hard edge cel shading with clean defined color blocks,
bold clean outlines in near-black (#1A1A1E),
muted desaturated dark fantasy color palette,
earthy tones with gray brown amber accents,
stylized companion creature illustration,
solid white background for clean extraction,
no border no frame,
strong rim light along creature edges from behind,
soft key light from upper-left,

vertical portrait 2:3 aspect ratio,
tiny cute proportions,
2 head body ratio,
full body composition showing head to feet,
creature fits entirely within frame with small margin,
large expressive eyes with highlights,

subtle rosy blush on cheeks,
small circular pink blush marks,
loyal determined expression,
brave protective stance,
body facing right at three-quarter angle,
looking toward viewer with slight right tilt,

small wolf companion creature,
cute SD proportions wolf pup,
gray-brown fluffy fur (#8B7D6B),
warm amber eyes (#DAA520),
fluffy tail wagging,
small pointed ears alert,
loyal faithful expression,
ready to attack stance,
battle companion appearance,

solid white background,
single creature illustration only`,
      negative: CHARACTER_NEGATIVE
    },
    {
      id: 'forest-owl',
      name: '숲 올빼미',
      nameEn: 'Forest Owl',
      prompt: `flat color illustration style,
hard edge cel shading with clean defined color blocks,
bold clean outlines in near-black (#1A1A1E),
muted desaturated dark fantasy color palette,
earthy tones with brown beige gold accents,
stylized companion creature illustration,
solid white background for clean extraction,
no border no frame,
strong rim light along creature edges from behind,
soft key light from upper-left,

vertical portrait 2:3 aspect ratio,
tiny cute proportions,
2 head body ratio,
full body composition showing head to feet,
creature fits entirely within frame with small margin,
large expressive round eyes with highlights,

subtle rosy blush on cheeks,
small circular pink blush marks,
wise knowing expression,
calm intelligent gaze,
body facing right at three-quarter angle,
looking toward viewer with slight right tilt,

small owl companion creature,
cute SD proportions round owl,
warm brown and beige feathers (#8B6914, #D2B48C),
large round wise golden eyes (#C9A227),
small tufted ear feathers,
tiny reading glasses perched on beak,
one wing slightly raised,
perched on invisible branch,
scholarly forest sage appearance,

solid white background,
single creature illustration only`,
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
      prompt: `hand-drawn ink illustration style,
pen and ink sketch base with visible line work,
variable line weight with organic imperfect strokes,
gouache and ink wash coloring,
muted earthy color palette (35-55% saturation),
warm gray linework,
solid white background for clean extraction,
moody atmospheric lighting from upper-left,
subtle rim light highlighting creature edges,

vertical portrait 2:3 aspect ratio,
tiny 2 head ratio,
common enemy creature,

small goblin creature,
simple crude appearance tutorial-level weak enemy,
greenish-tinted skin (#4A6741),
ragged torn cloth clothing,
holding small rusty knife,
hunched sneaky posture,
beady cunning eyes,
pointy ears and crooked nose,

enchanted forest aesthetic,
forest green and warm brown palette (#2D5A3D, #6B4423),

NO rosy blush on cheeks,
body facing left diagonal direction,
three-quarter view angled to left,
solid white background,
single creature only`,
      negative: MONSTER_NEGATIVE
    },
    {
      id: 'poison-spider',
      name: '독거미',
      nameEn: 'Poison Spider',
      gameplanId: 'MON_F02',
      designStatus: 'confirmed',
      group: 'T1',
      prompt: `hand-drawn ink illustration style,
pen and ink sketch base with visible line work,
variable line weight with organic imperfect strokes,
gouache and ink wash coloring,
muted earthy color palette (35-55% saturation),
warm gray linework,
solid white background for clean extraction,
moody atmospheric lighting from upper-left,
subtle rim light highlighting creature edges,

vertical portrait 2:3 aspect ratio,
tiny 2 head ratio,
common enemy creature,

eight-legged spider creature,
venom droplets dripping from fangs,
web silk strand elements,
purple-tinted venom markings on abdomen (#6B4B8C),
dark muted brown carapace (#4A3A2A),
multiple beady eyes glinting,
stealthy lurking posture,
dark and secretive atmosphere,

enchanted forest aesthetic,
dark brown and muted purple palette,

NO rosy blush on cheeks,
body facing left diagonal direction,
three-quarter view angled to left,
solid white background,
single creature only`,
      negative: MONSTER_NEGATIVE
    },
    {
      id: 'spore-parasite',
      name: '버섯 기생체',
      nameEn: 'Spore Parasite',
      gameplanId: 'MON_F03',
      designStatus: 'confirmed',
      group: 'T1',
      prompt: `hand-drawn ink illustration style,
pen and ink sketch base with visible line work,
variable line weight with organic imperfect strokes,
gouache and ink wash coloring,
muted earthy color palette (35-55% saturation),
warm gray linework,
solid white background for clean extraction,
moody atmospheric lighting from upper-left,
subtle rim light highlighting creature edges,

vertical portrait 2:3 aspect ratio,
tiny 2 head ratio,
common enemy creature,

parasitic mushroom-covered creature,
fungal growths overtaking host body,
spore particles floating in air around creature,
moldy fungal texture on surface (#8B668B),
disturbing organic overgrowth,
cap-like mushroom head,
shambling unnatural posture,

enchanted forest aesthetic,
muted purple and earthy brown palette,

NO rosy blush on cheeks,
body facing left diagonal direction,
three-quarter view angled to left,
solid white background,
single creature only`,
      negative: MONSTER_NEGATIVE
    },
    {
      id: 'thorn-vine',
      name: '가시 덩굴',
      nameEn: 'Thorn Vine',
      gameplanId: 'MON_F04',
      designStatus: 'confirmed',
      group: 'T2',
      prompt: `hand-drawn ink illustration style,
pen and ink sketch base with visible line work,
variable line weight with organic imperfect strokes,
gouache and ink wash coloring,
muted earthy color palette (35-55% saturation),
warm gray linework,
solid white background for clean extraction,
moody atmospheric lighting from upper-left,
subtle rim light highlighting creature edges,

vertical portrait 2:3 aspect ratio,
small 2.5 head ratio,
elite enemy creature,
notable presence,

thorn-covered vine plant creature,
twisted and coiling stems (#2D5A3D),
sharp thorns protruding from body,
plant-type monster with writhing tendrils,
dark forest green vines with brown woody sections (#6B4423),
menacing coiled strike posture,

enchanted forest aesthetic,
deep forest green and warm brown palette,

NO rosy blush on cheeks,
body facing left diagonal direction,
three-quarter view angled to left,
solid white background,
single creature only`,
      negative: MONSTER_NEGATIVE
    },
    {
      id: 'golem',
      name: '골렘',
      nameEn: 'Golem',
      gameplanId: 'MON_F05',
      designStatus: 'confirmed',
      group: 'T2',
      prompt: `hand-drawn ink illustration style,
pen and ink sketch base with visible line work,
variable line weight with organic imperfect strokes,
gouache and ink wash coloring,
muted earthy color palette (35-55% saturation),
warm gray linework,
solid white background for clean extraction,
moody atmospheric lighting from upper-left,
subtle rim light highlighting creature edges,

vertical portrait 2:3 aspect ratio,
small 2.5 head ratio,
elite enemy creature,
notable presence,

solid stone golem creature,
moss-covered rock surface (#4A6741),
cracks and crevices with faint inner glow,
heavy sturdy imposing build,
rounded boulder body warm gray (#5A5F6B),
small mushrooms and lichen on shoulders,
stoic guardian stance,

enchanted forest aesthetic,
stone gray and moss green palette,

NO rosy blush on cheeks,
body facing left diagonal direction,
three-quarter view angled to left,
solid white background,
single creature only`,
      negative: MONSTER_NEGATIVE
    },
    {
      id: 'wolf-pack',
      name: '늑대 (알파+베타)',
      nameEn: 'Wolf Pack',
      gameplanId: 'MON_F06',
      designStatus: 'confirmed',
      group: 'T2',
      prompt: `hand-drawn ink illustration style,
pen and ink sketch base with visible line work,
variable line weight with organic imperfect strokes,
gouache and ink wash coloring,
muted earthy color palette (35-55% saturation),
warm gray linework,
solid white background for clean extraction,
moody atmospheric lighting from upper-left,
subtle rim light highlighting creature edges,

vertical portrait 2:3 aspect ratio,
small 2.5 head ratio,
elite enemy creature,
notable presence,

two wolves as single group,
alpha wolf and beta wolf in hunting formation,
bared fangs in aggressive hunting stance,
moonlit howling atmosphere,
dark gray and brown fur (#5A5F6B, #6B4423),
fierce amber eyes (#DAA520),
pack dynamics with coordinated posture,
alpha slightly larger and forward,

enchanted forest aesthetic,
dark gray and warm brown palette,

NO rosy blush on cheeks,
body facing left diagonal direction,
three-quarter view angled to left,
solid white background`,
      negative: MONSTER_NEGATIVE
    },
    {
      id: 'rotten-tree',
      name: '썩은 나무',
      nameEn: 'Rotten Tree',
      gameplanId: 'MON_F07',
      designStatus: 'confirmed',
      group: 'T2',
      prompt: `hand-drawn ink illustration style,
pen and ink sketch base with visible line work,
variable line weight with organic imperfect strokes,
gouache and ink wash coloring,
muted earthy color palette (35-55% saturation),
warm gray linework,
solid white background for clean extraction,
moody atmospheric lighting from upper-left,
subtle rim light highlighting creature edges,

vertical portrait 2:3 aspect ratio,
small 2.5 head ratio,
elite enemy creature,
notable presence,

massive rotting tree creature,
decaying bark and mold covering trunk (#6B4423),
fungus and moss patches (#4A6741),
glowing hollow eye sockets with eerie light,
slow but powerfully threatening presence,
gnarled twisted branches as arms,
roots partially uprooted from ground,

enchanted forest aesthetic,
dark brown and muted green palette,

NO rosy blush on cheeks,
body facing left diagonal direction,
three-quarter view angled to left,
solid white background,
single creature only`,
      negative: MONSTER_NEGATIVE
    },
    {
      id: 'ancient-grove-lord',
      name: '고대 수목군주',
      nameEn: 'Ancient Grove Lord',
      gameplanId: 'BOSS_F01',
      designStatus: 'undesigned',
      group: 'T3',
      prompt: `hand-drawn ink illustration style,
pen and ink sketch base with visible line work,
variable line weight with organic imperfect strokes,
gouache and ink wash coloring,
muted earthy color palette (35-55% saturation),
warm gray linework,
solid white background for clean extraction,
moody atmospheric lighting from upper-left,
subtle rim light highlighting creature edges,

vertical portrait 2:3 aspect ratio,
medium 3 head ratio,
imposing presence,
legendary boss creature,
aura of authority,

colossal ancient tree boss creature,
roots and branches as weapons,
covered in moss and creeping vines (#2D5A3D, #4A6741),
ancient bark armor with deep cracks (#6B4423),
majestic forest ruler dignity,
boss aura radiating power,
crown of leaves and branches,
glowing amber eyes of ancient wisdom,

enchanted forest aesthetic,
deep green brown and golden accent palette,

NO rosy blush on cheeks,
body facing left diagonal direction,
three-quarter view angled to left,
solid white background,
single creature only`,
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
      prompt: `hand-drawn ink illustration style,
pen and ink sketch base with visible line work,
variable line weight with organic imperfect strokes,
gouache and ink wash coloring,
muted earthy color palette (35-55% saturation),
warm gray linework,
solid white background for clean extraction,
moody atmospheric lighting from upper-left,
subtle rim light highlighting creature edges,

vertical portrait 2:3 aspect ratio,
tiny 2 head ratio,
extra cute compact,
round soft body shape,
common enemy creature,

small skeleton creature,
rounded cartoonish cream bones (#E8E4D9),
large cute skull with big round eye sockets,
soft teal glowing eyes (#6B8E9F),
oversized rusty helmet,
tiny wooden sword,
wobbly standing pose,

dungeon stone aesthetic,
warm gray and cream palette,

NO rosy blush on cheeks,
body facing left diagonal direction,
three-quarter view angled to left,
solid white background,
single creature only`,
      negative: MONSTER_NEGATIVE
    },
    {
      id: 'golden-golem',
      name: '황금 골렘',
      nameEn: 'Golden Golem',
      designStatus: 'concept',
      group: 'T2',
      prompt: `hand-drawn ink illustration style,
pen and ink sketch base with visible line work,
variable line weight with organic imperfect strokes,
gouache and ink wash coloring,
muted earthy color palette (35-55% saturation),
warm gray linework,
solid white background for clean extraction,
moody atmospheric lighting from upper-left,
subtle rim light highlighting creature edges,

vertical portrait 2:3 aspect ratio,
small 2.5 head ratio,
sturdy body shape,
elite enemy creature,
notable presence,

medium golem creature,
body made of muted gold coins and bars (#D4A574),
warm amber glowing eyes,
rounded golden fists,
gems embedded in chest,
treasure guardian stance,

dungeon treasure aesthetic,
warm gold and brown palette,

NO rosy blush on cheeks,
body facing left diagonal direction,
three-quarter view angled to left,
solid white background,
single creature only`,
      negative: MONSTER_NEGATIVE
    },
    {
      id: 'ancient-dungeon-king',
      name: '던전의 고대왕',
      nameEn: 'Ancient Dungeon King',
      designStatus: 'concept',
      group: 'T3',
      prompt: `hand-drawn ink illustration style,
pen and ink sketch base with visible line work,
variable line weight with organic imperfect strokes,
gouache and ink wash coloring,
muted earthy color palette (35-55% saturation),
warm gray linework,
solid white background for clean extraction,
moody atmospheric lighting from upper-left,
subtle rim light highlighting creature edges,

vertical portrait 2:3 aspect ratio,
medium 3 head ratio,
imposing presence,
large commanding body,
legendary boss creature,
aura of authority,

skeleton king creature,
cream bone body with gold decorations (#E8E4D9),
elegant crystal crown,
muted purple royal robe,
holding ornate scepter,
wise ancient glowing amber eyes,
dignified regal expression,
noble undead ruler appearance,

dungeon throne aesthetic,
cream gold and purple palette,

NO rosy blush on cheeks,
body facing left diagonal direction,
three-quarter view angled to left,
solid white background,
single creature only`,
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
      prompt: `hand-drawn ink illustration style,
pen and ink sketch base with visible line work,
variable line weight with organic imperfect strokes,
gouache and ink wash coloring,
muted earthy color palette (35-55% saturation),
warm gray linework,
solid white background for clean extraction,
moody atmospheric lighting from upper-left,
subtle rim light highlighting creature edges,

vertical portrait 2:3 aspect ratio,
small 2.5 head ratio,
elegant body shape,
elite enemy creature,
notable presence,

haunted armor creature,
elegant dark steel armor (#5A5F6B),
soft teal glow from visor,
white gloves,
silver serving tray,
butler cane,
polite bowing pose,

castle interior aesthetic,
steel and burgundy palette,

NO rosy blush on cheeks,
body facing left diagonal direction,
three-quarter view angled to left,
solid white background,
single creature only`,
      negative: MONSTER_NEGATIVE
    },
    {
      id: 'vampire-count',
      name: '뱀파이어 백작',
      nameEn: 'Vampire Count',
      designStatus: 'concept',
      group: 'T3',
      prompt: `hand-drawn ink illustration style,
pen and ink sketch base with visible line work,
variable line weight with organic imperfect strokes,
gouache and ink wash coloring,
muted earthy color palette (35-55% saturation),
warm gray linework,
solid white background for clean extraction,
moody atmospheric lighting from upper-left,
subtle rim light highlighting creature edges,

vertical portrait 2:3 aspect ratio,
medium 3 head ratio,
imposing presence,
elegant commanding body,
legendary boss creature,
aura of authority,

elegant vampire noble creature,
muted burgundy and black royal attire (#8B4049),
flowing cape,
tarnished gold crown (#B8860B),
warm amber charismatic eyes,
charming knowing smile with small fangs,
wine glass in hand,
dignified noble stance,
bat silhouettes nearby,

castle throne aesthetic,
burgundy gold and black palette,

NO rosy blush on cheeks,
body facing left diagonal direction,
three-quarter view angled to left,
solid white background,
single creature only`,
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
      prompt: `layered silhouette background style,
dark muted color palette with low saturation,
strong vignette effect with darker edges,
minimal atmospheric scene design,

wide landscape 16:9 aspect ratio,
layered depth composition,
soft warm lighting from front-left,
central area empty for characters,
no characters no people,

sunny forest clearing,
warm golden sunbeams filtering through trees,
muted forest green (#2D5A3D) and warm brown (#6B4423),
small mushrooms and wildflowers,
cozy welcoming woodland,

warm dappled light,
peaceful atmosphere`,
      negative: BG_NEGATIVE
    },
    {
      id: 'sunny-forest-dusk',
      name: '햇살 숲 - 황혼',
      nameEn: 'Sunny Forest - Dusk',
      group: '숲',
      prompt: `layered silhouette background style,
dark muted color palette with low saturation,
strong vignette effect with darker edges,
minimal atmospheric scene design,

wide landscape 16:9 aspect ratio,
layered depth composition,
central area empty for characters,
no characters no people,

forest clearing at dusk,
muted forest green and warm brown,
small mushrooms and wildflowers,

warm orange sunset glow (#D4A574),
cozy evening atmosphere,
soft long shadows,
peaceful feeling`,
      negative: BG_NEGATIVE
    },
    {
      id: 'treasure-room',
      name: '보물 창고',
      nameEn: 'Treasure Room',
      group: '던전',
      prompt: `layered silhouette background style,
dark muted color palette with low saturation,
strong vignette effect with darker edges,
minimal atmospheric scene design,

wide landscape 16:9 aspect ratio,
layered depth composition,
central area empty for characters,
no characters no people,

cozy dungeon treasure room,
warm amber torchlight glow (#D4A574),
stone walls with warm brown tones (#6B4423),
treasure chests and coins,
adventure atmosphere,

warm inviting lighting,
sense of discovery`,
      negative: BG_NEGATIVE
    },
    {
      id: 'castle-garden',
      name: '성 정원',
      nameEn: 'Castle Garden',
      group: '성',
      prompt: `layered silhouette background style,
dark muted color palette with low saturation,
strong vignette effect with darker edges,
minimal atmospheric scene design,

wide landscape 16:9 aspect ratio,
layered depth composition,
central area empty for characters,
no characters no people,

cozy castle garden,
elegant hedges and flower beds,
warm sunlight,
muted burgundy (#8B4049) and gold (#B8860B) accents,
royal but welcoming atmosphere,

calm serene lighting,
peaceful mood`,
      negative: BG_NEGATIVE
    }
  ],

  'ui': [
    // ---- 코인 (4종) ----
    {
      id: 'coin-heads',
      name: '코인 앞면',
      nameEn: 'Coin Heads',
      group: '코인',
      prompt: `${UI_COIN_STYLE},

sun symbol centered on coin face,
eight short rays radiating from central sun disc,
warm gold metallic surface #FFD700,
bright cream highlight #FFF8DC on upper edge,
dark antique gold rim #B8860B,
subtle embossed relief texture,
warm golden sheen with gentle depth`,
      negative: UI_NEGATIVE
    },
    {
      id: 'coin-tails',
      name: '코인 뒷면',
      nameEn: 'Coin Tails',
      group: '코인',
      prompt: `${UI_COIN_STYLE},

crescent moon with two to three small stars,
cool silver metallic surface #C0C0C0,
light gray highlight #D3D3D3 on upper edge,
medium gray rim #808080,
subtle engraved relief texture,
cold silver sheen with gentle depth`,
      negative: UI_NEGATIVE
    },
    {
      id: 'coin-edge',
      name: '코인 측면',
      nameEn: 'Coin Edge',
      group: '코인',
      prompt: `fantasy card game coin edge view,
hand-drawn illustration with warm ink outlines,
side strip view of a coin,
horizontal strip shape,
gold to silver gradient across surface,
serrated ridged pattern along the edge,
warm tone on left transitioning to cool tone on right,
isolated on solid white background,
output 256x64 pixels`,
      negative: UI_NEGATIVE
    },
    {
      id: 'coin-pouch',
      name: '코인 주머니',
      nameEn: 'Coin Pouch',
      group: '코인',
      prompt: `fantasy card game coin pouch asset,
hand-drawn illustration with warm ink outlines,
small leather drawstring pouch #8B4513,
tied shut with braided cord,
three to five gold coins spilling out,
warm adventurous cozy feeling,
muted earthy tones with gold accents,
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

dark crimson gradient background #8B4049 to #6B3039,
semi-transparent crossed sword icon centered,
wide horizontal button shape,
subtle inner shadow for depth,
muted warm red tone evoking finality`,
      negative: UI_NEGATIVE
    },
    {
      id: 'btn-coin-flip',
      name: '코인 플립',
      nameEn: 'Coin Flip Button',
      group: '버튼',
      prompt: `${UI_BUTTON_STYLE},

warm gold gradient background #FFD700 to #B8860B,
small coin symbol centered,
subtle golden glow effect around edges,
bright warm inviting feeling,
metallic sheen highlight on top edge`,
      negative: UI_NEGATIVE
    },
    {
      id: 'btn-primary',
      name: '기본 버튼',
      nameEn: 'Primary Button',
      group: '버튼',
      prompt: `${UI_BUTTON_STYLE},

warm gold accent gradient #D4A574 to #B8956A,
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

dark gray gradient background #2A2A32 to #1E1E24,
thin graphite border outline #4A4A55,
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

coral red gradient background #C05050 to #8B3040,
warning destructive action appearance,
subtle dark vignette at edges,
muted crimson tone evoking caution,
slightly desaturated red for dark fantasy feel`,
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
muted toxic green color #4A7A2E,
small droplets falling below skull,
ominous poisonous atmosphere,
dark fantasy status effect icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-spore',
      name: '포자',
      nameEn: 'Spore',
      group: '상태 아이콘',
      prompt: `${UI_ICON_STYLE},

mushroom cap releasing floating spore particles,
muted purple color #6B4B8C,
small dots and particles drifting upward,
organic fungal atmosphere,
dark fantasy status effect icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-thorns',
      name: '가시',
      nameEn: 'Thorns',
      group: '상태 아이콘',
      prompt: `${UI_ICON_STYLE},

sharp thorny vine coiling in circular shape,
dark teal green color #2E6B5A,
pointed barbs protruding outward,
dangerous defensive atmosphere,
dark fantasy status effect icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-hardening',
      name: '경화',
      nameEn: 'Hardening',
      group: '상태 아이콘',
      prompt: `${UI_ICON_STYLE},

solid rock surface with crystalline facets,
steel gray color #5A5F6B,
angular stone slab with crack lines,
heavy fortified atmosphere,
dark fantasy status effect icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-evasion',
      name: '회피',
      nameEn: 'Evasion',
      group: '상태 아이콘',
      prompt: `${UI_ICON_STYLE},

wind swirl with speed lines,
cool blue color #4A7AC0,
dynamic motion blur streaks,
swift agile atmosphere,
dark fantasy status effect icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-vulnerable',
      name: '취약',
      nameEn: 'Vulnerable',
      group: '상태 아이콘',
      prompt: `${UI_ICON_STYLE},

cracked shield with broken armor fragment,
dark red-brown color #8B4049,
visible fracture lines across surface,
weakened exposed atmosphere,
dark fantasy status effect icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-strength',
      name: '힘',
      nameEn: 'Strength',
      group: '상태 아이콘',
      prompt: `${UI_ICON_STYLE},

upward-pointing sword with power aura radiating,
coral red color #C05050,
energy lines emanating from blade,
fierce empowered atmosphere,
dark fantasy status effect icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-weak',
      name: '약화',
      nameEn: 'Weak',
      group: '상태 아이콘',
      prompt: `${UI_ICON_STYLE},

broken sword with downward droop,
muted orange-brown color #8B6B4A,
wilting blade bending downward,
weakened diminished power atmosphere,
dark fantasy status effect icon`,
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
warm red color #C05050,
smooth rounded heart shape,
subtle highlight on upper left,
dark fantasy resource icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-defense',
      name: '방어도',
      nameEn: 'Defense',
      group: '리소스 아이콘',
      prompt: `${UI_ICON_STYLE},

shield symbol with sturdy frame,
steel blue color #4A90C0,
heraldic shield silhouette,
subtle metallic sheen,
dark fantasy resource icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-soul',
      name: '소울',
      nameEn: 'Soul',
      group: '리소스 아이콘',
      prompt: `${UI_ICON_STYLE},

ghostly wisp soul flame floating upward,
ethereal cyan-white color #A0D8E8,
translucent spirit silhouette with soft glow trail,
mysterious otherworldly luminescence,
dark fantasy resource icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-mini-coin',
      name: '미니 코인',
      nameEn: 'Mini Coin',
      group: '리소스 아이콘',
      prompt: `${UI_ICON_STYLE},

small circular coin with simple embossed mark,
gold color #FFD700,
clean flat coin silhouette,
subtle rim edge detail,
dark fantasy resource icon`,
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
red tint color #C05050,
sharp blade edges with bold outlines,
aggressive threatening atmosphere,
dark fantasy monster intent icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-intent-defense',
      name: '방어 의도',
      nameEn: 'Defense Intent',
      group: '몬스터 의도',
      prompt: `${UI_ICON_STYLE},

shield with small plus sign overlay,
blue tint color #4A90C0,
sturdy defensive shield silhouette,
protective guarding atmosphere,
dark fantasy monster intent icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-intent-buff',
      name: '버프 의도',
      nameEn: 'Buff Intent',
      group: '몬스터 의도',
      prompt: `${UI_ICON_STYLE},

upward arrow with sparkle particles,
warm gold color #D4A574,
ascending arrow with small star bursts,
empowering strengthening atmosphere,
dark fantasy monster intent icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-intent-debuff',
      name: '디버프 의도',
      nameEn: 'Debuff Intent',
      group: '몬스터 의도',
      prompt: `${UI_ICON_STYLE},

downward arrow with dark mist wisps,
muted purple color #6B4B8C,
descending arrow surrounded by fog,
ominous weakening atmosphere,
dark fantasy monster intent icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-intent-unknown',
      name: '미공개 의도',
      nameEn: 'Unknown Intent',
      group: '몬스터 의도',
      prompt: `${UI_ICON_STYLE},

large bold question mark symbol,
neutral gray color #4A4A55,
thick outlined question mark centered,
mysterious uncertain atmosphere,
dark fantasy monster intent icon`,
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
muted gray color #4A4A55,
classic hourglass silhouette,
time passage atmosphere,
dark fantasy turn phase icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-phase-coin',
      name: '코인 플립',
      nameEn: 'Coin Flip Phase',
      group: '턴 페이즈',
      prompt: `${UI_ICON_STYLE},

spinning coin in mid-air with motion arc,
warm gold color #D4A574,
coin shown at angle with rotation blur,
dynamic flipping moment,
dark fantasy turn phase icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-phase-player',
      name: '플레이어 턴',
      nameEn: 'Player Turn',
      group: '턴 페이즈',
      prompt: `${UI_ICON_STYLE},

lightning bolt symbol with electric energy,
blue color #4A90C0,
jagged bolt shape with small sparks,
active empowered player atmosphere,
dark fantasy turn phase icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-phase-monster',
      name: '몬스터 턴',
      nameEn: 'Monster Turn',
      group: '턴 페이즈',
      prompt: `${UI_ICON_STYLE},

monster claw slash with sharp fangs,
red color #C05050,
three claw marks with pointed teeth below,
dangerous menacing atmosphere,
dark fantasy turn phase icon`,
      negative: UI_NEGATIVE
    },

    // ---- 라운드 노드 (6종) ----
    {
      id: 'icon-node-monster',
      name: '몬스터 노드',
      nameEn: 'Monster Node',
      group: '라운드 노드',
      prompt: `${UI_NODE_STYLE},

sword icon on red circular badge background #C05050,
simple crossed sword silhouette,
white or cream icon on colored circle,
combat encounter node,
dark fantasy map node icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-node-elite',
      name: '엘리트 노드',
      nameEn: 'Elite Node',
      group: '라운드 노드',
      prompt: `${UI_NODE_STYLE},

skull icon on purple circular badge background #6B4B8C,
simple skull silhouette front view,
white or cream icon on colored circle,
elite dangerous encounter node,
dark fantasy map node icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-node-shop',
      name: '상점 노드',
      nameEn: 'Shop Node',
      group: '라운드 노드',
      prompt: `${UI_NODE_STYLE},

gem or bag icon on gold circular badge background #D4A574,
simple treasure silhouette,
white or cream icon on colored circle,
merchant shop node,
dark fantasy map node icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-node-event',
      name: '이벤트 노드',
      nameEn: 'Event Node',
      group: '라운드 노드',
      prompt: `${UI_NODE_STYLE},

exclamation mark on cream circular badge background #FFF5E6,
bold dark exclamation symbol #4A4A55,
dark icon on light cream circle,
random event encounter node,
dark fantasy map node icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-node-boss',
      name: '보스 노드',
      nameEn: 'Boss Node',
      group: '라운드 노드',
      prompt: `${UI_NODE_STYLE},

crown icon on deep crimson circular badge background #8B0000,
regal crown silhouette with pointed peaks,
white or cream icon on dark red circle,
final boss encounter node,
dark fantasy map node icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-node-rest',
      name: '휴식 노드',
      nameEn: 'Rest Node',
      group: '라운드 노드',
      prompt: `${UI_NODE_STYLE},

campfire flame icon on warm brown circular badge background #6B4423,
simple flame silhouette with small sparks,
white or cream icon on colored circle,
rest recovery healing node,
dark fantasy map node icon`,
      negative: UI_NEGATIVE
    },

    // ---- 스킬 아이콘 (14종) ----
    {
      id: 'icon-skill-basic-strike',
      name: '기본 공격',
      nameEn: 'Basic Strike',
      group: '스킬 아이콘',
      prompt: `${UI_ICON_STYLE},

single straight sword pointing upward,
warm steel gray color #5A5F6B,
simple clean blade silhouette,
minimal no-frills weapon,
dark fantasy skill icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-skill-defense',
      name: '방어',
      nameEn: 'Defense',
      group: '스킬 아이콘',
      prompt: `${UI_ICON_STYLE},

round shield with horizontal bar across center,
steel blue color #4A90C0,
sturdy solid shield silhouette,
protective blocking stance,
dark fantasy skill icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-skill-fighting-spirit',
      name: '투지',
      nameEn: 'Fighting Spirit',
      group: '스킬 아이콘',
      prompt: `${UI_ICON_STYLE},

clenched fist with upward energy lines,
warm red-orange color #C07050,
strong determined fist raised,
fighting spirit vitality aura,
dark fantasy skill icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-skill-combo-strike',
      name: '연속 베기',
      nameEn: 'Combo Strike',
      group: '스킬 아이콘',
      prompt: `${UI_ICON_STYLE},

two crossed daggers with motion slash lines,
coral red color #C05050,
dual blade cross pattern,
swift consecutive attack feel,
dark fantasy skill icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-skill-cleave',
      name: '분산 공격',
      nameEn: 'Cleave',
      group: '스킬 아이콘',
      prompt: `${UI_ICON_STYLE},

wide horizontal slash arc with radiating impact,
electric blue color #4A7AC0,
broad sweeping blade trail,
area attack wide spread feel,
dark fantasy skill icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-skill-weakening-strike',
      name: '약화 공격',
      nameEn: 'Weakening Strike',
      group: '스킬 아이콘',
      prompt: `${UI_ICON_STYLE},

sword with cracked zigzag impact lines,
muted purple color #6B4B8C,
blade with fracture marks radiating,
weakening debilitating strike,
dark fantasy skill icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-skill-weakening-blow',
      name: '약화의 일격',
      nameEn: 'Weakening Blow',
      group: '스킬 아이콘',
      prompt: `${UI_ICON_STYLE},

hammer with shockwave ripples expanding outward,
muted purple color #6B4B8C,
heavy impact with concentric rings,
area weakening crushing blow,
dark fantasy skill icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-skill-charge',
      name: '차지',
      nameEn: 'Charge Attack',
      group: '스킬 아이콘',
      prompt: `${UI_ICON_STYLE},

lightning bolt striking downward with energy sparks,
electric amber color #DAA520,
jagged bolt with small spark particles,
charged power accumulation,
dark fantasy skill icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-skill-vulnerable-strike',
      name: '취약 공격',
      nameEn: 'Vulnerable Strike',
      group: '스킬 아이콘',
      prompt: `${UI_ICON_STYLE},

crosshair target reticle with crack lines through center,
dark red color #8B4049,
precise targeting with shatter marks,
vulnerability exploiting strike,
dark fantasy skill icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-skill-desperate-strike',
      name: '절망의 일격',
      nameEn: 'Desperate Strike',
      group: '스킬 아이콘',
      prompt: `${UI_ICON_STYLE},

skull with single large sword piercing through top,
dark crimson color #6B2030,
jagged desperate energy radiating,
last resort all-or-nothing attack,
dark fantasy skill icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-skill-focus',
      name: '집중',
      nameEn: 'Focus',
      group: '스킬 아이콘',
      prompt: `${UI_ICON_STYLE},

single eye symbol with radiating focus lines,
warm gold color #D4A574,
concentrated gaze with thin rays,
mental focus precision aura,
dark fantasy skill icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-skill-regenerative-defense',
      name: '재생 방어',
      nameEn: 'Regenerative Defense',
      group: '스킬 아이콘',
      prompt: `${UI_ICON_STYLE},

shield with small leaf sprouting from center,
teal green color #2E6B5A,
protective shield with organic growth,
healing defensive nature power,
dark fantasy skill icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-skill-weakening-defense',
      name: '약화 방어',
      nameEn: 'Weakening Defense',
      group: '스킬 아이콘',
      prompt: `${UI_ICON_STYLE},

shield with downward arrow overlay,
muted blue-purple color #5A5B8C,
defensive shield with weakening mark,
protection with counter-debuff,
dark fantasy skill icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-skill-desperate-shield',
      name: '절망의 방패',
      nameEn: 'Desperate Shield',
      group: '스킬 아이콘',
      prompt: `${UI_ICON_STYLE},

cracked shield with dark energy swirling around,
dark crimson color #6B2030,
broken shield fragments held by dark force,
last resort desperate defense,
dark fantasy skill icon`,
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
cream white color #FFF5E6,
mechanical gear silhouette centered,
clean utility atmosphere,
dark fantasy settings icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-target-cursor',
      name: '대상 커서',
      nameEn: 'Target Cursor',
      group: '기타',
      prompt: `${UI_ICON_STYLE},

crosshair reticle with outer circle,
warm gold color #D4A574,
thin cross lines intersecting at center,
precise targeting atmosphere,
dark fantasy cursor icon`,
      negative: UI_NEGATIVE
    },
    {
      id: 'icon-defense-badge',
      name: '방어도 뱃지',
      nameEn: 'Defense Badge',
      group: '기타',
      prompt: `${UI_ICON_STYLE},

circular shield emblem with inner crest,
dark blue base #2A4A6B with steel blue accent #4A90C0,
round badge shape with layered rings,
sturdy protective atmosphere,
dark fantasy defense badge icon`,
      negative: UI_NEGATIVE
    }
  ]
}
