# My Tools (Supabase連携ツール)

個人用HTMLツール集。Supabaseを共通データストアとして使い、スマホ・PCで同じデータを利用できる。

## 使用技術

- HTML
- CSS
- JavaScript
- GitHub Pages
- Supabase (Database / Auth)

## 収録ツール

- [Threadsデモ](./threads.html) — 投稿・ツリー投稿の表示確認
- [JSON保管庫](./json-storage.html) — JSONデータの保存・バックアップ・復元

両ツールとも `app.js` を共有し、Supabaseの `records` テーブルにデータを保存する。

## セットアップ

### 1. Supabaseプロジェクトを作成

https://supabase.com で新規プロジェクトを作成する。

### 2. テーブルとRLSを設定

Supabaseダッシュボードの **SQL Editor** で以下を実行する。

```sql
create table if not exists public.records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text default '',
  content text default '',
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.records enable row level security;

create policy "records_select_own"
on public.records
for select
using (auth.uid() = user_id);

create policy "records_insert_own"
on public.records
for insert
with check (auth.uid() = user_id);

create policy "records_update_own"
on public.records
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "records_delete_own"
on public.records
for delete
using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_records_updated_at on public.records;

create trigger set_records_updated_at
before update on public.records
for each row
execute function public.set_updated_at();
```

### 3. `app.js` に接続情報を設定

`tools/app.js` の先頭にある以下2行を、自分のSupabaseプロジェクトの値に置き換える。

```js
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
```

値はSupabaseダッシュボードの **Project Settings → API** で確認できる。

**`service_role` キーは絶対にこのファイル（ブラウザ側コード）に置かないこと。** `anon` キーのみを使う（公開されて問題ないキーで、RLSによってデータが保護される）。

### 4. Supabase AuthのRedirect URLを追加

Supabaseダッシュボードの **Authentication → URL Configuration** に、GitHub PagesのURL（例: `https://<your-username>.github.io/<repo>/tools/`）を追加する。Magic Linkのメール内リンクがこのURLに戻ってくる。

### 5. GitHubへPushしてPagesを有効化

変更をpushし、GitHub Pagesが有効化されていることを確認する（`main`ブランチ・`/(root)`ディレクトリ）。

## セキュリティ

- `service_role` キーをGitHubへ保存しない。
- RLSを無効にしない。
- `anon` キーはクライアント側に公開される前提の値だが、リポジトリはpublicになる点に留意する。

## 動作確認

Supabaseセットアップ完了後、以下を確認する。

- ログイン（Magic Link）→ 投稿作成・保存・削除・ツリー投稿・TLリセット・JSON Export
- JSON保管庫での保存・読み込み・削除・整形・Export・Import（日本語・絵文字・改行・長文を含む）
- PCで保存 → スマホで同じデータが見えるか（逆方向・削除の反映も含む）
