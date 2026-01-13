# moritz-kobler-website

Static personal website for moritz-kobler.com.

## Local development

This repo is static (no backend). The website implementation lives in `/site`.

### Option A (recommended): SPA-friendly dev server

Run:

- `python scripts/dev_server.py`

Then open `http://localhost:8000`.

### Option B: basic static server (no deep-link support)

From `/site`:

- `python -m http.server 8000`

Note: direct navigation to routes like `/about-me` will 404 in this mode.

## Data-driven content

- CV/About: `site/data/about.en.json`, `site/data/about.de.json`
- Projects: `site/data/projects.json`

## Routing (clean URLs)

This site uses a small client-side router (History API) to support clean URLs like:

- `/about-me`
- `/projects`
- `/projects/apps/<slug>`

On real static hosting, this requires a rewrite/fallback rule to serve `index.html` for unknown paths.

If you’re hosting on Apache (common on Hostinger), use the provided `site/.htaccess`.

## Reference-only

`/original-site` is kept as a reference copy of an older site (do not edit unless explicitly instructed).
