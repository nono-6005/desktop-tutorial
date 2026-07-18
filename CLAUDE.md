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

## Available Skills

### /memo-pwa

Create and deploy a PWA memo app to any GitHub repository.

```
/memo-pwa --app-name "My Notes" --theme-color "#FF5733"
```

See `.claude/skills/memo-pwa.md` for details.

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

- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Storage:** IndexedDB (browser local storage)
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

## Notes

- Service Worker caches pages from network first, falls back to cache if offline
- All user data stored locally on device (no cloud sync)
- Cache invalidation: rename cache in sw.js (e.g., v1 → v2)
