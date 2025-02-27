<script lang="ts">
  import Button from '$lib/ui/buttons/button.svelte';
  import { createEventDispatcher } from 'svelte';
  import Stepper from './stepper.svelte';

  export let filename: string;

  const dispatch = createEventDispatcher<{
    reset: void;
  }>();
</script>

<div class="flex flex-col items-center gap-12 text-center">
  <Stepper current={2} />
  <h3 class="m-0 font-normal [word-break:break-word]">
    Finished enhancing <span class="font-semibold">{filename}</span>.
  </h3>
  <Button role="secondary" size="sm" on:click={() => dispatch('reset')}>Start over</Button>
</div>
