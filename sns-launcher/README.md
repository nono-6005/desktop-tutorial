# SNS Quick Launcher

複数のSNSアカウントをワンクリックで開けるシンプルなPWA/Webアプリ。

## 概要

- 単一HTMLファイル（`index.html`）で完結
- 外部ライブラリ・依存関係なし
- LocalStorageでデータ永続化（ブラウザ内保存）
- GitHub Pages デプロイ想定（`nono-6005/desktop-tutorial` リポジトリ）

## 現在の機能

- アカウント登録（プラットフォーム選択 + URL/ユーザー名 + 表示名 + 説明）
- ワンクリックでURLを新規タブで開く
- アカウント削除
- 対応プラットフォーム: Threads, X, Substack, Instagram, TikTok, YouTube, Bluesky, note
  - `urlPattern()` でユーザー名からURLを自動生成
  - `http(s)://` で始まるURLを直接入力することも可能
- 説明文をボタンにインライン表示 + ホバー時ツールチップ表示
- 保存時に画面下部へトースト通知（「保存しました」）

## データ構造（LocalStorage: `snsAccounts`）

```json
[
  {
    "id": 1,
    "platform": "threads",
    "url": "https://www.threads.net/@example",
    "displayName": "メイン垢",
    "description": "SNS戦略用アカウント"
  }
]
```

## ファイル構成

```
index.html   -- 全機能を含む単一ファイル（HTML+CSS+JS）
```

## 既知の制約

- LocalStorageのみでデータ保存（ブラウザ/端末をまたいだ同期なし）
- エクスポート/インポート機能は未実装（過去に検討したが現在は未搭載）
- SNS投稿の更新監視機能は実装を試みたが、CORS制限等により安定動作せず削除済み

## 今後の拡張候補（未着手）

- データのエクスポート/インポート（JSON）
- ドラッグ&ドロップでの並び替え
- PWA化（manifest.json + service worker でホーム画面追加対応）
- アイコンのカスタムアップロード対応

## デプロイ

GitHub Pages で公開する場合：

```bash
# nono-6005/desktop-tutorial リポジトリ内に配置
cp index.html /path/to/desktop-tutorial/sns-launcher/index.html
git add .
git commit -m "Add SNS quick launcher"
git push
```
