# Amended Master Plan (Phases 1-5)

> Approved by the user with amendments on 2026-09-24.
> All copy must come from i18n message files (en.json + ar.json), never hardcoded.
> All factual claims must trace to docs/facts.md.
> WebGLRenderer + GLSL only (no WebGPU/TSL for now).
> CSS logical properties everywhere (margin-inline, padding-inline, inset-inline, text-align: start).

---

## Phase 1 — Foundation

**Goal:** Scrollable page with shared canvas, design tokens, fonts, tier HUD, FPS overlay, and live deployment.

**Files to create:**
- `app/composables/useSharedCanvas.ts` — ONE WebGLRenderer for the whole site. Default DPR clamp to 1.5 (allow 2.0 only when `useDeviceCapability` reports high-tier GPU). ResizeObserver. FPS monitor. **Adaptive quality:** if FPS drops below 50fps for >1s, auto-disable bloom pass and halve particle simulation step frequency. Dev-only stats overlay (FPS, draw calls, triangles, GPU tier). **Scene lifecycle:** sections register/unregister objects; ScrollTrigger `onEnter`/`onLeave` hooks lazily allocate textures/geometry and `.dispose()` GPU resources when a section is 2+ viewports away.
- `app/composables/useTier.ts` — Maps clamped scroll progress [0,1] → V8 tier (Ignition 0-0.25, Sparkplug 0.25-0.55, Maglev 0.55-0.85, TurboFan 0.85-1.0). Sets CSS custom properties on `<html>`: `--tier` (name string), `--tier-progress` (0-1 within current tier), `--tier-index` (0-3).
- `app/i18n/en.json` — All English copy.
- `app/i18n/ar.json` — All Arabic copy (at least hero, about, footer sections).
- `docs/facts.md` — Already created. Single source of truth.

**Files to modify:**
- `nuxt.config.ts` — Remove `@tresjs/nuxt`. Configure i18n to use message files. Keep google-fonts, tailwindcss, vite-plugin-glsl.
- `package.json` — Remove `@tresjs/nuxt`, `@nuxt/devtools-kit`. Add `@google/model-viewer` or similar if needed (unlikely). Verify GSAP SplitText is available from the public `gsap` package.
- `app/app.vue` — Mount shared canvas container (fixed, z-0, pointer-events-none). Skip link. `<html>` class for reduced-motion. All meta from i18n. CSS variables for fonts (--font-display using Instrument Serif, swappable).
- `app/pages/index.vue` — Scaffold sections in order. Wire to shared canvas. Delete all fabricated project data.
- `app/composables/useScroll.ts` — Clamp `scrollProgress` to `Math.max(0, Math.min(1, p))`.
- `app/components/ui/ScrollProgress.vue` — Use clamped progress. Tier name from `useTier`. Wire CSS custom properties so tier visually changes the page.
- `app/assets/css/main.css` — Design tokens as CSS custom properties. Font declarations (Instrument Serif via @font-face or Google Fonts). CSS logical properties baseline. `prefers-reduced-motion` media query baseline.
- `tailwind.config.ts` — Add font-display family. Verify logical property support.

**Files to delete:**
- `app/composables/useThree.ts` — Replaced by useSharedCanvas.
- `app/composables/useAudio.ts` — Deferred.
- `app/composables/useHaptic.ts` — Deferred.
- `app/components/ui/SoundToggle.vue` — Deferred.
- `app/components/projects/ProjectCard.vue` — SaaS card pattern, deleted entirely.
- `app/components/projects/SaafShowcase.vue` — Fake dashboard, deleted entirely.
- `app/components/projects/HazeClueViz.vue` — 2D canvas, rewritten as ProjectHazeClue.
- `app/components/projects/AtharGraph.vue` — 2D canvas, rewritten as ProjectAthar.
- `README.md` — Auto-generated, rewrite.
- `public/favicon.ico` — Replace with SVG.

**Deploy:** Set up Cloudflare Pages or Vercel connected to the repo. Site live at ameeen.me (or a preview URL) by end of Phase 1.

**Deliverables:**
- Empty page scrolls smoothly with Lenis
- Tier HUD updates correctly 0-100%, shows Ignition/Sparkplug/Maglev/TurboFan
- Shared canvas renders (even if just a black rect) without errors
- Dev FPS overlay visible in dev mode
- All copy from i18n, zero hardcoded strings
- Deploy URL accessible
- `nuxi typecheck` and `nuxi build` pass with 0 errors

---

## Phase 2a — Loader + Hero + Particles

**Goal:** The first impression. Loader preloads assets and dissolves into particles. Hero shows name as DOM text with GPGPU particles behind it.

**Files to create/rewrite:**
- `app/components/TheLoader.vue` — A **non-blocking overlay** (not a gate). The hero `<h1>` renders immediately underneath via SSR — the loader overlays it with a monospace code stream (V8 compilation phases) while 3D assets load async in the background. Fades away once the shared canvas is initialized (or after 3s max, whichever is sooner). LCP is the hero text, not the loader — target LCP < 1.0s. Copy from i18n.
- `app/components/TheHero.vue` — `<h1>` with SplitText char-by-char spring reveal. **SSR-rendered** so the text is in the initial HTML payload. Behind: shared canvas showing 50-100k GPGPU particles (code glyphs). Cursor repulsion on desktop. Gyroscope on mobile. Copy from i18n. Location: Mansoura, Egypt (from facts.md). Font loaded with `font-display: swap`.
- `app/composables/useGPGPU.ts` — Full FBO ping-pong implementation. Data texture init with positions/velocities. Simulation material with cursor repulsion uniform.
- `app/shaders/particles.vert` — Staggered morph with turbulence (already partially done). Add uTier uniform.
- `app/shaders/particles.frag` — Tier-based coloring. Soft circular particles. Distance-based alpha.
- New: `app/shaders/simulation.frag` — GPGPU simulation: position update, velocity damping, cursor repulsion force.

**Mobile:** 20k particles max. No post-processing. Test at 390px width.

**Deliverables:**
- Loader plays, dissolves, hero appears
- 50-100k particles on desktop, 20k on mobile
- Cursor repulsion works
- SplitText animation on hero name
- 60fps desktop, 50-60fps mobile (Pixel 6a target)
- LCP < 2.5s (hero text is real DOM)

---

## Phase 2b — Morph

**Goal:** Pinned section where particles morph into a 3D object driven by scroll.

**Files to create/rewrite:**
- `app/components/TheMorph.vue` — Pinned via ScrollTrigger scrub. One `uProgress` uniform from scroll. Particles → wireframe → glass/chrome solid. Slow camera orbit via GSAP. Bloom + film grain post-processing.
- Extend `particles.vert` — Morph stages based on uProgress.
- New: `app/shaders/glass.frag` — Glass/chrome material with rim light and orange accent reflection.
- New: `app/shaders/postprocess/grain.frag` — Film grain overlay.
- New: `app/shaders/postprocess/bloom.frag` — Selective bloom for accent glow.

**Mobile:** Fewer morph stages, no post-processing, still beautiful.

**Deliverables:**
- Scroll drives morph smoothly
- Visual stages are distinct: particles → wireframe → solid
- Camera orbits on scroll
- Bloom + grain on desktop
- 60fps desktop, 50fps+ mobile

---

## Phase 3 — Projects

**Goal:** Each project is a full-viewport pinned scene, not a card.

**Files to create:**
- `app/components/projects/ProjectSaaf.vue` — Full-viewport pinned. Real blurred UI screenshots that assemble on scroll. Count-up animation of TRUE numbers only (840+ views, 1,180+ components, 33 stores). Copy from i18n, facts from facts.md.
- `app/components/projects/ProjectHazeClue.vue` — Full-viewport pinned. 3D EEG waveform lines in shared canvas. Cursor speed = chaos, still cursor = calm state.
- `app/components/projects/ProjectSaser.vue` — Full-viewport pinned. Working in-page terminal. Commands: help, whoami, status, about, sa5er fix, cd projects/*, deopt, clear. Sarcastic Egyptian Arabic responses. **Focus isolation:** "Click to interact" overlay → on click, pauses Lenis scroll, captures keyboard/wheel events inside terminal. ESC or "Release scroll" button resumes Lenis. Persistent skip button always visible.
- `app/components/projects/ProjectAthar.vue` — Full-viewport pinned. Force-directed constellation graph in shared canvas. Real node labels (lessons, resolutions, MCP concepts — generic, not fake counts).
- `app/shaders/transition.frag` — Project-to-project transition: ripple distortion + RGB split driven by uTransition uniform.

**Each project scene has:** Huge index number (01-04), project title, one unique interaction, minimal description. Copy from i18n.

**Deliverables:**
- 4 full-viewport project scenes, each pinned
- Transitions between them via WebGL distortion
- Sa5er terminal is interactive and functional
- All numbers trace to facts.md
- No fabricated metrics anywhere

---

## Phase 4 — About + i18n Toggle + Deopt + Cursor + Footer

**Files to create/rewrite:**
- `app/components/TheAbout.vue` — SVG path timeline that draws on scroll. Real career data from facts.md: neop (12/2025+), Azzrk (10-12/2025), ITI (07-08/2025), CIS Team & CAT Reloaded, Mansoura University. Skills from CV only.
- `app/components/ui/LangToggle.vue` — AR/EN toggle. GSAP Flip for layout mirror. `<html dir>` switches. Matched Arabic typeface (IBM Plex Arabic or Noto Kufi Arabic). Particle drift direction reverses. **Teardown lifecycle:** pause Lenis → disable all ScrollTrigger instances → execute GSAP Flip → let CSS logical properties settle → reset Lenis scroll position → `ScrollTrigger.refresh()` → resume Lenis.
- `app/components/ui/CustomCursor.vue` — Context-aware: default dot+ring, text mode, project "View" label, interactive magnetic snap. No cursor on touch devices (`navigator.maxTouchPoints > 0`).
- `app/components/TheDeopt.vue` — Keep current implementation. Verify: logo click 3x, Ctrl+Shift+D, or typing "deopt" in Sa5er terminal triggers it. Subtle glitch, page falls to Ignition style for 2s, recovers. No harsh flashing.
- `app/components/TheFooter.vue` — Real data from facts.md: Mansoura Egypt, ameeenmv@gmail.com, Africa/Cairo timezone, real social links. Giant email with magnetic hover. DOM only, zero 3D.
- `app/components/ui/MagneticButton.vue` — Refine existing. Stronger magnetic effect.

**Deliverables:**
- AR/EN toggle works with full layout mirror
- About shows real career timeline
- Cursor is context-aware, disabled on mobile
- Deopt easter egg works via all 3 triggers
- Footer has correct data
- All copy from i18n files

---

## Phase 5 — Performance, Accessibility, Polish

**Goal:** Ship-ready for Awwwards submission.

**Tasks:**
- Lighthouse mobile perf ≥ 90, accessibility = 100
- LCP < 2.5s, CLS < 0.1, INP < 200ms
- `prefers-reduced-motion`: no particles, CSS fades only, static layout
- Skip link, aria labels on all canvases, keyboard nav, focus rings
- Color contrast AA+ (off-white #f0ece2 on #0a0a0a = ~16:1)
- No console errors
- ~60fps on mid-range phone (Pixel 6a / Galaxy A53)
- OG image (custom social card)
- Meta tags (title, description, og:*, twitter:*)
- `<link rel="canonical">`, sitemap.xml, robots.txt
- Repo-wide grep for leftover placeholder/fake content (Riyadh, "Software Architect", lorem, TODO placeholders in rendered output)
- Final `nuxi build` + bundle size report

**Deliverables:**
- All Lighthouse scores met
- All CWV green
- OG image renders correctly on Twitter/LinkedIn/Slack preview
- `grep -ri "riyadh\|lorem\|architect\|TODO" --include="*.vue" --include="*.ts" --include="*.json"` returns only docs/facts.md TODOs
- Ready for CSSDA / Awwwards submission

---

## Response to review

### Round 1 — Reviewer: agy (Gemini 3.8 Flash High)
**Verdict:** CHANGES_REQUESTED (5 issues: 1 blocker, 2 major, 2 minor)

| # | Severity | Issue | Disposition | Reason |
|---|----------|-------|-------------|--------|
| 1 | Blocker | 3s loader blocks LCP → fails CWV | **ACCEPT** | Correct. Loader becomes non-blocking overlay. Hero `<h1>` SSR-renders immediately. LCP target < 1.0s. |
| 2 | Major | RTL toggle breaks pinned ScrollTrigger | **ACCEPT** | Valid. Added explicit teardown lifecycle: pause Lenis → disable ScrollTriggers → Flip → refresh → resume. |
| 3 | Major | Terminal in pinned section causes scroll/focus conflict | **ACCEPT** | Valid UX risk. Added "Click to interact / ESC to release" focus isolation pattern. |
| 4 | Minor | Fill-rate bottleneck at high DPR + post-processing | **ACCEPT** | Default DPR now 1.5 (2.0 only for high-tier GPU). Auto-degrade below 50fps. |
| 5 | Minor | Concurrent scene VRAM pressure | **ACCEPT** | Added viewport-based asset lifecycle: lazy allocate/dispose via ScrollTrigger onEnter/onLeave. |

All 5 issues accepted. Plan updated. Resubmitting for Round 2.
