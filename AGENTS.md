# Repository Guidelines

## Project Structure & Module Organization
- `manifest.json`: Chrome MV3 manifest (name, version, permissions, hosts)
- `popup.html`, `popup.js`: User entry UI and collection trigger
- `result.html`, `result.js`: Results grid, download logic, and video preview
- `content.js`: Diagnostic probes/logging on product pages
- `content-script.js`: Page scrapers for Taobao/Tmall/AliExpress
- `background.js`: Currently unused placeholder
- `images/`: Extension icons (16/48/128)
- `README.md`: Product description and usage

## Build, Test, and Development Commands
- Build: no build step. Load unpacked via Chrome → `chrome://extensions` → enable Developer Mode → Load unpacked → select this folder.
- Package for store/manual install:
  - macOS/Linux: `zip -r taotao-fast-image-collector-v2.0.zip images manifest.json background.js content-script.js content.js popup.html popup.js result.html result.js`
- Debug: right‑click popup → Inspect; on result page use DevTools; watch console logs from `content*.js` on product pages.

## Coding Style & Naming Conventions
- JavaScript (ES6+), 2‑space indentation, semicolons required.
- Variables/functions: `camelCase`; files: lower‑case; multiword scripts may use `kebab-case` (e.g., `content-script.js`).
- Prefer `const`/`let`; small, pure helpers; keep selectors centralized when possible.
- No linter configured; if adding one, use ESLint with a minimal config and fix-on-save.

## Testing Guidelines
- No automated tests yet. Validate manually on: `taobao.com`, `tmall.com`, `aliexpress.*`.
- Verify: counts per section, deduping, `.webp` normalization, video playback, and batch downloads creating a timestamped folder.
- If adding tests, place in `tests/` and name like `content.selectors.spec.js`; consider Playwright for smoke E2E.

## Commit & Pull Request Guidelines
- Commits: concise, present tense. Conventional Commits encouraged: `feat`, `fix`, `docs`, `refactor`, `chore`.
  - Example: `feat(popup): show installed version in header`
- PRs must include: purpose/impact, before/after screenshot or short clip (popup and results), any selector/permission changes, and manual test notes across the 3 sites.
- When changing permissions/`host_permissions`, call them out and bump `manifest.json` `version`.

## Security & Configuration Tips
- Keep permissions minimal: `downloads`, `tabs`, `storage`, `scripting`; hosts limited to Taobao/Tmall/AliExpress.
- Avoid broad patterns; test on a sample of product pages; ensure downloads respect file name sanitization.
