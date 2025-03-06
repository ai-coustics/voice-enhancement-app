<script lang="ts">
  import Button from '$lib/ui/buttons/button.svelte';
  import Spinner from '$lib/ui/display/spinner.svelte';
  import Stepper from './stepper.svelte';

  interface Props {
    filename: string;
    onCancel: () => void;
  }

  const { filename, onCancel }: Props = $props();
</script>

<div class="flex flex-col items-center gap-12 text-center">
  <Stepper current={0} />
  <div class="flex max-w-full items-center gap-3">
    <Spinner size={18} />
    <h3 class="trunc m-0 font-normal">
      Uploading <span class="font-semibold">{filename}</span>...
    </h3>
  </div>
  <Button role="secondary" size="sm" onclick={onCancel}>Cancel</Button>
</div>
