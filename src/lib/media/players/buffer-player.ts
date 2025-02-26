import svelteFsm from 'svelte-fsm';
import type { Readable } from 'svelte/store';
import { getAudioContext } from '../audio-context';

type State = 'initial' | 'decoding' | 'playing' | 'pausing' | 'paused' | 'seeking' | 'ended';

export class BufferPlayer extends EventTarget {
  private sourceNode?: AudioBufferSourceNode;
  private gainNode: GainNode;
  private buffer?: AudioBuffer;

  // TODO: figure out typing for this, ReturnType<typeof svelteFsm> does not work.
  private fsm: any;
  private state: State = 'initial';

  // All in seconds
  private startTime = -1;
  private startOffset = 0;
  private cursor = 0;

  private keepAlive = false;

  constructor() {
    super();

    this.fsm = svelteFsm('initial', {
      initial: {
        decode: 'decoding'
      },
      decoding: {
        cue: 'paused'
      },
      playing: {
        pause: 'pausing',
        seek: 'seeking',
        end: 'ended'
      },
      pausing: {
        paused: 'paused'
      },
      paused: {
        play: 'playing',
        seek: 'seeking'
      },
      seeking: {
        play: 'playing',
        paused: 'paused'
      },
      ended: {
        play: 'playing'
      }
    });

    this.fsm.subscribe((s: State) => {
      this.state = s;
    });

    const ctx = getAudioContext();
    this.gainNode = ctx.createGain();
    this.gainNode.connect(ctx.destination);
  }

  public state$(): Readable<State> {
    return this.fsm;
  }

  public load(dataBuffer: ArrayBuffer) {
    const ctx = getAudioContext();
    ctx.decodeAudioData(dataBuffer, audioBuffer => {
      this.buffer = audioBuffer;
      this.fsm.cue();
    });
    this.fsm.decode();
  }

  public play() {
    if (!this.buffer) {
      return;
    }

    const ctx = getAudioContext();
    ctx.resume();

    // AudioBufferSourceNode are single use only, so we need to recreate them for each playback request.
    this.sourceNode = ctx.createBufferSource();
    this.sourceNode.buffer = this.buffer;
    this.sourceNode.connect(this.gainNode);

    this.sourceNode.onended = () => {
      if (!this.keepAlive) {
        this.startTime = -1;
        this.cursor = 0;
        this.fsm.end();
      }
      this.keepAlive = false;
    };

    this.startTime = ctx.currentTime;
    this.startOffset = this.cursor;
    this.sourceNode.start(0, this.cursor);

    this.fsm.play();
  }

  public pause() {
    this.fsm.pause();
    this.cursor = this.getCursor();
    this.stop();
    this.fsm.paused();
  }

  public seek(cursor: number) {
    // AudioBufferSourceNodes don't support seeking either, only way to do it is
    // to stop the current one and start a new one.
    const wasPlaying = this.state === 'playing';
    this.fsm.seek();
    if (wasPlaying) {
      this.stop();
    }

    this.cursor = Math.min(Math.max(0, cursor), this.getDuration());

    if (wasPlaying) {
      this.play();
      this.fsm.play();
    } else {
      this.fsm.paused();
    }
  }

  public setGain(gain: number) {
    this.gainNode.gain.value = gain;
  }

  public getGain() {
    return this.gainNode.gain.value;
  }

  public getDuration() {
    return this.buffer?.duration ?? 0;
  }

  public getCursor() {
    return this.startTime !== -1
      ? this.startOffset + (getAudioContext().currentTime - this.startTime)
      : 0;
  }

  public getBuffer() {
    return this.buffer;
  }

  private stop() {
    this.keepAlive = true;
    this.sourceNode?.stop();
    this.sourceNode?.disconnect();
    this.sourceNode = undefined;
  }
}
