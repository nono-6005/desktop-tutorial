# {{APP_NAME}}

{{APP_DESCRIPTION}}

## Features

- Markdown editing with real-time preview
- Local storage (IndexedDB)
- Fully offline capable
- PWA (add to home screen)
- Download notes as Markdown files

## Installation

This app runs entirely in your browser. No server or installation needed.

### On Desktop
Open this repository with GitHub Pages enabled:
`https://{{REPO_OWNER}}.github.io/{{REPO_NAME}}/`

### On Mobile (Android/iOS)
1. Open the app in your browser
2. **Android Chrome**: Tap address bar → "Install" (or menu → "Install app")
3. **iOS Safari**: Share button → "Add to Home Screen"

## How to Use

- **New Note**: Tap the + button
- **Edit**: Tap a note to edit it
- **Save**: Tap ← Save when done
- **Download**: Tap 📥 to download as .md file
- **Delete**: Tap 🗑 to delete

## Technical Details

- **Storage**: IndexedDB (survives browser close/refresh)
- **Offline**: Service Worker caches app, works without internet
- **Updates**: Browser checks for new versions, installs in background
- **Privacy**: All data stays on your device, no cloud sync

## Browser Support

- ✅ Chrome/Chromium (desktop & Android)
- ✅ Firefox (desktop & Android)  
- ✅ Safari (iOS 15+)
- ✅ Edge (desktop)

## For Developers

To customize this app, edit:
- `index.html` - UI, styles, and JavaScript logic
- `manifest.json` - App name, colors, icons
- `sw.js` - Caching strategy

Then commit and push. GitHub Pages will automatically deploy within minutes.
