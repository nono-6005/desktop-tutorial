# memo-pwa

Create and deploy a PWA memo app with Markdown support.

## Description

Generates a fully functional Progressive Web App (PWA) for note-taking with:
- Markdown editing with real-time preview
- Local storage (IndexedDB)
- Offline support via Service Worker
- Download memos as Markdown files
- iPhone/Android home screen installation
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

1. **index.html** - Main app with UI, editor, and IndexedDB integration
2. **manifest.json** - PWA manifest for installability
3. **sw.js** - Service Worker for offline support and caching
4. **README.md** - Setup instructions

## Features

✅ Create, edit, delete notes
✅ Markdown support with live preview  
✅ Notes stored locally (survive refresh)
✅ Download notes as .md files
✅ Fully offline capable
✅ Install to home screen as app
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
