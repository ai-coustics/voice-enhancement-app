<script lang="ts">
  import InputZone from './input/input-zone.svelte';
  import OutputZone from './output/output-zone.svelte';
  import ModelZone from './model-zone.svelte';

  const { data } = $props();

  // --- Internal ---

  let model = $state('LARK');
  let filename = $state('');
  // svelte-ignore non_reactive_update
  let originalBuffer: ArrayBuffer;
  // svelte-ignore non_reactive_update
  let enhancedBuffer: ArrayBuffer;
  let hasEnhanced = $state(false);

  // -- Helpers ---

  function handleEnhanced(args: {
    filename: string;
    originalBuffer: ArrayBuffer;
    enhancedBuffer: ArrayBuffer;
  }) {
    filename = args.filename;
    originalBuffer = args.originalBuffer;
    enhancedBuffer = args.enhancedBuffer;
    hasEnhanced = true;
  }

  function handleReset() {
    hasEnhanced = false;
  }
</script>

<h1 class="mb-12">Upload</h1>

<div class="mx-auto flex max-w-[800px] flex-col items-center">
  <ModelZone bind:model />

  <InputZone
    class="mt-12 h-[340px]"
    {model}
    settings={data.settings}
    onEnhanced={handleEnhanced}
    onReset={handleReset}
  />

  {#if hasEnhanced}
    <OutputZone
      class="mt-12 h-[540px]"
      {filename}
      {originalBuffer}
      {enhancedBuffer}
      {model}
      onReset={handleReset}
    />
  {/if}
</div>
