import os
import anthropic

client = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


async def summarize_messages(messages: list[dict]) -> str:
    """
    メッセージリストを受け取り、Claude API を使って要約を返す。

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

    response = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=(
            "あなたはDiscordチャンネルのメッセージを要約するアシスタントです。"
            "会話の流れ、主なトピック、重要な決定事項や情報を簡潔にまとめてください。"
            "日本語で回答してください。"
        ),
        messages=[
            {
                "role": "user",
                "content": f"以下のDiscordチャンネルのメッセージを要約してください:\n\n{formatted}",
            }
        ],
    )

    return response.content[0].text
