# Threadsデモ

投稿・ツリー投稿の表示確認用ツール。データはこのブラウザのlocalStorageにのみ保存される（端末間の同期はなし）。

## 使用技術

- HTML
- CSS
- JavaScript
- GitHub Pages
- localStorage

## 機能

- 投稿の作成・保存・編集・削除
- ツリー投稿（返信の追加）
- TLリセット（全削除）
- JSON書き出し（バックアップ用・ChatGPT/Claude.aiなどのAIチャットに貼り付けて読ませる用）

`app.js` に localStorage CRUDヘルパーをまとめている。ログイン不要。

## 使い方（AIに投稿を読ませる）

投稿データをChatGPTやClaude.aiなどのAIチャットに読ませたい場合：

1. https://nono-6005.github.io/desktop-tutorial/tools/ を開く
2. 「JSON書き出し（AI用）」ボタンをクリック
3. `threads-backup.json` がダウンロードされる（スマホなら「ダウンロード」フォルダに入る）
4. ダウンロードしたファイルを開き、中身のテキストを全部コピー
5. ChatGPTやClaude.aiのチャット欄に貼り付けて質問する（例：「これは私の投稿記録です。要約して」）

書き出されるJSONは投稿ごとに `content`（本文）・`data.tree`（ツリー返信）・`created_at`（投稿日時）などを含む配列。

## 制約

- **端末間の同期はない。** PCで保存したデータはPCのブラウザにのみ残り、スマホには表示されない。
- ブラウザのサイトデータ（キャッシュ・Cookie等）を消すとデータも消える。バックアップには「JSON書き出し」機能を使う。

## セットアップ

不要。GitHub Pagesにデプロイされていればそのまま使える。
