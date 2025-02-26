<script lang="ts">
  import EnhancingZone from './enhancing-zone.svelte';
  import UploadZone from './upload-zone.svelte';
  import UploadingZone from './uploading-zone.svelte';
  import svelteFsm from 'svelte-fsm';
  import ModelZone from './model-zone.svelte';
  import { api } from '$lib/api/api';
  import ErrorZone from './error-zone.svelte';

  // --- Internal ---

  let model = 'LARK';
  let filename = '';
  let originalBuffer: ArrayBuffer;
  let enhancedBuffer: ArrayBuffer;
  let timerId: number;
  let errorTitle = '';
  let errorMessage = '';

  let zone2 = svelteFsm('waiting', {
    waiting: {
      upload: (file: File) => {
        uploadAndStartEnhancing(file);
        return 'uploading';
      },
      reject: (reason: string) => {
        errorTitle = 'File rejected';
        errorMessage = reason;
        return 'errored';
      }
    },
    uploading: {
      enhance: (generatedName: string) => {
        startPolling(generatedName);
        return 'enhancing';
      },
      error: (err: string) => {
        errorTitle = 'Upload failed';
        errorMessage = err;
        return 'errored';
      }
    },
    enhancing: {
      cancel: () => {
        stopPolling();
        return 'waiting';
      },
      reset: 'waiting',
      error: (err: string) => {
        errorTitle = 'Enhancement failed';
        errorMessage = err;
        return 'errored';
      }
    },
    errored: {
      reset: 'waiting'
    }
  });

  let zone3 = svelteFsm('hidden', {
    hidden: {
      show: 'previewing'
    },
    previewing: {
      download: 'downloading',
      hide: 'hidden'
    },
    downloading: {
      hide: 'hidden'
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
      zone2.enhance(generatedName);
    } catch (err) {
      console.error(err);
      zone2.error('Upload failed');
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
        zone2.reset();
        zone3.show();
      } catch (err) {
        console.debug('Download not ready', err);
        if (Date.now() - startTime > timeout) {
          clearInterval(timerId);
          zone2.error('Enhancement failed');
        }
      }
    }, interval);
  }

  function stopPolling() {
    clearInterval(timerId);
  }
</script>

<h1>Upload</h1>
<p class="text-sm">Upload audio files to enhance.</p>

<div class="mx-auto flex max-w-[800px] flex-col items-center">
  <div class="mt-12 w-full">
    <ModelZone bind:model />
  </div>

  <div class="mt-12 w-full">
    {#if $zone2 === 'waiting'}
      <UploadZone
        on:accepted={(file) => zone2.upload(file.detail)}
        on:rejected={(reason) => zone2.reject(reason.detail)}
      />
    {:else if $zone2 === 'errored'}
      <ErrorZone title={errorTitle} {errorMessage} on:reset={() => zone2.reset()} />
    {:else if $zone2 === 'uploading'}
      <UploadingZone filename={filename!} />
    {:else if $zone2 === 'enhancing'}
      <EnhancingZone filename={filename!} on:cancel={() => zone2.cancel()} />
    {/if}
  </div>

  {#if $zone3 !== 'hidden'}
    <div class="mt-12 w-full">
      {#if $zone3 === 'previewing'}
        <p>Preview of {filename} {originalBuffer} {enhancedBuffer}</p>
      {:else if $zone3 === 'downloading'}
        <p>Downloading mixed {filename}</p>
      {/if}
    </div>
  {/if}
</div>
