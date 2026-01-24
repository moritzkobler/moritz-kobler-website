# work_plan.md
Purpose: This document is designed to be executed by a coding agent. Each task is written as a TODO item. When complete, the agent should mark it as DONE (e.g., change “TODO:” → “DONE:” or strike through).

PRD source: :contentReference[oaicite:0]{index=0}

---

## Context / Constraints (read first)
- DONE: Confirm repository contains `/original-site/` directory with the current live/previous version of the site. Treat it as **reference-only**; do not edit unless explicitly instructed. New implementation should live outside it (e.g., `/site/` or repo root).
- DONE: Confirm target hosting model: static files served by Hostinger from GitHub; no backend.
- DONE: Confirm approach: vanilla HTML/CSS + minimal JS; content sourced from JSON; EN/DE; clean URLs; custom 404. (Per PRD.)

---

## 0) Project setup (repo hygiene + directory scaffold)
- DONE: Create directory structure (new site implementation). Recommended:
  - `/site/`
    - `/site/pages/` (HTML templates or page entrypoints)
    - `/site/assets/`
      - `/site/assets/css/`
      - `/site/assets/js/`
      - `/site/assets/img/`
      - `/site/assets/logos/`
      - `/site/assets/cv/`
      - `/site/assets/screenshots/`
    - `/site/data/`
      - `/site/data/about.en.json`
      - `/site/data/about.de.json`
      - `/site/data/projects.json`
    - `/site/shared/` (header/footer components, utilities)
    - `/site/404.html`
    - `/site/index.html` (optional redirect or landing; see routing decision)
  - `/scripts/` (optional, only if needed; keep site runnable without it)
  - `/docs/` (implementation notes)
- DONE: Add `.gitignore` (keep minimal; ensure no build artifacts required for deploy).
- DONE: Add `README.md` with:
  - How to run locally (simple static server)
  - Where data files live
  - How routing works
  - How to deploy to Hostinger
  - Note about `/original-site/` reference
- DONE: Add a simple local dev command suggestion (no tooling requirement):
  - Example: `python -m http.server 8000` executed from `/site/`

---

## 1) Architecture decisions (record in /docs/architecture.md)
- DONE: Choose routing strategy to achieve “clean URLs (no index.html)” on static hosting:
  - Option A: Directory-based pages (`/about-me/index.html`, `/projects/index.html`, `/projects/apps/<slug>/index.html`) + Hostinger rewrite support.
  - Option B: Single `index.html` + JS router (History API) + fallback rewrite to `/index.html`.
  - Document the choice and required Hostinger config.
- DONE: Choose language mechanism:
  - Default EN
  - UI toggle EN/DE
  - URL parameter support (e.g., `?lang=de`)
  - Document precedence rules: URL param overrides stored preference overrides default.
- DONE: Decide whether to add an optional build step:
  - Default: no build step
  - Only add if it materially improves maintainability (e.g., copy/minify) and keep it optional.

---

## 2) Base HTML/CSS foundation
- DONE: Create base HTML shell with:
  - Semantic structure
  - Shared header navigation (About Me, Projects)
  - Footer (if desired)
- DONE: Implement CSS system:
  - CSS variables for colors, spacing, typography
  - Dark (not pure black) theme + neon accents
  - Mobile-first layout; additive `min-width` media queries
  - No inline styles; avoid deep selector nesting
  - Focus states + hover states + subtle transitions
- DONE: Implement motion constraints:
  - Decorative CSS/SVG animations (lightweight)
  - Respect `prefers-reduced-motion` (disable/reduce animations)
- DONE: Implement accessible nav:
  - Keyboard navigable
  - Visible focus outline
  - ARIA only where needed

---

## 3) Data layer (JSON-driven content)
- DONE: Create `/site/data/about.en.json` and `/site/data/about.de.json` with PRD schema:
  - `meta`, `summary`, `experience[]`, `education[]`, `volunteering[]`, `references[]`, `skills[]`, `hobbies[]`
- DONE: Create `/site/data/projects.json` with PRD schema:
  - `projects[]` with fields: `slug`, `type`, `name`, `status`, `shortDescription`, `longDescription`, `appStoreLinks`, `supportEmail`, `privacy`, `screenshots`
- DONE: Implement a small JS loader:
  - Fetch JSON
  - Cache in-memory
  - Error handling (missing file, invalid JSON)
- DONE: Implement date formatting utility:
  - Input: ISO-ish strings like `YYYY-MM` and `present`
  - Output: human-readable (e.g., `Oct 2022 – Present`)
  - Locale aware (EN/DE formatting)

---

## 4) Page implementation: About Me (`/about-me`)
- TODO: Add “Ask about Moritz” chat entrypoint at top of About page:
  - Must be visible above the intro
  - Must be keyboard accessible
  - Must clearly disclose AI-generated content
  - Default implementation for static hosting: link-out to the custom GPT in ChatGPT
  - Do not embed any secret API keys in client-side code
  - Optional later: embedded on-site chat UI only if a secure proxy/token-minting approach is approved
- DONE: Create About page route and HTML skeleton.
  - DONE: Render header/intro from JSON:
  - Name, title, location, LinkedIn link, summary
  - Implemented: Right-side intro panel shows “My Priorities”; “About Me” renders in the main hero card.
  - DONE: Implement Work Experience horizontal gallery:
  - Card per role entry
  - Company logo (official logo path from JSON; placeholder acceptable)
  - `roles[]` (array of role titles) — display the latest role prominently and list prior roles
  - Company, dates, highlights
  - Horizontal scroll with scroll-snap; swipeable on mobile
- DONE: Implement Education horizontal gallery:
  - Same interaction pattern
  - Institution logo, degree, dates, focus, details
- DONE: Implement Volunteering horizontal gallery:
  - Same interaction pattern
  - Organization logo/image, role, dates, cause, highlights
- DONE: Implement References horizontal gallery:
  - Same interaction pattern
  - Photo, name, title, relation, date, and recommendation text
- Implemented: Added About page Volunteering + References sections (horizontal galleries) driven by `about.{lang}.json`.
- DONE: Implement Skills & Tools section:
  - Brand icons only (use placeholders initially)
  - Optional grouping support in JSON (if not present, render as flat list)
- DONE: Implement Hobbies / personal notes list rendering.
- DONE: Implement Contact section:
  - LinkedIn only (email optional/hidden)
- DONE: Implement Downloadable CV link:
  - `meta.cvPdf` points to `/assets/cv/...`
  - Ensure link downloads/opens reliably

---

## 5) Page implementation: Projects (`/projects`)
- TODO: Create Projects listing route and HTML skeleton.
- TODO: Render grid/list of project cards from `projects.json`:
  - Name, short description, status
  - Icon/screenshot placeholder
  - Link to detail page
- TODO: Ensure cards are accessible:
  - Entire card clickable (but preserve semantic links)
  - Focusable with keyboard

---

## 6) Page implementation: Project detail (`/projects/apps/{slug}`)
- TODO: Implement route resolution by slug.
- TODO: Render project detail:
  - App name, icon, status, long description
  - Screenshot gallery (placeholders allowed)
  - App Store links (if present)
- TODO: App Store compliance sections:
  - Support section: `mailto:` link using `supportEmail`
  - Privacy section: render `privacy` statement
- TODO: Ensure URL structure supports future non-app project types:
  - Use `type` in data model and keep routing extensible.

---

## 7) Language toggle UX + persistence
- TODO: Add EN/DE toggle visible on all pages.
- TODO: Implement language selection rules:
  - URL param `?lang=de|en` sets language for current load
  - Store preference in `localStorage` (if allowed) for subsequent visits
  - Default EN if nothing set
- TODO: Ensure partial translations don’t break rendering:
  - Fallback behavior if a field missing in DE: show EN or hide section (document which).

---

## 8) Analytics + consent banner (privacy-safe)
- TODO: Implement cookie/tracking consent banner:
  - No GA initialization until explicit consent
  - Store consent choice
- TODO: Integrate Google Analytics in a deferred way:
  - Load GA script only after consent
  - Respect Do Not Track where applicable (skip loading if DNT is enabled) [Inference: implement `navigator.doNotTrack` check]
- TODO: Add a small “manage consent” link in footer (optional but recommended).

---

## 13) AI Chat Assistant (“Ask about Moritz”)
- TODO: Add data configuration to `about.{lang}.json`:
  - `meta.chat.enabled`, `meta.chat.mode`, `meta.chat.label`, `meta.chat.url`
  - Ensure EN/DE labels work with the language toggle
- TODO: Implement UI component (site-native) for the chat entrypoint:
  - “Open chat” button opens the custom GPT URL in a new tab
  - Provide short helper copy (what it can answer)
  - Provide disclaimer and privacy note
- TODO: (Optional) Track “open chat” event via analytics only after consent.
- TODO: Document the security constraint in `docs/architecture.md`:
  - No secrets in static client code
  - Embedded chat requires a secure proxy/token strategy

---

## 9) 404 + error handling
- TODO: Create `/site/404.html` with styling consistent with the site.
- TODO: Ensure 404 works with Hostinger routing approach chosen in section 1.
- TODO: Implement graceful “not found” for invalid project slugs (render a friendly message + link back to `/projects`).

---

## 10) Performance + accessibility pass
- TODO: Run a manual accessibility checklist:
  - Keyboard navigation across all interactive elements
  - Focus visible everywhere
  - Reasonable contrast
  - Semantic headings order
- TODO: Performance checklist:
  - Optimize images/logos (SVG where possible)
  - Avoid heavy JS; defer non-critical scripts
  - Ensure mobile load is fast
- TODO: Confirm `prefers-reduced-motion` behavior on animations.

---

## 11) Content placeholders + assets
- TODO: Add placeholder logos in `/site/assets/logos/` for companies/institutions referenced in JSON.
- TODO: Add placeholder app icons/screenshots in `/site/assets/screenshots/` and wire them in `projects.json`.
- TODO: Add placeholder CV PDF to `/site/assets/cv/` and reference in `about.en.json`.

Implemented note: Asset files are intentionally not generated in-repo; see `/docs/assets_needed.md` for the list of files to add.

---

## 12) Deployment readiness (Hostinger + GitHub)
- TODO: Document exact deploy steps in `README.md`:
  - Which directory Hostinger serves (repo root vs `/site/`)
  - If Hostinger needs configuration for clean URLs / SPA fallback
- TODO: Validate clean URL behavior for:
  - `/about-me`
  - `/projects`
  - `/projects/apps/<slug>`
  - `/404` (as appropriate)
- TODO: Final smoke test:
  - Open site locally
  - Verify navigation
  - Switch language
  - Open project pages
  - Verify consent banner gating analytics

---

## Definition of Done
- TODO: All PRD pages implemented with JSON-driven content and EN/DE support.
- TODO: Clean URLs working on Hostinger.
- TODO: Custom 404 present and functional.
- TODO: GA loads only after consent; consent banner present; DNT respected where implemented.
- TODO: CSS is maintainable (variables, no inline styles, minimal nesting).
- TODO: Mobile-first and keyboard accessible.


