<script lang="ts">
  import Spinner from '$lib/ui/display/spinner.svelte';
  import Stepper from './stepper.svelte';

  export let filename: string;
</script>

<div class="flex flex-col items-center gap-11">
  <Stepper current={0} />
  <Spinner />
  <h3 class="text-center font-semibold [word-break:break-word]">Uploading {filename}...</h3>
</div>
