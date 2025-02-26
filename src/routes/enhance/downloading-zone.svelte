<script lang="ts">
  import Spinner from '$lib/ui/display/spinner.svelte';
  import Zone from '$lib/ui/display/zone.svelte';

  export let message: string;
</script>

<Zone class="border-royal-blue">
  <div class="flex flex-col items-center gap-11 py-16">
    <Spinner size={48} />
    <div class="mb-24 text-center">{message}</div>
  </div>
</Zone>
