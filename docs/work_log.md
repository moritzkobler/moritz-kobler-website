### 2026-01-20 — About links + merged edu/vol carousel
- Summary:
  - Merged Education and Volunteering into a single combined carousel (schema remains separate).
  - Added `link` properties for card-backed About items and rendered names as link-outs with a diagonal arrow.
  - Switched Work Experience logos to local assets under `/assets/img/companies/`.
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
  - Switched UI to use `site/assets/img/logo.png` as the default logo/icon everywhere.
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
