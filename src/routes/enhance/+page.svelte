<script lang="ts">
  import InputZone from './input-zone/input-zone.svelte';
  import OutputZone from './output-zone/output-zone.svelte';
  import ModelZone from './model-zone.svelte';

  // --- Internal ---

  let model = 'LARK';
  let filename = '';
  let originalBuffer: ArrayBuffer;
  let enhancedBuffer: ArrayBuffer;
  let hasEnhanced = false;

  // -- Helpers ---

  function handleEnhanced(
    event: CustomEvent<{
      filename: string;
      originalBuffer: ArrayBuffer;
      enhancedBuffer: ArrayBuffer;
    }>
  ) {
    filename = event.detail.filename;
    originalBuffer = event.detail.originalBuffer;
    enhancedBuffer = event.detail.enhancedBuffer;
    hasEnhanced = true;
  }

  function handleReset() {
    hasEnhanced = false;
  }
</script>

<h1>Upload</h1>
<p class="text-sm">Upload audio files to enhance.</p>

<div class="mx-auto flex max-w-[800px] flex-col items-center">
  <ModelZone class="mt-12" bind:model />

  <InputZone class="mt-12 h-[400px]" {model} on:enhanced={handleEnhanced} on:reset={handleReset} />

  {#if hasEnhanced}
    <OutputZone
      class="mt-12 h-[540px]"
      {filename}
      {originalBuffer}
      {enhancedBuffer}
      {model}
      on:reset={handleReset}
    />
  {/if}
</div>
