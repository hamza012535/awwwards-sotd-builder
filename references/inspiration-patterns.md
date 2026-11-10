# Inspiration Patterns

Recurring techniques in winning sites. Use them as vocabulary, not a checklist: choose the few that serve your concept and execute them with craft. Copying a pattern without a reason is the fastest route to "derivative".

## Contents
1. Horizontal scroll galleries
2. Sticky pinning and scene sequences
3. WebGL heroes and image distortion
4. Kinetic typography
5. Brutalist and editorial layouts
6. Split-screen
7. Noise, grain, and texture
8. Custom cursors
9. Marquees and tickers
10. Full-screen menus and navigation
11. Page transitions and preloaders
12. Case-study / project index patterns
13. Sound and haptics (with opt-in)
14. Pairing recipes
15. How to adapt (not copy)

## 1. Horizontal scroll galleries
**What:** vertical scroll drives a horizontal track of projects/chapters. **Why it works:** gives rhythm and a "film strip" sense of progression. **Craft:** pin the wrapper, scrub the track, add progress indicator and index numbers; parallax images inside cards; snap to cards on release. **Pitfalls:** unusable on mobile without fallback; trapped keyboard users; too long (cap at 5-7 panels).

## 2. Sticky pinning and scene sequences
**What:** a section pins while inner elements animate (text swaps, image morphs, counters, 3D rotation). **Craft:** build scenes as GSAP timelines with `scrub`; use 100-300vh of scroll per scene; end with a clear release. Use `position: sticky` for simple cases (no JS). **Pitfalls:** too many pins fatigue; always allow quick skim of the content.

## 3. WebGL heroes and image distortion
**What:** a shader-driven plane that ripples, warps, or reveals on hover/scroll; particle fields; a 3D object reacting to cursor. **Craft:** images as textures on planes synced to DOM positions; displacement maps; chromatic aberration tied to scroll velocity; fluid cursor trails. **Pitfalls:** DOM/WebGL sync drift, heavy textures, no fallback. Keep the DOM text real so it stays accessible and indexable.

## 4. Kinetic typography
**What:** type that moves with meaning: letter-by-letter reveals, scroll-driven weight/width, text on a path, velocity skew, scrambled-to-resolved text, huge marquee words, variable font morphs. **Craft:** split text into lines/chars (preserve `aria-label`); stagger 20-60ms; mask reveals; keep line breaks stable on resize. **Pitfalls:** unreadable at mid-animation; layout shift during splitting.

## 5. Brutalist and editorial layouts
**What:** raw grids, oversized type, hairline rules, monospaced metadata, deliberate "ugliness" or magazine composition, index numbering, asymmetric columns, overlapping images. **Craft:** strict system under the chaos (consistent margins, baseline, two or three type sizes), limited palette, authoritative copy. **Pitfalls:** randomness that reads as unfinished; poor contrast; unreadable body text.

## 6. Split-screen
**What:** two halves with independent behavior: fixed text vs scrolling images; opposing scroll directions; hover one side to transform the other. **Craft:** `grid-template-columns: 1fr 1fr`, sticky halves, independent timelines; collapse to stacked layout on mobile. **Pitfalls:** attention split with no hierarchy.

## 7. Noise, grain, and texture
**What:** a subtle film-grain overlay, paper texture, halftone, or gradient noise to add tactility and counter digital flatness.
```html
<svg width="0" height="0"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .6 0"/></filter></svg>
```
```css
.grain { position: fixed; inset: -50%; pointer-events: none; z-index: 50; opacity: .07; filter: url(#n); animation: grain 1s steps(6) infinite; }
@keyframes grain { 0%{transform:translate(0,0)} 20%{transform:translate(-3%,2%)} 40%{transform:translate(2%,-3%)} 60%{transform:translate(-2%,-1%)} 80%{transform:translate(3%,3%)} 100%{transform:translate(0,0)} }
@media (prefers-reduced-motion: reduce) { .grain { animation: none; } }
```
Prefer a pre-rendered small PNG/WebP noise tile for performance on weak GPUs.

## 8. Custom cursors
**What:** blend-mode dot, expanding "View" label on media, drag cursor on carousels, magnetic pull toward buttons, trailing images. **Craft:** `quickTo` for smoothing, state via data attributes, hide on touch. **Pitfalls:** lag, obscured text, missing native cursor in inputs. Snippet in `motion-patterns.md`.

## 9. Marquees and tickers
**What:** infinitely scrolling words or logos, often reacting to scroll direction/velocity. **Craft:** duplicate content, translate `-50%`, tie speed to Lenis velocity, pause on hover/reduced motion. Use as punctuation between sections, not filler.

## 10. Full-screen menus and navigation
**What:** overlay menus with giant type, staggered link reveals, image preview on hover, index/time/location metadata. **Craft:** focus trap while open, `Esc` closes, `aria-expanded`, return focus; animate with clip-path or translate; keep nav always reachable.

## 11. Page transitions and preloaders
**What:** wipes, shared-element morphs from card to detail page, color curtain, zoom into image. **Craft:** same easing family as the rest of the site; under 1.2s; maintain scroll and focus management; skip preloader on repeat visit.

## 12. Case-study / project index patterns
- **Hover list:** large project names; hover reveals a floating preview that follows the cursor.
- **Stacked cards:** cards stick and scale down as the next arrives.
- **Grid with filters:** animated layout via GSAP Flip or Framer `layout`.
- **Detail pages:** hero media, role/year/tech metadata, narrative sections, next-project teaser that becomes the transition.

## 13. Sound and haptics
Optional, strictly opt-in (never autoplay audio). Provide a clear sound toggle, default off or muted, remember choice, and keep UI sounds under 200ms and low volume. Offer vibration only on mobile for key confirmations.

## 14. Pairing recipes
- *Editorial brutalism:* mono + grotesk, hairlines, index numbers, marquee, hover-list index, minimal motion, bold color flash.
- *Cinematic dark:* full-bleed video, WebGL hero, slow easings, pinned storytelling, grain.
- *Playful kinetic:* oversized variable type, bouncy magnetics, saturated blocks, cursor character.
- *Luxury minimal:* serif display, vast whitespace, slow masked reveals, subtle parallax, restrained palette.
- *Product 3D:* one hero object, scroll-linked camera, exploded views, spec typography.

## 15. How to adapt (not copy)
1. Name the underlying *function* of a pattern (e.g., "pacing a gallery").
2. Ask what your content's version of that function is.
3. Change at least two of: structure, motion language, interaction trigger, visual treatment.
4. Check against your concept sentence; remove it if it does not serve.
