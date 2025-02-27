<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import svelteFsm from 'svelte-fsm';
  import UploadZone from './upload-zone.svelte';
  import UploadingZone from './uploading-zone.svelte';
  import EnhancingZone from './enhancing-zone.svelte';
  import ErrorZone from '../error-zone.svelte';
  import EnhancedZone from './enhanced-zone.svelte';
  import { api } from '$lib/api/api';
  import Zone from '$lib/ui/display/zone.svelte';
  import { twMerge } from 'tailwind-merge';

  // --- Exports ---

  let className = '';
  export { className as class };
  export let model: string;

  const dispatch = createEventDispatcher<{
    enhanced: { filename: string; originalBuffer: ArrayBuffer; enhancedBuffer: ArrayBuffer };
    reset: void;
  }>();

  // --- Internal ---

  let filename = '';
  let originalBuffer: ArrayBuffer;
  let enhancedBuffer: ArrayBuffer;

  let timerId: number;
  let errorTitle = '';
  let errorMessage = '';
  let isDraggingOver = false;

  let phase = svelteFsm('waiting', {
    waiting: {
      upload: (file: File) => {
        uploadAndStartEnhancing(file);
        return 'uploading';
      },
      reject: (reason: string) => {
        setError('File rejected', reason);
        return 'errored';
      },
      _exit: () => {
        isDraggingOver = false;
      }
    },
    uploading: {
      enhance: (generatedName: string) => {
        startPolling(generatedName);
        return 'enhancing';
      },
      cancel: 'waiting',
      error: (err: string) => {
        setError('Upload failed', err);
        return 'errored';
      }
    },
    enhancing: {
      complete: () => {
        return 'enhanced';
      },
      cancel: () => {
        stopPolling();
        return 'waiting';
      },
      error: (err: string) => {
        setError('Enhancement failed', err);
        return 'errored';
      }
    },
    enhanced: {
      reset: () => {
        dispatch('reset');
        return 'waiting';
      }
    },
    errored: {
      reset: 'waiting'
    }
  });

  // --- Helpers ---

  async function uploadAndStartEnhancing(file: File) {
    try {
      filename = file.name;
      originalBuffer = await file.arrayBuffer();
      const generatedName = await api.enhance({
        file,
        modelArch: model
      });
      phase.enhance(generatedName);
    } catch (err: any) {
      console.error(err);
      phase.error('Something went wrong when trying to upload the file. Please try again later.');
    }
  }

  async function startPolling(generatedName: string) {
    const interval = 10 * 1000; // ms
    const timeout = 60 * 60 * 1000; // ms
    const startTime = Date.now();

    timerId = window.setInterval(async () => {
      try {
        enhancedBuffer = await api.download(generatedName);
        console.debug(`Enhancement succeeded`);
        clearInterval(timerId);
        phase.complete();
        dispatch('enhanced', { filename, originalBuffer, enhancedBuffer });
      } catch (err: any) {
        // TODO: distinguish 412 from other errors
        console.debug('Download not ready', err);
        if (Date.now() - startTime > timeout) {
          clearInterval(timerId);
          phase.error('The enhancement request timed out. Please try again later.');
        }
      }
    }, interval);
  }

  function stopPolling() {
    clearInterval(timerId);
  }

  function setError(title: string, message: string) {
    errorTitle = title;
    errorMessage = message;
  }

  function getBorderClass(phase: string, isDraggingOver: boolean) {
    if (phase === 'waiting') {
      return isDraggingOver ? 'border-dashed border-royal-blue' : 'border-dashed';
    } else if (phase === 'uploading' || phase === 'enhancing') {
      return 'border-royal-blue';
    } else if (phase === 'errored') {
      return 'border-error-red-fg';
    }
    return '';
  }

  // --- Reactives ---

  $: borderClass = getBorderClass($phase, isDraggingOver);
</script>

<Zone class={twMerge(borderClass, className, $phase === 'waiting' ? 'p-0' : '')}>
  {#if $phase === 'waiting'}
    <UploadZone
      on:accepted={(file) => phase.upload(file.detail)}
      on:rejected={(reason) => phase.reject(reason.detail)}
      bind:isDraggingOver
    />
  {:else if $phase === 'uploading'}
    <UploadingZone {filename} on:cancel={() => phase.cancel()} />
  {:else if $phase === 'enhancing'}
    <EnhancingZone {filename} on:cancel={() => phase.cancel()} />
  {:else if $phase === 'enhanced'}
    <EnhancedZone {filename} on:reset={() => phase.reset()} />
  {:else if $phase === 'errored'}
    <ErrorZone title={errorTitle} {errorMessage} on:reset={() => phase.reset()} />
  {/if}
</Zone>
