<script lang="ts">
  import StepIndicator from '$lib/ui/display/step-indicator.svelte';

  interface Props {
    current: number;
  }

  const { current }: Props = $props();
</script>

<div class="mt-6">
  <StepIndicator steps={['Generating', 'Done']} stepWidth={150} {current} />
</div>
