# Motion Patterns

## Contents
1. Principles
2. Easing curves
3. Smooth scroll (Lenis + GSAP)
4. Scroll-triggered reveals
5. Pinning and scrubbed sequences
6. Horizontal scroll
7. Kinetic type
8. Page transitions
9. Custom cursor
10. Magnetic buttons and hover
11. Preloader
12. Framer Motion recipes
13. Pure CSS recipes
14. Reduced motion

## 1. Principles
- **Purpose:** motion explains hierarchy, state, or story. Remove anything decorative that doesn't serve the concept.
- **Choreography:** stagger related elements (40-90ms), lead with the most important.
- **Weight:** large elements move slower (0.9-1.4s), small elements faster (0.2-0.5s).
- **Asymmetry:** ease out on enter (decelerate), ease in on exit (accelerate); exits shorter than entrances.
- **Performance:** animate `transform`, `opacity`, `clip-path`, `filter` sparingly; avoid `top/left/width/height`. Use `will-change` only during animation.
- **Interruptibility:** animations should be reversible and killable when the user scrolls or navigates.

## 2. Easing curves

| Name | Cubic-bezier | Use |
|---|---|---|
| expo out | `0.16, 1, 0.3, 1` | Reveals, hero entrances (signature "luxury" feel) |
| quint out | `0.22, 1, 0.36, 1` | General enter, hover |
| quart in-out | `0.76, 0, 0.24, 1` | Page transitions, wipes |
| circ in-out | `0.85, 0, 0.15, 1` | Dramatic masks |
| back out (light) | `0.34, 1.56, 0.64, 1` | Playful pops (use sparingly) |

GSAP names: `expo.out`, `power4.out`, `power4.inOut`, `circ.inOut`. Custom: `CustomEase.create("silk", "0.16,1,0.3,1")`.

Timing: micro-interactions 150-300ms; reveals 600-1000ms; page transitions 700-1200ms; never longer than 1.4s for anything blocking.

## 3. Smooth scroll (Lenis + GSAP)

```js
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
let lenis;
if (!reduce) {
  lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);               // keep ScrollTrigger in sync
  gsap.ticker.add(t => lenis.raf(t * 1000));              // drive Lenis from GSAP's ticker
  gsap.ticker.lagSmoothing(0);
}
```
Keep native scroll semantics: do not hijack keyboard, touch, or anchor behavior. Use `lenis.scrollTo("#id", { offset: -80 })` for anchors, and `lenis.stop()/start()` when opening modals.

## 4. Scroll-triggered reveals

**Masked line reveal (the classic)**
```html
<h2 class="split"><span class="line"><span class="line__inner">Making things</span></span></h2>
```
```css
.line { display: block; overflow: hidden; }
.line__inner { display: block; } /* start state is set by GSAP (fromTo) so no-JS users still see the text */
```
```js
gsap.utils.toArray(".split").forEach(el => {
  gsap.fromTo(el.querySelectorAll(".line__inner"), { yPercent: 110 }, {
    yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.08,
    scrollTrigger: { trigger: el, start: "top 85%", once: true }
  });
});
```

**Image clip reveal**
```js
gsap.fromTo(img, { clipPath: "inset(100% 0 0 0)", scale: 1.25 },
  { clipPath: "inset(0% 0 0 0)", scale: 1, duration: 1.4, ease: "expo.out",
    scrollTrigger: { trigger: img, start: "top 80%" } });
```

**Batch reveals (performant for many items)**
```js
ScrollTrigger.batch(".card", {
  start: "top 88%",
  onEnter: els => gsap.fromTo(els, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: "power4.out", stagger: .08 }),
});
```

**Parallax**
```js
gsap.utils.toArray("[data-speed]").forEach(el => {
  gsap.to(el, { yPercent: () => -100 * parseFloat(el.dataset.speed), ease: "none",
    scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
});
```

## 5. Pinning and scrubbed sequences

```js
const tl = gsap.timeline({
  scrollTrigger: { trigger: ".hero", start: "top top", end: "+=150%", scrub: 0.6, pin: true, anticipatePin: 1 }
});
tl.to(".hero__title", { scale: 0.4, yPercent: -30, ease: "none" }, 0)
  .to(".hero__media", { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, 0)
  .to(".hero__meta", { opacity: 0, ease: "none" }, 0);
```
Tips: use `scrub: 0.5-1` for smoothing; `pinSpacing: true`; avoid pinning more than 2-3 sections; refresh with `ScrollTrigger.refresh()` after fonts/images load.

## 6. Horizontal scroll

```js
const track = document.querySelector(".h-track");
gsap.to(track, {
  x: () => -(track.scrollWidth - innerWidth),
  ease: "none",
  scrollTrigger: { trigger: ".h-wrap", start: "top top", end: () => "+=" + (track.scrollWidth - innerWidth),
                   scrub: true, pin: true, invalidateOnRefresh: true }
});
```
Always provide a mobile fallback (vertical stack or native `overflow-x: auto` with `scroll-snap`), and ensure keyboard access to items.

## 7. Kinetic type

**Per-character split (no paid plugin)**
```js
function splitChars(el) {
  const text = el.textContent; el.setAttribute("aria-label", text); el.textContent = "";
  return [...text].map(ch => {
    const s = document.createElement("span");
    s.className = "char"; s.setAttribute("aria-hidden", "true");
    s.textContent = ch === " " ? "\u00A0" : ch; el.appendChild(s); return s;
  });
}
```
**Scroll-driven weight/width (variable font)**
```js
gsap.to(".display", { fontVariationSettings: "'wght' 900, 'wdth' 125", ease: "none",
  scrollTrigger: { trigger: ".display", start: "top 80%", end: "top 20%", scrub: true } });
```
**Velocity skew**
```js
let proxy = { skew: 0 }, setSkew = gsap.quickSetter(".skewme", "skewY", "deg"), clamp = gsap.utils.clamp(-8, 8);
ScrollTrigger.create({ onUpdate: self => {
  const s = clamp(self.getVelocity() / -400);
  if (Math.abs(s) > Math.abs(proxy.skew)) { proxy.skew = s; gsap.to(proxy, { skew: 0, duration: .8, ease: "power3", overwrite: true, onUpdate: () => setSkew(proxy.skew) }); }
}});
```
**Marquee (CSS)**
```css
.marquee { overflow: hidden; display: flex; }
.marquee__inner { display: flex; flex: none; gap: 3rem; animation: marquee 30s linear infinite; }
@keyframes marquee { to { transform: translateX(-50%); } } /* duplicate content inside for seamless loop */
@media (prefers-reduced-motion: reduce) { .marquee__inner { animation: none; } }
```

## 8. Page transitions

**View Transitions API (multi-page, progressive enhancement)**
```css
@view-transition { navigation: auto; }
::view-transition-old(root) { animation: .5s var(--ease-in-out-quart) both fade-out; }
::view-transition-new(root) { animation: .7s var(--ease-out-expo) both slide-up; }
@keyframes fade-out { to { opacity: 0; } }
@keyframes slide-up { from { clip-path: inset(100% 0 0 0); } to { clip-path: inset(0); } }
```
**SPA (JS) curtain wipe with GSAP**
```js
async function leave() {
  return gsap.timeline().set(".curtain", { yPercent: 100 })
    .to(".curtain", { yPercent: 0, duration: .7, ease: "power4.inOut" }).then();
}
async function enter() {
  return gsap.timeline().to(".curtain", { yPercent: -100, duration: .8, ease: "power4.inOut" })
    .from(".page h1 .line__inner", { yPercent: 110, stagger: .08, duration: 1, ease: "expo.out" }, "-=.35").then();
}
```
Next.js: use a transition wrapper with `AnimatePresence` (Framer Motion) and a frozen router context for exit animations, or View Transitions where supported. Always ensure focus is moved to the new page's `h1`/`main` and the document title updates.

## 9. Custom cursor

```js
const cursor = document.querySelector(".cursor");
if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const x = gsap.quickTo(cursor, "x", { duration: .35, ease: "power3" });
  const y = gsap.quickTo(cursor, "y", { duration: .35, ease: "power3" });
  addEventListener("pointermove", e => { x(e.clientX); y(e.clientY); });
  document.querySelectorAll("[data-cursor]").forEach(el => {
    el.addEventListener("pointerenter", () => { cursor.dataset.state = el.dataset.cursor; });
    el.addEventListener("pointerleave", () => { cursor.dataset.state = ""; });
  });
}
```
```css
.cursor { position: fixed; top: 0; left: 0; width: 14px; height: 14px; margin: -7px 0 0 -7px; border-radius: 50%;
  background: #fff; mix-blend-mode: difference; pointer-events: none; z-index: 9999;
  transition: width .3s var(--ease-out-expo), height .3s var(--ease-out-expo), margin .3s var(--ease-out-expo); }
.cursor[data-state="view"] { width: 90px; height: 90px; margin: -45px 0 0 -45px; }
@media (hover: none), (pointer: coarse) { .cursor { display: none; } }
```
Rules: keep the native cursor available over text inputs; never hide it without a replacement; hide on touch.

## 10. Magnetic buttons and hover

```js
document.querySelectorAll(".magnetic").forEach(el => {
  const xTo = gsap.quickTo(el, "x", { duration: .5, ease: "elastic.out(1,.6)" });
  const yTo = gsap.quickTo(el, "y", { duration: .5, ease: "elastic.out(1,.6)" });
  el.addEventListener("pointermove", e => {
    const r = el.getBoundingClientRect();
    xTo((e.clientX - (r.left + r.width / 2)) * .3); yTo((e.clientY - (r.top + r.height / 2)) * .3);
  });
  el.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
});
```
**Text roll hover (CSS)**
```css
.roll { display: inline-block; overflow: hidden; height: 1.2em; line-height: 1.2; }
.roll span { display: block; transition: transform .5s var(--ease-out-expo); }
.roll:hover span, .roll:focus-visible span { transform: translateY(-100%); } /* duplicate label in a second block span */
```

## 11. Preloader

Short (<2s), purposeful, skippable on repeat visits (`sessionStorage`). Reveal the hero as part of the loader's exit so the load feels like the first scene, not a gate.
```js
const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
tl.to(".loader__count", { textContent: 100, snap: { textContent: 1 }, duration: 1.2, ease: "power2.inOut" })
  .to(".loader", { yPercent: -100, duration: .9, ease: "power4.inOut" })
  .from(".hero .line__inner", { yPercent: 110, stagger: .08, duration: 1.1 }, "-=.4");
```
Never block content on assets that are not critical; load WebGL in the background.

## 12. Framer Motion recipes (`motion/react`)

```jsx
import { motion, useScroll, useTransform, useSpring } from "motion/react";

const ease = [0.16, 1, 0.3, 1];

export const Reveal = ({ children, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10% 0px" }} transition={{ duration: .9, ease, delay }}>
    {children}
  </motion.div>
);

export function ScrollHero() {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]), { stiffness: 120, damping: 24 });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  return <section ref={ref}><motion.h1 style={{ y, scale }}>Title</motion.h1></section>;
}

// Shared element transitions: give both elements the same layoutId
// <motion.img layoutId={`work-${id}`} />
```
Use `MotionConfig reducedMotion="user"` at the root to respect the OS setting automatically.

## 13. Pure CSS recipes

**Scroll-driven animations (progressive enhancement)**
```css
@supports (animation-timeline: view()) {
  .reveal { animation: rise linear both; animation-timeline: view(); animation-range: entry 0% cover 35%; }
  @keyframes rise { from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: none; } }
}
```
**Scroll progress bar**
```css
.progress { position: fixed; inset: 0 0 auto 0; height: 3px; background: var(--accent); transform-origin: 0 50%;
  animation: grow linear both; animation-timeline: scroll(root); }
@keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
```
**Underline draw**
```css
a.u { background: linear-gradient(currentColor 0 0) 0 100% / 0 1px no-repeat; transition: background-size .5s var(--ease-out-expo); }
a.u:hover, a.u:focus-visible { background-size: 100% 1px; }
```

## 14. Reduced motion

Replace, don't just remove. Keep state changes legible with fades.
```js
const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: no-preference)", () => { /* full choreography */ });
mm.add("(prefers-reduced-motion: reduce)", () => {
  gsap.set(".line__inner, .reveal", { clearProps: "all" }); // show content immediately
  gsap.utils.toArray(".reveal").forEach(el => gsap.from(el, { opacity: 0, duration: .3, scrollTrigger: el }));
});
```
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
```
Also provide a visible pause control for any looping or autoplaying motion longer than 5s.
