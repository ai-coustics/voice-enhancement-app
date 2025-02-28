<script lang="ts">
  import Zone from '$lib/ui/display/zone.svelte';
  import SettingsZone from './settings-zone.svelte';

  export let data;
</script>

<h1 class="mb-12">Settings</h1>

<div class="mx-auto flex max-w-[800px] flex-col items-center">
  <Zone>
    <SettingsZone settings={data.serverSettings} />
  </Zone>
</div>
