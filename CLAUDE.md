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

**Live:** https://nono-6005.github.io/desktop-tutorial/

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

- `index.html` - Main app (UI + JavaScript + IndexedDB)
- `manifest.json` - PWA configuration
- `sw.js` - Service Worker (caching, offline support)
- `README.md` - User-facing docs

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

## Notes

- Service Worker caches pages from network first, falls back to cache if offline
- All user data stored locally on device (no cloud sync)
- Cache invalidation: rename cache in sw.js (e.g., v1 → v2)
