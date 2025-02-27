<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '$lib/ui/display/icon.svelte';
  import Link from '$lib/ui/navigation/link.svelte';
  import Download from '$lib/ui/icons/download.svelte';
  import Button from '$lib/ui/buttons/button.svelte';

  // --- Exports ---

  export let filename: string;
  export let downloadUrl: string;
  export let downloadName: string;

  const dispatch = createEventDispatcher<{
    downloaded: void;
    reset: void;
  }>();

  // --- Internal ---
</script>

<div class="flex flex-col items-center">
  <h1 class="shrink-0 grow-0 overflow-hidden text-ellipsis whitespace-nowrap">
    {filename}
  </h1>

  <Link
    class="my-12 self-center"
    href={downloadUrl}
    download={downloadName}
    target="new-tab"
    on:click={() => {
      dispatch('downloaded');
    }}
  >
    <div class="flex flex-col items-center">
      <Icon size="xl" class="mb-8">
        <Download />
      </Icon>
      <p>Download enhanced file</p>
    </div>
  </Link>

  <Button size="sm" on:click={() => dispatch('reset')}>Preview</Button>
</div>
