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
- Projects: `site/data/projects.en.json`, `site/data/projects.de.json`

## Routing (clean URLs)

This site uses a small client-side router (History API) to support clean URLs like:

- `/about-me`
- `/projects`
- `/projects/apps/<slug>`

On real static hosting, this requires a rewrite/fallback rule to serve `index.html` for unknown paths.

If you’re hosting on Apache (common on Hostinger), use the provided `site/.htaccess`.

## Deployment (Hostinger + Git)

This repo is a monorepo-style layout: the actual website lives in `/site`, but the site uses absolute asset paths like `/assets/...`.

That means the *contents of* `/site` must be deployed to your domain’s web root (usually `public_html/`).
If Hostinger deploys the whole repo “as-is”, you’d end up with `public_html/site/...` and the website would break.

### Recommended setup: deploy branch (auto-generated)

This repository includes a GitHub Actions workflow that publishes the contents of `/site` to a separate branch called `deploy`.

- Workflow: `.github/workflows/deploy-hostinger.yml`
- Trigger: every push to `main` (and manual runs via Actions)
- Output: `deploy` branch contains `index.html`, `assets/`, `data/`, `.htaccess`, etc at the branch root

### Hostinger configuration

In Hostinger hPanel:

1. Ensure Git is connected to this repository (you already did this).
2. Configure Git deployment to use:
	- Branch: `deploy`
	- Deployment directory: your domain web root (commonly `public_html/`)
3. Deploy (or enable auto-deploy if available).

After deployment, verify in Hostinger File Manager:

- `public_html/index.html` exists
- `public_html/.htaccess` exists (required for SPA clean URLs)

Then test these URLs (directly in the browser address bar):

- `/about-me`
- `/projects`
- `/projects/apps/chronimo`

## Reference-only

`/original-site` is kept as a reference copy of an older site (do not edit unless explicitly instructed).
