<script lang="ts">
  import Button from '$lib/ui/buttons/button.svelte';
  import Zone from '$lib/ui/display/zone.svelte';
  import { createEventDispatcher } from 'svelte';
  import Stepper from './stepper.svelte';

  export let filename: string;

  const dispatch = createEventDispatcher<{
    reset: void;
  }>();
</script>

<Zone>
  <div class="flex flex-col items-center gap-11 pb-8 pt-16">
    <Stepper current={2} />
    <div class="flex flex-col items-center gap-2 px-4 text-center">
      <h3 class="font-semibold [word-break:break-word]">Finished enhancing {filename}...</h3>
      <p class="mt-8">
        <Button size="sm" on:click={() => dispatch('reset')}>Pick another file</Button>
      </p>
    </div>
  </div>
</Zone>
