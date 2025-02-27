<script lang="ts">
  import Spinner from '$lib/ui/display/spinner.svelte';
  import Zone from '$lib/ui/display/zone.svelte';
  import Link from '$lib/ui/navigation/link.svelte';
  import { createEventDispatcher } from 'svelte';
  import Stepper from './stepper.svelte';

  export let filename: string;

  const dispatch = createEventDispatcher<{
    cancel: void;
  }>();
</script>

<Zone class="border-royal-blue">
  <div class="flex flex-col items-center gap-11 py-16">
    <Stepper current={1} />
    <Spinner />
    <div class="flex flex-col items-center gap-2 px-4 text-center">
      <h3 class="font-semibold [word-break:break-word]">Enhancing {filename}...</h3>
      <p class="text-mineshaft">This might take a few minutes.</p>
      <p class="mt-8">
        <Link on:click={() => dispatch('cancel')}>Cancel</Link>
      </p>
    </div>
  </div>
</Zone>
