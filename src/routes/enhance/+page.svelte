<script lang="ts">
  import EnhancingZone from './enhancing-zone.svelte';
  import UploadZone from './upload-zone.svelte';
  import UploadingZone from './uploading-zone.svelte';
  import svelteFsm from 'svelte-fsm';
  import ModelZone from './model-zone.svelte';
  import { api } from '$lib/api/api';
  import ErrorZone from './error-zone.svelte';
  import PreviewZone from './preview-zone.svelte';
  import { formatEnhancedFilename, formatModel, formatPercentage } from '$lib/utils/format';
  import DownloadZone from './download-zone.svelte';
  import DownloadingZone from './downloading-zone.svelte';
  import EnhancedZone from './enhanced-zone.svelte';

  // --- Internal ---

  let model = 'LARK';
  let filename = '';
  let originalBuffer: ArrayBuffer;
  let enhancedBuffer: ArrayBuffer;
  let timerId: number;
  let errorTitle = '';
  let errorMessage = '';

  let previewContainer: HTMLElement;
  let previewZone: PreviewZone;
  let downloadingMessage = '';
  let downloadUrl: string;
  let downloadName: string;

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
      done: () => {
        return 'enhanced';
      },
      error: (err: string) => {
        errorTitle = 'Enhancement failed';
        errorMessage = err;
        return 'errored';
      }
    },
    enhanced: {
      reset: () => {
        zone3.hide();
        return 'waiting';
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
      _enter: () => {
        setTimeout(() => {
          previewContainer.scrollIntoView({ behavior: 'smooth' });
        }, 1);
      },
      download: (mix: number) => {
        handleDownload(mix);
        return 'generatingDownload';
      },
      hide: 'hidden'
    },
    generatingDownload: {
      done: 'downloadReady',
      error: (err: string) => {
        errorTitle = 'Download failed';
        errorMessage = err;
        return 'errored';
      }
    },
    downloadReady: {
      hide: 'hidden'
    },
    errored: {
      reset: 'hidden'
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
        zone2.done();
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

  async function handleDownload(mix: number) {
    try {
      downloadingMessage = `Generating final audio at ${formatPercentage(mix)} enhancement...`;
      downloadUrl = await previewZone.generateDownload();
      const modelName = formatModel(model);
      downloadName = formatEnhancedFilename(filename, mix, modelName, '.wav');
      zone3.done();
    } catch (err) {
      console.error('Generating download failed with error:', err);
      zone3.error(
        'Something went wrong when generating the mixed file for download. Please try again later.'
      );
    }
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
    {:else if $zone2 === 'enhanced'}
      <EnhancedZone filename={filename!} on:reset={() => zone2.reset()} />
    {/if}
  </div>

  {#if $zone3 !== 'hidden'}
    <div class="mt-12 w-full" bind:this={previewContainer}>
      {#if $zone3 === 'previewing'}
        <PreviewZone
          filename={filename!}
          {originalBuffer}
          {enhancedBuffer}
          bind:this={previewZone}
          on:download={({ detail: mix }: CustomEvent<number>) => zone3.download(mix)}
        />
      {:else if $zone3 === 'generatingDownload'}
        <DownloadingZone message={downloadingMessage} />
      {:else if $zone3 === 'downloadReady'}
        <DownloadZone filename={filename!} {downloadUrl} {downloadName} />
      {:else if $zone3 === 'errored'}
        <!-- TODO: fix shared error strings -->
        <ErrorZone title={errorTitle} {errorMessage} on:reset={() => zone3.reset()} />
      {/if}
    </div>
  {/if}
</div>
