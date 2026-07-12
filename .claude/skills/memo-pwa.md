# memo-pwa

Create and deploy a PWA memo app with Markdown support.

## Description

Generates a fully functional Progressive Web App (PWA) for note-taking with:
- Markdown editing
- Local storage (IndexedDB)
- Offline support via Service Worker
- Download memos as Markdown files
- Bookmark guidance for iOS/Android/desktop (device-agnostic; native install prompts are unreliable on many tablets, so this is the primary "quick access" path)
- GitHub Pages deployment ready

## Usage

```
/memo-pwa
```

Or with parameters:

```
/memo-pwa --app-name "My Notes" --theme-color "#d97757"
```

## Parameters

- `--app-name` (optional, default: "メモ") - App display name
- `--theme-color` (optional, default: "#d97757") - Primary theme color (hex)
- `--repo-owner` (optional) - GitHub owner for deployment
- `--repo-name` (optional) - GitHub repo name for deployment

## What it creates

1. **index.html** - Main app with UI, editor, IndexedDB integration, and bookmark guide modal (generated from `templates/index.html`, with `{{APP_NAME}}`, `{{THEME_COLOR}}`, `{{APP_DESCRIPTION}}` substituted)
2. **manifest.json** - PWA manifest (still useful for SW scope/offline; installability is a bonus, not guaranteed)
3. **sw.js** - Service Worker for offline support and caching
4. **README.md** - Setup instructions

## Features

✅ Create, edit, delete notes
✅ Markdown editing
✅ Notes stored locally (survive refresh)
✅ Download notes as .md files
✅ Fully offline capable
✅ Bookmark guide (works regardless of device PWA-install support)
✅ Responsive layout: single-column on mobile, 2-column list+editor on tablet/desktop (≥768px)
✅ Dark theme, mobile-optimized UI
✅ No server needed, runs entirely in browser

## Deploy to GitHub Pages

After files are generated:

1. Commit files to your repo's main branch
2. Enable Pages: Settings → Pages → Source: main branch
3. App will be available at `https://{owner}.github.io/{repo}/`

## Example workflow

```bash
# Create the app
/memo-pwa

# Add to git
git add index.html manifest.json sw.js README.md

# Commit and push
git commit -m "feat: add memo PWA"
git push

# Enable Pages in GitHub settings
# Wait a few minutes for deployment
# Visit https://your-username.github.io/your-repo/
```

## Notes

- All data stays on the device (no cloud sync)
- Service Worker caching: pages load from cache first, checks network for updates
- Works on: Chrome/Firefox (desktop), Chrome/Firefox/Samsung Internet (Android), Safari (iOS 15+)
