import type { Track } from '@/types';

// In-memory cache for generated track audio URLs
const generatedAudioCache = new Map<string, string>();

/**
 * Returns pre-generated audio URL synchronously from memory if already computed.
 */
export function getGeneratedTrackAudioSync(track: Track): string | null {
  const cacheKey = `${track.id}_${track.genre}`;
  return generatedAudioCache.get(cacheKey) || null;
}

/**
 * Converts an AudioBuffer into a standard 16-bit PCM WAV Blob.
 */
function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = buffer.length * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;
  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // RIFF Chunk Descriptor
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');

  // fmt sub-chunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);

  // data sub-chunk
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // Interleave channels
  const channelData: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channelData.push(buffer.getChannelData(c));
  }

  let offset = 44;
  const length = buffer.length;
  for (let i = 0; i < length; i++) {
    for (let c = 0; c < numChannels; c++) {
      const sample = Math.max(-1, Math.min(1, channelData[c][i]));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

/**
 * Deterministically generates musical audio for any track using OfflineAudioContext.
 * Produces smooth musical synth harmony, 808 sub bass, and hi-hats.
 */
export async function generateTrackAudio(track: Track): Promise<string> {
  if (typeof window === 'undefined') return '';

  const cacheKey = `${track.id}_${track.genre}`;
  if (generatedAudioCache.has(cacheKey)) {
    return generatedAudioCache.get(cacheKey)!;
  }

  // Derive deterministic parameters from track title and ID
  let hash = 0;
  const seedString = `${track.id}_${track.title}_${track.genre}`;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);

  // Musical scales
  const minorScaleRoots = [130.81, 146.83, 164.81, 174.61, 196.0, 220.0, 246.94]; // C3 to B3
  const rootFreq = minorScaleRoots[seed % minorScaleRoots.length];

  // Minor pentatonic ratios
  const intervals = [1, 1.2, 1.333, 1.5, 1.778, 2];

  // Generate 20-second musical preview loop
  const previewDuration = Math.min(track.duration || 30, 20);
  const sampleRate = 44100;
  const offlineCtx = new (window.OfflineAudioContext || (window as unknown as { webkitOfflineAudioContext: typeof OfflineAudioContext }).webkitOfflineAudioContext)(
    2,
    Math.floor(sampleRate * previewDuration),
    sampleRate
  );

  // Master bus
  const masterGain = offlineCtx.createGain();
  masterGain.gain.setValueAtTime(0.7, 0);
  masterGain.connect(offlineCtx.destination);

  // BPM calculation
  const bpms = [120, 128, 140, 95, 110, 132];
  const bpm = track.bpm || bpms[seed % bpms.length];
  const secondsPerBeat = 60 / bpm;

  // 1. Bassline synth (808 / Sub)
  const bassNotes = [1, 0.8, 1.2, 1, 1.333, 0.8];
  let curTime = 0;
  let beatIndex = 0;

  while (curTime < previewDuration) {
    const bassOsc = offlineCtx.createOscillator();
    const bassGain = offlineCtx.createGain();

    const freqMultiplier = bassNotes[beatIndex % bassNotes.length];
    const bassFreq = (rootFreq / 2) * freqMultiplier;

    bassOsc.type = 'triangle';
    bassOsc.frequency.setValueAtTime(bassFreq, curTime);
    // Pitch envelope drop
    bassOsc.frequency.exponentialRampToValueAtTime(Math.max(20, bassFreq * 0.85), curTime + 0.3);

    bassGain.gain.setValueAtTime(0.4, curTime);
    bassGain.gain.exponentialRampToValueAtTime(0.001, curTime + secondsPerBeat * 1.8);

    bassOsc.connect(bassGain);
    bassGain.connect(masterGain);

    bassOsc.start(curTime);
    bassOsc.stop(curTime + secondsPerBeat * 2);

    curTime += secondsPerBeat * 2;
    beatIndex++;
  }

  // 2. Chords & Lead melody
  curTime = 0;
  beatIndex = 0;

  while (curTime < previewDuration) {
    const leadOsc = offlineCtx.createOscillator();
    const leadGain = offlineCtx.createGain();

    const noteIdx = (seed + beatIndex * 3) % intervals.length;
    const leadFreq = rootFreq * intervals[noteIdx] * (beatIndex % 4 === 3 ? 2 : 1);

    leadOsc.type = (seed + beatIndex) % 2 === 0 ? 'sine' : 'sawtooth';
    leadOsc.frequency.setValueAtTime(leadFreq, curTime);

    leadGain.gain.setValueAtTime(0.12, curTime);
    leadGain.gain.exponentialRampToValueAtTime(0.001, curTime + secondsPerBeat * 0.9);

    leadOsc.connect(leadGain);
    leadGain.connect(masterGain);

    leadOsc.start(curTime);
    leadOsc.stop(curTime + secondsPerBeat);

    curTime += secondsPerBeat;
    beatIndex++;
  }

  // 3. Crisp Hi-hats
  curTime = 0;
  const hatStep = secondsPerBeat / 2;

  while (curTime < previewDuration) {
    const hatLen = Math.floor(sampleRate * 0.05);
    const hatBuffer = offlineCtx.createBuffer(1, hatLen, sampleRate);
    const data = hatBuffer.getChannelData(0);
    for (let i = 0; i < hatLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.015));
    }

    const hatSource = offlineCtx.createBufferSource();
    hatSource.buffer = hatBuffer;

    const hatFilter = offlineCtx.createBiquadFilter();
    hatFilter.type = 'highpass';
    hatFilter.frequency.value = 7500;

    const hatGain = offlineCtx.createGain();
    hatGain.gain.setValueAtTime(0.08, curTime);

    hatSource.connect(hatFilter);
    hatFilter.connect(hatGain);
    hatGain.connect(masterGain);

    hatSource.start(curTime);
    curTime += hatStep;
  }

  // Render synthesized audio buffer
  const renderedBuffer = await offlineCtx.startRendering();
  const wavBlob = audioBufferToWavBlob(renderedBuffer);
  const audioUrl = URL.createObjectURL(wavBlob);

  generatedAudioCache.set(cacheKey, audioUrl);
  return audioUrl;
}
