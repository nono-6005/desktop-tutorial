import os
import discord
from discord.ext import commands
from discord import app_commands
from summarizer import summarize_messages

intents = discord.Intents.default()
intents.message_content = True

bot = commands.Bot(command_prefix="!", intents=intents)


@bot.event
async def on_ready():
    print(f"ログイン成功: {bot.user} (ID: {bot.user.id})")
    try:
        synced = await bot.tree.sync()
        print(f"スラッシュコマンドを {len(synced)} 件同期しました")
    except Exception as e:
        print(f"コマンド同期エラー: {e}")


@bot.tree.command(name="summarize", description="このチャンネルの最近のメッセージを要約します")
@app_commands.describe(count="要約するメッセージ数（デフォルト: 50、最大: 200）")
async def summarize(interaction: discord.Interaction, count: int = 50):
    """チャンネルの最近のメッセージを要約するスラッシュコマンド"""
    count = min(max(count, 1), 200)
    await interaction.response.defer(thinking=True)

    messages = []
    async for msg in interaction.channel.history(limit=count):
        if not msg.author.bot:
            messages.append({"author": msg.author.display_name, "content": msg.content})

    messages.reverse()

    if not messages:
        await interaction.followup.send("要約できるメッセージが見つかりませんでした。")
        return

    summary = await summarize_messages(messages)

    embed = discord.Embed(
        title=f"直近 {len(messages)} 件のメッセージの要約",
        description=summary,
        color=discord.Color.blurple(),
    )
    embed.set_footer(text=f"チャンネル: #{interaction.channel.name}")
    await interaction.followup.send(embed=embed)


@bot.command(name="summarize")
async def summarize_prefix(ctx: commands.Context, count: int = 50):
    """!summarize コマンドで要約（プレフィックスコマンド）"""
    count = min(max(count, 1), 200)
    async with ctx.typing():
        messages = []
        async for msg in ctx.channel.history(limit=count + 1):
            if not msg.author.bot and msg.id != ctx.message.id:
                messages.append({"author": msg.author.display_name, "content": msg.content})

        messages.reverse()

        if not messages:
            await ctx.reply("要約できるメッセージが見つかりませんでした。")
            return

        summary = await summarize_messages(messages)

        embed = discord.Embed(
            title=f"直近 {len(messages)} 件のメッセージの要約",
            description=summary,
            color=discord.Color.blurple(),
        )
        embed.set_footer(text=f"チャンネル: #{ctx.channel.name}")
        await ctx.reply(embed=embed)


if __name__ == "__main__":
    token = os.getenv("DISCORD_BOT_TOKEN")
    if not token:
        raise ValueError("環境変数 DISCORD_BOT_TOKEN が設定されていません")
    bot.run(token)
