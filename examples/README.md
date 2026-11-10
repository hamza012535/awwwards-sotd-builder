# Starter Template: scroll-driven hero, kinetic type, custom cursor

A dependency-free (HTML/CSS/JS) starting point that demonstrates the three moves most SOTD sites build on: a pinned scroll scene, type that behaves like a material, and a cursor with a point of view. Open `starter-template/index.html` directly in a browser, or serve it:

```bash
cd examples/starter-template
npx serve .          # or: python3 -m http.server 5173
```

Fonts (Bricolage Grotesque, JetBrains Mono) load from Google Fonts. Offline, the page falls back to system fonts and stays fully functional.

## How it works

| Piece | Where | Mechanism |
|---|---|---|
| Pinned hero | `.hero` (300vh) + `.hero__stage` (sticky) | Scroll position becomes progress `p` (0 to 1) |
| Smoothing | `script.js` `frame()` | The *value* is eased, never the scroll itself, so native scroll, keyboard, and touch stay intact |
| CSS variable contract | `--p`, `--e` on `.hero__stage` | JS supplies numbers; CSS decides how the title scales, the media window opens, and metadata fades |
| Kinetic type | `splitLine()` + wave loop | Lines split into masked words and chars; each char gets a phase-shifted weight, lift, and rotation |
| Intro | `.js .char` keyframes | Chars rise out of masks; masks release after (`.intro-done`) so scroll motion is not clipped |
| Title legibility | `mix-blend-mode: difference` | White title inverts against paper and dark media alike |
| Reveals | `IntersectionObserver` | No scroll listeners; staggered by sibling index |
| Cursor | `.cursor` + `data-cursor` | Lerped follower; `link` and `view` states; fine pointers only |
| Reduced motion | CSS + JS branches | Static composition, simple fades, no scrubbing, instant cursor |

## Adapting it (in order)

1. **Tokens first.** Edit `:root` in `styles.css`: `--ink`, `--paper`, `--accent`, fonts, scale. Everything inherits.
2. **Replace the concept.** Rewrite the copy and swap the `.hero__orb` and `.hero__grid` for your media: a video loop (`<video muted loop playsinline poster>`), an image with a duotone treatment, or a WebGL canvas. Keep saturated colors out of anything the title crosses (see the comment on `.hero__orb`).
3. **Tune the choreography.** In `render()` change the wave: `p * 1.7` (speed), `i / n * 0.7` (stagger spread), weight range `800 - 560 * ...`, lift `-7vh`. In CSS adjust `.hero__title` scale/translate and `.hero__media` clip insets.
4. **Change the scene length.** `.hero { height: 300vh }` sets how long the hero lasts: more height means slower scrubbing.
5. **Add pages and sections** with the same tokens; reuse `data-reveal` for entrances and `data-cursor` for cursor states.
6. **Graduate the engine when needed.** For many pinned scenes, horizontal scroll, or timelines, swap the loop for GSAP + ScrollTrigger + Lenis (snippets in `references/motion-patterns.md`). Keep the same CSS variable contract.
7. **Make it a project.** Move to Vite or Next.js (see `references/tech-stack.md`), add `package.json` scripts, self-host and subset fonts, and optimize images.

## Before you ship

- Run `references/qa-checklist.md`.
- Verify contrast at the worst frame of the hero, since blend modes depend on what sits underneath.
- Test with `prefers-reduced-motion: reduce` (DevTools > Rendering) and keyboard only.
- Replace the sample copy and email; it is placeholder content for the template.
