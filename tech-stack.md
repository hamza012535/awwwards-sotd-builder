# Tech Stack

## Contents
1. Decision guide
2. Core libraries
3. When to use 3D/WebGL
4. Performance tradeoffs
5. Recommended project setups
6. Hosting and delivery

## 1. Decision guide

| Goal | Recommended stack | Why |
|---|---|---|
| Max control, scroll-driven storytelling | Vite or Astro + vanilla JS + GSAP + Lenis | Smallest bundle, no framework overhead, easiest to hit 60fps |
| Multi-page site with CMS and transitions | Next.js (App Router) + GSAP + Lenis + Framer Motion | Routing, image optimization, SEO, React ecosystem |
| Heavy interactivity, shared-element transitions | Next.js + Framer Motion (`motion`) | Layout animations and `AnimatePresence` |
| 3D hero or full 3D experience | Next.js or Vite + React Three Fiber + drei | Declarative Three.js, React state integration |
| Shader-only effects on images/text | Vanilla Three.js or OGL + custom GLSL | Lighter than full R3F (OGL is ~29kb) |
| Static portfolio, fastest ship | Astro + GSAP | Zero JS by default, islands for motion |
| Prototype in an hour | Single `index.html` + CDN GSAP/Lenis | See `examples/starter-template` |

Pick the lightest stack that supports the concept. A framework is a cost; justify it.

## 2. Core libraries

**Animation**
- **GSAP + ScrollTrigger** (free, including all plugins since 2025; verify license terms for your use): the industry standard. Timelines, scrub, pinning, SplitText, Flip, MorphSVG, CustomEase.
- **Motion (Framer Motion)**: React-native layout animation, gestures, `useScroll`, shared layout transitions.
- **Lenis**: lightweight smooth scrolling that preserves native behavior. Pair with GSAP's ticker.
- **Locomotive Scroll v5**: Lenis-based with data-attribute API.
- **Barba.js / Swup**: page transitions for multi-page non-React sites. **View Transitions API** for native alternative.
- **Splitting / GSAP SplitText**: text splitting for kinetic type.

**3D / WebGL**
- **Three.js**: the baseline. **React Three Fiber (R3F)** + **@react-three/drei** (helpers) + **@react-three/postprocessing**.
- **OGL**: minimal WebGL library for shader planes and particles.
- **Theatre.js**: timeline-driven 3D choreography.
- **Spline**: fast visual 3D authoring with embeds; heavier runtime, less control. Good for prototypes, risky for performance scores.
- **GLSL / glslify / lygia**: shader utilities (noise, SDF, color).

**Styling**
- **Tailwind CSS** for speed and token consistency; extend theme with your tokens, avoid default look.
- **Custom CSS (with variables, `@layer`, container queries)** when typographic precision matters.
- **CSS Modules / vanilla-extract** for component scoping without runtime cost.

**Content and data**
- Sanity, Contentful, Storyblok, Payload, or MDX for content. Keep editorial content out of animation code.

**Assets**
- **Fonts:** Fontsource or self-hosted WOFF2, subsetted (`glyphhanger`, `pyftsubset`).
- **Images:** `sharp`, Next/Image, Astro Image, Squoosh; AVIF/WebP with `srcset`.
- **Video:** H.264 MP4 + WebM/AV1, 2-6s loops, under 2-3MB, `poster` frames, muted/`playsinline`.
- **3D models:** glTF/GLB with Draco or Meshopt compression, KTX2 textures (`gltf-transform`, `gltfjsx`).

## 3. When to use 3D/WebGL

**Use it when:**
- The concept *is* spatial, material, or product-centered (a bottle, a car, a landscape, a data universe).
- A single shader effect creates the signature moment (liquid distortion on image hover, displacement transitions, particle morphs).
- You can afford the performance budget and have art assets/skills to execute at quality.

**Avoid it when:**
- It exists only to look impressive; a clean typographic site with great motion often outscores a mediocre 3D scene.
- The audience is on low-end devices or the content must load instantly.
- You cannot provide a graceful fallback (static image or CSS version) for no-WebGL, low-power, and reduced-motion users.

**Rules for WebGL:**
- One canvas, fixed behind content (`position: fixed; inset: 0; pointer-events: none`) or scoped to a section.
- Cap pixel ratio: `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))` (1.5 on mobile).
- Render on demand when nothing animates (`frameloop="demand"` in R3F); pause when off-screen or tab hidden.
- Keep draw calls low (instancing), textures small and compressed, avoid real-time shadows and heavy postprocessing on mobile.
- Dispose geometries, materials, textures on unmount.
- Detect capability (`WebGL2`, `navigator.hardwareConcurrency`, `deviceMemory`) and downgrade quality tiers.
- Load WebGL code with dynamic import after first paint.

## 4. Performance tradeoffs (approximate gzipped sizes)

| Library | Size | Note |
|---|---|---|
| GSAP core | ~27kb | + ScrollTrigger ~12kb |
| Lenis | ~4kb | Negligible |
| Motion (Framer) | ~18-35kb | Use `LazyMotion` + `domAnimation` to trim |
| Three.js | ~150-170kb (tree-shaken less) | Import only what you use |
| R3F + drei | +40-100kb | drei is large; import named helpers |
| OGL | ~29kb | Best for simple shaders |
| Spline runtime | 500kb+ | Heavy |

Budget JS: **under ~170kb gzipped for initial route** on non-3D sites; defer 3D chunks. Code-split by route, `dynamic()` import heavy modules, preload critical fonts, and measure with Lighthouse, WebPageTest, and real-device tests.

## 5. Recommended project setups

**Vanilla showpiece (Vite)**
```bash
npm create vite@latest site -- --template vanilla
cd site && npm i gsap lenis
```
```json
{
  "name": "site", "private": true, "type": "module",
  "scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview" },
  "dependencies": { "gsap": "^3.12.5", "lenis": "^1.1.0" },
  "devDependencies": { "vite": "^5.4.0" }
}
```

**Next.js immersive**
```bash
npx create-next-app@latest site --ts --app --tailwind --eslint
cd site && npm i gsap @gsap/react lenis motion
# 3D (optional): npm i three @react-three/fiber @react-three/drei && npm i -D @types/three
```
Patterns: wrap Lenis in a client `SmoothScroll` provider; use `useGSAP()` from `@gsap/react` for cleanup-safe animations; mark WebGL components `dynamic(() => import(...), { ssr: false })`.

**Astro editorial**
```bash
npm create astro@latest site && cd site && npm i gsap lenis
```
Ship motion as small client scripts per page; keep everything else static HTML.

## 6. Hosting and delivery

- Vercel, Netlify, or Cloudflare Pages with edge CDN, HTTP/2+, Brotli.
- Long-cache hashed assets (`immutable`), short-cache HTML; preconnect to font/image CDNs.
- Provide `robots.txt`, sitemap, OG/Twitter images, `manifest`, and structured data.
- Use real-device testing (an iPhone and a mid-range Android) before launch.
