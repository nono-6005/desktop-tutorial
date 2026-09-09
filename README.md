# desktop-tutorial

チュートリアル用PWAアプリ集。

## アプリ一覧

- [メモ](./memo/) — Markdown対応のローカルメモアプリ
- [SNS Quick Launcher](./sns-launcher/) — 複数SNSアカウントをワンクリックで開くランチャー
- [Podcast Studio](./podcast-studio/) — 複数トラック録音・ミックス＆AI処理ができるポッドキャスト編集アプリ
- [My Tools](./tools/) — Threadsデモ・JSON保管庫（Supabaseでスマホ・PC間のデータ同期）

各アプリは独立したPWA（それぞれ専用のmanifest.json・Service Workerを持つ）です。
ホーム画面に追加する場合は、各アプリのURLを直接開いてから追加してください。
`tools/` はPWA化しておらず（常時オンライン前提のSupabase連携ツールのため）、通常のWebページとして動作します。利用にはSupabaseプロジェクトのセットアップが必要です（[tools/README.md](./tools/README.md)参照）。
