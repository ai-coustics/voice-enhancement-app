<script lang="ts">
  import Icon from '$lib/ui/display/icon.svelte';
  import Zone from '$lib/ui/display/zone.svelte';
  import { createEventDispatcher } from 'svelte';
  import Button from '$lib/ui/buttons/button.svelte';
  import Upload from '$lib/ui/icons/upload.svelte';

  export let title: string;
  export let errorMessage: string;

  const dispatch = createEventDispatcher<{
    reset: null;
  }>();
</script>

<Zone class="border-error-red-fg">
  <div class="flex flex-col items-center p-9">
    <Icon size="lg" class="mt-2 text-error-red-fg">
      <Upload />
    </Icon>

    <h2 class="m-6 text-center">{title}</h2>

    <p class="text-center text-sm text-error-red-fg">
      {errorMessage}
    </p>

    <Button class="mt-12" on:click={() => dispatch('reset')}>Go back</Button>
  </div>
</Zone>
