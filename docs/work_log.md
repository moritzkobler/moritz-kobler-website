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

### 2026-01-13 — Initial site scaffold
- Summary:
  - Added `/site` static SPA skeleton (routing, styling, shared header/footer, JSON-driven placeholders).
  - Added optional Python dev server with SPA fallback.
- Scope: work_plan sections 0–3 (partial)
- Files: site/*, scripts/dev_server.py, README.md, docs/architecture.md
- Tests: N/A (static site)
- Follow-ups: Implement About/Projects sections fully; add consent banner + GA gating.
- Commit: fbadd5d
