export type WarriorSpriteState = 'idle' | 'attack' | 'hit'

export interface WarriorSpritePrompt {
  id: string
  state: WarriorSpriteState
  name: string
  referenceAsset: string
  prompt: string
  negative: string
}

const joinPrompt = (...lines: string[]) => lines.filter(Boolean).join(',\n')

/**
 * Canonical visual reference for CLS_W.
 * Attach this image as the visual reference whenever the image model supports it.
 */
export const WARRIOR_REFERENCE_ASSET = 'assets/characters/CLS_W_warrior.png'

const WARRIOR_REFERENCE_LOCK = joinPrompt(
  'PRIORITY REFERENCE LOCK: use the attached benchmark warrior image as the single visual source of truth',
  'recreate the same beginner warrior character and the same visual construction as closely as possible without redesigning the character',
  'preserve the exact overall silhouette hierarchy, oversized floppy charcoal-gray triangular forest hat, short messy warm-brown hair, subdued half-lidded face, tiny dot-like nose and mouth treatment, restrained peach-pink cheek blush, muted brick-red vest, cream sleeves, simple brown wrist wraps, brown belt with square buckle, dark short trousers, short brown boots, and one plain short sword',
  'preserve the same compact squat SD proportions: oversized head and hat dominating the silhouette, tiny torso, very short legs, small rounded boots, short simplified arms, mitten-like hands',
  'preserve the same calm slightly weary cautious personality; friendly enough to be playable but never cheerful, glossy, heroic, or mascot-like',
  'preserve the same flat muted palette and relative color relationships from the reference rather than inventing new costume colors',
  'preserve the same intentionally awkward hand-made indie sprite construction rather than polishing it into modern anime or vector mascot art',
)

const WARRIOR_STYLE_LOCK = joinPrompt(
  'hand-drawn 2D SD sticker game sprite for a dark fairy-tale roguelike deckbuilder',
  'compact readable low-fidelity indie sprite construction with large simple color masses and sparse purposeful interior marks',
  'all visible contours and internal marks use controlled uneven hand-drawn or pixel-stepped rhythm rather than smooth geometric vector curves',
  'outer silhouette, hat edge, hair clumps, eyelids, brows, nose, mouth, vest edges, wraps, boots, sword and all internal marks should remain slightly blunt, chunky and irregular',
  'crisp full-resolution source image with intentional coarse construction; no blur, no random noise, no compression damage, no fake reduced-resolution degradation',
  'strictly flat muted color fields with hard boundaries; minimal or no shading; no gradients; no cel shading; no glossy lighting; no tonal modeling',
  'matte hand-filled pigment feeling may use only one restrained low-contrast irregular variation on broad color regions',
  'silhouette-first readability at 32px and 64px and clear recognition around 96x96 after downscaling',
)

const WARRIOR_VISUAL_SHELL = joinPrompt(
  'VISUAL SHELL ORDER: character color silhouette -> #48413F CharacterOuterLine -> #F9F6F0 BorderArea -> #48413F Outerline -> genuine transparent RGBA alpha',
  'CharacterOuterLine reads as approximately 2px fixed at final normalized sprite scale',
  'BorderArea is an off-white #F9F6F0 sticker separation border averaging approximately 8px and following the silhouette',
  'Outerline is #48413F averaging approximately 4px and remains fully opaque',
  'both dark contours and the off-white separation border inherit the same controlled uneven hand-cut contour rhythm',
  'no decorative shell or frame unrelated to the character silhouette',
)

const WARRIOR_OUTPUT_LOCK = joinPrompt(
  'single character sprite only',
  'standalone full-body transparent PNG asset with genuine RGBA alpha transparency',
  '1:1 square canvas',
  'complete head, hat, torso, arms, hands, legs, feet, boots, sword, sticker border and final outer contour fully visible',
  'nothing cropped and nothing touching the canvas edge',
  'center the complete sticker-shell bounding box on the canvas',
  'keep the sprite large and consistent in frame while preserving a narrow transparent safety margin around every furthest point',
  'outside the final #48413F contour transition directly to alpha 0',
  'no checkerboard drawn into the image, no white matte, no gray matte, no chroma-key fallback, no background scene, no ground, no shadow, no text, no logo, no watermark, no UI frame',
)

export const WARRIOR_SPRITE_NEGATIVE = `
character redesign, different costume, different hair color, different vest color, different sword design, missing hat, small hat, ornate hat, wizard symbols, stars, moons, runes, magic effects,
polished mascot face, polished vector mascot, smooth vector outline, perfectly uniform outline, perfectly even sticker border, smooth bezier silhouette, glossy anime character, anime manga style, anime beauty face, large sparkling eyes, pupils, irises, glossy eye highlights, realistic eyeballs,
realistic anatomy, tall body, natural-length limbs, muscular body, detailed fingers, complex hands, heroic proportions, baby or toddler proportions,
ornate armor, shoulder plates, complex accessories, multiple weapons, shield, giant sword, long sword, ornate sword,
photorealistic, realistic, 3D render, CGI, painterly illustration, watercolor, gouache, airbrush, soft shading, gradient shading, cel shading, ambient occlusion, rim light, glossy highlights, heavy paper grain, visible brush strokes,
blur, random noise, JPEG artifacts, compression damage, artificial low-resolution degradation, broken anatomy,
card frame, portrait frame, UI frame, panel, text, letters, numbers, logo, watermark, scene background, environment, floor, ground plane, cast shadow, contact shadow, checkerboard background, fake transparency, painted transparency, white background, gray background, green background,
extra character, visible monster, visible enemy, duplicate body parts, cropped hat, cropped boots, cropped sword, cropped border, cropped outer contour
`.trim()

export const WARRIOR_IDLE_PROMPT = joinPrompt(
  WARRIOR_REFERENCE_LOCK,
  WARRIOR_STYLE_LOCK,
  'BASE / IDLE POSE LOCK: reproduce the attached benchmark composition as closely as possible',
  'mostly front-facing with only a very subtle rightward bias; head, body and feet remain compact and nearly frontal',
  'shoulders relaxed, feet planted close together, neutral balanced idle stance',
  'one hand loosely holds the short sword down and diagonally toward the lower-left, with the full blade and hilt visible',
  'the sword remains secondary to the huge hat-and-head silhouette',
  'eyes remain soft half-lidded off-white shapes with no pupils; expression subdued, slightly tired and cautious',
  'do not add action effects or motion cues',
  WARRIOR_VISUAL_SHELL,
  WARRIOR_OUTPUT_LOCK,
)

export const WARRIOR_ATTACK_PROMPT = joinPrompt(
  WARRIOR_REFERENCE_LOCK,
  WARRIOR_STYLE_LOCK,
  'ATTACK KEYFRAME: preserve the exact same warrior identity, palette, clothing, hat, hair, face construction, sword design, proportions and visual shell; change pose only',
  'player attacks toward screen-right',
  'one compact readable melee strike keyframe: torso leans slightly right, front shoulder advances, hips rotate only a little, and the short sword swings from the lower-left resting position across the body toward screen-right',
  'sword arm extends enough to clearly read as a hit, but keep the elbow bent and the weapon close enough that the overall sticker silhouette stays compact',
  'feet remain close; use only a small forward step or weight shift rather than a wide heroic lunge',
  'hat lags subtly backward from the motion with one controlled asymmetrical bend; hair follows with one or two chunky shifted tufts only',
  'expression changes from weary idle to focused effort: eyelids slightly tighter, brows angled with restrained determination, tiny mouth still simple',
  'single action silhouette only, readable at 32px and 64px',
  'no slash trail, no spark burst, no impact star, no magic glow, no enemy, no detached effects; the body pose and sword angle alone must communicate the attack',
  'keep the entire sword, hat, boots, border and outer contour inside the canvas',
  WARRIOR_VISUAL_SHELL,
  WARRIOR_OUTPUT_LOCK,
)

export const WARRIOR_HIT_PROMPT = joinPrompt(
  WARRIOR_REFERENCE_LOCK,
  WARRIOR_STYLE_LOCK,
  'HIT / DAMAGE REACTION KEYFRAME: preserve the exact same warrior identity, palette, clothing, hat, hair, face construction, sword design, proportions and visual shell; change pose only',
  'incoming impact is understood to come from screen-right toward the player',
  'compact readable recoil pose: torso shifts and tilts slightly back toward screen-left, shoulders compress inward, knees soften, and the head pulls back a small amount',
  'the oversized hat tilts and deforms slightly from the impact while remaining on the head; do not detach it',
  'sword remains in the same hand but drops lower and closer to the body, never flying away',
  'arms stay compact and hands remain simplified; one free arm may pull slightly inward toward the torso',
  'expression becomes a restrained startled hurt reaction: eyelids squeeze or become uneven, brows lift and pinch, tiny mouth becomes a short small open or tense mark; still cute and readable, never comedic slapstick',
  'no blood, no wound, no gore, no bruising, no broken equipment',
  'no impact star, no comic text, no particles, no enemy, no detached effect; the recoil silhouette and facial change alone must communicate being hit',
  'keep the full character, sword, hat, boots, sticker border and outer contour inside the canvas',
  WARRIOR_VISUAL_SHELL,
  WARRIOR_OUTPUT_LOCK,
)

export const WARRIOR_SPRITE_PROMPTS: WarriorSpritePrompt[] = [
  {
    id: 'warrior-idle-reference-lock',
    state: 'idle',
    name: '전사 - 기준/대기',
    referenceAsset: WARRIOR_REFERENCE_ASSET,
    prompt: WARRIOR_IDLE_PROMPT,
    negative: WARRIOR_SPRITE_NEGATIVE,
  },
  {
    id: 'warrior-attack',
    state: 'attack',
    name: '전사 - 공격',
    referenceAsset: WARRIOR_REFERENCE_ASSET,
    prompt: WARRIOR_ATTACK_PROMPT,
    negative: WARRIOR_SPRITE_NEGATIVE,
  },
  {
    id: 'warrior-hit',
    state: 'hit',
    name: '전사 - 피격',
    referenceAsset: WARRIOR_REFERENCE_ASSET,
    prompt: WARRIOR_HIT_PROMPT,
    negative: WARRIOR_SPRITE_NEGATIVE,
  },
]
