# desktop-tutorial

A collection of tutorial projects and PWA apps.

## Projects

### memo-pwa (Markdown Memo App)

A fully functional PWA memo application with:
- Markdown editing and preview
- Local storage (IndexedDB)
- Offline support via Service Worker
- Download memos as .md files
- PWA installation on mobile

**Live:** https://nono-6005.github.io/desktop-tutorial/memo/
(Files live under `memo/`; the root `index.html` just redirects there. Kept isolated from other apps so each has its own PWA scope — see "PWA scope isolation" below.)

### sns-launcher (SNS Quick Launcher)

A PWA app for opening multiple SNS accounts with one click:
- Account registration (platform + URL/username + display name + description)
- LocalStorage persistence
- Offline support via Service Worker
- PWA installation on mobile/desktop

**Live:** https://nono-6005.github.io/desktop-tutorial/sns-launcher/

### podcast-studio (Podcast Studio)

A PWA app for recording and editing podcasts, fully local (no server, no data sent):
- Multi-track microphone recording (Web Audio API; each recording becomes a track)
- Per-track volume, single-track preview, delete
- Simultaneous mixdown playback (OfflineAudioContext)
- Metadata (title / description / cover image)
- WAV export of the mixed audio + text export of metadata
- Offline support via Service Worker
- PWA installation on mobile/desktop

**Live:** https://nono-6005.github.io/desktop-tutorial/podcast-studio/

Like memo and sns-launcher, this is a build-free single `index.html` (vanilla JS, no
framework). It was originally distributed as a React + Claude-API version, but the
AI title/description feature was **deliberately dropped**: on GitHub Pages (public,
no backend) an API key can't be kept secret and would let anyone run up charges on the
account. This app therefore makes **no external network requests at all** — everything
stays on-device. Do not reintroduce client-side API-key calls here.

### tools (Threadsデモ)

A build-free HTML page, originally scoped per `PROJECT_PACKAGE.md` (the Lv4 spec this
was built from) as a pair of tools (Threadsデモ + JSON保管庫) synced via Supabase.
Downgraded twice at the user's request: first to localStorage-only (Supabase Magic
Link sign-in didn't work in practice), then JSON保管庫 was dropped entirely (not
useful outside developer/debug use). What's left:
- **Threadsデモ** (`tools/index.html`) — post creation, tree replies, delete, TL
  reset, JSON export (backup only, not sync)
- localStorage CRUD helpers in `tools/app.js` (single `tools_records` key; record
  shape: `id`/`type`/`title`/`content`/`data`/`created_at`/`updated_at`)

No login, no cross-device sync — each browser's data stays local to that browser.

**Live:** https://nono-6005.github.io/desktop-tutorial/tools/
No setup required — works immediately once deployed.

Unlike the other three apps, this one is **not a PWA** (no `manifest.json`/`sw.js`).
It still lives in its own `tools/` subdirectory per "PWA scope isolation" below, to
keep it isolated from the other apps' folders.

## Available Skills

### /memo-pwa

Create and deploy a PWA memo app to any GitHub repository.

```
/memo-pwa --app-name "My Notes" --theme-color "#FF5733"
```

See `.claude/skills/memo-pwa.md` for details.

### /podcast-studio

Create and deploy a Podcast Studio PWA app (multi-track recording/mixing, WAV export,
optional AI-assisted title/description generation) to any GitHub repository. Unlike
`/memo-pwa`, this generates a React + Vite + Tailwind project (source in
`{app-dir}-app/`) that must be built (`npm install && npm run build`) into a sibling
`{app-dir}/` directory before it can be served.

```
/podcast-studio --app-name "Podcast Studio" --theme-color "#4c1d95"
```

See `.claude/skills/podcast-studio.md` for details.

## Development

- Branch: `claude/execution-9vl80x` (feature development)
- Main: `main` (production, auto-deployed to GitHub Pages)

## Key Files

- `index.html` - Root redirect to `memo/`
- `memo/index.html` - Memo app (UI + JavaScript + IndexedDB)
- `memo/manifest.json` - Memo PWA configuration (scope: `/memo/`)
- `memo/sw.js` - Memo Service Worker (caching, offline support)
- `sns-launcher/index.html` - SNS Launcher app
- `sns-launcher/manifest.json` - SNS Launcher PWA configuration (scope: `/sns-launcher/`)
- `sns-launcher/sw.js` - SNS Launcher Service Worker
- `podcast-studio/index.html` - Podcast Studio app (recording/editing via Web Audio API)
- `podcast-studio/manifest.json` - Podcast Studio PWA configuration (scope: `/podcast-studio/`)
- `podcast-studio/sw.js` - Podcast Studio Service Worker
- `tools/index.html` - Threadsデモ app (localStorage-backed, no login/sync)
- `tools/app.js` - localStorage CRUD helpers for tools/
- `tools/README.md` - Docs for tools/ (no setup required)
- `README.md` - User-facing docs

## PWA scope isolation

Each app must live in its own subdirectory with its own `manifest.json`/`sw.js`, and
`manifest.json`'s `scope` must not overlap with another app's. A PWA's manifest `scope`
(e.g. `/memo/`) is a URL prefix: navigating to any URL under it, from inside that app's
already-open standalone window, stays in the same window instead of launching as a
separate app. If two apps shared scope `/` at the repo root, opening one from inside the
other's installed window would just navigate in place rather than opening as a distinct
app. Do not add a new app directly at the repo root — always give it its own folder.

## Technical Stack

- **Frontend:** Vanilla JavaScript, HTML5, CSS3 (all three apps; build-free single-file)
- **Storage:** IndexedDB / localStorage (browser local storage)
- **Deployment:** GitHub Pages
- **PWA:** manifest.json + Service Worker

## GitHub Pages Settings

Settings → Pages → Source: `main` branch, `/(root)` directory

## Deployment

Changes to `main` branch are automatically deployed via GitHub Pages within 2-5 minutes.

To deploy:
1. Make changes on feature branch
2. Create PR to main
3. Merge PR
4. Wait for deployment

### Auto-merge policy

For this repo, once a PR is opened and its changes have been verified (tests/manual
checks described in the PR body pass), merge it immediately without waiting for
separate user confirmation — this is standing authorization for this repo, not a
one-off approval. Still surface anything that needs human judgment (ambiguous specs,
destructive changes outside this repo, anything not already covered by the PR's own
verification) before merging.

After merging, poll the GitHub Actions "pages build and deployment" run for the merge
commit until it completes, then report the resulting live URL(s) to the user
automatically (no need to wait for them to ask "URL発行") — e.g.
`https://nono-6005.github.io/desktop-tutorial/memo/`,
`https://nono-6005.github.io/desktop-tutorial/sns-launcher/`, and
`https://nono-6005.github.io/desktop-tutorial/podcast-studio/`, adjusted to whatever
paths the merged change actually affects.

## Notes

- Service Worker caches pages from network first, falls back to cache if offline
- All user data stored locally on device (no cloud sync)
- Cache invalidation: rename cache in sw.js (e.g., v1 → v2)
