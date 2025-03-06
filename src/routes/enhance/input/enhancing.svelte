<script lang="ts">
  import Spinner from '$lib/ui/display/spinner.svelte';
  import Stepper from './stepper.svelte';
  import Button from '$lib/ui/buttons/button.svelte';

  interface Props {
    filename: string;
    onCancel: () => void;
  }

  const { filename, onCancel }: Props = $props();
</script>

<div class="flex flex-col items-center gap-12 text-center">
  <Stepper current={1} />
  <div class="flex max-w-full flex-col items-center gap-3">
    <div class="flex max-w-full items-center gap-3">
      <Spinner size={18} />
      <h3 class="trunc m-0 font-normal">
        Enhancing <span class="font-semibold">{filename}</span>...
      </h3>
    </div>
    <p class="text-mineshaft">This might take a few minutes.</p>
  </div>
  <Button role="secondary" size="sm" onclick={onCancel}>Cancel</Button>
</div>
