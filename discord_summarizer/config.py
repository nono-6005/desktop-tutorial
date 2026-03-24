import os
from dataclasses import dataclass


@dataclass
class Config:
    discord_token: str
    anthropic_api_key: str
    command_prefix: str = "!"
    default_message_count: int = 50
    max_message_count: int = 200
    summarize_model: str = "claude-sonnet-4-6"
    max_tokens: int = 1024


def load_config() -> Config:
    token = os.getenv("DISCORD_BOT_TOKEN")
    api_key = os.getenv("ANTHROPIC_API_KEY")

    if not token:
        raise ValueError("環境変数 DISCORD_BOT_TOKEN が設定されていません")
    if not api_key:
        raise ValueError("環境変数 ANTHROPIC_API_KEY が設定されていません")

    return Config(
        discord_token=token,
        anthropic_api_key=api_key,
        command_prefix=os.getenv("COMMAND_PREFIX", "!"),
        default_message_count=int(os.getenv("DEFAULT_MESSAGE_COUNT", "50")),
        max_message_count=int(os.getenv("MAX_MESSAGE_COUNT", "200")),
        summarize_model=os.getenv("SUMMARIZE_MODEL", "claude-sonnet-4-6"),
        max_tokens=int(os.getenv("MAX_TOKENS", "1024")),
    )
