<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import svelteFsm from 'svelte-fsm';
  import Preview from './preview.svelte';
  import Download from './download.svelte';
  import Downloading from './downloading.svelte';
  import Errored from '../errored.svelte';
  import { formatEnhancedFilename, formatModel, formatPercentage } from '$lib/utils/format';
  import Zone from '$lib/ui/display/zone.svelte';
  import { twMerge } from 'tailwind-merge';

  // --- Exports ---

  let className = '';
  export { className as class };
  export let filename: string;
  export let originalBuffer: ArrayBuffer;
  export let enhancedBuffer: ArrayBuffer;
  export let model: string;

  const dispatch = createEventDispatcher<{
    reset: void;
  }>();

  // --- Internal ---

  let container: HTMLElement;
  let preview: Preview;

  let downloadingMessage = '';
  let downloadUrl: string;
  let downloadName: string;
  let errorTitle = '';
  let errorMessage = '';

  let phase = svelteFsm('previewing', {
    previewing: {
      download: (mix: number) => {
        handleDownload(mix);
        return 'generatingDownload';
      }
    },
    generatingDownload: {
      complete: 'downloadReady',
      cancel: 'previewing',
      error: (err: string) => {
        setError('Download failed', err);
        return 'errored';
      }
    },
    downloadReady: {
      reset: 'previewing'
    },
    errored: {
      reset: () => {
        dispatch('reset');
        return 'previewing';
      }
    }
  });

  // --- Helpers ---

  function setError(title: string, message: string) {
    errorTitle = title;
    errorMessage = message;
  }

  function getBorderClass(phase: string) {
    if (phase === 'generatingDownload') {
      return 'border-royal-blue';
    } else if (phase === 'errored') {
      return 'border-error-red-fg';
    }
    return '';
  }

  // --- Event handlers ---

  async function handleDownload(mix: number) {
    try {
      downloadingMessage = `Generating final audio at ${formatPercentage(mix)} enhancement...`;
      downloadUrl = await preview.generateDownload();
      // Check cancellation
      if ($phase !== 'generatingDownload') {
        return;
      }
      const modelName = formatModel(model);
      downloadName = formatEnhancedFilename(filename, mix, modelName, '.wav');
      phase.complete();
    } catch (err) {
      console.error('Generating download failed with error:', err);
      phase.error(
        'Something went wrong when generating the mixed file for download. Please try again later.'
      );
    }
  }

  // --- Lifecycle ---

  onMount(() => {
    container.scrollIntoView({ behavior: 'smooth' });
  });

  // --- Reactives ---

  $: borderClass = getBorderClass($phase);
</script>

<div class={twMerge('w-full', className)} bind:this={container}>
  <Zone class={twMerge('h-full', borderClass)}>
    <!-- 
      Do not let Preview get unmounted, just hide it instead when moving to the other phases.
      Reason being that when the internal players decode the buffers, they get detached and can't
      be reused. So when we return to previewing after a download, we'd get an error about 
      ArrayBuffers being detached if we let it unmount/remount.
    -->
    <Preview
      {filename}
      {originalBuffer}
      {enhancedBuffer}
      hide={$phase !== 'previewing'}
      bind:this={preview}
      on:download={({ detail: mix }: CustomEvent<number>) => phase.download(mix)}
    />
    {#if $phase === 'generatingDownload'}
      <Downloading message={downloadingMessage} on:cancel={() => phase.cancel()} />
    {:else if $phase === 'downloadReady'}
      <Download {downloadUrl} {downloadName} on:reset={() => phase.reset()} />
    {:else if $phase === 'errored'}
      <Errored title={errorTitle} {errorMessage} on:reset={() => phase.reset()} />
    {/if}
  </Zone>
</div>
