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

  interface Props {
    class?: string;
    filename: string;
    originalBuffer: ArrayBuffer;
    enhancedBuffer: ArrayBuffer;
    model: string;
    onReset: () => void;
  }

  const {
    class: className = '',
    filename,
    originalBuffer,
    enhancedBuffer,
    model,
    onReset
  }: Props = $props();

  // --- Internal ---

  let container: HTMLElement | undefined;
  let preview: Preview | undefined;

  let downloadingMessage = $state('');
  let downloadUrl = $state('');
  let downloadName = $state('');
  let errorTitle = $state('');
  let errorMessage = $state('');

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
        onReset();
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
      downloadUrl = (await preview?.generateDownload()) || '';
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
    container?.scrollIntoView({ behavior: 'smooth' });
  });

  // --- Reactives ---

  const borderClass = $derived(getBorderClass($phase));
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
      onDownload={(mix: number) => phase.download(mix)}
    />
    {#if $phase === 'generatingDownload'}
      <Downloading message={downloadingMessage} onCancel={() => phase.cancel()} />
    {:else if $phase === 'downloadReady'}
      <Download
        {downloadUrl}
        {downloadName}
        onDownloaded={() => phase.complete()}
        onReset={() => phase.reset()}
      />
    {:else if $phase === 'errored'}
      <Errored title={errorTitle} {errorMessage} onReset={() => phase.reset()} />
    {/if}
  </Zone>
</div>
