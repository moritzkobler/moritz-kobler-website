### 2026-01-24 — Projects: overview/detail UX + Planimo
- Summary:
  - Removed the top hero card on `/projects` and aligned project cards with the About card header layout (logo sizing, spacing, typography).
  - Kept the “Projects” nav item active on project detail pages and added a minimal “Back to Projects” link above the detail hero.
  - Moved the project `type` into a small all-caps meta tag in front of status on the detail hero.
  - Added a second app project “Planimo” in EN/DE.
- Scope: work_plan sections 5/6 (Projects listing + detail)
- Files: site/assets/js/views.js, site/assets/js/app.js, site/assets/css/styles.css, site/data/projects.en.json, site/data/projects.de.json
- Tests: Manual (static server)
- Follow-ups: Replace placeholder support/privacy copy per app when ready.
- Commit: 6c45617

### 2026-01-24 — Projects: screenshots carousel
- Summary:
  - Switched project detail screenshots from a grid to the same carousel/gallery mechanism used on About.
  - Added a max height for screenshots (mobile/desktop) while keeping aspect ratio via `object-fit: contain`.
- Scope: work_plan section 6 (Project detail)
- Files: site/assets/js/views.js, site/assets/css/styles.css
- Tests: Manual (static server)
- Follow-ups: Tune `--shot-max-h` after visual review on real devices.
- Commit: 93391be

### 2026-01-24 — i18n: per-bundle keys + localized projects
- Summary:
  - Removed dotted namespaces from `copy` keys; bundles now use flat keys (file name provides the namespace).
  - Moved Projects content from `projects.json` into `projects.{lang}.json` so project data is translatable.
  - Added a global `site.{lang}.json` bundle for shared UI strings (404 + error fallback) and centralized loading in `i18n.js`.
- Scope: work_plan section 3 (Data & language handling), sections 5/6 (Projects views)
- Files: site/assets/js/i18n.js, site/assets/js/views.js, site/assets/js/app.js, site/data/site.en.json, site/data/site.de.json, site/data/projects.en.json, site/data/projects.de.json
- Tests: N/A (static site)
- Follow-ups: Revisit copy key naming consistency as Projects/Detail pages get implemented.
- Commit: c7e2012

### 2026-01-24 — i18n: centralize UI copy in JSON
- Summary:
  - Added a flat `copy` key/value map to `about.en.json` + `about.de.json` to act as a single translation source for UI strings.
  - Updated renderers (About/Projects/Project detail/Privacy/404) to read labels, headings, and empty-states from `copy`, including `{placeholder}` formatting.
  - Made `renderPrivacy` and `renderNotFound` async so they can load `copy` consistently.
- Scope: work_plan section 3 (Data & language handling), section 4/5 (views)
- Files: site/assets/js/views.js, site/assets/js/app.js, site/data/about.en.json, site/data/about.de.json, docs/work_plan.md
- Tests: N/A (static site)
- Follow-ups: Consider moving the remaining hardcoded error fallback in `app.js` ("Error") into `copy` as well.
- Commit: ab9fc80

### 2026-01-24 — i18n: split projects/privacy copy files
- Summary:
  - Moved `projects.*` UI copy out of `about.{lang}.json` into `projects.{lang}.json`.
  - Moved `privacy.*` UI copy out of `about.{lang}.json` into `privacy.{lang}.json`.
  - Updated renderers to load copy from the dedicated files while keeping 404 copy in `about.{lang}.json`.
- Scope: work_plan section 3 (Data & language handling), section 5 (Projects)
- Files: site/assets/js/views.js, site/data/projects.en.json, site/data/projects.de.json, site/data/privacy.en.json, site/data/privacy.de.json, site/data/about.en.json, site/data/about.de.json
- Tests: N/A (static site)
- Follow-ups: Decide whether 404 + global error UI copy should live in a `site.{lang}.json` in the future.
- Commit: c136e70

### 2026-01-24 — About: intro side panel priorities
- Summary:
  - Replaced the right-side intro panel content with “My Priorities” (bullets) and “About Me” (paragraph) sourced from `about.{lang}.json`.
  - Kept existing panel/heading styling by reusing the current `kv` layout (no CSS changes).
- Scope: work_plan section 4 (About page UX and galleries)
- Files: site/assets/js/views.js, site/data/about.en.json, docs/work_plan.md
- Tests: N/A (static site)
- Follow-ups: Fill in `aboutMe` text in `about.en.json` (currently blank).
- Commit: 4588486

### 2026-01-24 — About: hero About Me + layout refinements
- Summary:
  - Moved “About Me” into the main hero card (under summary, above link buttons) and left “My Priorities” in the side panel.
  - Removed the Hobbies section from the About page.
  - Made container and gallery gutters consistent (mobile: `--space-3`, desktop: `--space-4`).
  - Adjusted card headers so org/title shares the top row with dates; role/sub-lines render full width below.
  - Merged analytics tools into “Day-to-day tools” and rendered skill notes under names in a serif font.
- Scope: work_plan section 4 (About page UX and galleries)
- Files: site/assets/js/views.js, site/assets/css/styles.css, site/data/about.en.json, docs/work_plan.md
- Tests: N/A (static site)
- Follow-ups: Sanity-check last-card scroll behavior after gutter change.
- Commit: bd87f74

### 2026-01-24 — Gallery: match gutters + restore end alignment
- Summary:
  - Fixed container/gallery gutter mismatch by using a scrollbar-safe viewport width for inset math.
  - Restored the trailing spacer so the last card can scroll fully to the left inset again.
- Scope: work_plan section 4 (About page UX and galleries)
- Files: site/assets/css/styles.css
- Tests: N/A (static site)
- Follow-ups: None.
- Commit: a2cc7d5

### 2026-01-24 — CSS: card header alignment fix
- Summary:
  - Fixed an invalid `align-items: space-between` value in the card header layout.
- Scope: work_plan section 4 (About page UX and galleries)
- Files: site/assets/css/styles.css
- Tests: N/A (static site)
- Follow-ups: None.
- Commit: 751d2b0

### 2026-01-21 — Work experience duration in date meta
- Summary:
  - Added a compact duration (e.g. `2y1m`) before the Work Experience date range.
  - Styled duration as bold and the date range as normal weight.
- Scope: work_plan section 4 (About page UX and galleries)
- Files: site/assets/js/views.js, site/assets/css/styles.css
- Tests: N/A (static site)
- Follow-ups: Confirm desired rounding (month-precision) for duration.
- Commit: da01675

### 2026-01-24 — About: remove CV section + tool icons
- Summary:
  - Removed the bottom CV section from `/about-me` (download remains in the intro).
  - Switched several skill/tool icons to local images under `/assets/img/about/tools/` where available.
- Scope: work_plan section 4 (About page UX and galleries)
- Files: site/assets/js/views.js, site/data/about.en.json
- Tests: N/A (static site)
- Follow-ups: Add more tool icons by wiring additional skills to matching images.
- Commit: c4d14b4

### 2026-01-21 — Experience cards: paragraphs, ordered highlights, typography
- Summary:
  - Extended Experience entries to support `text[]` paragraphs rendered above highlights.
  - Added `highlightType` support (ordered/unordered) with sensible default.
  - Tightened the Experience card header layout (right-aligned dates, tighter role stack) and introduced serif/sans typography via Google Fonts.
- Scope: work_plan section 4 (About page UX and galleries)
- Files: site/assets/js/views.js, site/assets/css/styles.css, site/index.html, site/data/about.en.json, site/data/about.de.json
- Tests: N/A (static site)
- Follow-ups: Adjust type scale/spacing after visual review.
- Commit: 228b027

### 2026-01-21 — Card header layout consistency
- Summary:
  - Unified Experience/Education/Volunteering/References card headers to use the same layout and spacing.
  - Moved Education/Volunteering and References dates into a right-aligned meta column (sans serif).
  - Standardized the label line (above the title) to be uppercase and sans serif across all card types.
- Scope: work_plan section 4 (About page UX and galleries)
- Files: site/assets/js/views.js, site/assets/css/styles.css
- Tests: N/A (static site)
- Follow-ups: Visual review for any long label wrapping edge cases.
- Commit: c919ac4

### 2026-01-21 — Typography weights + consistent card media
- Summary:
  - Added weight variables/utilities (300–700) and lowered default body/muted weights.
  - Made gallery header media (logos/photos) fill header height with a square aspect ratio.
  - Removed the Education/Volunteering label from the combined carousel for cleaner cards.
- Scope: work_plan section 4 (About page UX and galleries)
- Files: site/assets/css/styles.css, site/assets/js/views.js, site/index.html
- Tests: N/A (static site)
- Follow-ups: Fine-tune `--card-head-h` and `--w-body` after visual pass.
- Commit: 25e337b

### 2026-01-20 — About links + merged edu/vol carousel
- Summary:
  - Merged Education and Volunteering into a single combined carousel (schema remains separate).
  - Added `link` properties for card-backed About items and rendered names as link-outs with a diagonal arrow.
  - Switched Work Experience logos to local assets under `/assets/img/about/companies/`.
- Scope: work_plan section 4 (About page UX and galleries)
- Files: site/assets/js/views.js, site/assets/css/styles.css, site/data/about.en.json, site/data/about.de.json
- Tests: N/A (static site)
- Follow-ups: Confirm/adjust the external URLs (company/institution) for accuracy.
- Commit: 8276ab0

### 2026-01-20 — Link icon consistency polish
- Summary:
  - Switched the diagonal link indicator to an inline SVG so it’s consistent everywhere (incl. References) and aligns well with text wrapping.
  - Made reference photos use the same rounded-rectangle shape as other card images.
  - Increased the merged Education/Volunteering carousel card size to match other large carousels.
- Scope: work_plan section 4 (About page UX and galleries)
- Files: site/assets/js/views.js, site/assets/css/styles.css
- Tests: N/A (static site)
- Follow-ups: None.
- Commit: 541546a

### 2026-01-20 — Carousel chevron controls
- Summary:
  - Added per-card footer chevrons (prev/next) to navigate carousels without relying on swipe/scroll.
  - Wired chevrons to scroll by one card while keeping existing dot pagination.
- Scope: work_plan section 4 (About page UX and galleries)
- Files: site/assets/js/views.js, site/assets/css/styles.css
- Tests: N/A (static site)
- Follow-ups: Consider keyboard left/right shortcuts for focused carousel.
- Commit: b5a9967

### 2026-01-20 — Chevron visibility polish
- Summary:
  - Made carousel chevrons appear only on the active card and on hover/focus.
- Scope: work_plan section 4 (About page UX and galleries)
- Files: site/assets/css/styles.css
- Tests: N/A (static site)
- Follow-ups: None.
- Commit: 76bec43

### 2026-01-20 — Chevron visibility (active hover only)
- Summary:
  - Refined carousel chevrons to show only when the active (current) card is hovered.
- Scope: work_plan section 4 (About page UX and galleries)
- Files: site/assets/css/styles.css
- Tests: N/A (static site)
- Follow-ups: None.
- Commit: 92b309c

### 2026-01-14 — Lang label + footer alignment
- Summary:
  - Fixed the language toggle label so it reliably reflects the current state.
  - Adjusted footer structure to align its contents cleanly to the main container width.
- Scope: work_plan section 2 (base HTML/CSS foundation) and section 7 (language toggle UX)
- Files: site/assets/js/app.js, site/shared/footer.html, site/assets/css/styles.css
- Tests: N/A (static site)
- Follow-ups: None.
- Commit: f33b255

### 2026-01-14 — Sticky footer + language toggle fix
- Summary:
  - Fixed the language toggle so it stays in sync with the current `lang` state and can toggle back and forth.
  - Implemented a sticky footer layout (footer stays at the bottom on short pages) and aligned footer content to the main container width.
  - Removed the background “hard cutoff” by allowing the page background to paint beyond the first viewport.
- Scope: work_plan section 2 (base HTML/CSS foundation) and section 7 (language toggle UX)
- Files: site/assets/js/app.js, site/assets/js/lang.js, site/assets/css/styles.css, site/shared/footer.html
- Tests: N/A (static site)
- Follow-ups: None.
- Commit: b0521ae

### 2026-01-14 — Language toggle + scrolling background
- Summary:
  - Replaced the two-button language picker with a single text toggle showing the current language.
  - Made the site background scroll with the page while keeping intermittent neon color blotches.
- Scope: work_plan section 2 (base HTML/CSS foundation) and section 7 (language toggle UX)
- Files: site/shared/header.html, site/assets/js/lang.js, site/assets/css/styles.css
- Tests: N/A (static site)
- Follow-ups: None.
- Commit: d399692

### 2026-01-14 — Header + button polish
- Summary:
  - Simplified the header (no background/border), removed the brand block, and centered navigation.
  - Switched nav active styling to a thick bottom border with hover underline.
  - Unified button styling (and chip links) to a consistent translucent white look; made carousel cards show a pointer cursor.
- Scope: work_plan section 2 (base HTML/CSS foundation)
- Files: site/shared/header.html, site/assets/css/styles.css
- Tests: N/A (static site)
- Follow-ups: None.
- Commit: 6a30dbd

### 2026-01-14 — About: volunteering + references
- Summary:
  - Added About page rendering for `volunteering[]` and `references[]` as horizontal galleries.
  - Extended About data (EN) with LinkedIn-derived education/volunteering/references and local image paths.
  - Improved date formatting to accept year-only ranges and added `--port` to the dev server.
- Scope: work_plan section 4 (About page) and section 3 (date formatting)
- Files: scripts/dev_server.py, site/assets/js/views.js, site/assets/js/data.js, site/assets/css/styles.css, site/data/about.en.json, docs/prd.md, docs/work_plan.md
- Tests: N/A (static site)
- Follow-ups: Mirror volunteering/references content to `about.de.json` (or document intentional EN-only); implement “Ask about Moritz” entrypoint.
- Commit: bebe178

### 2026-01-13 — Logo fallback + assets checklist
- Summary:
  - Switched UI to use `site/assets/img/about/logo.png` as the default logo/icon everywhere.
  - Added `/docs/assets_needed.md` table listing required assets and locations.
  - Wired DE CV to `moritz-kobler-de.pdf` and made screenshots optional until provided.
- Scope: work_plan sections 4–6 (partial) and 11 (process)
- Files: site/shared/header.html, site/assets/css/styles.css, site/assets/js/views.js, site/data/*.json, docs/assets_needed.md
- Tests: N/A (static site)
- Follow-ups: Replace fallbacks with real company/institution logos and app screenshots; implement consent banner + GA gating.
- Commit: 081df5a

### 2026-01-14 — Carousel dots + active glow
- Summary:
  - Replaced visible carousel scrollbars with dot pagination under each About carousel.
  - Added active-card state with glow + slight 3D lift, and a weaker hover state.
  - Made dots clickable to scroll to a specific card; active dot tracks scroll position.
- Scope: work_plan section 4 (About page UX)
- Files: site/assets/css/styles.css, site/assets/js/views.js
- Tests: N/A (static site)
- Follow-ups: Optional keyboard navigation (arrow keys) for carousels.
- Commit: e231cf0

### 2026-01-13 — PRD: Ask-about-Moritz chat feature
- Summary:
  - Added a new About-page “Ask about Moritz” AI chat entrypoint requirement.
  - Documented static-site security constraints (no client-side secrets) and safe default (link-out to custom GPT).
- Scope: work_plan section 13
- Files: docs/prd.md, docs/work_plan.md
- Tests: N/A (docs change)
- Follow-ups: Decide link-out URL + labels; implement the component per work plan.
- Commit: 4b219a9

### 2026-01-13 — Initial site scaffold
- Summary:
  - Added `/site` static SPA skeleton (routing, styling, shared header/footer, JSON-driven placeholders).
  - Added optional Python dev server with SPA fallback.
- Scope: work_plan sections 0–3 (partial)
- Files: site/*, scripts/dev_server.py, README.md, docs/architecture.md
- Tests: N/A (static site)
- Follow-ups: Implement About/Projects sections fully; add consent banner + GA gating.
- Commit: fbadd5d
