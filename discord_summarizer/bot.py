import logging
import discord
from discord.ext import commands
from discord import app_commands
from .config import Config
from .summarizer import Summarizer

logger = logging.getLogger(__name__)


def create_bot(config: Config) -> commands.Bot:
    intents = discord.Intents.default()
    intents.message_content = True

    bot = commands.Bot(command_prefix=config.command_prefix, intents=intents)
    summarizer = Summarizer(config)

    @bot.event
    async def on_ready():
        logger.info(f"ログイン成功: {bot.user} (ID: {bot.user.id})")
        try:
            synced = await bot.tree.sync()
            logger.info(f"スラッシュコマンドを {len(synced)} 件同期しました")
        except Exception as e:
            logger.error(f"コマンド同期エラー: {e}")

    @bot.event
    async def on_command_error(ctx: commands.Context, error: commands.CommandError):
        if isinstance(error, commands.BadArgument):
            await ctx.reply("引数が正しくありません。数値を指定してください。例: `!summarize 100`")
        else:
            logger.error(f"コマンドエラー: {error}")
            await ctx.reply(f"エラーが発生しました: {error}")

    # --- スラッシュコマンド ---

    @bot.tree.command(name="summarize", description="このチャンネルの最近のメッセージを要約します")
    @app_commands.describe(count=f"要約するメッセージ数（デフォルト: {config.default_message_count}、最大: {config.max_message_count}）")
    async def slash_summarize(interaction: discord.Interaction, count: int = config.default_message_count):
        count = min(max(count, 1), config.max_message_count)
        await interaction.response.defer(thinking=True)

        try:
            messages = await _fetch_messages(interaction.channel, count)
            if not messages:
                await interaction.followup.send("要約できるメッセージが見つかりませんでした。")
                return

            summary = await summarizer.summarize(messages)
            embed = _build_embed(len(messages), summary, interaction.channel.name)
            await interaction.followup.send(embed=embed)
        except Exception as e:
            logger.error(f"要約エラー: {e}")
            await interaction.followup.send(f"要約中にエラーが発生しました: {e}")

    # --- プレフィックスコマンド ---

    @bot.command(name="summarize", help="チャンネルのメッセージを要約します。使い方: !summarize [件数]")
    async def prefix_summarize(ctx: commands.Context, count: int = config.default_message_count):
        count = min(max(count, 1), config.max_message_count)
        async with ctx.typing():
            try:
                messages = await _fetch_messages(ctx.channel, count, exclude_id=ctx.message.id)
                if not messages:
                    await ctx.reply("要約できるメッセージが見つかりませんでした。")
                    return

                summary = await summarizer.summarize(messages)
                embed = _build_embed(len(messages), summary, ctx.channel.name)
                await ctx.reply(embed=embed)
            except Exception as e:
                logger.error(f"要約エラー: {e}")
                await ctx.reply(f"要約中にエラーが発生しました: {e}")

    return bot


async def _fetch_messages(
    channel: discord.abc.Messageable,
    count: int,
    exclude_id: int | None = None,
) -> list[dict]:
    """チャンネルからボット以外のメッセージを取得して時系列順で返す。"""
    messages = []
    async for msg in channel.history(limit=count + (1 if exclude_id else 0)):
        if msg.author.bot:
            continue
        if exclude_id and msg.id == exclude_id:
            continue
        if msg.content.strip():
            messages.append({"author": msg.author.display_name, "content": msg.content})
    messages.reverse()
    return messages


def _build_embed(count: int, summary: str, channel_name: str) -> discord.Embed:
    embed = discord.Embed(
        title=f"直近 {count} 件のメッセージの要約",
        description=summary,
        color=discord.Color.blurple(),
    )
    embed.set_footer(text=f"チャンネル: #{channel_name}")
    return embed
