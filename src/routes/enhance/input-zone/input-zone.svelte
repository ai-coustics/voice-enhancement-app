<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import svelteFsm from 'svelte-fsm';
  import UploadZone from './upload-zone.svelte';
  import UploadingZone from './uploading-zone.svelte';
  import EnhancingZone from './enhancing-zone.svelte';
  import ErrorZone from '../error-zone.svelte';
  import EnhancedZone from './enhanced-zone.svelte';
  import { api } from '$lib/api/api';

  // --- Exports ---

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

  let phase = svelteFsm('waiting', {
    waiting: {
      upload: (file: File) => {
        uploadAndStartEnhancing(file);
        return 'uploading';
      },
      reject: (reason: string) => {
        setError('File rejected', reason);
        return 'errored';
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
</script>

<div class="w-full">
  {#if $phase === 'waiting'}
    <UploadZone
      on:accepted={(file) => phase.upload(file.detail)}
      on:rejected={(reason) => phase.reject(reason.detail)}
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
</div>
