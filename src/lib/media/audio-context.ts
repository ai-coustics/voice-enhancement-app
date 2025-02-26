let ctx: AudioContext;

export function getAudioContext() {
  if (!ctx) {
    ctx = new AudioContext({
      latencyHint: 'playback'
    });
  }
  return ctx;
}
