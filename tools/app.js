import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

export async function signInWithEmail(email) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin + window.location.pathname
    }
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function listRecords(type = null) {
  let query = supabase
    .from("records")
    .select("*")
    .order("created_at", { ascending: false });

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createRecord({
  type,
  title = "",
  content = "",
  data = {}
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("ログインが必要です");

  const { data: created, error } = await supabase
    .from("records")
    .insert({
      user_id: user.id,
      type,
      title,
      content,
      data
    })
    .select()
    .single();

  if (error) throw error;
  return created;
}

export async function updateRecord(id, patch) {
  const { data, error } = await supabase
    .from("records")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteRecord(id) {
  const { error } = await supabase
    .from("records")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export function downloadJson(filename, value) {
  const blob = new Blob(
    [JSON.stringify(value, null, 2)],
    { type: "application/json;charset=utf-8" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result));
      } catch (error) {
        reject(new Error("JSONの形式が不正です"));
      }
    };

    reader.onerror = reject;
    reader.readAsText(file, "utf-8");
  });
}
