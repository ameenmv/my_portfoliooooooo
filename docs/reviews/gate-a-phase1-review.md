# CREATIVE DEVELOPER ARCHITECTURAL REVIEW

**VERDICT: CHANGES_REQUESTED**

The overall ambition to clone Guillaume Zhu’s award-winning architecture for **ameeen.me** is technically sound and visually stellar, especially given your positioning as a **Vue.js / Nuxt.js Front-End Engineer**. However, attempting Phase 1 with the current specifications will lead to immediate layout breakdowns in Arabic (RTL), font dropouts, hydration conflicts in Nuxt 4, and a misrepresentation of key signature interactions from `guillaumezhu.com`.

Below is the structured critique and required adjustments before locking Phase 1.

---

## 1. ISSUES LIST

### [BLOCKER] Arabic Typography & OpenType Cursive Shaping Broken by SplitText
- **Description:** `guillaumezhu.com` relies heavily on splitting text into individual character spans (`.letter` / `.project-letter`) for GSAP staggers and physics. In Arabic script, characters are cursive and contextual (initial, medial, final, isolated forms). When a string is split into individual `<span>` elements or inline-blocks, browser text-shaping engines (HarfBuzz/CoreText) disconnect the glyphs, rendering words as broken, disjointed isolated letters (e.g. `أ م ي ن` instead of `أمين`).
- **Remediation:** In Phase 1 architecture, specify that `SplitText` for Arabic text must strictly use `type: "words, lines"` and **never** `chars` for body and display sentences. For letter-based animations, you must implement an Arabic-safe strategy (e.g. Zero-Width Joiners `&zwj;`, SVG stroke clip-paths, or word-level masking).

### [BLOCKER] Font Character Coverage: Cabinet Grotesk & Satoshi Lack Arabic Glyphs
- **Description:** Neither *Cabinet Grotesk* nor *Satoshi* (distributed by Fontshare/ITF) contains Arabic unicode ranges. Without an explicit Arabic font fallback stack defined in Phase 1, switching to `ar` will cause the browser to fall back to generic system fonts (Arial, Times New Roman, or Tahoma), destroying optical weights, x-heights, line-heights, and the creative aesthetic.
- **Remediation:** Define dedicated Arabic companion font tokens in Phase 1. 
  - **Display companion (for Cabinet Grotesk):** **Alexandria** or **Readex Pro** (geometric, expressive display grotesque).
  - **Body companion (for Satoshi):** **IBM Plex Sans Arabic** or **Alexandria Regular** (clean, contemporary neutral sans).

### [BLOCKER] GSAP SplitText Licensing & CI/CD Pipeline
- **Description:** `SplitText` is a closed-source, paid Club GreenSock plugin. You cannot install it from public npm without a private `.npmrc` authentication token or vendoring the `.tgz` package. If deploying via Bun on platforms like Vercel or Cloudflare Pages, missing token configuration will cause build failures. If you do not hold a Club GreenSock license, distributing it in a public repository violates licensing.
- **Remediation:** Confirm Club GSAP credentials in your CI/CD environment or replace `SplitText` in Phase 1 with an open-source alternative (e.g., custom regex DOM splitting or `split-type` with Nuxt composable wrapping).

### [BLOCKER] Route Lifecycle & GSAP/Lenis Memory Leaks in Nuxt 4
- **Description:** Unlike Guillaume Zhu’s site (which is a static Vite SPA/MPA), Nuxt 4 runs a persistent client-side Vue router. Over 2,000vh of pinned scroll triggers (`1100vh` Trajectory, `600vh` Toolkit, `360vh` Projects) will permanently pollute memory, trigger phantom callbacks, and lock the scrollbar when navigating between `/`, `/projects/[slug]`, `/contact`, and `/playground` if not reverted.
- **Remediation:** Phase 1 foundation must architect a centralized `useScrollAnimation()` composable wrapping all GSAP code inside `gsap.context()`. On route exit (`onUnmounted` or `onBeforeRouteLeave`), all `ScrollTrigger` instances must be killed, `lenis.stop()` invoked, and `ScrollTrigger.refresh()` scheduled on the next tick after the incoming page transitions in.

---

### [MAJOR] Nuxt 4 Hydration Clashing with ScrollTrigger Pin Spacers
- **Description:** GSAP `pin: true` wraps elements inside `.pin-spacer` divs and injects extensive inline styles (`position: fixed`, `top`, `padding-bottom`, `transform`). If Nuxt hydrates after or during animation setup, Vue's virtual DOM reconciliation will throw hydration mismatches or duplicate DOM nodes.
- **Remediation:** Enforce that all GSAP pins, Lenis instances, and Three.js canvases are executed **strictly client-side** inside `onMounted` with `import.meta.client` (or wrapped in `<ClientOnly>`). Pinned containers must be static leaf components without reactive Vue state mutations during scroll.

### [MAJOR] Missing Matter.js 2D Physics in Projects Section Plan
- **Description:** The plan states: *"Projects (italic text list with letter-image reveals 360vh)"*. In reality, Guillaume Zhu's projects list uses **Matter.js 2D rigid-body rope physics**. Each `.project-letter` is an anchored rigid body connected with spring constraints (`stiffness: 0.005, damping: 0.004`), which sway and stretch dynamically according to scroll velocity (`setScrollVelocity()`), complete with an automatic frame-drop fallback (>24ms). Omitting physics strips the portfolio of one of its most recognized creative interactions.
- **Remediation:** Include `matter-js` in the architectural dependencies and account for its lifecycle in Phase 2, or document that Ameen's portfolio is intentionally doing a purely CSS/GSAP kinematic alternative.

### [MAJOR] Missing Dynamic Theme Switching Engine (Cream vs. Dark)
- **Description:** Guillaume Zhu’s architecture is built around an active theme coordinator:
  - Hero (Cream) $\to$ Manifesto (Dark) $\to$ Trajectory (Cream) $\to$ Toolkit (Cream $\to$ Dark flip) $\to$ Projects (Dark) $\to$ Next/Footer (Cream reveal).
  - The background, text, header, and scroll indicator actively interpolate between `#f5e7df` and `#1f1d1d`. In the Toolkit, there is a dedicated WebGL canvas card reveal (`toolkit-card__cream-reveal`) that visually transforms the global page theme.
- **Remediation:** Phase 1 cannot just define two static color variables; it must implement a reactive `data-theme="cream|dark"` system on the root element with GSAP ScrollTrigger callbacks that simultaneously update CSS custom properties, the site header, and the scroll indicator.

### [MAJOR] SVG `<textPath>` & Orb Reveal Incompatible with RTL
- **Description:** In the Next/Footer section, the text follows an explicit SVG path `d="M0.398438 611.016 C175... 6108.4 328.516"` spanning from left ($x=0$) to right ($x=6108$). Guillaume Zhu reveals text letter-by-letter (`slice(0, c)`) while translating the SVG `viewBox` along this coordinate system. In RTL (Arabic), SVG `<textPath>` either renders text reversed, inverted, or starts reading backwards from the wrong anchor.
- **Remediation:** Phase 1 plan must note that the Next section SVG path requires an RTL mirrored path definition and reversed coordinate interpolation in Arabic mode.

---

### [MINOR] Scroll Indicator Needs Skeleton Sections in Phase 1
- **Description:** Phase 1 includes the 6-dot scroll indicator (`#hero`, `#manifesto`, `#parcours`, `#toolkit`, `#projects`, `#contact`), but defers the actual sections to Phase 2. The scroll indicator cannot be properly tested, calibrated, or demonstrated without scroll height.
- **Remediation:** Add temporary placeholder section wrappers to Phase 1 with their intended scroll heights (`100vh`, `400vh`, `1100vh`, `600vh`, `360vh`, etc.) so Lenis, ScrollTrigger, and active/neighbor dot states (`is-active`, `is-neighbor`) are verified in Phase 1.

### [MINOR] GSAP Transforms vs. CSS Logical Properties in RTL
- **Description:** The plan mentions "CSS logical properties", but GSAP transforms operate on physical pixel offsets (`x`, `xPercent`). 
- **Remediation:** Any GSAP horizontal translation (e.g. Manifesto horizontal scroll `x: () => -distance`) must be parameterized with a directional multiplier: `const dir = locale.value === 'ar' ? 1 : -1; x: () => dir * distance`.

---

## 2. MISSING SECTIONS & DETAILS FROM GUILLAUMEZHU.COM

1. **Trajectory WebGL Image Distortion Canvas (`createImageDistortionScene`):**
   - The Trajectory section is not just text sentences over 1100vh. It runs a Three.js shader distortion canvas (`background.webp`) with custom noise uniforms (`uNoiseScale`, `uNoiseStrength`) and sliding left/right visual card masks.
2. **Toolkit Dual-Wheel & 3D Theme-Flip Card:**
   - The Toolkit section has **two separate wheels**: *Creative Front-End* and *Art Direction*.
   - Between them is a 3D flip card (`toolkit-card--flip`) that rotates 180° on the Y-axis and triggers a full-page cream-to-dark canvas reveal.
3. **Matter.js Dynamic Letter Ragdoll in Projects:**
   - Interactive physical springs on each letter reacting to scroll speed and mouse pointer.
4. **Hero Shader Loader Handoff:**
   - The Home Loader does not simply fade out; it drives WebGL uniforms (`uLoadProgress`, `uLogoCutoutProgress`, `uHeroRevealProgress`) that transition directly into the 3D canvas logo distortion.
5. **Kinetic Playground Link Wave:**
   - The "A detour through the Playground ↗" button has an interactive letter-wave spring animation (`.playground-link__letter`) triggered on hover and scroll.
6. **Cursor-Distortion 404 Page & Mentions Légales:**
   - Dedicated 404 page featuring WebGL cursor fluid distortion, plus the legal notice page (`/mentions-legales`).

---

## 3. TECHNICAL CONCERNS: NUXT 4 VS. VANILLA VITE

| Consideration | Guillaume Zhu (Vanilla Vite) | Ameen.me (Nuxt 4) | Architectural Verdict & Fix |
|---|---|---|---|
| **SSR / SSG vs. WebGL** | Clean client-only runtime. No virtual DOM overhead. | SSR will crash on `window`, `document`, and WebGL context imports. | **Fix:** Use Nuxt 4 SSG mode (`nuxt generate` / `ssr: true` with selective client-only rendering) or SPA mode (`ssr: false`). Keep Three.js inside `.client.ts` plugins or `onMounted`. |
| **Branding Alignment** | Vanilla Vite shows raw JavaScript mastery. | Nuxt 4 directly highlights Ameen's expertise as a **Vue/Nuxt Specialist**. | **Great decision for Ameen’s career profile**, provided Nuxt’s framework overhead does not compromise 60fps performance. |
| **Scroll Restoration** | Handled natively in `<head>` before DOM paint via custom script. | Nuxt router tries to manage scroll position, conflicting with Lenis and pinned pins. | **Fix:** Configure `router.options.ts` with `scrollBehaviorType: 'manual'` and replicate Guillaume’s `sessionStorage` scroll intent logic. |
| **Ticker Synchronization** | Direct window RAF loop. | Vue reactive updates can cause micro-stutters if RAF is fragmented. | **Fix:** Bind Lenis directly to GSAP's ticker: <br>`gsap.ticker.add((time) => lenis.raf(time * 1000))` and set `gsap.ticker.lagSmoothing(0)`. |
| **Three.js Asset Pipeline** | Direct Vite raw/GLSL imports (`vite-plugin-glsl`). | Nuxt requires explicit Vite plugin declarations in `nuxt.config.ts`. | **Fix:** Install `vite-plugin-glsl` in `nuxt.config.ts` `vite.plugins`. |

---

## 4. RTL (ARABIC) CONCERNS & SPECIFIC RECOMMENDATIONS

1. **Avoid Splitting Arabic Characters:**
   - For manifesto, trajectory sentences, and titles in Arabic: animate words or lines (`SplitText.create(el, { type: "words, lines" })`).
   - If letter reveals are essential, animate whole words with a clip-path mask (`clip-path: inset(0 100% 0 0)` to `inset(0 0% 0 0)` in RTL).
2. **Horizontal Scrubbing Multipliers:**
   - Manifesto in LTR translates `x: () => -n()` (moves content left as user scrolls down).
   - In RTL, content must move from right to left, meaning the transform translation polarity must invert: `x: () => +n()`.
3. **SVG `<textPath>` in Next/Footer:**
   - In Arabic, text written along a left-to-right bezier renders backwards. You must provide a flipped SVG path (`d` coordinates mirrored across the horizontal center) for Arabic mode.
4. **Header and UI Layout:**
   - Replace any physical CSS properties (`left`, `right`, `margin-left`) with logical properties (`inset-inline-start`, `margin-inline-start`).
   - Flip icon arrows (e.g. playground arrow `↗` vs `↖`).

---

## 5. REVISED PHASE 1 CHECKLIST (RECOMMENDED)

To move forward with approval, adjust Phase 1 to include:
1. **Nuxt 4 Client-Only WebGL & Animation Architecture** (`ssr: false` or strict client-only composables).
2. **Dual-Font System:** Cabinet Grotesk + Satoshi (EN) paired with Alexandria / IBM Plex Sans Arabic (AR).
3. **GSAP + Lenis Master Ticker Sync:** Centralized RAF loop with `lagSmoothing(0)` and `gsap.context()` cleanup.
4. **Reactive Theme Engine (`data-theme="cream|dark"`):** Driving header, scroll indicator, and background color interpolation.
5. **Skeleton Page Layout:** Placeholder sections with exact vh heights so the scroll indicator and Lenis can be verified end-to-end.
6. **Arabic Text-Shaping Guard:** Disallow character-level splitting for Arabic copy across all GSAP helpers.
