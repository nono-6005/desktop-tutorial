# desktop-tutorial

チュートリアル用PWAアプリ集。

## アプリ一覧

- [メモ](./memo/) — Markdown対応のローカルメモアプリ
- [SNS Quick Launcher](./sns-launcher/) — 複数SNSアカウントをワンクリックで開くランチャー
- [Podcast Studio](./podcast-studio/) — 複数トラック録音・ミックス＆AI処理ができるポッドキャスト編集アプリ
- [My Tools](./tools/) — Threadsデモ・JSON保管庫（localStorageにローカル保存、端末間同期なし）

各アプリは独立したPWA（それぞれ専用のmanifest.json・Service Workerを持つ）です。
ホーム画面に追加する場合は、各アプリのURLを直接開いてから追加してください。
`tools/` はPWA化しておらず、通常のWebページとして動作します。セットアップ不要ですぐ使えます。
