import anthropic
from .config import Config


class Summarizer:
    def __init__(self, config: Config):
        self.config = config
        self.client = anthropic.AsyncAnthropic(api_key=config.anthropic_api_key)

    async def summarize(self, messages: list[dict]) -> str:
        """
        メッセージリストを受け取り、Claude API を使って日本語で要約を返す。

        Parameters
        ----------
        messages : list[dict]
            [{'author': str, 'content': str}, ...] の形式のメッセージリスト

        Returns
        -------
        str
            要約テキスト
        """
        formatted = "\n".join(
            f"{m['author']}: {m['content']}" for m in messages if m["content"].strip()
        )

        if not formatted:
            return "要約できる内容がありませんでした。"

        response = await self.client.messages.create(
            model=self.config.summarize_model,
            max_tokens=self.config.max_tokens,
            system=(
                "あなたはDiscordチャンネルのメッセージを要約するアシスタントです。"
                "会話の流れ、主なトピック、重要な決定事項や情報を簡潔にまとめてください。"
                "箇条書きを使って見やすくまとめ、日本語で回答してください。"
            ),
            messages=[
                {
                    "role": "user",
                    "content": f"以下のDiscordチャンネルのメッセージを要約してください:\n\n{formatted}",
                }
            ],
        )

        return response.content[0].text
