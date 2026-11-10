# QA Checklist (Pre-Submission)

Work through every section. A site is "ready" only when all boxes are checked or consciously waived with a reason.

## Contents
1. Concept and content
2. Visual design
3. Motion and interaction
4. Usability and navigation
5. Responsive
6. Cross-browser and devices
7. Performance
8. Accessibility
9. SEO, sharing, and meta
10. Technical hygiene
11. Launch and submission

## 1. Concept and content
- [ ] The big idea can be stated in one sentence and is visible in the first screen
- [ ] No lorem ipsum, placeholder images, "TODO", or dummy links anywhere
- [ ] Copy is specific, proofread, consistent in voice; microcopy (buttons, errors, 404, empty states) written
- [ ] Case studies/sections have real outcomes, credits, and media
- [ ] All media licensed (fonts, images, video, music, 3D models); credits page or footer present

## 2. Visual design
- [ ] Typography consistent with the system; no orphans/widows in headlines; `text-wrap` applied
- [ ] Spacing follows tokens; alignment checked against grid at multiple widths
- [ ] Palette used consistently; accent used sparingly
- [ ] Images share a consistent treatment; no stretched, pixelated, or mis-cropped assets
- [ ] Inner pages receive the same craft as the home page
- [ ] Footer, forms, and utility pages (404, legal) are designed, not default

## 3. Motion and interaction
- [ ] Motion has purpose; every animation can be justified by the concept
- [ ] Consistent easing/duration tokens throughout
- [ ] Load sequence under 2s and non-blocking; skippable on return visits
- [ ] Scroll feels natural (wheel, trackpad, touch, keyboard, Page Up/Down, Space, Home/End)
- [ ] Anchor links, back/forward buttons, and refresh restore correct state and scroll position
- [ ] Hover, focus, active, and disabled states exist for every interactive element
- [ ] Animations can be interrupted (fast scroll, quick nav) without broken states
- [ ] No animation replays unexpectedly or jumps on resize
- [ ] Custom cursor hidden on touch; native cursor intact in inputs and over text where needed

## 4. Usability and navigation
- [ ] Visitor always knows where they are and how to go back/home
- [ ] Primary CTA is obvious; contact path takes under 10 seconds to find
- [ ] Menu opens/closes by click, keyboard, and `Esc`; focus managed
- [ ] Forms validate clearly, show success/error states, and work without JS where feasible
- [ ] External links are labeled; new-tab links have `rel="noopener"`
- [ ] 404 and error states guide users back

## 5. Responsive (test at 320, 375, 414, 768, 1024, 1280, 1440, 1920, 2560)
- [ ] No horizontal scrollbar, clipped text, or overlapping elements at any width
- [ ] Mobile layouts are designed (not scaled-down desktop); touch targets 44px+
- [ ] Orientation changes work; dynamic viewport units (`dvh`, `svh`) handle mobile browser bars
- [ ] Horizontal scroll/pinned sections have mobile fallbacks
- [ ] Large-screen max-widths or fluid scaling prevent awkward stretching
- [ ] Text readable at 200% zoom

## 6. Cross-browser and devices
- [ ] Chrome, Safari (macOS and iOS), Firefox, Edge latest two versions
- [ ] Safari-specific checks: `100vh`, backdrop-filter, `clip-path` animation, video autoplay (`muted playsinline`), WebGL context loss, scroll bounce
- [ ] Low-power mode and battery saver on iOS/Android (video autoplay, high-refresh behavior)
- [ ] At least one mid-range Android and one older iPhone tested physically
- [ ] 60Hz and 120Hz displays: animation timing is frame-rate independent
- [ ] Fallbacks for unsupported features (`@supports`, feature detection)

## 7. Performance
- [ ] Lighthouse mobile >= 90 performance; LCP < 2s, INP < 200ms, CLS < 0.05
- [ ] Throttled run (4x CPU, Slow 4G) acceptable
- [ ] Hero asset preloaded; below-fold media lazy; fonts preloaded and subset
- [ ] JS budget respected; 3D/WebGL chunk deferred; bundle analyzed for duplicates
- [ ] Scroll profile in DevTools: no long tasks during scroll, steady 60fps
- [ ] WebGL: DPR capped, pauses off-screen/hidden tab, resources disposed, no memory growth after 5 minutes
- [ ] Caching headers and compression (Brotli) verified

## 8. Accessibility
- [ ] `prefers-reduced-motion` tested; content fully available without motion
- [ ] Keyboard-only walkthrough of every page and interaction; focus always visible; no traps
- [ ] Screen reader pass (VoiceOver or NVDA) on home and one inner page
- [ ] Contrast checks pass (including text over images/video)
- [ ] Alt text, labels, landmarks, heading order verified; axe reports zero critical/serious issues
- [ ] Zoom (200%) and text-spacing tested; no `user-scalable=no`
- [ ] No autoplay audio; any sound has a visible, keyboard-accessible control, default off

## 9. SEO, sharing, and meta
- [ ] Unique `title` and `meta description` per page; canonical URLs
- [ ] OG and Twitter images (1200x630) designed and verified
- [ ] Favicon set (SVG + PNG + Apple touch icon), `theme-color`, web manifest
- [ ] `robots.txt`, sitemap, structured data (Organization/Person/CreativeWork)
- [ ] Real HTML text for headings and body content (not canvas-only)
- [ ] Analytics privacy-compliant; cookie notice minimal, non-blocking, not covering the hero

## 10. Technical hygiene
- [ ] No console errors/warnings; no 404s in network tab
- [ ] `npm run build` succeeds clean; lint and type checks pass
- [ ] Environment variables and secrets not exposed
- [ ] Source maps appropriate for production; no debug UI (GUI panels, stats, helpers) left on
- [ ] Dependencies pinned; licenses reviewed
- [ ] Error boundaries and fallbacks for failed asset/WebGL loads
- [ ] HTTPS, security headers (CSP, `X-Content-Type-Options`, `Referrer-Policy`)

## 11. Launch and submission
- [ ] Production URL stable; no staging banners or password walls
- [ ] Final full-site walkthrough on desktop and phone, from a cold cache
- [ ] Submission text drafted: concept, process, technologies, credits, notable interactions
- [ ] Screenshots/video of key moments prepared in case of load issues
- [ ] Monitoring in place (uptime, Web Vitals RUM, error tracking)
- [ ] Team credited correctly; social posts prepared
