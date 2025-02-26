<script lang="ts">
  import Spinner from '$lib/ui/display/spinner.svelte';
  import StepIndicator from '$lib/ui/display/step-indicator.svelte';
  import Zone from '$lib/ui/display/zone.svelte';

  export let currentUpload: string;
</script>

<Zone class="border-royal-blue">
  <div class="flex flex-col items-center gap-11 py-16 md:px-24">
    <StepIndicator steps={['1. Upload', '2. Enhancement']} stepWidth={150} current={0} />
    <Spinner />
    <div class="flex flex-col items-center gap-2 px-4 text-center">
      <h3 class="font-semibold [word-break:break-word]">Uploading {currentUpload}</h3>
      <div class="text-sm">?%</div>
    </div>
  </div>
</Zone>
