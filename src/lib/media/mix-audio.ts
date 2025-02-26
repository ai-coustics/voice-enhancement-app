import Crunker from 'crunker';

export async function mixToWav(original: AudioBuffer, enhanced: AudioBuffer, mix: number) {
  let mixed: AudioBuffer;

  if (mix > 0.999) {
    mixed = enhanced;
  } else {
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

    mixed = await ctx.startRendering();
  }

  const objectUrl = createWavObjectUrl(mixed);
  return objectUrl;
}

function createWavObjectUrl(buffer: AudioBuffer): string {
  const crunker = new Crunker({ sampleRate: buffer.sampleRate });
  const file = crunker.export(buffer, 'audio/wav');
  const url = URL.createObjectURL(file.blob);
  return url;
}
