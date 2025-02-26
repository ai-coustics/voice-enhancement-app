<script lang="ts">
  import Icon from '$lib/ui/display/icon.svelte';
  import Zone from '$lib/ui/display/zone.svelte';
  import { createEventDispatcher } from 'svelte';
  import Button from '$lib/ui/buttons/button.svelte';
  import Upload from '$lib/ui/icons/upload.svelte';

  export let reason: string;

  const dispatch = createEventDispatcher<{
    close: null;
  }>();
</script>

<Zone class="border-error-red-fg">
  <div class="flex flex-col items-center gap-11 py-9 md:px-24">
    <Icon size="lg" class="text-error-red-fg mt-6">
      <Upload />
    </Icon>

    <h2 class="text-center">Upload rejected</h2>

    <div class="align-center text-error-red-fg flex flex-col gap-4 text-center text-sm">
      <p>
        {reason}
      </p>
    </div>

    <div class="px-24 sm:p-0">
      <Button on:click={() => dispatch('close')}>Go back</Button>
    </div>
  </div>
</Zone>
