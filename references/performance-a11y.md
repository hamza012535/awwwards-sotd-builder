# Performance and Accessibility

## Contents
1. Performance budgets
2. Core Web Vitals playbook
3. Assets
4. JavaScript and animation performance
5. WebGL performance
6. Accessibility requirements
7. Accessible motion
8. Accessible patterns (menus, carousels, custom cursor)
9. Verification tools

## 1. Performance budgets

| Metric | Target | Hard limit |
|---|---|---|
| LCP | < 2.0s (4G, mid-range mobile) | 2.5s |
| INP | < 150ms | 200ms |
| CLS | < 0.02 | 0.1 |
| TBT (lab) | < 150ms | 300ms |
| Initial JS (gzip, non-3D) | < 170kb | 250kb |
| Initial CSS (gzip) | < 30kb | 60kb |
| Initial page weight (excl. lazy media) | < 1.5MB | 2.5MB |
| Hero image/poster | < 200kb (AVIF/WebP) | 350kb |
| Video loops | < 2.5MB each, lazy | 5MB |
| Fonts | <= 3 files, < 100kb total WOFF2 | 150kb |
| 3D initial chunk | < 1MB incl. models, lazy | 2.5MB |
| Frame rate | 60fps scroll on mid devices | never drop below 45 |
| Lighthouse Performance | 90+ (mobile) | 80 |

Treat budgets as release gates. Measure on throttled CPU (4x) and Slow 4G.

## 2. Core Web Vitals playbook

**LCP:** preload the hero image/font (`<link rel="preload" as="image" fetchpriority="high">`), avoid lazy-loading the LCP element, inline critical CSS, serve through CDN, avoid blocking JS before first paint, do not hide the LCP element behind a preloader animation that delays paint.
**INP:** keep handlers short, yield with `requestIdleCallback`/`scheduler.yield`, avoid synchronous layout reads in event handlers, debounce resize, use passive listeners (`{ passive: true }`).
**CLS:** reserve space with `aspect-ratio` or width/height on every image/video/embed; fonts with `size-adjust` fallbacks; animate with transforms only; do not inject content above existing content.

## 3. Assets

- **Images:** AVIF with WebP/JPEG fallback; `srcset` and `sizes`; max display width x 2 for DPR; `loading="lazy"` and `decoding="async"` below the fold; blur-up/LQIP or dominant-color placeholders.
- **Video:** `muted loop playsinline` with `preload="metadata"`, poster image, `IntersectionObserver` to play/pause, no autoplay audio; provide WebM and MP4; strip audio track.
- **Fonts:** subset to used glyphs/ranges, WOFF2 only, `rel="preload"` for the 1-2 critical files with `crossorigin`, `font-display: swap` (or `optional` for non-critical), variable fonts to cut file count.
- **SVG:** optimize with SVGO; inline small icons; avoid huge filters (blur, turbulence on large areas) on scroll.
- **3rd party:** defer analytics; no heavy chat widgets or tag managers on the showpiece.

## 4. JavaScript and animation performance

- Animate `transform`, `opacity` (and sparingly `clip-path`, `filter`). Avoid animating layout properties.
- One `requestAnimationFrame` loop (GSAP ticker) drives everything; do not create competing loops.
- `will-change: transform` only on elements actively animating; remove after.
- Avoid reading layout (`getBoundingClientRect`, `offsetHeight`) inside animation frames; cache measurements and recompute on resize (`ResizeObserver`, ScrollTrigger `invalidateOnRefresh`).
- Use `IntersectionObserver` to start/stop off-screen animations and videos.
- `content-visibility: auto` with `contain-intrinsic-size` for long below-fold sections.
- Code-split by route and by feature; `import()` WebGL and heavy plugins after first paint.
- Tree-shake: import named exports; avoid whole-library imports.
- Avoid large blurs/box-shadows/backdrop-filter on big, moving areas.
- Use `ScrollTrigger.batch` and `once: true` when reveals need not reverse.
- Clean up on unmount: kill ScrollTriggers/timelines (`gsap.context().revert()` / `useGSAP`).

## 5. WebGL performance

- Cap DPR (2 desktop, 1.5 mobile); lower resolution under load (adaptive DPR, e.g. drei `PerformanceMonitor`).
- `frameloop="demand"` or pause rendering off-screen; stop on `visibilitychange` hidden.
- Instance repeated meshes; merge geometries; limit lights; bake lighting; avoid real-time shadows on mobile.
- Compress textures (KTX2/Basis) and geometry (Draco/Meshopt); power-of-two where needed; mipmaps on.
- Keep shaders cheap: avoid loops with high iteration counts, minimize texture lookups, use `mediump` where possible.
- Dispose of resources; avoid creating objects in the render loop.
- Provide a quality tier fallback and a static fallback for no-WebGL.

## 6. Accessibility requirements (target WCAG 2.2 AA)

**Structure:** one `h1`; logical heading order; landmarks (`header`, `nav`, `main`, `footer`); skip link as first focusable element; meaningful `lang`; descriptive `title` per page/route.
**Contrast:** text 4.5:1 (3:1 for 24px+ or 19px bold+); UI components and focus indicators 3:1; check text over images/video with a scrim or text shadow and test the worst frame.
**Keyboard:** everything operable with keyboard; logical tab order; visible `:focus-visible` style (2px+ outline with offset, not removed); no keyboard traps; `Esc` closes overlays; focus returns to trigger.
**Names and roles:** native elements first (`button`, `a`, `input`); labels for form fields; `aria-label` for icon-only controls; `aria-current="page"` for current nav item; `aria-expanded`/`aria-controls` for toggles; avoid redundant ARIA.
**Media:** alt text meaningful (empty `alt=""` for decorative); captions/transcripts for meaningful video; no autoplay audio; pause control for moving content longer than 5s.
**Targets:** 24x24 CSS px minimum (aim for 44px) for touch.
**Text:** supports 200% zoom and text-spacing overrides without loss; no text baked into images; do not disable pinch zoom (`user-scalable=no` is forbidden).
**Forms:** visible labels, error messages linked via `aria-describedby`, not color-only errors, autocomplete attributes.
**Split text:** when splitting into spans, set `aria-label` on the parent and `aria-hidden="true"` on spans so screen readers read the phrase once.

## 7. Accessible motion

- Respect `prefers-reduced-motion: reduce`: remove parallax, scrubbing, large translations, cursor effects, marquees, autoplaying video loops; keep simple fades (<300ms) so changes remain perceivable.
- No flashing more than 3 times per second.
- Smooth scroll must not break native scroll, keyboard scrolling, find-in-page, or anchor jumps; disable it under reduced motion.
- Do not make essential content only available via animation or hover; ensure content exists in the DOM at load.
- Offer a visible toggle for motion/sound if the experience is intense.
- Provide a skip-intro/skip-preloader option for long intros.

```js
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
reduce.addEventListener("change", () => location.reload()); // simple, reliable teardown
```

## 8. Accessible patterns

**Full-screen menu:** button with `aria-expanded` and `aria-controls`; when open, set `inert` on the rest of the page (or trap focus), lock scroll (`lenis.stop()`), close on `Esc`, return focus to the button.
**Carousels/horizontal scroll:** items reachable by keyboard; focus scrolls item into view; provide previous/next buttons; vertical fallback on mobile; do not auto-advance without pause.
**Custom cursor:** purely decorative, `pointer-events: none`, `aria-hidden`; never the only hover affordance; disabled on coarse pointers.
**Page transitions (SPA):** update `document.title`, move focus to `h1` or `main` (`tabindex="-1"`), announce route change via a polite live region.
**Canvas/WebGL:** `role="img"` with `aria-label` if meaningful, otherwise `aria-hidden="true"`; all information also available as DOM text.

## 9. Verification tools

- Lighthouse (mobile + desktop), PageSpeed Insights, WebPageTest (Moto G class device).
- Chrome DevTools: Performance panel (CPU 4x), Rendering panel (paint flashing, FPS meter, emulate reduced motion), Coverage.
- axe DevTools / `@axe-core/cli`, WAVE, Accessibility Insights.
- Keyboard-only pass; VoiceOver (macOS/iOS) and NVDA quick pass.
- `web-vitals` library for field data; Real-user monitoring after launch.
- Bundle analysis: `vite-bundle-visualizer`, `@next/bundle-analyzer`.
