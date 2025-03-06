<script lang="ts">
  import { floatEquals } from '$lib/utils/compare';
  import debounce from 'lodash/debounce';
  import { onMount } from 'svelte';

  // --- Constants ---

  const step = 2;

  // --- Exports ---

  interface Props {
    originalBuffer: AudioBuffer;
    enhancedBuffer: AudioBuffer;
    mix: number;
    playbackCursor?: number; // in seconds
    onSeek: (position: number) => void;
  }

  const { originalBuffer, enhancedBuffer, mix, playbackCursor = 0, onSeek }: Props = $props();

  // --- Internal ---

  let waveformEl: SVGElement | undefined;
  let lastDrawnMix: number = -1;
  let lastDrawnWidth: number = $state(-1);

  // --- Helpers ---

  function peak(values: number[]) {
    return values.reduce((peak, value) => (value > peak ? value : peak), 0);
  }

  function drawWaveform(mix: number) {
    if (!waveformEl) return;

    const width = parseInt(window.getComputedStyle(waveformEl).width);

    if (floatEquals(mix, lastDrawnMix, 0.01) && floatEquals(width, lastDrawnWidth, 1)) {
      return;
    }

    const rootGroup = waveformEl.querySelector('g')!;
    rootGroup.innerHTML = '';

    const originalSamples = originalBuffer.getChannelData(0);
    const enhancedSamples = enhancedBuffer.getChannelData(0);

    const dataPoints = width / step;
    const peaks = new Float32Array(dataPoints);
    const windowSize = Math.round(originalSamples.length / dataPoints);
    for (let i = 0, y = 0, amplitudes = []; i < originalSamples.length; i++) {
      const mixedSample = originalSamples[i] * (1 - mix) + enhancedSamples[i] * mix;
      amplitudes.push(Math.abs(mixedSample));
      if (amplitudes.length === windowSize) {
        peaks[y++] = peak(amplitudes);
        amplitudes = [];
      }
    }

    const height: number = parseInt(window.getComputedStyle(waveformEl).height);

    for (let i = 0; i < peaks.length; i++) {
      const x = i * step;
      const yCenter = height / 2;
      const yAmplitude = peaks[i] * height;
      const y1 = yCenter - yAmplitude / 2;
      const y2 = yCenter + yAmplitude / 2;

      var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      newLine.setAttribute('x1', x.toString());
      newLine.setAttribute('x2', x.toString());
      newLine.setAttribute('y1', y1.toString());
      newLine.setAttribute('y2', y2.toString());
      newLine.setAttribute('stroke', '#454545');
      newLine.setAttribute('stroke-width', '1');
      newLine.setAttribute('stroke-linecap', 'round');
      newLine.style.position = 'relative';
      newLine.style.top = 'relative';

      rootGroup.append(newLine);
    }

    lastDrawnMix = mix;
    lastDrawnWidth = width;
  }

  const drawWaveformDebounced = debounce((mix: number) => drawWaveform(mix), 50, {
    leading: false,
    trailing: true
  });

  // --- Event handlers ---

  function handleClick(event: MouseEvent) {
    if (!originalBuffer) {
      return;
    }

    const svg = document.getElementById('waveform')!;
    const boundingLeft = svg.getBoundingClientRect().left;
    const waveformWidth = parseInt(window.getComputedStyle(svg).width);
    const clickedPercentage = (event.x - boundingLeft) / waveformWidth;
    const clickedPosition = originalBuffer.duration * clickedPercentage;
    if (!isNaN(clickedPosition)) {
      onSeek(clickedPosition);
    }
  }

  // --- Lifecycle ---

  onMount(() => {
    const observer = new ResizeObserver(() => {
      drawWaveformDebounced(mix);
    });
    observer.observe(waveformEl!);
    drawWaveform(mix);
    return () => {
      observer.unobserve(waveformEl!);
    };
  });

  // --- Reactives ---

  $effect(() => {
    drawWaveformDebounced(mix);
  });

  $effect(() => {
    const left = originalBuffer
      ? Math.round((playbackCursor / originalBuffer.duration) * lastDrawnWidth)
      : 0;
    const cursorEl = document.getElementById('cursor');

    if (cursorEl) {
      cursorEl.style.width = `${left}px`;
    }
  });
</script>

<div class="relative h-full grow py-2">
  <!-- The `transform: translate3d(0,0,0);` is a hack needed for Safari, otherwise the mix-blend-mode 
			 does not always take effect, and we get a solid orange block over the waveform. -->
  <div
    id="cursor"
    class="pointer-events-none absolute top-0 h-full bg-flamingo mix-blend-lighten transition-transform"
    style="transform: translate3d(0,0,0); width: 0"
  ></div>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <svg
    id="waveform"
    class="h-full w-full outline-none"
    role="button"
    tabindex="-1"
    bind:this={waveformEl}
    onclick={handleClick}
  >
    <g></g>
  </svg>
</div>
