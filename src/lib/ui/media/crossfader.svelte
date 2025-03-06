<script lang="ts">
  import { onMount } from 'svelte';
  import Slider from '../inputs/slider.svelte';

  interface Props {
    mix: number;
  }

  let { mix = $bindable() }: Props = $props();

  let fader: HTMLDivElement | undefined = $state();
  let labelStyles = $state('');

  // --- Helpers ---

  function toLog(value: number) {
    return Math.pow(value, 2);
  }

  function toLinear(value: number) {
    return Math.sqrt(value);
  }

  function calcLabelPos(mix: number) {
    if (fader) {
      const faderWidth = Math.round(fader.getBoundingClientRect().width);
      const labelX = toLog(mix) * (faderWidth - 25);
      labelStyles = `transform: translateX(${labelX}px)`;
    }
  }

  // --- Event handlers ---

  function onInput(sliderValue: number) {
    mix = toLinear(sliderValue);
  }

  // --- Lifecycle ---

  onMount(() => {
    if (!fader) return;
    const observer = new ResizeObserver(() => {
      calcLabelPos(mix);
    });
    observer.observe(fader);
    return () => {
      observer.unobserve(fader!);
    };
  });

  // --- Reactives ---

  const mixInPercent = $derived(Math.round(mix * 100));
  $effect(() => {
    calcLabelPos(mix);
  });
</script>

<div class="relative w-full" bind:this={fader}>
  <div id="label" class="absolute font-bold" style={labelStyles}>
    {mixInPercent}%
  </div>
  <Slider class="mt-[30px] w-full" value={toLog(mix)} oninput={onInput} />
  <div class="mt-1 flex justify-between text-mineshaft">
    <div>Original</div>
    <div>Enhanced</div>
  </div>
</div>
