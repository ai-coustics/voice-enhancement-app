export async function mixToWav(original: AudioBuffer, enhanced: AudioBuffer, mixRatio: number) {
  const mixed = await mix(original, enhanced, mixRatio);
  const interleaved = interleave(mixed);
  const blob = writeWav(interleaved, mixed.numberOfChannels, mixed.sampleRate);
  const url = URL.createObjectURL(blob);
  return url;
}

// --- Helpers ---

async function mix(original: AudioBuffer, enhanced: AudioBuffer, mix: number) {
  mix = Math.max(0, Math.min(mix, 1));

  const ctx = new OfflineAudioContext({
    numberOfChannels: 2,
    length: Math.max(original.length, enhanced.length),
    sampleRate: enhanced.sampleRate
  });

  const sourceNodes = [ctx.createBufferSource(), ctx.createBufferSource()];
  sourceNodes[0].buffer = original;
  sourceNodes[1].buffer = enhanced;

  const gainNodes = [ctx.createGain(), ctx.createGain()];
  gainNodes[0].gain.value = 1 - mix;
  gainNodes[1].gain.value = mix;

  for (let i = 0; i < sourceNodes.length; ++i) {
    sourceNodes[i].connect(gainNodes[i]).connect(ctx.destination);
    sourceNodes[i].start();
  }

  const mixed = await ctx.startRendering();
  return mixed;
}

function interleave(buffer: AudioBuffer): Float32Array {
  if (buffer.numberOfChannels === 1) {
    return buffer.getChannelData(0);
  }

  const channels = [];
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }
  const length = channels.reduce((prev, channelData) => prev + channelData.length, 0);
  const interleaved = new Float32Array(length);

  let interleavedIndex = 0;
  let channelIndex = 0;
  while (interleavedIndex < length) {
    channels.forEach((channelData) => {
      interleaved[interleavedIndex++] = channelData[channelIndex];
    });
    channelIndex++;
  }

  return interleaved;
}

function writeWav(buffer: Float32Array, numChannels: number, sampleRate: number) {
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const sampleSize = numChannels * bytesPerSample;

  const fileHeaderSize = 8;
  const chunkHeaderSize = 36;
  const chunkDataSize = buffer.length * bytesPerSample;
  const chunkTotalSize = chunkHeaderSize + chunkDataSize;

  const arrayBuffer = new ArrayBuffer(fileHeaderSize + chunkTotalSize);
  const view = new DataView(arrayBuffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, chunkTotalSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * sampleSize, true);
  view.setUint16(32, sampleSize, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, chunkDataSize, true);

  let offset = fileHeaderSize + chunkHeaderSize;
  for (let i = 0; i < buffer.length; i++, offset += 2) {
    const val = Math.max(-1, Math.min(1, buffer[i]));
    view.setInt16(offset, val < 0 ? val * 0x8000 : val * 0x7fff, true);
  }

  const blob = new Blob([view], { type: "audio/wav" });
  return blob;
}

function writeString(view: DataView, offset: number, header: string) {
  for (let i = 0; i < header.length; i++) {
    view.setUint8(offset + i, header.charCodeAt(i));
  }
}
