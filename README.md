# Discord メッセージ要約ボット

Discord チャンネルの最近のメッセージを **Claude AI** を使って自動要約するボットです。

## 機能

- `/summarize [count]` — スラッシュコマンドで要約
- `!summarize [count]` — プレフィックスコマンドで要約
- 件数指定可能（デフォルト: 50件、最大: 200件）
- ボットのメッセージを自動除外
- Embed 形式で見やすく出力
- Docker で簡単に起動

## セットアップ

### 1. リポジトリをクローン

```bash
git clone <repo-url>
cd desktop-tutorial
```

### 2. 環境変数を設定

```bash
cp .env.example .env
```

`.env` を編集して以下の値を設定します：

```
DISCORD_BOT_TOKEN=your_discord_bot_token_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

#### 各キーの取得方法

**DISCORD_BOT_TOKEN**
1. [Discord Developer Portal](https://discord.com/developers/applications) でアプリを作成
2. **Bot** ページでトークンをコピー
3. **Privileged Gateway Intents** の `MESSAGE CONTENT INTENT` を有効化
4. **OAuth2 → URL Generator** でスコープ `bot` + `applications.commands` を選択してサーバーに招待

**ANTHROPIC_API_KEY**
1. [Anthropic Console](https://console.anthropic.com) でAPIキーを作成

---

## 起動方法

### Docker（推奨）

```bash
docker compose up -d
```

### Python 直接実行

```bash
pip install -r requirements.txt
python main.py
```

---

## 使い方

| コマンド | 説明 |
|---|---|
| `/summarize` | 直近50件のメッセージを要約 |
| `/summarize 100` | 直近100件のメッセージを要約 |
| `!summarize` | 直近50件を要約（プレフィックス） |
| `!summarize 100` | 直近100件を要約（プレフィックス） |

## ファイル構成

```
.
├── main.py                        # エントリーポイント
├── discord_summarizer/
│   ├── __init__.py
│   ├── config.py                  # 設定管理
│   ├── bot.py                     # Discord ボット本体
│   └── summarizer.py              # Claude API による要約処理
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── .env.example
```
