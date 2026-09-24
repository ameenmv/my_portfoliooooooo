# Phase 1 Plan: ameeen.me (Cloning guillaumezhu.com Architecture)

> **Reference site:** https://guillaumezhu.com/
> **Stack:** Nuxt 4 (bun), Vanilla CSS (no Tailwind), GSAP + ScrollTrigger + SplitText, Three.js (WebGLRenderer), Lenis, i18n (EN + AR)
> **Content source:** docs/facts.md (no fabricated data)

---

## Architecture Overview

guillaumezhu.com is a **Vite MPA** (vanilla JS). We're building the same structure as a **Nuxt 4 app** with:
- SSR for SEO/LCP
- `app/pages/` for routing (home, contact, playground, project pages)
- Composables instead of vanilla JS modules
- CSS Modules or scoped CSS instead of BEM global CSS
- `@nuxtjs/i18n` with `data-i18n` equivalent via `$t()` / `useI18n()`

---

## Site Map (mirrors guillaumezhu.com exactly)

```
/                     → Home (hero, manifesto, trajectory, toolkit, projects, next/footer)
/projects/saaf/       → SAAF case study
/projects/haze-clue/  → Haze Clue case study
/projects/sa5er/      → Sa5er CLI case study
/projects/athar/      → Athar case study
/projects/nabeeh/     → Nabeeh case study
/contact/             → Contact page (3D canvas + heading + availability)
/playground/          → Playground (3D media sphere)
```

---

## Phase 1 Deliverables (Foundation)

### 1.1 Project Setup
- [x] Delete old scaffold
- [ ] Init Nuxt 4 with bun (minimal template)
- [ ] Install dependencies:
  ```
  bun add gsap lenis three @nuxtjs/i18n vite-plugin-glsl
  ```
- [ ] Configure `nuxt.config.ts`:
  - SSR enabled
  - `@nuxtjs/i18n` with EN + AR locales
  - `vite-plugin-glsl` for GLSL imports
  - Disable Tailwind (pure CSS)
  - CSS logical properties everywhere
- [ ] Create `.gitignore`, `tsconfig.json`
- [ ] Init git repo

### 1.2 Fonts
guillaumezhu.com uses:
- **CabinetGrotesk** (Variable, 100-900) — display headings
- **Satoshi** (Variable, 300-900) — body text, nav

Both are free from [Fontshare](https://www.fontshare.com/). Self-host via `@font-face` in `assets/css/fonts.css`.

Map for Ameen's site:
| Guillaume | Ameen | Why |
|-----------|-------|-----|
| CabinetGrotesk | CabinetGrotesk | Same font — it's perfect for this style |
| Satoshi | Satoshi | Same font — clean modern body |

### 1.3 Color System
Exact colors from guillaumezhu.com CSS:
```css
:root {
  --color-cream: #f5e7df;
  --color-dark: #1f1d1d;
  --border-radius-block: 40px;
  --border-radius-card: 15px;
  --padding-min: 1rem;
  --letter-spacing-display: -0.025em;
}
```
Accent colors (from SVG gradient):
- Gold: `#f6c177`
- Purple: `#9b7cff`
- Orange: `#ff6b4a`

### 1.4 Global CSS Reset & Base Styles
Port the following from guillaumezhu.com's CSS:
- Font declarations (`@font-face`)
- Typography scale (`.text-manifesto`, `.text-title`, `.text-project`, `.text-body`, `.text-button`, `.text-nav`)
- `body` defaults, `::selection`, smooth scrolling
- `.visually-hidden` utility
- CSS logical properties for RTL support (`margin-inline`, `padding-inline`, etc.)

### 1.5 Layout Components
- `components/SiteHeader.vue` — fixed header with:
  - Logo (SVG mask, `clamp(36px, 4vw, 48px)`)
  - Nav pill capsule (`backdrop-filter: blur(20px)`, `color-mix()` borders)
  - Links: Projects, Playground, Contact
  - EN/AR language switch
  - Interface color switching (cream/dark based on section)
- `components/ScrollIndicator.vue` — 6 vertical bars (left side):
  - Active = 48px, neighbor = 28px, inactive = 12px
  - Progress fill via CSS custom property
  - Hidden on mobile (<600px)
- `components/PageTransition.vue` — cross-page transition:
  - Curved div (`140vw × 120vh`, rounded left edge)
  - Cream or dark variant
  - `sessionStorage` coordination

### 1.6 Shared WebGL Canvas
- `composables/useSharedCanvas.ts` — single `<canvas>` element
- `composables/useDeviceCapability.ts` — GPU tier detection
- `composables/useReducedMotion.ts` — `prefers-reduced-motion` support
- WebGLRenderer with:
  - DPR default 1.5 (2.0 for high-tier GPU)
  - Auto-degrade if FPS < 50 for >1s
  - Lifecycle: allocate on enter, dispose on leave

### 1.7 Lenis + GSAP ScrollTrigger Sync
- `composables/useScroll.ts`:
  - Lenis instance with `lerp: 0.1, duration: 1.2`
  - GSAP ticker sync (`gsap.ticker.add(...)`)
  - `ScrollTrigger.scrollerProxy()` if needed
  - Scroll progress clamped 0-1
  - Scroll locking for loader (`lenis.stop()` / `lenis.start()`)

### 1.8 i18n Setup
- `i18n/locales/en.json` — all English strings
- `i18n/locales/ar.json` — all Arabic strings
- Configure RTL via `<html dir="rtl" lang="ar">`
- CSS logical properties everywhere:
  ```css
  /* ✅ Do this */
  padding-inline: 2rem;
  margin-inline-start: 1rem;
  text-align: start;
  inset-inline-start: 0;

  /* ❌ Not this */
  padding-left: 2rem;
  margin-left: 1rem;
  text-align: left;
  left: 0;
  ```

### 1.9 FPS/GPU Stats Overlay (dev only)
- Shows: FPS, GPU tier, DPR, draw calls
- Only visible in dev mode
- Uses `requestAnimationFrame` for accurate measurement

### 1.10 Deploy
- Cloudflare Pages or Vercel
- Connected to git repo
- Preview deploys on push

---

## Home Page Sections (Phase 2+)

These will be built in subsequent phases but the structure is defined here:

### Section 1: Loader (first visit only)
- Full-screen `<canvas>` with 3D "AM" monogram assembling
- `sessionStorage.homeLoaderShown` prevents repeat
- Cream background, fades once ready
- Scroll locked during loader

### Section 2: Hero
- Full viewport Three.js canvas with 3D scene
- `h1` is `visually-hidden` (for SEO): "Ameen Mohamed — Front-End Engineer"
- Name + role overlaid at bottom-right
- `clip-path: inset(var(--hero-frame-inset) round 18px)` inner frame

### Section 3: Manifesto
- Single massive horizontal-scrolling sentence
- EN: "I build systems that move, scale, and feel alive."
- AR: "بابني أنظمة بتتحرك، بتكبر، وبتحسّك إنها حقيقية."
- Each letter individually animated
- Cream bg, dark text, overlaps hero above

### Section 4: Trajectory — "My Journey"
- Dark bg, cream text
- Title at 12vw centered
- Pinned sentence sequence (1100vh):
  1. "First" / "الأول"
  2. "computer science." / "علوم الحاسب."
  3. "Then" / "بعدها"
  4. "front-end development." / "تطوير الواجهات."
  5. "Today" / "النهارده"
  6. "I ship" / "بأشحن"
  7. "real products." / "منتجات حقيقية."
- Background visuals: split left/right panels with images
- Canvas for additional effects

### Section 5: Toolkit
- Rotating card wheel (600vh pin)
- Two decks with flip transition:
  - **Frontend:** Vue.js, Nuxt.js, TypeScript, Pinia, GSAP, Three.js, Tailwind CSS, Shopify→flip
  - **Backend:** Node.js, NestJS, MongoDB, Socket.IO, RESTful APIs, Laravel, SQLite, Git
- SVG card illustrations for each tool
- Subtitle animates between deck names

### Section 6: Projects
- Cream bg, dark text
- Container scales up from dark section (360vh pin)
- Project names as large italic links:
  - SAAF
  - Haze Clue
  - Sa5er CLI
  - Athar
  - Nabeeh
- Font: Satoshi Variable Italic, `clamp(50px, 7vw, 88px)`
- Letter-image reveals on hover
- Each links to `/projects/[slug]/` with page transition

### Section 7: Next / Footer
- "What's next?" title (500vh pin)
- SVG text on wavy path with gradient
- Footer reveals via `clip-path: circle()`
- Background image, 18px inset, rounded corners
- Content: "Open for collaboration", links, location

---

## Project Pages (Phase 3+)

Each project page follows guillaumezhu.com's pattern:
- Horizontal scroll track (`project-scroll__track`)
- Pinned panels:
  1. **Intro** — Project title + 2 videos/images
  2. **Context** — Categories, description, links
  3. **Visuals** — Gallery panels (fullscreen images/videos)
  4. **Ellipse** — Feature image in ellipse mask
  5. **Footer** — "Other projects" navigation

---

## Contact Page (Phase 3+)

- 3D canvas background
- Heading: "Let's build / something worth / shipping" (3 lines)
- Availability: "Open for opportunities · Mansoura, Egypt"
- Services: creative development, real-time systems, front-end craft
- Email link: ameeenmv@gmail.com

---

## Playground Page (Phase 4+)

- 3D media sphere with draggable/keyboard navigation
- Cards with:
  - Video demos of shader studies
  - YouTube thumbnails
  - Code experiment screenshots
- Caption updates from centered card data attributes

---

## Content Mapping (guillaumezhu → ameeen)

| Guillaume | Ameen |
|-----------|-------|
| Front Creative Developer & Art Director | Front-End Engineer · Vue.js & Nuxt.js |
| Paris, France | Mansoura, Egypt |
| EN / FR | EN / ع |
| "I create experiences at the intersection of design and code" | "I build systems that move, scale, and feel alive" |
| Journey: Art direction → Front-end → Both | Journey: Computer Science → Front-end → Shipping real products |
| Toolkit Front: JS, Three.js, GLSL, GSAP, Vue, React, Webflow, Shopify | Toolkit Front: Vue.js, Nuxt.js, TypeScript, Pinia, GSAP, Three.js, Tailwind, Shopify→ |
| Toolkit Art: Figma, PS, AI, ID, AE, CapCut, LR | Toolkit Back: Node.js, NestJS, MongoDB, Socket.IO, REST, Laravel, SQLite, Git |
| Projects: Ghibli, Mirage, Pulse, Ornate, Maë | Projects: SAAF, Haze Clue, Sa5er, Athar, Nabeeh |
| "Open to joining a creative team · Apprenticeship · October 2026" | "Open for collaboration · Mansoura, Egypt" |
| contact@guillaumezhu.com | ameeenmv@gmail.com |
| LinkedIn, GitHub, Email | LinkedIn, GitHub, YouTube, npm, Email |

---

## Phase 1 Acceptance Criteria

- [ ] `bun run dev` starts without errors
- [ ] `bun run build` succeeds with 0 type errors
- [ ] SiteHeader renders with logo, nav pill, language switch
- [ ] ScrollIndicator renders (hidden on mobile)
- [ ] CabinetGrotesk + Satoshi fonts load correctly
- [ ] Color system works (cream/dark switching)
- [ ] Lenis smooth scroll working
- [ ] GSAP ScrollTrigger registered and functional
- [ ] i18n EN/AR toggle switches all text + HTML dir
- [ ] CSS logical properties used everywhere (0 `left`/`right` for layout)
- [ ] FPS overlay visible in dev mode
- [ ] Deploy accessible on real device
- [ ] Home page has placeholder sections for all 7 sections
- [ ] Facts.md preserved as single source of truth
