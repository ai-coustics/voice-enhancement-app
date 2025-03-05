<script lang="ts">
  import Zone from '$lib/ui/display/zone.svelte';
  import Settings from './settings.svelte';

  export let data;
</script>

<h1 class="mb-12">Settings</h1>

<div class="mx-auto flex max-w-[800px] flex-col items-center">
  <Zone>
    <Settings settings={data.settings} />
  </Zone>
</div>
