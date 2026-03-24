# Discord メッセージ要約ボット

Discord チャンネルの最近のメッセージを Claude AI を使って自動要約するボットです。

## 機能

- `/summarize [count]` スラッシュコマンドでチャンネルの直近メッセージを要約
- `!summarize [count]` プレフィックスコマンドにも対応
- 要約件数を指定可能（デフォルト: 50件、最大: 200件）
- ボットのメッセージは除外して要約
- Embed 形式で見やすく出力

## セットアップ

### 1. 依存パッケージをインストール

```bash
pip install -r requirements.txt
```

### 2. 環境変数を設定

`.env.example` をコピーして `.env` を作成し、各値を設定します。

```bash
cp .env.example .env
```

`.env` を編集:

```
DISCORD_BOT_TOKEN=your_discord_bot_token_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 3. Discord Developer Portal での設定

1. [Discord Developer Portal](https://discord.com/developers/applications) でアプリケーションを作成
2. **Bot** ページでトークンを取得
3. **Privileged Gateway Intents** の `MESSAGE CONTENT INTENT` を有効化
4. **OAuth2 > URL Generator** でスコープ `bot` と `applications.commands` を選択し、ボットをサーバーに招待

### 4. ボットを起動

```bash
cd discord_summarizer
python bot.py
```

## 使い方

| コマンド | 説明 |
|---|---|
| `/summarize` | 直近50件のメッセージを要約 |
| `/summarize 100` | 直近100件のメッセージを要約 |
| `!summarize` | 直近50件のメッセージを要約（プレフィックス） |
| `!summarize 100` | 直近100件のメッセージを要約（プレフィックス） |

## ファイル構成

```
discord_summarizer/
├── bot.py          # Discord ボット本体
└── summarizer.py   # Claude API による要約処理
requirements.txt    # 依存パッケージ
.env.example        # 環境変数サンプル
```
