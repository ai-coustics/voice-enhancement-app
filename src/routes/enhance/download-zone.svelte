<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '$lib/ui/display/icon.svelte';
  import Zone from '$lib/ui/display/zone.svelte';
  import Link from '$lib/ui/navigation/link.svelte';
  import Download from '$lib/ui/icons/download.svelte';

  // --- Exports ---

  export let filename: string;
  export let downloadUrl: string;
  export let downloadName: string;

  const dispatch = createEventDispatcher<{
    downloaded: void;
  }>();

  // --- Internal ---
</script>

<Zone>
  <div class="flex flex-col items-center p-9">
    <h1 class="shrink-0 grow-0 overflow-hidden text-ellipsis whitespace-nowrap">
      {filename}
    </h1>

    <Link
      class="my-24 self-center"
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
  </div>
</Zone>
