"""Discord メッセージ要約ボットのエントリーポイント"""
import logging
from dotenv import load_dotenv

load_dotenv()  # .env ファイルを読み込む

from discord_summarizer.config import load_config
from discord_summarizer.bot import create_bot

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)


def main():
    config = load_config()
    bot = create_bot(config)
    bot.run(config.discord_token)


if __name__ == "__main__":
    main()
