<script context="module" lang="ts">
  export type AudioPreviewState = 'initial' | 'loading' | 'paused' | 'playing' | 'ended';
</script>

<script lang="ts">
  import { BufferPlayer } from '$lib/media/players/buffer-player';
  import { mixToWav } from '$lib/media/mix-audio';
  import { createEventDispatcher, onMount } from 'svelte';
  import svelteFsm from 'svelte-fsm';
  import { derived, writable, type Readable } from 'svelte/store';
  import Crossfader from '$lib/ui/media/crossfader.svelte';
  import PlayButton from '$lib/ui/media/play-button.svelte';
  import Waveform from '$lib/ui/media/waveform.svelte';

  // --- Constants ---

  const cursorUpdateInterval = 1000 / 30; // 30 fps in milliseconds

  // --- Exports ---

  export let originalBuffer: ArrayBuffer;
  export let enhancedBuffer: ArrayBuffer;
  export let mix: number;

  const dispatch = createEventDispatcher<{
    load: void;
  }>();

  export async function mixPlayerBuffers(): Promise<string> {
    const original = originalPlayer.getBuffer();
    const enhanced = enhancedPlayer.getBuffer();
    if (!original || !enhanced) {
      return '';
    }
    return await mixToWav(original, enhanced, mix);
  }

  export function pause() {
    fsm.pause();
  }

  export function play() {
    fsm.play();
  }

  export function state$(): Readable<AudioPreviewState> {
    return fsm;
  }

  export function playbackCursor$(): Readable<number> {
    return playbackCursor;
  }

  // --- Internal ---

  const originalPlayer = new BufferPlayer();
  const enhancedPlayer = new BufferPlayer();
  let unsubscribeFromPlayers: () => void | undefined;

  let originalAudioBuffer: AudioBuffer | undefined;
  let enhancedAudioBuffer: AudioBuffer | undefined;

  let playbackCursor = writable(0); // in seconds
  let playbackCursorTimerId: number;

  async function initPlayer(player: BufferPlayer, buffer: ArrayBuffer) {
    try {
      player.load(buffer);
      return player;
    } catch (error: any) {
      console.error('Failed to load audio', error);
    }
  }

  function seek(position: CustomEvent<number>) {
    const cursor = position.detail;
    originalPlayer.seek(cursor);
    enhancedPlayer.seek(cursor);
    playbackCursor.set(cursor);
  }

  const fsm = svelteFsm('initial', {
    initial: {
      load: () => {
        Promise.all([
          initPlayer(originalPlayer, originalBuffer),
          initPlayer(enhancedPlayer, enhancedBuffer)
        ]).then(() => {
          // The only state changes we need to derive from the underlying players are:
          //   - decoding -> paused
          //   - playing -> paused
          //   - playing -> ended
          const derivedPlayerState = derived(
            [originalPlayer.state$(), enhancedPlayer.state$()],
            ([$originalState, $enhancedState]) => {
              if ($originalState === 'paused' && $enhancedState === 'paused') {
                return 'pause';
              } else if ($originalState === 'ended' && $enhancedState === 'ended') {
                return 'end';
              } else {
                return undefined;
              }
            }
          );

          unsubscribeFromPlayers = derivedPlayerState.subscribe(
            (transition: 'pause' | 'end' | undefined) => {
              if (transition) fsm[transition]();
            }
          );
        });

        return 'loading';
      }
    },
    loading: {
      _exit: () => {
        originalAudioBuffer = originalPlayer.getBuffer();
        enhancedAudioBuffer = enhancedPlayer.getBuffer();
        dispatch('load');
      },
      pause: 'paused'
    },
    paused: {
      play: 'playing',
      seek
    },
    playing: {
      _enter: () => {
        originalPlayer.play();
        enhancedPlayer.play();
        playbackCursorTimerId = window.setInterval(() => {
          playbackCursor.set(originalPlayer.getCursor());
        }, cursorUpdateInterval);
      },
      pause: () => {
        originalPlayer.pause();
        enhancedPlayer.pause();
        clearInterval(playbackCursorTimerId);
        return 'paused';
      },
      seek,
      end: () => {
        clearInterval(playbackCursorTimerId);
        playbackCursor.set(0);
        return 'ended';
      }
    },
    ended: {
      play: 'playing'
    }
  });

  onMount(() => {
    fsm.load();
    const unmount = () => {
      fsm.pause();
      unsubscribeFromPlayers?.();
    };
    return unmount;
  });

  $: {
    enhancedPlayer.setGain(mix);
    originalPlayer.setGain(1 - mix);
  }

  $: {
    console.debug('AudioPreview State:', $fsm);
  }
</script>

<div class="flex flex-col gap-5">
  <div class="flex h-[64px] w-full items-center rounded-lg bg-sleet px-3">
    <PlayButton
      state={$fsm === 'initial' || $fsm === 'loading'
        ? 'loading'
        : $fsm === 'playing'
          ? 'playing'
          : 'paused'}
      on:click={() => {
        if ($fsm === 'playing') fsm.pause();
        else fsm.play();
      }}
    />
    {#if originalAudioBuffer && enhancedAudioBuffer}
      <Waveform
        originalBuffer={originalAudioBuffer}
        enhancedBuffer={enhancedAudioBuffer}
        {mix}
        playbackCursor={$playbackCursor}
        on:seek={fsm.seek}
      />
    {/if}
  </div>

  <Crossfader bind:mix />
</div>
