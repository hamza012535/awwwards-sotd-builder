---
name: awwwards-sotd-builder
description: Design and build award-caliber websites aiming for Awwwards Site of the Day (SOTD). Use whenever the user mentions Awwwards, SOTD, Site of the Day, "award-winning website", "make it stunning", "world-class website", high-end agency or studio sites, portfolio sites that need to wow, immersive web experiences, WebGL or 3D sites, scroll-driven storytelling, kinetic typography, GSAP, Lenis, Framer Motion, or Three.js showpieces. Also use when the user asks to elevate a generic or template-looking site into something bold, editorial, and memorable, even if they never say "Awwwards".
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Awwwards SOTD Builder

Build sites that score on all four Awwwards criteria: **Design, Usability, Creativity, Content**. Winners combine a distinctive art direction, fluid motion, flawless performance, and a clear reason to exist. Taste and restraint beat effects; every effect must serve the concept.

## When this skill applies

Activate for any request to build or upgrade a visually ambitious site: agency, studio, portfolio, product launch, campaign, editorial, culture, or experimental. If the user only wants a standard marketing page, say so and offer to dial the ambition up or down.

## Reference map (read on demand, not all at once)

| Need | Read |
|---|---|
| Type, color, layout, hierarchy | `references/design-principles.md` |
| Easing, scroll, transitions, cursors, code | `references/motion-patterns.md` |
| Choosing libraries, 3D tradeoffs | `references/tech-stack.md` |
| How jurors score; SOTD vs Honorable Mention | `references/awwwards-criteria.md` |
| Techniques seen in winners | `references/inspiration-patterns.md` |
| Budgets, a11y rules | `references/performance-a11y.md` |
| Final verification | `references/qa-checklist.md` |
| Runnable starter | `examples/starter-template/` and `examples/README.md` |

## Output behavior (non-negotiable)

1. **Ask first.** Before concepts or code, ask the clarifying questions below (skip any already answered).
2. **Concepts before code.** Always propose 2-3 distinct creative concepts and wait for a choice (or a clear "you pick").
3. **Iterate visibly.** Build in stages: structure → styling → motion → polish. After each stage, summarize what exists and what is next, so the user can steer.
4. **Comment design decisions** in code (why this easing, why this ratio), not what the code obviously does.
5. **Ship runnable.** Default to a complete project: `package.json`, scripts (`dev`, `build`), README with run steps. No placeholders, no `TODO`s, no lorem ipsum in final output (write real, voiceful copy).
6. **Respect constraints.** Honor the user's stack, hosting, browsers, deadlines, and content limits over your preferences.

### Clarifying questions (ask 4-6, concisely)

- Who is it for, and what should a visitor feel and do within 10 seconds?
- Brand assets: name, logo, colors, fonts, existing tone of voice? Any references they love or hate?
- Content on hand: copy, imagery, video, 3D models, case studies? Who creates missing pieces?
- Stack/hosting constraints, target devices, and performance floor (low-end mobile?).
- Ambition dial: restrained editorial, expressive motion-heavy, or full WebGL immersion?
- Deadline and whether they intend to submit to Awwwards.

## Core workflow

### Step 1 - Brief and art direction
Extract brand, audience, mood, and the single idea the site is *about*. Write a 3-line creative brief (Audience / Feeling / Big idea). Then propose **2-3 concepts**, each with:
- A name and one-sentence thesis
- Visual language (type feel, palette mood, imagery treatment)
- Signature interaction (the one moment people will screenshot)
- Risk and cost (what could go wrong, performance impact)

Make concepts genuinely different (e.g., "Brutalist editorial grid" vs "Dark cinematic WebGL" vs "Playful kinetic type"), not three skins of one idea. Recommend one and say why.

### Step 2 - Design system
Define as CSS custom properties **before** building pages. Read `references/design-principles.md`. Deliver:
- Type: one display face with character plus one workhorse; fluid scale via `clamp()`
- Color: 1 ink, 1 paper, 1 accent minimum; verify contrast
- Spacing scale and a 12-column (or deliberately broken) grid
- Motion tokens: durations, easings, stagger values (see `references/motion-patterns.md`)

### Step 3 - Tech stack selection
Read `references/tech-stack.md`. Default recommendations:
- **Immersive / maximum control:** Next.js (App Router) or Astro + GSAP (ScrollTrigger) + Lenis; add React Three Fiber only when 3D is the concept.
- **Component-heavy React app feel:** Framer Motion (`motion`) for layout and page transitions; GSAP for scroll scenes.
- **Static showpiece / fastest to ship:** Vite + vanilla JS + GSAP + Lenis (see the starter).
- **Styling:** Tailwind for speed and consistency, or hand-rolled CSS with tokens when typography precision matters.
State the choice, the reason, and the cost in bundle size.

### Step 4 - Structure and build
Semantic HTML first (`header`, `main`, `section`, `nav`, `footer`, headings in order). The site must be readable and navigable with CSS and JS disabled. Build components with real focus states and ARIA only where native semantics fall short. Progressive enhancement: motion layers on top of working content, never gate content behind JS.
**Checkpoint:** show the unstyled/structural stage and the content hierarchy.

### Step 5 - Motion and interaction
Layer in order of impact: (1) page load sequence, (2) scroll-linked hero, (3) section reveals, (4) hover/cursor micro-interactions, (5) page transitions, (6) one WebGL or signature moment. Use `references/motion-patterns.md` snippets. Rules:
- One choreographed idea per viewport; motion must clarify hierarchy
- Animate `transform` and `opacity` only; avoid layout-triggering properties
- Every animation has a purpose and a reduced-motion alternative

### Step 6 - Performance pass
Targets: **LCP < 2.0s, INP < 200ms, CLS < 0.05**, 60fps scroll on mid-range mobile. Optimize images (AVIF/WebP, `srcset`), subset and preload fonts, lazy-load below-the-fold media, code-split WebGL, cap DPR at 2, dispose Three.js resources. Details and budgets: `references/performance-a11y.md`.

### Step 7 - Accessibility pass
Honor `prefers-reduced-motion` (swap, don't just disable), full keyboard navigation with visible focus, AA contrast (4.5:1 body, 3:1 large), alt text, labelled controls, no focus traps, no scroll-jacking that breaks native behavior (keep wheel, keyboard, and touch scrolling intact). Details: `references/performance-a11y.md`.

### Step 8 - Polish and QA
Run `references/qa-checklist.md` completely: cross-browser (Chrome, Safari, Firefox, iOS Safari), breakpoints from 320px to 2560px, loading and error states, 404 page, favicon/OG images, micro-interactions on every interactive element, and a final copy edit.

## Anti-patterns (these kill award chances)

- **Template-y layouts:** centered hero + three feature cards + logo row + CTA band
- Stock photography and generic gradients/blobs as the "creative idea"
- Low-contrast gray-on-gray text, tiny body copy, light-weight type on busy imagery
- **Janky scroll:** scroll-jacking that fights the user, heavy main-thread work, un-throttled listeners, layout thrash, scrubbing animations that stutter
- Unoptimized images and video (multi-MB heroes), no font strategy, layout shift on load
- Missing `prefers-reduced-motion` support; animation that cannot be paused or skipped
- Preloaders longer than ~2s with no purpose, or fake loading bars
- Autoplay audio (or sound without a clear opt-in)
- Intrusive cookie banners covering the hero; modals on first paint
- Effects for their own sake: five easings, three cursors, WebGL with nothing to say
- Mystery-meat navigation: users cannot tell where they are or how to leave
- Desktop-only brilliance with a broken or afterthought mobile experience
- Lorem ipsum, placeholder copy, or vague corporate language
- Fonts, images, or code you do not have the license to use

## Quality bar before saying "done"

Ask: Would a juror remember this site tomorrow? Can they name its one big idea? Does it work on a mid-range phone on 4G? Is every pixel and word intentional? If not, iterate.

## Delivering the project

Include: file tree, `package.json` (if a framework), install/run/build commands, a short design-decisions note (type, color, motion tokens, rationale), and a list of known tradeoffs. If the user plans to submit, point them to `references/awwwards-criteria.md` for submission prep.
