# SNS投稿分析 → Googleドライブ保存

ユーザーが「実行」と送信したとき、または `/analyze-sns` を呼び出したとき、直前に提供された画像を対象に以下の手順を自動で実行してください。

## 手順

1. **画像を分析**して【出力①】NotebookLM用Markdownと【出力②】GAS用JSオブジェクトを生成する
   - CLAUDE.md の分析軸・スコア基準・出力フォーマットにすべて従うこと

2. **今日の日付**を `YYYYMMDD` 形式で取得する（currentDate参照）

3. **ファイル名を決定する**
   - `analysis_YYYYMMDD_001.md`（2枚目以降は連番）
   - `posts_YYYYMMDD_001.js`（2枚目以降は連番）

4. **GASにPOSTしてGoogleドライブに保存する**

### mdファイルの送信
```bash
curl -L -s -X POST "https://script.google.com/macros/s/AKfycbzYhshb-k9cM1AIGnbQy-KG-lwNUt_WbVNh2wJpROSlsueb_yNXRrRhN98vmlIHf1g/exec" \
  -H "Content-Type: application/json" \
  -d "{\"folderId\":\"1bvfuZow4gYm_EJxf3xZICI8eBWSDQ9-Y\",\"filename\":\"analysis_YYYYMMDD_001.md\",\"content\":\"<出力①の内容（改行を\\nにエスケープ）>\"}"
```

### jsファイルの送信
```bash
curl -L -s -X POST "https://script.google.com/macros/s/AKfycbzYhshb-k9cM1AIGnbQy-KG-lwNUt_WbVNh2wJpROSlsueb_yNXRrRhN98vmlIHf1g/exec" \
  -H "Content-Type: application/json" \
  -d "{\"folderId\":\"1bvfuZow4gYm_EJxf3xZICI8eBWSDQ9-Y\",\"filename\":\"posts_YYYYMMDD_001.js\",\"content\":\"<出力②の内容（改行を\\nにエスケープ）>\"}"
```

5. **完了報告**
   - 成功：`✅ Googleドライブ保存完了`
     - `analysis_YYYYMMDD_001.md`
     - `posts_YYYYMMDD_001.js`
   - 失敗：`⚠️ GAS送信失敗` + エラー内容

## 注意事項
- 複数画像の場合は1枚ごとに連番で別ファイル送信
- hook は投稿1行目テキストを完全一致で抜き出す（要約・改変禁止）
- スコアは厳しめに採点（インフレ禁止）
- 既読本フレームワーク照合は全6冊すべて記載
