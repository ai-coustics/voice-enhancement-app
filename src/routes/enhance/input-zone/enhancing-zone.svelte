<script lang="ts">
  import Spinner from '$lib/ui/display/spinner.svelte';
  import Link from '$lib/ui/navigation/link.svelte';
  import { createEventDispatcher } from 'svelte';
  import Stepper from './stepper.svelte';
  import Button from '$lib/ui/buttons/button.svelte';

  export let filename: string;

  const dispatch = createEventDispatcher<{
    cancel: void;
  }>();
</script>

<div class="flex flex-col items-center gap-12 text-center">
  <Stepper current={1} />
  <div class="flex flex-col items-center gap-3">
    <div class="flex items-center gap-3">
      <Spinner size={18} />
      <h3 class="m-0 font-normal [word-break:break-word]">
        Enhancing <span class="font-semibold">{filename}</span>...
      </h3>
    </div>
    <p class="text-mineshaft">This might take a few minutes.</p>
  </div>
  <Button role="secondary" size="sm" on:click={() => dispatch('cancel')}>Cancel</Button>
</div>
