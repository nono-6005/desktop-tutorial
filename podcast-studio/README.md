# Podcast Studio

マイク録音・複数トラック編集・ミックス再生・WAV書き出しができる、ローカル完結のポッドキャスト編集PWA。

## 概要

- 単一HTMLファイル（`index.html`）で完結（ビルド不要・依存ライブラリなし）
- Web Audio API による録音・トラックミックス・WAV書き出し
- オフライン対応（Service Worker）
- PWA（ホーム画面追加可・scope: `/podcast-studio/`）

## 現在の機能

- マイク録音（1回の録音＝1トラックとして追加、複数トラック対応）
- トラックごとの音量調整（0〜100%）・単体試聴・削除
- 全トラックの同時ミックス再生（OfflineAudioContext）
- タイトル・説明・カバー画像のメタデータ入力
- ミックス音声のWAVダウンロード
- 番組情報（タイトル・説明）のテキスト保存

## AI機能について

元の配布物（React版）には Claude API を使った音声→タイトル/説明の自動生成機能が含まれていたが、
GitHub Pages（公開・サーバーなし）ではAPIキーを安全に秘匿できないため**意図的に除外**している。
このアプリは外部への通信を一切行わず、すべて端末内で完結する。

## 技術構成

- Vanilla JavaScript / HTML5 / CSS3（フレームワークなし）
- Web Audio API（MediaRecorder・OfflineAudioContext・AudioBuffer）
- Service Worker（ネットワーク優先・オフラインフォールバック）

## ファイル構成

```
podcast-studio/
├── index.html      -- 全機能を含む単一ファイル（HTML+CSS+JS）
├── manual.html     -- 取扱説明書
├── manifest.json   -- PWA 設定（scope: /podcast-studio/）
├── sw.js           -- Service Worker
└── icons/icon.svg  -- アプリアイコン
```

## セキュリティについて

- **サーバーなし・データ送信なし**: 録音音声・番組情報・カバー画像は端末内でのみ処理され、外部に送信されない
- **保存されない**: 録音データはページを閉じると消える。残す場合はWAVでダウンロードする
- **通信処理なし**: 解析/広告/トラッキングのスクリプトは無く、コード上に `fetch`/`XMLHttpRequest` 等の通信処理が存在しない

## 動作要件

- マイク付きの端末
- HTTPS 環境（GitHub Pages・localhost など。`file://` では録音不可）
- Web Audio API 対応ブラウザ（Chrome / Firefox / Safari / Edge の最新版）

## デプロイ

`main` ブランチに置くと GitHub Pages で自動公開される。
公開URL: `https://nono-6005.github.io/desktop-tutorial/podcast-studio/`
