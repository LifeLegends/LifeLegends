# LifeLegends — Visual Design Bible

Version 1.0 · Single source of truth for all visual decisions
No code. No architecture. Only artistic direction.

---

## 1. Design Philosophy

LifeLegends is not a content website. It is a **digital museum wing at night** — the moment after closing hours, when the galleries are empty, the crowds are gone, and each portrait is lit only for you. Every design decision serves that one sensation: *quiet reverence in the presence of greatness.*

The governing philosophy is **restraint as luxury**. Premium is not more ornament — it is more space, more silence, more precision. Every element that survives onto the page must earn its place. If a component doesn't deepen the feeling of standing before something important, it is cut.

## 2. Emotional Experience

The visitor should feel, in order:

1. **Arrival** — a held breath. The loading sequence and hero don't rush; they let anticipation build.
2. **Awe** — the hero portrait and headline land like walking into a rotunda and seeing the centerpiece sculpture.
3. **Curiosity** — categories and featured cards invite exploration without overwhelming; each is a doorway, not a demand.
4. **Intimacy** — the biography page is where awe becomes connection: a single life, examined closely, lit like a private viewing.
5. **Continuity** — the timeline and footer close the loop, reminding the visitor this is one room in a much larger museum.

Nothing on the site should feel like a "web app." Nothing should flash, nag, or compete for attention. The visitor sets the pace by scrolling; the site never rushes them.

## 3. Luxury Principles

- **Negative space is the primary luxury material.** When in doubt, remove an element rather than shrink it.
- **One accent color speaks at a time.** Gold and violet never shout simultaneously in the same visual unit — one leads, the other supports as ambient atmosphere.
- **Nothing is free.** Every border, glow, and shadow must justify its presence by adding depth or hierarchy, never decoration for its own sake.
- **Consistency over novelty per-section.** A section that reinvents the visual language undermines the museum's authority. The signature devices (duotone portraits, gold rim light, glass panels) repeat throughout, like consistent gallery signage.
- **Confidence, not urgency.** No countdown timers, no aggressive CTAs, no "Act now" energy. Legends have already stood the test of time; the site should feel equally unhurried.

## 4. Museum Inspiration

Drawn from the feeling of major cultural institutions — the Louvre at dusk, the Guggenheim's spiral hush, a Nobel archive reading room:

- Portraits are spotlit against darkness, never against white gallery walls — this is a **night museum**, not a bright one.
- Wall-text conventions inspire the eyebrow-label system (small, gold, tracked-out capitals identifying what you're about to see, exactly as a placard precedes an artwork).
- Generous plinth-like spacing surrounds every "exhibit" (card, portrait, stat block) — nothing touches the edge of its frame.
- Visitors move room to room (section to section); each room has one clear subject.

## 5. Editorial Inspiration

Drawn from long-form print journalism at its most prestigious (think a Nobel-prize retrospective spread, not a listicle):

- Large serif display type used sparingly and with authority — headlines are typeset, not merely large.
- Pull-quotes are treated as monuments: isolated, centered, oversized italics, nothing competing nearby.
- Captions and metadata (dates, stat labels, categories) are small, quiet, and consistently placed — the reader trusts them because they never change position or voice.

## 6. Cinematic Inspiration

Drawn from prestige-film title sequences and biographical documentaries:

- Every reveal is a **held shot**, not a jump cut: content fades and rises into place over 400–800ms, never appears instantly.
- Light behaves like a key light in a portrait studio — one dominant source (implied top-left or top-right), soft falloff, no flat even lighting anywhere.
- The loading sequence is a title card: wordmark, silence, a single thin progress line — not a spinner, not a percentage-heavy dashboard readout.
- Parallax is used the way a slow dolly-in is used in film: to add dimensionality to a still frame, never as a gimmick that calls attention to itself.

## 7. Color Psychology

| Color | Psychological role |
|---|---|
| **Near-black void** (`#05050A`) | The neutral museum darkness. Reads as infinite, respectful, non-competing — it is the silence between notes. |
| **Gold** (`#D4AF6A`) | Achievement, permanence, the "eternal flame" of legacy. Used for anything that says *this matters* — CTAs, active states, labels, timeline highlights. |
| **Violet / indigo** (`#6E5BD6`, `#2A1F5E`) | Mystery, intellect, the ineffable quality of genius. Used as ambient atmosphere — glows, gradients, background light — never as a solid fill on text or buttons. |
| **Off-white text** (`#F5F3EE`) | Warm rather than clinical white — keeps the darkness feeling inhabited, not cold. |
| **Muted gray-blue** | Secondary information recedes without disappearing — supporting cast, never competing with the lead. |

**Rule of one lead color per moment:** gold leads in interactive/CTA moments; violet leads in ambient/atmospheric moments. They share a frame but never fight for the same job.

## 8. Lighting System

- **Single dominant light source** per composition, implied via gradient direction — never flat, evenly-lit surfaces.
- **Key light = violet glow**, positioned off-center (typically upper-right in hero contexts, mirroring the reference), used to sculpt depth behind subjects.
- **Rim light = gold**, a thin 1px edge-light on portraits and active cards — this is the signature "museum spotlight edge" that separates subject from void.
- Light never fully illuminates a surface corner-to-corner; every lit area fades back to void at its edges (vignette discipline, §10).
- Light intensity scales with importance: hero > featured card > standard card > background texture.

## 9. Background Treatment

- The void (`#05050A`) is the constant canvas — never pure black (#000), which reads as "no signal" rather than "night museum."
- Ambient nebula glows (soft, large-radius, blurred radial gradients in violet and gold) drift slowly or stay static depending on section importance — hero and section transitions get them, dense content sections (long-form bio text) stay quieter so text stays legible.
- A very faint film-grain/noise texture sits over the entire site at all times (2–4% opacity) — this is what keeps the flat digital darkness from looking like a UI mockup instead of a physical space.
- Backgrounds are never a flat single hex color in a hero or feature section — there is always at least one soft gradient breathing behind the content.

## 10. Depth System

Four depth planes, consistently used across every page:

1. **Void plane** — the background itself, farthest back, near-black with ambient glow.
2. **Ambient plane** — floating light arcs, particles, blurred glow shapes; drift slowly on parallax, establish atmosphere without demanding focus.
3. **Content plane** — cards, portraits, text blocks; the "objects in the room" the visitor came to see.
4. **Interface plane** — navigation, cursor, active-state chrome; always nearest, always crisp, never blurred or glowing itself (it should feel like glass between the visitor and the museum, not part of the exhibit).

Parallax depth increases from plane 1 → 2 (ambient moves more than content; interface never moves with the mouse).

## 11. Shadow System

- Shadows are **soft, large-radius, and low-opacity** — never a tight, hard-edged drop shadow (that reads as flat-design, not cinematic).
- Standard ambient shadow: large blur (60–120px), heavy negative spread, opacity capped around 60% black — used under any "raised" object (portraits, glass panels).
- Gold glow and violet glow (§7/§8) function as *colored shadows* — used specifically to indicate importance/interactivity, not general elevation.
- Shadows never appear on text directly (no text-shadow for legibility tricks) — depth is created by background treatment, not by darkening type.

## 12. Border System

- Default border: hairline (1px), low-opacity white (`rgba(255,255,255,.08)`) — barely visible, present only to suggest an edge in the dark.
- Hover/active border: same hairline weight, opacity raised (`rgba(255,255,255,.16–.18)`) or shifted to gold — the border never gets thicker, only brighter/warmer. Weight stays constant; only color and glow escalate.
- Gold borders are reserved for: active/hover states on interactive cards, the hero portrait frame, and any element being called out as "currently in focus."
- No double borders, no drop-shadow-simulated borders, no gradient borders on small UI elements (reserve gradient treatment for large hero-scale compositions only).

## 13. Glass Usage Rules

Glass morphism is a **rare instrument**, not a default surface:

- Reserved exclusively for: navigation bar (on scroll), the search overlay panel, the newsletter panel, and modal/drawer surfaces.
- Never applied to content cards (legend cards, category cards) — those are solid dark surfaces with image content; glass would blur the "exhibit" itself, which breaks the museum metaphor.
- Glass = low-opacity white fill + hairline border + strong blur (~20px). It should read as a pane of museum display glass between the visitor and something behind it, never as a decorative texture.

## 14. Gold Usage Rules

Gold is the site's **achievement signal** — it must stay rare to stay meaningful:

- Used for: eyebrow labels, primary CTA fill/outline, active nav underline, active timeline node, hover glow on featured content, rim-light accents.
- Never used for: body text, large background fills, more than one CTA per view, decorative dividers with no functional meaning.
- Gold-on-dark text must always resolve through a solid gold fill with dark text on top (not gold text on dark background) wherever it's a primary action, to protect both contrast and restraint.

## 15. Purple Lighting Rules

Violet is **atmosphere, never object**:

- Always applied as a soft, blurred gradient or glow — never as a solid fill, border, or text color.
- Placed off-frame or behind subjects (implying a light source outside the visible composition), not centered on top of content.
- Deepest violet (`#2A1F5E`) anchors darker gradient transitions (portrait duotones, card overlays); brighter violet (`#6E5BD6`) is reserved for glow/highlight moments.
- Never let violet glow reduce text contrast — it sits behind or beside content, never directly under body copy without a darkening gradient on top of it.

## 16. Image Treatment

Every photographic image on the site goes through the same grading pass so the whole platform feels shot by one cinematographer:

1. **Grayscale base** (full or near-full desaturation) — removes the "stock photo" color temperature mismatch between disparate historical source images.
2. **Contrast + brightness pull-down** — punchy blacks, slightly underexposed, so the image feels lit rather than flatly photographed.
3. **Duotone color pass** — a violet-to-gold gradient applied in `color` blend mode, unifying every portrait into the site's palette regardless of source.
4. **Vignette** — edges (especially bottom, for text legibility, and top, for atmosphere) fade to void.
5. **Gold rim light** — a subtle inset highlight along one edge, reinforcing the single-light-source rule.

No image ships in its original color temperature. No image is fully desaturated *without* the duotone pass — flat grayscale alone reads as "placeholder," the gold/violet grade is what makes it feel intentional.

## 17. Portrait Composition

- Subjects are framed **tight and confident** — chest-up or head-and-shoulders, not full-body, not distant.
- Eyeline or gaze typically falls slightly off-camera or middle-distance — contemplative, not a mugshot-style direct smile-to-camera.
- Vertical aspect ratios dominate (4:5 or taller) — this is a gallery portrait, not a landscape banner photo.
- Backgrounds behind the subject in the source image are always subordinated to void via the vignette/duotone pass — the subject must read as "lifted out of history," not "photographed in a room."
- Hero-scale portraits may bleed off one edge of their frame (implying scale beyond the viewport); card-scale portraits stay fully contained within their rounded frame.

## 18. Hero Composition

- Asymmetric split: text-led composition occupies the left ~45–55%, portrait/art occupies the right, bleeding toward the edge.
- Headline is the loudest single element on the page — nothing else on the hero competes with it in size or weight.
- Exactly one CTA per hero. Never two competing actions.
- Ambient light (violet glow) sits behind/around the portrait, not behind the text — text stays on "clean void" for maximum legibility.
- A small index/meta marker (page count, scroll hint) anchors the bottom of the frame — a quiet wayfinding detail, never decorative clutter.

## 19. Card Design Language

- All cards share one anatomy: image/art fills the frame, a bottom gradient overlay guarantees text legibility, a small eyebrow/chip sits top-left, primary label sits bottom-left, and — where the card is navigable — a circular arrow affordance sits bottom-right.
- Card corner radius is consistent site-wide (one radius token, no per-section variation).
- Hover state escalates exactly three things together, never in isolation: border brightens toward gold, a soft gold glow appears, and the card lifts a few pixels — these three always move as one unit so hover feels like a single confident gesture, not scattered micro-effects.
- Card imagery is always duotone-treated (§16) — never a raw, full-color photo, even on hover.

## 20. Section Spacing

- Vertical rhythm between major sections is generous and consistent — sections should feel like walking from one gallery room into the next, with a clear threshold between them (never content packed edge-to-edge with the next section's content).
- Section headers (eyebrow + heading) always get more space above them (arriving into a new room) than below (moving into that room's content) — asymmetric spacing signals arrival.
- Horizontal margins stay consistent site-wide at each breakpoint — content never touches the viewport edge except intentionally bleeding hero art.
- Mobile spacing compresses proportionally but never collapses to zero — breathing room is a luxury signal that must survive at every size.

## 21. Typography Rhythm

- Two voices only: a serif display face for anything that should feel *spoken with authority* (headlines, names, pull-quotes), and a clean grotesk for anything *read for information* (body copy, labels, UI, data).
- Display type is used sparingly — reserved for hero headlines, section titles, legend names, and quotes. It never appears in paragraph-length runs.
- Label/eyebrow type is always small, uppercase, and letter-spaced wide — this tracked-out treatment is the site's consistent "wall placard" signature and should not be reproduced at large sizes or without the uppercase+tracking pairing.
- Line-length for body copy stays in a comfortable reading measure (~60–75 characters) even on wide desktop viewports — long-form biography text is never allowed to stretch edge-to-edge.
- Type scale steps are deliberate and few — avoid introducing one-off font sizes outside the established scale.

## 22. Animation Philosophy

- Motion exists to **reveal**, not to **decorate**. Every animation should answer "what is this helping the visitor understand or notice?" If the answer is "nothing, it just looks cool," cut it.
- One orchestrated moment per page load (the loading sequence, the hero reveal) is allowed to be elaborate. Everything after that is quieter, in service of scroll-driven storytelling rather than performance.
- Easing is always confident and decelerating (ease-out character) — things arrive with authority and settle, they don't bounce, overshoot, or wobble (no cartoonish spring physics anywhere on this site).
- Duration scales with element importance: hero-level reveals are slower and more deliberate (800ms+); small hover feedback is fast and immediate (150ms).

## 23. Motion Hierarchy

1. **Page-load ceremony** (loading sequence, hero entrance) — once per session, most elaborate, sets the tone.
2. **Scroll-triggered reveals** (sections fading/rising into view) — repeated throughout, consistent timing and easing, becomes a reassuring rhythm rather than a surprise each time.
3. **Ambient/idle motion** (parallax drift, subtle glow pulsing) — continuous, very subtle, never demands attention, purely atmospheric.
4. **Interactive feedback** (hover, focus, click) — fastest tier, direct response to the visitor's own action, always immediate (no delay before a hover state begins).

Higher tiers are rarer and slower; lower tiers are frequent and fast. This hierarchy is what prevents the site from feeling chaotic despite having motion nearly everywhere.

## 24. Scroll Storytelling Principles

- The page should feel like it is **narrating**, not merely "loading content as you go." Each section reveal should feel like a new sentence in the same story, not an unrelated widget appearing.
- Timeline-based content (a legend's life) uses scroll position itself as the narrative device — progress through the timeline should feel tied to the visitor's own physical scrolling, reinforcing "you are moving through this person's life."
- Reveals stagger in reading order (left-to-right, top-to-bottom) so the eye is guided the same way it would read a printed page.
- Nothing should reveal *before* it enters a comfortable viewing zone (roughly the lower 80% of the viewport) — content should never animate somewhere the visitor can't yet see clearly.

## 25. Mobile Design Philosophy

- The museum metaphor holds at every size — mobile is not "the desktop site, compressed," it's the same gallery experience walked through one exhibit at a time, single-file.
- Single-column, generous vertical spacing preserved even though horizontal space is limited — luxury reads through breathing room, not through horizontal density.
- Hero portraits and key imagery remain prominent on mobile (never shrunk to an afterthought) — the emotional payload of the hero must survive on a phone screen exactly as it does on desktop.
- Custom cursor and fine-pointer-only interactions gracefully disappear (they were never meant for touch) — but every micro-interaction they represented (hover glow, magnetic pull) has a touch-appropriate equivalent (tap state, press feedback) so nothing feels missing, only translated.
- Bottom tab bar (mobile-only) becomes the wayfinding anchor in place of the desktop header nav — consistent iconography, gold active-state, same restraint as desktop.

## 26. Hover Philosophy

- Hover is a **conversation, not a jump-scare** — states transition smoothly (never instant snap), and always move toward more light/warmth (brighter border, gold glow, slight lift), never toward a jarring color change or shape distortion.
- Every hoverable element has exactly one hover identity used consistently: cards lift + glow + border-brighten; buttons fill from one edge; links get a warm color shift with no underline jump.
- Hover states never hide information that was visible before hovering (e.g., a card's title should never disappear on hover) — additional information may appear, but nothing already trusted by the visitor should vanish.

## 27. Interaction Philosophy

- Every interactive element should feel like it has slight physical weight — motion settles rather than snapping to its end state, mimicking real inertia.
- Feedback is immediate on interaction start (no perceptible delay when a hover/press begins) but graceful on interaction end (a short, eased return, not an instant reset).
- The custom cursor (desktop) is a quiet companion, not a spectacle — it shifts subtly near interactive elements (widening into a ring) rather than transforming into icons or text.
- Sound, haptics, or aggressive attention-grabbing feedback (shaking, flashing, badge pings) have no place in this design language — the museum does not shout.

## 28. Icon Style

- Icons are thin-stroke, geometric, single-weight line icons — never filled/solid icon sets, never multi-color icon sets.
- Stroke weight stays consistent with the site's hairline border language (thin, precise) — icons should look like they were engraved, not drawn with a marker.
- Icons are functional wayfinding only (search, arrow, menu, social) — never decorative illustration filler. If an icon isn't clarifying an action, it doesn't belong.

## 29. Illustration Style

- Where photography isn't appropriate (category art, abstract concepts), illustration follows the same duotone gold/violet logic as photography — abstract gradient-and-line compositions that evoke a concept (a lightbulb form for "Innovators," a sculptural bust silhouette for "Pioneers") rather than literal clip-art.
- Illustration is always geometric/abstract, never cartoonish or flat-vector-stock-style — it should feel like museum signage art, not app iconography.
- Illustration and photography share the same lighting rules (§8) even though one is generated and one is captured — this is what keeps the two from feeling like they belong to different design systems.

## 30. Photography Style

- Every photograph used is treated as an **archival artifact**, not stock imagery — sourced from real historical material where the subject is a real figure, always run through the full Image Treatment pipeline (§16).
- No generic stock photography (smiling models, generic office/lifestyle imagery) ever appears anywhere on the site — if a real photo isn't available or appropriate, an abstract illustration (§29) is used instead; a mismatched stock photo is never an acceptable middle ground.
- Photography crops favor intimacy (§17) over context — the site is about the person, not their surroundings.

## 31. Component Consistency Rules

- **One radius token, one border token, one shadow token, one glow token** — every component references the same values; no component invents its own spacing or effect scale.
- Any new component proposed for a future page must be checked against Sections 11–20 (border, glass, gold, purple, image, portrait, hero, card rules) before it is approved — if it requires a new visual rule not covered here, that rule must be added to this document first, not improvised silently in code.
- Consistency is validated by the "museum test": if a component looks like it wandered in from a different, more generic website, it fails review regardless of how polished it looks in isolation.

---

**This document governs every visual decision on every future page.** Where a future request conflicts with a rule above, the conflict should be raised and resolved against this Bible before building — not silently overridden.
