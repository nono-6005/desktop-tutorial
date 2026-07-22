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

## セキュリティについて

- **サーバーなし・データ送信なし**: このアプリはサーバーを持たず、登録したアカウント情報（プラットフォーム・URL/ユーザー名・表示名・説明・グループ）は外部に送信されません。すべて端末のブラウザ内（LocalStorage）にのみ保存されます。
- **暗号化なし**: 保存データは暗号化されていません。同じ端末・同じブラウザプロファイルにアクセスできる人は内容を閲覧できます。登録するのは公開SNSアカウントのURL/ユーザー名程度を想定しており、パスワードなど機密情報は保存しないでください。
- **端末間の同期なし**: LocalStorageのみで保存するため、ブラウザのサイトデータを消去すると復元できません。別端末とは自動で同期されません。
- **XSS対策**: アカウントの表示名・説明・URLを画面に表示する際はエスケープ処理（`title`属性は`&quot;`エスケープ、本文表示はテンプレート内でHTML特殊文字が実行されない形で挿入）を行っています。信頼できない相手から共有されたURL/説明文をそのまま登録する場合は内容を確認してください。
- **リンク遷移時の注意**: 「開く」操作は登録されたURLへ`window.location.href`で直接遷移します。URLの入力・編集は自分で行う想定のため、他人が管理画面を操作できる環境では悪意あるURLを登録されないよう注意してください。
- **開発元へのデータ送信もなし**: 解析・広告・トラッキングの類のスクリプトは組み込んでおらず、コード上 `fetch`/`XMLHttpRequest` などの通信処理自体が存在しません。GitHub Pages上の静的ファイルのみで動作するため、開発元を含め誰にもデータは送信されません。「開く」操作で移動するのは登録した各SNSサービス自体のページのみです。
