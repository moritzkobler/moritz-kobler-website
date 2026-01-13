# Architecture decisions

## Routing strategy

Chosen: **Option B — Single-page app router (History API) + server fallback to `index.html`**.

Why:
- Allows clean URLs without `index.html`.
- Supports dynamic routes like `/projects/apps/{slug}` from JSON without generating one HTML file per project.

Hosting requirement:
- Static host must serve `site/index.html` for unknown paths.
- If hosting on Apache (common on Hostinger), use `site/.htaccess`.

## Language mechanism

- Default language: `en`.
- URL param: `?lang=en|de` (highest precedence).
- Stored preference in `localStorage` (second precedence).

Precedence:
1. `?lang=` query parameter
2. `localStorage` preference
3. default `en`

Fallback behavior (initial implementation):
- If a field is missing in DE, the section may render empty; long-term we should implement EN fallback per PRD.
