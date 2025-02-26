<script lang="ts">
  import Spinner from '$lib/ui/display/spinner.svelte';
  import StepIndicator from '$lib/ui/display/step-indicator.svelte';
  import Zone from '$lib/ui/display/zone.svelte';

  export let filename: string;
</script>

<Zone class="border-royal-blue">
  <div class="flex flex-col items-center gap-11 py-16">
    <StepIndicator steps={['1. Upload', '2. Enhancement']} stepWidth={150} current={0} />
    <Spinner />
    <h3 class="text-center font-semibold [word-break:break-word]">Uploading {filename}...</h3>
  </div>
</Zone>
