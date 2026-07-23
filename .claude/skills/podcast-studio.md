# podcast-studio

Create and deploy a Podcast Studio PWA app to any GitHub repository.

## Description

Generates a fully functional Progressive Web App (PWA) for recording and mixing a
podcast episode:
- Multi-track microphone recording (Web Audio API)
- Per-track volume mixing and playback
- WAV export of the mixed result
- Optional AI-assisted title/description generation via the Claude API (experimental —
  calls `api.anthropic.com` directly from the browser with a user-supplied key; may hit
  CORS restrictions, and Claude does not natively transcribe/understand raw audio)
- Offline support via Service Worker
- GitHub Pages deployment ready

Unlike `/memo-pwa`, this app is **React + Vite + Tailwind**, not vanilla JS/HTML, because
the UI (track list, mixer, settings panel) and Web Audio API usage are naturally
component-shaped. It generates two sibling directories instead of one:

- `{app-dir}-app/` — the source project (not deployed directly)
- `{app-dir}/` — the built static output, produced by `npm run build`, which is what
  GitHub Pages actually serves (no build step needed at deploy time — consistent with
  how this repo's Pages source is configured: `main` branch, `/(root)` directory)

## Usage

```
/podcast-studio
```

Or with parameters:

```
/podcast-studio --app-name "Podcast Studio" --theme-color "#4c1d95" --app-dir "podcast-studio"
```

## Parameters

- `--app-name` (optional, default: "Podcast Studio") - App display name
- `--theme-color` (optional, default: "#4c1d95") - Primary theme color (hex)
- `--app-dir` (optional, default: "podcast-studio") - Directory name for the built app;
  the source project is placed at `{app-dir}-app/`
- `--repo-owner` (optional) - GitHub owner, used only in generated README links
- `--repo-name` (optional) - GitHub repo name, used only in generated README links

## What it creates

Generated from `templates/podcast-studio/` (placeholders `{{APP_NAME}}`,
`{{APP_SHORT_NAME}}`, `{{APP_DESCRIPTION}}`, `{{THEME_COLOR}}`, `{{APP_DIR}}`,
`{{REPO_OWNER}}`, `{{REPO_NAME}}` substituted):

1. **`{app-dir}-app/package.json`, `vite.config.js`, `tailwind.config.js`,
   `postcss.config.js`** — build configuration. `vite.config.js` sets `base: './'` and
   `build.outDir: '../{app-dir}'` so a plain `npm run build` produces the deployable
   static site directly as a sibling directory.
2. **`{app-dir}-app/index.html`** — Vite entry point with PWA meta tags (manifest link,
   theme-color, icon).
3. **`{app-dir}-app/src/App.jsx`** — the main component (recording, mixing, metadata,
   AI processing, WAV export).
4. **`{app-dir}-app/src/main.jsx`, `src/index.css`** — React bootstrap + Tailwind
   directives; `main.jsx` also registers the Service Worker.
5. **`{app-dir}-app/public/manifest.json`, `public/sw.js`, `public/manual.html`,
   `public/icons/icon.svg` + `icon-192.png`/`icon-512.png`/`icon-192-maskable.png`/
   `icon-512-maskable.png`** — PWA manifest, Service Worker, in-app help page, and icons
   (copied into the build output by Vite automatically since they live under
   `public/`). The manifest lists **both** the PNGs and the SVG; the PNGs are what
   satisfy Chrome/Android's installability check (an SVG-only icon set is not
   consistently enough for the native "Install" prompt to appear — this bit real users
   in earlier iterations of this skill). `manual.html` carries the "ホーム画面に追加
   （アプリ化）" install instructions as a fallback, linked from the app header, mirroring
   `/memo-pwa` and the existing `sns-launcher` app in this repo.
6. **`{app-dir}-app/README.md`** — setup/usage instructions.

## Build steps (must run after generating files)

```bash
cd {app-dir}-app
npm install
npm run build   # produces ../{app-dir}/ — the actual deployed site
```

## PWA scope isolation

If this repository already hosts other PWAs (see `CLAUDE.md`), give this app its own
`{app-dir}/` directory with its own `manifest.json`/`sw.js`, and make sure
`manifest.json`'s `scope` doesn't overlap another app's. Never build directly into the
repo root.

## Deploy to GitHub Pages

After `{app-dir}/` is built:

1. Commit both `{app-dir}-app/` (source, minus `node_modules/` — add that to
   `.gitignore`) and `{app-dir}/` (built output) to your repo's main branch
2. Enable Pages: Settings → Pages → Source: `main` branch, `/(root)` directory
3. App will be available at `https://{owner}.github.io/{repo}/{app-dir}/`

## Example workflow

```bash
# Generate the app
/podcast-studio --app-name "My Podcast Studio"

# Install deps and build
cd podcast-studio-app
npm install
npm run build
cd ..

# Add to git (node_modules is gitignored)
git add podcast-studio-app podcast-studio

# Commit and push
git commit -m "feat: add podcast studio PWA"
git push

# Enable Pages in GitHub settings if not already
# Wait a few minutes for deployment
# Visit https://your-username.github.io/your-repo/podcast-studio/
```

## Known limitations

- The AI-processing feature is experimental: browser→`api.anthropic.com` calls are
  likely to be blocked by CORS in real deployments, and Claude does not natively
  transcribe or understand raw audio. It degrades gracefully (shows an error alert,
  rest of the app keeps working) rather than crashing.
- MP3 export is not implemented; only WAV.
- Every rebuild (`npm run build`) empties and regenerates `{app-dir}/` — never
  hand-edit files there, only in `{app-dir}-app/`.
- The template's PNG icons are pre-rendered with the **default** `--theme-color`
  (`#4c1d95`) baked into the pixels. Passing a different `--theme-color` re-tints the
  SVG icon, manifest colors, and page meta tags, but **not** the PNGs — they'll still
  show the default purple background. If exact color matching matters, re-render
  `icon-192.png`/`icon-512.png`/`icon-192-maskable.png`/`icon-512-maskable.png` from the
  substituted `icon.svg` (e.g. headless-Chromium screenshot of an `<img>` sized to the
  target dimensions, or any SVG-to-PNG tool) before shipping.
