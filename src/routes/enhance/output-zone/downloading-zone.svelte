<script lang="ts">
  import Spinner from '$lib/ui/display/spinner.svelte';

  export let message: string;
</script>

<div class="flex flex-col items-center gap-11">
  <Spinner size={48} />
  <div class="mb-24 text-center">{message}</div>
</div>
