/* ==========================================================================
   North Field starter — hero scroll scene, kinetic type, custom cursor, reveals.
   Dependency-free on purpose: you can read the whole mechanism in one file.
   When you outgrow it, swap the loop for GSAP + ScrollTrigger + Lenis (see
   references/motion-patterns.md); the CSS variable contract stays identical.
   ========================================================================== */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");

  /* ------------------------------------------------------------------
     1. Kinetic type: split each line into words (masks) and characters.
        Accessibility: the line keeps its text in aria-label, spans are aria-hidden,
        so screen readers read the phrase once, naturally.
     ------------------------------------------------------------------ */
  function splitLine(el, startIndex) {
    const text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    el.textContent = "";
    let i = startIndex;
    text.split(/(\s+)/).forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) { el.appendChild(document.createTextNode(" ")); return; }
      const word = document.createElement("span");
      word.className = "word";
      word.setAttribute("aria-hidden", "true");
      [...part].forEach(ch => {
        const c = document.createElement("span");
        c.className = "char";
        c.style.setProperty("--i", i++); // drives the intro stagger in CSS
        c.textContent = ch;
        word.appendChild(c);
      });
      el.appendChild(word);
    });
    return i;
  }

  const hero = $(".hero");
  let idx = 0;
  $$("[data-split]").forEach(line => { idx = splitLine(line, idx); });
  const chars = $$(".hero__title .char");

  // Release the word masks after the intro finishes (CSS: .intro-done .word { overflow: visible }).
  const lastChar = chars[chars.length - 1];
  const releaseMasks = () => hero.classList.add("intro-done");
  if (lastChar && !reduceMotion.matches) lastChar.addEventListener("animationend", releaseMasks, { once: true });
  else releaseMasks();

  /* ------------------------------------------------------------------
     2. Hero scroll scene.
        - Native scroll is never hijacked. We read progress, then smooth the
          *value* (not the scroll), which keeps wheel/keyboard/touch intact.
        - Output is a handful of CSS variables; CSS decides how they look.
     ------------------------------------------------------------------ */
  const stage = $(".hero__stage");
  let target = 0;   // raw progress from scroll position
  let current = 0;  // smoothed progress used for rendering
  let heroTop = 0, heroSpan = 1;
  let ticking = false;

  function measure() {
    // Cache geometry; recompute only on resize/load so scroll handlers stay cheap.
    const rect = hero.getBoundingClientRect();
    heroTop = rect.top + scrollY;
    heroSpan = Math.max(1, hero.offsetHeight - innerHeight);
    readScroll();
  }

  function readScroll() {
    target = clamp((scrollY - heroTop) / heroSpan);
    if (!ticking && !reduceMotion.matches) { ticking = true; requestAnimationFrame(frame); }
  }

  function render(p) {
    // Global scene variables consumed by CSS (title scale/translate, media clip, orb scale, meta fade).
    const e = easeInOut(clamp((p - 0.05) / 0.8));
    stage.style.setProperty("--p", p.toFixed(4));
    stage.style.setProperty("--e", e.toFixed(4));

    // Per-character wave: letters thin out and hop in sequence as you scroll.
    // Each char has its own local progress offset by its index, creating a travelling wave.
    const n = chars.length;
    for (let i = 0; i < n; i++) {
      const local = clamp(p * 1.7 - (i / n) * 0.7);
      const wave = Math.sin(local * Math.PI);                 // 0 to 1 to 0
      const weight = Math.round(800 - 560 * easeOut(local));  // heavy to light
      const c = chars[i];
      c.style.fontWeight = weight;
      c.style.translate = `0 ${(-7 * wave).toFixed(2)}vh`;
      c.style.rotate = `${(wave * (i % 2 ? 4 : -4)).toFixed(2)}deg`;
    }
  }

  function frame() {
    // Critically damped-ish follow: smooth but never laggy. Stops when settled to save battery.
    current += (target - current) * 0.1;
    if (Math.abs(target - current) < 0.0005) current = target;
    render(current);
    if (current !== target) requestAnimationFrame(frame); else ticking = false;
  }

  function staticHero() {
    // Reduced motion: present the finished composition, no scrubbing.
    stage.style.setProperty("--p", "0");
    stage.style.setProperty("--e", "0.6");
    chars.forEach(c => { c.style.fontWeight = 700; c.style.translate = ""; c.style.rotate = ""; });
  }

  addEventListener("scroll", readScroll, { passive: true });
  addEventListener("resize", measure, { passive: true });
  addEventListener("load", measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure); // fonts change title size
  reduceMotion.addEventListener("change", () => { reduceMotion.matches ? staticHero() : measure(); });

  if (reduceMotion.matches) staticHero(); else { measure(); render(0); }

  /* ------------------------------------------------------------------
     3. Scroll reveals via IntersectionObserver (cheap, no scroll listeners).
     ------------------------------------------------------------------ */
  const revealEls = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const siblings = $$("[data-reveal]", entry.target.parentElement);
        const delay = Math.max(0, siblings.indexOf(entry.target)) * 80; // stagger within the same parent
        entry.target.style.transitionDelay = `${Math.min(delay, 400)}ms`;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.05 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("is-in"));
  }

  /* ------------------------------------------------------------------
     4. Custom cursor (fine pointers only). Decorative; the native cursor stays
        for touch, keyboard users, and any device without hover.
     ------------------------------------------------------------------ */
  const cursor = $(".cursor");
  if (cursor && finePointer.matches) {
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, running = false;
    const follow = reduceMotion.matches ? 1 : 0.2; // instant when motion is reduced

    const loop = () => {
      cx += (mx - cx) * follow;
      cy += (my - cy) * follow;
      cursor.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
      if (Math.abs(mx - cx) > 0.1 || Math.abs(my - cy) > 0.1) requestAnimationFrame(loop); else running = false;
    };

    addEventListener("pointermove", e => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX; my = e.clientY;
      cursor.classList.add("is-on");
      if (!running) { running = true; requestAnimationFrame(loop); }
    }, { passive: true });
    document.addEventListener("pointerleave", () => cursor.classList.remove("is-on"));

    // State changes: any element with data-cursor="link|view" morphs the cursor.
    $$("[data-cursor]").forEach(el => {
      el.addEventListener("pointerenter", () => { cursor.dataset.state = el.dataset.cursor; });
      el.addEventListener("pointerleave", () => { cursor.dataset.state = ""; });
    });
  }

  /* ------------------------------------------------------------------
     5. Magnetic element: gently pulled toward the pointer, springs back on leave.
     ------------------------------------------------------------------ */
  if (finePointer.matches && !reduceMotion.matches) {
    $$(".magnetic").forEach(el => {
      el.style.transition = "transform .6s cubic-bezier(.16,1,.3,1)";
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.3;
        el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }
})();
