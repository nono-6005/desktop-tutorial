# My Tools

個人用HTMLツール集。データはこのブラウザのlocalStorageにのみ保存される（端末間の同期はなし）。

## 使用技術

- HTML
- CSS
- JavaScript
- GitHub Pages
- localStorage

## 収録ツール

- [Threadsデモ](./threads.html) — 投稿・ツリー投稿の表示確認
- [JSON保管庫](./json-storage.html) — JSONデータの保存・バックアップ・復元

両ツールとも `app.js` を共有し、ブラウザのlocalStorageにデータを保存する。ログイン不要。

## 制約

- **端末間の同期はない。** PCで保存したデータはPCのブラウザにのみ残り、スマホには表示されない。
- ブラウザのサイトデータ（キャッシュ・Cookie等）を消すとデータも消える。
- バックアップ・移行には各ツールの「JSON書き出し / Export」「Import」機能を使う。

## セットアップ

不要。GitHub Pagesにデプロイされていればそのまま使える。
