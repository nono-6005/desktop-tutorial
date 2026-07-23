import React, { useState, useRef, useEffect } from 'react';
import { Mic, Play, Pause, Download, Trash2, Settings, Loader } from 'lucide-react';

export default function PodcastApp() {
  const [tracks, setTracks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [apiKey, setApiKey] = useState(localStorage.getItem('claudeApiKey') || '');
  const [showSettings, setShowSettings] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedDesc, setGeneratedDesc] = useState('');

  const mediaRecorder = useRef(null);
  const audioContext = useRef(null);

  useEffect(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, []);

  // 録音開始
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;

      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const arrayBuffer = await blob.arrayBuffer();
        const decoded = await audioContext.current.decodeAudioData(arrayBuffer);

        const newTrack = {
          id: Date.now(),
          buffer: decoded,
          volume: 1,
          startTime: 0,
          duration: decoded.duration,
        };

        setTracks((prev) => [...prev, newTrack]);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('マイクアクセスエラー: ' + err.message);
    }
  };

  // 録音停止
  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  // 再生（全トラックミックス）
  const playAllTracks = async () => {
    if (tracks.length === 0) return;

    const offlineContext = new OfflineAudioContext(
      2,
      audioContext.current.sampleRate * Math.max(...tracks.map((t) => t.duration)),
      audioContext.current.sampleRate
    );

    tracks.forEach((track) => {
      const source = offlineContext.createBufferSource();
      source.buffer = track.buffer;
      const gainNode = offlineContext.createGain();
      gainNode.gain.value = track.volume;
      source.connect(gainNode);
      gainNode.connect(offlineContext.destination);
      source.start(track.startTime);
    });

    const renderedBuffer = await offlineContext.startRendering();

    const source = audioContext.current.createBufferSource();
    source.buffer = renderedBuffer;
    source.connect(audioContext.current.destination);
    source.start();

    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), renderedBuffer.duration * 1000);
  };

  // AI処理（タイトル・説明文の自動生成）
  //
  // 注意: Claude API は現時点で音声入力（音声の書き起こし・聴解）に対応していない。
  // このリクエストはブラウザから直接 api.anthropic.com を叩く構成のため、CORS で
  // ブロックされる可能性が高い。動作しない場合はエラーメッセージが表示されるのみで
  // アプリ自体は継続利用できる（README の「実装予定」を参照）。
  const processWithAI = async () => {
    if (!apiKey) {
      alert('Claude APIキーを設定してください');
      setShowSettings(true);
      return;
    }

    if (tracks.length === 0) {
      alert('録音がありません');
      return;
    }

    setAiProcessing(true);

    try {
      const offlineContext = new OfflineAudioContext(
        1,
        audioContext.current.sampleRate * tracks[0].duration,
        audioContext.current.sampleRate
      );

      const source = offlineContext.createBufferSource();
      source.buffer = tracks[0].buffer;
      source.connect(offlineContext.destination);
      source.start(0);

      const renderedBuffer = await offlineContext.startRendering();
      const wavBlob = audioBufferToWav(renderedBuffer);
      const base64Audio = await blobToBase64(wavBlob);

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-5',
          max_tokens: 500,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'この音声ファイルを聴いて、以下を日本語で提供してください:\n1. ポッドキャストのタイトル（1行）\n2. 説明文（3行程度）\n形式: タイトル:\n説明:',
                },
                {
                  type: 'document',
                  source: {
                    type: 'base64',
                    media_type: 'audio/wav',
                    data: base64Audio.split(',')[1],
                  },
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const result = data.content[0].text;

      const titleMatch = result.match(/タイトル[:\s]+(.+)/);
      const descMatch = result.match(/説明[:\s]+([\s\S]+)/);

      setGeneratedTitle(titleMatch ? titleMatch[1].trim() : '');
      setGeneratedDesc(descMatch ? descMatch[1].trim() : '');
    } catch (err) {
      alert('AI処理エラー: ' + err.message);
    } finally {
      setAiProcessing(false);
    }
  };

  // 音量調整
  const updateTrackVolume = (id, volume) => {
    setTracks((prev) => prev.map((t) => (t.id === id ? { ...t, volume } : t)));
  };

  // トラック削除
  const deleteTrack = (id) => {
    setTracks((prev) => prev.filter((t) => t.id !== id));
  };

  // 画像アップロード
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setCoverImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  // API設定保存
  const saveApiKey = () => {
    localStorage.setItem('claudeApiKey', apiKey);
    setShowSettings(false);
  };

  // WAV形式に変換
  const audioBufferToWav = (buffer) => {
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1;
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numberOfChannels * bytesPerSample;

    const channelData = [];
    for (let i = 0; i < numberOfChannels; i++) {
      channelData.push(buffer.getChannelData(i));
    }

    const interleaved = new Float32Array(buffer.length * numberOfChannels);
    let offset = 0;
    for (let i = 0; i < buffer.length; i++) {
      for (let j = 0; j < numberOfChannels; j++) {
        interleaved[offset++] = channelData[j][i];
      }
    }

    const dataLength = interleaved.length * bytesPerSample;
    const arrayBuffer = new ArrayBuffer(44 + dataLength);
    const view = new DataView(arrayBuffer);

    const writeString = (pos, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(pos + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, dataLength, true);

    let index = 44;
    for (let i = 0; i < interleaved.length; i++) {
      view.setInt16(index, interleaved[i] < 0 ? interleaved[i] * 0x8000 : interleaved[i] * 0x7fff, true);
      index += 2;
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  // WAVダウンロード（全トラックミックス）
  const downloadMix = async () => {
    if (tracks.length === 0) {
      alert('トラックがありません');
      return;
    }

    const offlineContext = new OfflineAudioContext(
      2,
      audioContext.current.sampleRate * Math.max(...tracks.map((t) => t.duration)),
      audioContext.current.sampleRate
    );

    tracks.forEach((track) => {
      const source = offlineContext.createBufferSource();
      source.buffer = track.buffer;
      const gainNode = offlineContext.createGain();
      gainNode.gain.value = track.volume;
      source.connect(gainNode);
      gainNode.connect(offlineContext.destination);
      source.start(track.startTime);
    });

    const renderedBuffer = await offlineContext.startRendering();
    const wavBlob = audioBufferToWav(renderedBuffer);

    const url = URL.createObjectURL(wavBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'podcast'}.wav`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">🎙️ Podcast Studio</h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            <Settings size={24} />
          </button>
        </div>

        {/* 設定パネル */}
        {showSettings && (
          <div className="bg-indigo-800 rounded-lg p-6 mb-6 text-white">
            <h2 className="text-xl font-bold mb-4">API設定</h2>
            <input
              type="password"
              placeholder="Claude APIキー"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-3 rounded bg-indigo-900 border border-indigo-600 text-white mb-4"
            />
            <button
              onClick={saveApiKey}
              className="w-full p-3 bg-green-600 hover:bg-green-700 rounded font-bold"
            >
              保存
            </button>
          </div>
        )}

        {/* メインエリア */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左側：録音・トラック管理 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 録音コントロール */}
            <div className="bg-indigo-800 rounded-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-4">録音</h2>
              <div className="flex gap-4">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="flex-1 p-4 bg-red-600 hover:bg-red-700 rounded-lg font-bold flex items-center justify-center gap-2"
                  >
                    <Mic size={20} /> 録音開始
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="flex-1 p-4 bg-orange-600 hover:bg-orange-700 rounded-lg font-bold"
                  >
                    停止
                  </button>
                )}
              </div>
            </div>

            {/* トラック一覧 */}
            <div className="bg-indigo-800 rounded-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-4">トラック ({tracks.length})</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {tracks.length === 0 ? (
                  <p className="text-indigo-300">トラックがありません</p>
                ) : (
                  tracks.map((track, idx) => (
                    <div key={track.id} className="bg-indigo-900 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-bold">トラック {idx + 1}</p>
                        <button
                          onClick={() => deleteTrack(track.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-indigo-300 mb-3">
                        {track.duration.toFixed(2)}秒
                      </p>
                      <div className="flex items-center gap-3">
                        <label className="text-sm">音量:</label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={track.volume}
                          onChange={(e) =>
                            updateTrackVolume(track.id, parseFloat(e.target.value))
                          }
                          className="flex-1"
                        />
                        <span className="text-sm w-12">{(track.volume * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 再生コントロール */}
            <div className="bg-indigo-800 rounded-lg p-6 text-white">
              <button
                onClick={playAllTracks}
                disabled={tracks.length === 0 || isPlaying}
                className="w-full p-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                {isPlaying ? '再生中...' : '再生'}
              </button>
            </div>
          </div>

          {/* 右側：メタデータ・AI処理 */}
          <div className="space-y-6">
            {/* メタデータ入力 */}
            <div className="bg-indigo-800 rounded-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-4">メタデータ</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">タイトル</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ポッドキャストのタイトル"
                    className="w-full p-3 rounded bg-indigo-900 border border-indigo-600 text-white"
                  />
                  {generatedTitle && (
                    <div className="mt-2 p-2 bg-green-900 rounded text-sm">
                      <p className="text-green-300">AI提案: {generatedTitle}</p>
                      <button
                        onClick={() => setTitle(generatedTitle)}
                        className="mt-1 text-xs bg-green-600 hover:bg-green-700 px-2 py-1 rounded"
                      >
                        採用
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">説明</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="説明文"
                    rows="3"
                    className="w-full p-3 rounded bg-indigo-900 border border-indigo-600 text-white"
                  />
                  {generatedDesc && (
                    <div className="mt-2 p-2 bg-green-900 rounded text-sm">
                      <p className="text-green-300 text-xs whitespace-pre-wrap">{generatedDesc}</p>
                      <button
                        onClick={() => setDescription(generatedDesc)}
                        className="mt-1 text-xs bg-green-600 hover:bg-green-700 px-2 py-1 rounded"
                      >
                        採用
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">カバー画像</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full p-2 bg-indigo-900 border border-indigo-600 rounded text-white"
                  />
                  {coverImage && (
                    <img src={coverImage} alt="cover" className="mt-3 w-full rounded" />
                  )}
                </div>
              </div>
            </div>

            {/* AI処理 */}
            <div className="bg-indigo-800 rounded-lg p-6 text-white">
              <button
                onClick={processWithAI}
                disabled={aiProcessing || tracks.length === 0}
                className="w-full p-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                {aiProcessing ? <Loader size={20} className="animate-spin" /> : '✨'}
                {aiProcessing ? '処理中...' : 'AI処理'}
              </button>
            </div>

            {/* ダウンロード */}
            <div className="bg-indigo-800 rounded-lg p-6 text-white">
              <button
                onClick={downloadMix}
                disabled={tracks.length === 0}
                className="w-full p-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                <Download size={20} />
                ダウンロード（WAV）
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
