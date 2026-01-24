# Assets to provide (to replace placeholders)

The site currently uses `site/assets/img/logo.png` as a universal fallback for any missing logo/icon.

| Asset type | Where to store | File name | Used by | Notes |
|---|---|---|---|---|
| Site logo (square) | `site/assets/img/` | `logo.png` | Header brand + fallbacks | Already present. Prefer ~512×512 PNG with transparent background. |
| CV PDF (English) | `site/assets/cv/` | `moritz-kobler-en.pdf` | About page CV download | You added this. |
| CV PDF (German) | `site/assets/cv/` | `moritz-kobler-de.pdf` | About page CV download | You added this. |
| Company logos (SVG preferred) | `site/assets/logos/` | `seek.svg` | About → Work Experience cards | Add one SVG per company; update JSON paths if names differ. |
| Education logos (SVG preferred) | `site/assets/logos/` | `tu-berlin.svg` | About → Education cards | Add one SVG per institution; update JSON paths if names differ. |
| App icon (per project) | `site/assets/img/` (or new folder `site/assets/apps/<slug>/`) | e.g. `chronomo.png` | Projects list + Project detail hero | Currently using `logo.png` everywhere; we can switch to per-project icons when provided. |
| App screenshots (per project) | `site/assets/screenshots/` | e.g. `chronomo-1.png`, `chronomo-2.png` | Project detail screenshots grid | Add files and list them in `site/data/projects.{lang}.json` under `screenshots`. Prefer PNG/WebP. |
| Social preview image (optional) | `site/assets/img/` | `og-image.png` | `<meta property="og:image">` (future) | Not wired yet; recommended for sharing. |
| Favicons (optional) | `site/` | `favicon.ico`, `apple-touch-icon.png` | Browser tab + mobile | Not wired yet; recommended. |

If you tell me your preferred naming scheme for company/institution logos and screenshots, I can align the JSON to match exactly.