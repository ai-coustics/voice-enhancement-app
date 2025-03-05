<script lang="ts">
  import StepIndicator from '$lib/ui/display/step-indicator.svelte';

  export let current: number;
</script>

<div class="mt-6">
  <StepIndicator steps={['Generating', 'Done']} stepWidth={150} {current} />
</div>
