<script lang="ts">
  import svelteFsm from 'svelte-fsm';
  import Upload from './upload.svelte';
  import Uploading from './uploading.svelte';
  import Enhancing from './enhancing.svelte';
  import Errored from '../errored.svelte';
  import Enhanced from './enhanced.svelte';
  import { AicousticsApi } from '$lib/api/api';
  import Zone from '$lib/ui/display/zone.svelte';
  import { twMerge } from 'tailwind-merge';
  import { RequestError } from '$lib/api/request';

  // --- Exports ---

  interface Props {
    class?: string;
    model: string;
    settings: {
      apiRoot: string;
      apiKey: string;
    };
    onEnhanced: (args: {
      filename: string;
      originalBuffer: ArrayBuffer;
      enhancedBuffer: ArrayBuffer;
    }) => void;
    onReset: () => void;
  }

  const { class: className = '', model, settings, onEnhanced, onReset }: Props = $props();

  // --- Internal ---

  const api = new AicousticsApi(settings.apiRoot, settings.apiKey);

  let filename = $state('');
  let originalBuffer: ArrayBuffer;
  let enhancedBuffer: ArrayBuffer;

  let timerId: number;
  let errorTitle = $state('');
  let errorMessage = $state('');
  let isDraggingOver = $state(false);

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
        onReset();
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
        enhancementLevel: 1,
        modelArch: model
      });
      phase.enhance(generatedName);
    } catch (err: unknown) {
      console.error(err);

      if (err instanceof RequestError) {
        const error = err as RequestError;
        if (error.statusCode === 401 || error.statusCode === 403) {
          phase.error(
            "Authentication with the API failed. Please make sure you've added a valid API key under Settings."
          );
          return;
        }
        if (error.statusCode === 402) {
          phase.error("You don't have enough credits to enhance this file.");
          return;
        }
      }
      phase.error('Something went wrong when trying to upload the file.');
    }
  }

  async function startPolling(generatedName: string) {
    // All in ms
    const initialInterval = 5 * 1000;
    const backoffFactor = 1.25;
    const maxInterval = 5 * 60 * 1000;
    const timeout = 60 * 60 * 1000;
    const startTime = Date.now();

    let currentInterval = initialInterval;

    const scheduleNext = () => {
      timerId = window.setTimeout(async () => {
        try {
          enhancedBuffer = await api.download(generatedName);
          console.debug(`Enhancement succeeded`);
          phase.complete();
          onEnhanced({ filename, originalBuffer, enhancedBuffer });
        } catch (err: unknown) {
          if (err instanceof RequestError) {
            const error = err as RequestError;
            if (error.statusCode === 412) {
              const didTimeout = Date.now() - startTime > timeout;
              if (!didTimeout) {
                currentInterval = Math.min(currentInterval * backoffFactor, maxInterval);
                console.debug(`Download not ready, retrying in ${currentInterval / 1000}s...`);
                scheduleNext();
                return;
              }
              phase.error('The enhancement request timed out. Please try again later.');
              return;
            }
          }
          console.error(err);
          phase.error(
            'Something went wrong when trying to enhance the file. Please try again later.'
          );
        }
      }, currentInterval);
    };

    scheduleNext();
  }

  function stopPolling() {
    clearTimeout(timerId);
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

  let borderClass = $derived(getBorderClass($phase, isDraggingOver));
</script>

<Zone class={twMerge(borderClass, className, $phase === 'waiting' ? 'p-0' : '')}>
  {#if $phase === 'waiting'}
    <Upload
      onAccepted={(file) => phase.upload(file)}
      onRejected={(reason) => phase.reject(reason)}
      bind:isDraggingOver
    />
  {:else if $phase === 'uploading'}
    <Uploading {filename} onCancel={() => phase.cancel()} />
  {:else if $phase === 'enhancing'}
    <Enhancing {filename} onCancel={() => phase.cancel()} />
  {:else if $phase === 'enhanced'}
    <Enhanced {filename} onReset={() => phase.reset()} />
  {:else if $phase === 'errored'}
    <Errored title={errorTitle} {errorMessage} onReset={() => phase.reset()} />
  {/if}
</Zone>
