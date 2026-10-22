const SHEET_NAME = 'clips';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = parseBody_(e);
    const expected = PropertiesService.getScriptProperties().getProperty('TOKEN');
    if (!expected || body.token !== expected) {
      return json_({ ok: false, error: 'unauthorized' });
    }

    const url = normalizeUrl_(body.url);
    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    if (url && isDuplicate_(sheet, url)) {
      return json_({ ok: true, duplicate: true });
    }

    sheet.appendRow([new Date(), url, body.title || '', body.text || '', '', body.device || '']);
    return json_({ ok: true, duplicate: false });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function parseBody_(e) {
  try {
    return JSON.parse(e.postData.contents);
  } catch (_) {
    return e.parameter;
  }
}

function normalizeUrl_(raw) {
  return String(raw || '').trim()
    .replace(/#.*$/, '')
    .replace(/([?&])(utm_[^=&]*|fbclid|si)=[^&]*/g, '$1')
    .replace(/\?&/, '?')
    .replace(/[?&]$/, '')
    .replace(/\/$/, '');
}

function isDuplicate_(sheet, url) {
  const last = sheet.getLastRow();
  if (last < 2) return false;
  const urls = sheet.getRange(2, 2, last - 1, 1).getValues().flat();
  return urls.includes(url);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
