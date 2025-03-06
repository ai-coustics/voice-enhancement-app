<script lang="ts">
  import Button from '$lib/ui/buttons/button.svelte';
  import Stepper from './stepper.svelte';

  interface Props {
    filename: string;
    onReset: () => void;
  }

  const { filename, onReset }: Props = $props();
</script>

<div class="flex flex-col items-center gap-12 text-center">
  <Stepper current={2} />
  <h3 class="trunc m-0 font-normal">
    Finished enhancing <span class="font-semibold">{filename}</span>.
  </h3>
  <Button role="secondary" size="sm" onclick={onReset}>Start over</Button>
</div>
