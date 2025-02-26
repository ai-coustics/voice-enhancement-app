<script lang="ts">
  import { goto } from '$app/navigation';
  import EnhancingZone from './enhancing-zone.svelte';
  import RejectedZone from './rejected-zone.svelte';
  import UploadZone from './upload-zone.svelte';
  import UploadingZone from './uploading-zone.svelte';
  import svelteFsm from 'svelte-fsm';
  import { writable } from 'svelte/store';
  import ModelZone from './model-zone.svelte';

  let rejectedReason = '';
  let toUpload: File;
  let currentUpload = writable<string>();
  let enhancementCount: number = 0;
  let selectedModel: string = 'FINCH';

  let fsm = svelteFsm('waiting', {
    waiting: {
      upload: (files: File) => {
        toUpload = files;
        return 'uploading';
      },
      reject: (reason: string) => {
        rejectedReason = reason;
        return 'rejected';
      }
    },
    uploading: {
      _enter: () => {
        // TODO
      },
      enhance: 'enhancing',
      reset: 'waiting'
    },
    enhancing: {
      _enter: async () => {
        // TODO
      },
      reset: 'waiting',
      finish: () => {
        goto('/dashboard/files');
        return 'waiting';
      }
    },
    rejected: {
      close: 'waiting'
    }
  });
</script>

<h1>Upload</h1>
<p class="text-sm">Upload audio or video files to enhance.</p>

<div class="mx-auto flex max-w-[800px] flex-col items-center">
  <div class="mt-12 w-full">
    <ModelZone bind:model={selectedModel} />
  </div>

  <div class="mt-12 w-full">
    {#if $fsm === 'waiting'}
      <UploadZone
        on:accepted={(files) => fsm.upload(files.detail)}
        on:rejected={(reason) => fsm.reject(reason.detail)}
      />
    {:else if $fsm === 'rejected'}
      <RejectedZone reason={rejectedReason || 'reason'} on:close={() => fsm.close()} />
    {:else if $fsm === 'uploading'}
      <UploadingZone currentUpload={$currentUpload} />
    {:else if $fsm === 'enhancing'}
      <EnhancingZone fileCount={enhancementCount} on:reset={() => fsm.reset()} />
    {/if}
  </div>
</div>
