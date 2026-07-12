# memo-pwa スキル実装ガイド

このスキルは PWA メモアプリを自動生成・デプロイするものです。

## 実装内容

### ファイル構成

```
.claude/skills/
├── memo-pwa.md                 # スキル定義
├── IMPLEMENTATION.md           # このファイル
└── templates/
    ├── manifest.json           # PWA マニフェスト
    ├── sw.js                   # Service Worker
    └── README.md               # セットアップガイド
```

### スキル定義（memo-pwa.md）

Claude Code がこのファイルを読み込むことで、`/memo-pwa` コマンドが使用可能になります。

パラメータ：
- `--app-name` - アプリ名
- `--theme-color` - テーマカラー

### テンプレートファイル

テンプレートには以下の変数が使用できます：

**manifest.json**
- `{{APP_NAME}}` - アプリ正式名
- `{{APP_SHORT_NAME}}` - ショート名（ホーム画面）
- `{{APP_DESCRIPTION}}` - 説明文
- `{{THEME_COLOR}}` - 16進色コード

**sw.js**
- `{{APP_SLUG}}` - キャッシュ名用スラッグ（例: memo-app）

**README.md**
- `{{APP_NAME}}` - アプリ名
- `{{APP_DESCRIPTION}}` - 説明文
- `{{REPO_OWNER}}` - GitHub ユーザー名
- `{{REPO_NAME}}` - リポジトリ名

### 実行フロー

1. ユーザーが `/memo-pwa` を実行
2. Claude が memo-pwa.md を読み込む
3. パラメータをユーザーに確認
4. templates/ から各ファイルをテンプレート処理
5. index.html（既存）+ テンプレート処理済みファイルを生成
6. Git にコミット
7. GitHub Pages 設定の案内を表示

### index.html について

index.html は手動で作成・カスタマイズします。以下の機能が必要：

- メモのリスト表示
- エディタビュー（タイトル + Markdown エディタ）
- IndexedDB 操作
- ダウンロード機能（Blob ベース）
- スタイルと UI

## 他のプロジェクトでの使用方法

### 新規プロジェクト

```bash
cd my-new-project
/memo-pwa --app-name "My App" --theme-color "#FF5733"
```

### 既存プロジェクト

```bash
cd existing-project
/memo-pwa
# ファイルが上書きされるので注意
```

## カスタマイズ方法

### テンプレートを編集

`.claude/skills/templates/` 内のファイルを編集すると、今後のスキル実行で新しい内容が使用されます。

### index.html の機能追加

index.html は Claude Code により手動で修正できます：

```bash
# スキル実行後に、手動で機能追加
# 例：タグ機能、検索機能、エクスポート形式追加など
```

## トラブルシューティング

### スキルが見つからない

- `.claude/skills/memo-pwa.md` が存在するか確認
- ファイル名に typo がないか確認
- Claude Code を再起動

### テンプレート変数が置換されない

- 変数名を確認（大文字・中括弧を含める）
- テンプレートファイルが `.claude/skills/templates/` にあるか確認

### GitHub Pages にデプロイされない

- リポジトリ設定でページが有効か確認
- main ブランチに全ファイルがコミットされているか確認
- キャッシュクリア後に再度アクセス

## 拡張アイデア

- [ ] 複数の UI テーマ（ライト/ダーク）
- [ ] タグ・カテゴリ機能
- [ ] JSON エクスポート（全メモ一括）
- [ ] モーダルやダイアログ UI
- [ ] データバックアップ（Google Drive/OneDrive 連携）
- [ ] リッチテキスト編集（Markdown+ HTMLサポート）
