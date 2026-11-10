# Design Principles

## Contents
1. Art direction first
2. Typography
3. Color
4. Layout and grid
5. Composition and whitespace
6. Visual hierarchy
7. Imagery and texture
8. Copy and voice
9. Design tokens template

## 1. Art direction first

A winning site has **one big idea** expressed consistently in type, color, motion, imagery, and copy. Define it in a sentence ("A newsroom for the night shift", "Architecture as slow light") and test every decision against it. If a component could appear on any other site, redesign it.

Moves that create distinctiveness:
- **Constraint:** pick a limited palette, two type sizes that contrast violently, one image treatment.
- **Point of view:** a strong opinion (brutalist, tender, clinical, chaotic-but-controlled).
- **Signature moment:** one interaction or layout the site is remembered for.
- **Consistency of rule-breaking:** if you break the grid, break it the same way everywhere.

## 2. Typography

Type is the fastest route to personality. Budget most of your design time here.

**Pairing recipes**
- *Display with character + neutral workhorse:* a distinctive serif/grotesk/mono for headlines, a clean sans for body.
- *One superfamily, extreme weights/widths:* variable fonts allow 100-900 weight and width axes, giving range with a single file.
- *Serif + mono:* editorial warmth plus technical precision.

**Typefaces that read as "current" (verify licensing):** Neue Montreal, PP Neue Machina, PP Editorial New, Söhne, Inter Tight, Instrument Serif, Fraunces, Space Grotesk, Geist, JetBrains Mono, Syne, Familjen Grotesk, Bricolage Grotesque. Free options with strong character: Instrument Serif, Fraunces, Bricolage Grotesque, Syne, Space Grotesk, Geist, JetBrains Mono (Google Fonts / Fontsource).

**Scale (fluid)**
```css
:root {
  --step--1: clamp(0.78rem, 0.74rem + 0.2vw, 0.9rem);
  --step-0:  clamp(1rem, 0.95rem + 0.25vw, 1.15rem);   /* body */
  --step-1:  clamp(1.25rem, 1.1rem + 0.7vw, 1.65rem);
  --step-2:  clamp(1.6rem, 1.3rem + 1.4vw, 2.5rem);
  --step-3:  clamp(2.2rem, 1.6rem + 3vw, 4.5rem);
  --step-4:  clamp(3.2rem, 2rem + 6vw, 9rem);          /* display */
  --step-5:  clamp(4.5rem, 2rem + 12vw, 18rem);        /* hero-scale */
}
```

**Rules of thumb**
- Display: line-height 0.85-1.0, letter-spacing -0.02 to -0.06em. Body: 1.5-1.65, 60-75 characters per line.
- Contrast through scale (ratio of 6:1 or more between display and body), weight, case, and style (italic against roman).
- Use `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs.
- Enable `font-optical-sizing: auto` and `font-variation-settings` for variable fonts.
- Uppercase small labels: 0.7-0.8rem, tracking 0.06-0.12em, mono or grotesk.
- `font-display: swap` plus preloaded subset WOFF2; match fallback metrics with `size-adjust` to prevent CLS.
- Never fake bold/italic; never set long text in display faces.

## 3. Color

**Build the palette**
1. **Ink** (text): rarely pure black; use a tinted near-black (`#0e0e0c`, `#111318`).
2. **Paper** (background): rarely pure white; warm off-white (`#f2efe8`) or deep dark (`#0b0b0c`).
3. **Accent:** one saturated color used sparingly (<10% of surface), e.g. signal orange `#ff4d00`, acid lime `#c8ff00`, ultramarine `#2a2bff`.
4. **Support:** one muted mid-tone for borders and secondary text.

**Strategies:** monochrome plus one accent; duotone imagery; inverted sections (light and dark transitions on scroll); color-blocked sections with full-bleed fields.

**Technical:** define as tokens, build both themes with `color-scheme` and `prefers-color-scheme` where relevant, use `oklch()` for perceptually even ramps, and check contrast (4.5:1 body, 3:1 large text and UI). Avoid default Tailwind-looking blue/indigo gradients and purple-to-pink hero glows.

## 4. Layout and grid

- Start from a **12-column grid** with generous gutters (`clamp(12px, 2vw, 32px)`) and outer margins (`clamp(16px, 4vw, 64px)`).
- **Break the grid deliberately:** offset images, oversized type bleeding off-canvas, asymmetric 7/5 splits, overlapping layers with z-index.
- Use **CSS Grid** for macro layout, **Flexbox** for components, container queries for component-level responsiveness.
- Vary section rhythm: full-bleed, tight text column, wide gallery, split screen. Never repeat the same layout three times in a row.
- Anchor with consistent **edge alignment** (a left margin line, a baseline grid) so chaos still feels designed.

## 5. Composition and whitespace

- Whitespace is a luxury signal. Give hero type room; let one element per viewport dominate.
- Use **scale contrast** (huge vs tiny), **density contrast** (crowded vs empty), and **tonal contrast** (dark vs light).
- Rule of thirds, golden-ish ratios (1 : 1.618), and diagonal reading paths guide the eye.
- Frame content with structure: hairline rules (1px), index numbers (01 / 02), small meta labels, corner marks. These "editorial details" signal craft.
- Avoid centering everything; left-aligned, asymmetric layouts feel more intentional.

## 6. Visual hierarchy

At any scroll position, a visitor should answer within a second: *What is this? Where do I look? What can I do?*
- **Primary:** one dominant element (headline, image, or interaction).
- **Secondary:** supporting copy and navigation, clearly quieter.
- **Tertiary:** metadata and labels.
- Use size, weight, color, position, and motion to rank. If everything is loud, nothing is.
- Calls to action: one primary per view, with an obvious hover/focus state.

## 7. Imagery and texture

- Treat all imagery with one consistent system: grading, crop ratio, grain, duotone, or masked shapes.
- Avoid stock look; use custom photography, illustration, 3D renders, video loops, or typographic imagery.
- **Texture:** SVG noise overlay (opacity 0.04-0.1, `mix-blend-mode`), halftone, paper grain, subtle vignettes add tactility.
- Use `aspect-ratio` to reserve space and prevent layout shift; `object-fit: cover` for crops.
- Image masks via `clip-path` for reveals (`inset()`, `polygon()`).

## 8. Copy and voice

Content is scored. Write like a person with a point of view:
- Specific over generic ("We rebuilt the Lisbon ferry timetable for 40,000 daily riders" vs "We deliver innovative solutions").
- Short headlines, verbs first, one idea each. Microcopy (buttons, 404s, loading) should carry the brand voice.
- Case studies: problem, approach, outcome, with numbers and craft detail.
- Avoid filler: "Welcome to...", "Scroll to explore" (unless styled as part of the concept), "cutting-edge".

## 9. Design tokens template

```css
:root {
  /* Color */
  --ink: #0e0e0c;
  --paper: #f2efe8;
  --accent: #ff4d00;
  --muted: #8a867c;
  --line: color-mix(in oklab, var(--ink) 18%, transparent);

  /* Spacing (4px base, geometric) */
  --s-1: 0.25rem; --s-2: 0.5rem; --s-3: 1rem; --s-4: 1.5rem;
  --s-5: 2.5rem; --s-6: 4rem; --s-7: 7rem; --s-8: 12rem;

  /* Layout */
  --gutter: clamp(12px, 2vw, 32px);
  --margin: clamp(16px, 4vw, 64px);
  --max: 1680px;

  /* Motion */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);
  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
  --dur-fast: 0.25s; --dur-base: 0.6s; --dur-slow: 1.1s; --stagger: 0.06s;
}
```
