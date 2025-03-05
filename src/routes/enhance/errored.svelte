<script lang="ts">
  import Icon from '$lib/ui/display/icon.svelte';
  import { createEventDispatcher } from 'svelte';
  import Button from '$lib/ui/buttons/button.svelte';
  import Error from '$lib/ui/icons/error.svelte';

  export let title: string;
  export let errorMessage: string;

  const dispatch = createEventDispatcher<{
    reset: null;
  }>();
</script>

<div class="flex flex-col items-center gap-12 text-center">
  <Icon size="xl" class="mt-2 text-error-red-fg">
    <Error />
  </Icon>

  <div class="flex max-w-full flex-col items-center gap-3">
    <h2>{title}</h2>
    <p class="max-w-full text-mineshaft">
      {errorMessage}
    </p>
  </div>

  <Button size="sm" on:click={() => dispatch('reset')}>Go back</Button>
</div>
