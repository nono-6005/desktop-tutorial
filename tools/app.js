const STORAGE_KEY = "tools_records";

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAll(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function generateId() {
  if (window.crypto?.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function listRecords(type = null) {
  const records = loadAll();
  const filtered = type ? records.filter(r => r.type === type) : records;
  return filtered
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export async function createRecord({
  type,
  title = "",
  content = "",
  data = {}
}) {
  const records = loadAll();
  const now = new Date().toISOString();

  const record = {
    id: generateId(),
    type,
    title,
    content,
    data,
    created_at: now,
    updated_at: now
  };

  records.push(record);
  saveAll(records);
  return record;
}

export async function deleteRecord(id) {
  const records = loadAll().filter(r => r.id !== id);
  saveAll(records);
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
