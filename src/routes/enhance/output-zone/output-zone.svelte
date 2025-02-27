<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import svelteFsm from 'svelte-fsm';
  import PreviewZone from './preview-zone.svelte';
  import DownloadZone from './download-zone.svelte';
  import DownloadingZone from './downloading-zone.svelte';
  import ErrorZone from '../error-zone.svelte';
  import { formatEnhancedFilename, formatModel, formatPercentage } from '$lib/utils/format';

  // --- Exports ---

  export let filename: string;
  export let originalBuffer: ArrayBuffer;
  export let enhancedBuffer: ArrayBuffer;
  export let model: string;

  const dispatch = createEventDispatcher<{
    reset: void;
  }>();

  // --- Internal ---

  let container: HTMLElement;
  let previewZone: PreviewZone;

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

  async function handleDownload(mix: number) {
    try {
      downloadingMessage = `Generating final audio at ${formatPercentage(mix)} enhancement...`;
      downloadUrl = await previewZone.generateDownload();
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

  function setError(title: string, message: string) {
    errorTitle = title;
    errorMessage = message;
  }

  // --- Lifecycle ---

  onMount(() => {
    container.scrollIntoView({ behavior: 'smooth' });
  });
</script>

<div class="w-full" bind:this={container}>
  {#if $phase === 'previewing'}
    <PreviewZone
      {filename}
      {originalBuffer}
      {enhancedBuffer}
      bind:this={previewZone}
      on:download={({ detail: mix }: CustomEvent<number>) => phase.download(mix)}
    />
  {:else if $phase === 'generatingDownload'}
    <DownloadingZone message={downloadingMessage} />
  {:else if $phase === 'downloadReady'}
    <DownloadZone {filename} {downloadUrl} {downloadName} on:reset={() => phase.reset()} />
  {:else if $phase === 'errored'}
    <ErrorZone title={errorTitle} {errorMessage} on:reset={() => phase.reset()} />
  {/if}
</div>
