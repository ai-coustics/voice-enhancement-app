<script lang="ts">
  import StepIndicator from '$lib/ui/display/step-indicator.svelte';

  export let current: number;
</script>

<StepIndicator steps={['Uploading', 'Enhancing', 'Done']} stepWidth={150} {current} />
