<script lang="ts">
  import Spinner from '$lib/ui/display/spinner.svelte';
  import StepIndicator from '$lib/ui/display/step-indicator.svelte';
  import Zone from '$lib/ui/display/zone.svelte';
  import Link from '$lib/ui/navigation/link.svelte';
  import { createEventDispatcher } from 'svelte';

  export let fileCount = 0;

  const dispatch = createEventDispatcher<{
    reset: void;
  }>();
</script>

<Zone class="border-royal-blue">
  <div class="flex flex-col items-center gap-11 py-16 md:px-24">
    <StepIndicator steps={['1. Upload', '2. Enhancement']} stepWidth={150} current={1} />
    <Spinner />
    <div class="flex flex-col items-center gap-2 px-4 text-center">
      <h3 class="font-semibold [word-break:break-word]">
        Enhancing {fileCount} file{fileCount > 1 ? 's' : ''}...
      </h3>
      <p class="text-mineshaft">
        This might take a few minutes. The enhanced files will show up under
        <Link href="/dashboard/files">My Files</Link> as soon as they are done.
      </p>
      <p class="mt-8">
        <Link on:click={() => dispatch('reset')}>Back to upload</Link>
      </p>
    </div>
  </div>
</Zone>
