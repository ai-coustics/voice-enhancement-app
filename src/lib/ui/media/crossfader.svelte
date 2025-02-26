<script lang="ts">
  import { onMount } from 'svelte';
  import Slider from '../inputs/slider.svelte';

  export let mix: number;

  let fader: HTMLDivElement;

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

  function onInput(e: CustomEvent) {
    const sliderValue = e.detail;
    mix = toLinear(sliderValue);
  }

  // --- Lifecycle ---

  onMount(() => {
    const observer = new ResizeObserver(() => {
      calcLabelPos(mix);
    });
    observer.observe(fader);
    return () => {
      observer.unobserve(fader);
    };
  });

  // --- Reactives ---

  let labelStyles = '';
  $: mixInPercent = Math.round(mix * 100);
  $: calcLabelPos(mix);
</script>

<div class="relative w-full" bind:this={fader}>
  <div id="label" class="absolute font-bold" style={labelStyles}>
    {mixInPercent}%
  </div>
  <Slider class="mt-[30px] w-full" value={toLog(mix)} on:input={onInput} />
  <div class="text-mineshaft mt-1 flex justify-between">
    <div>Original</div>
    <div>Enhanced</div>
  </div>
</div>
