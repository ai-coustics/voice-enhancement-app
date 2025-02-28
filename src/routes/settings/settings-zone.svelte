<script lang="ts">
  import TextInputField from '$lib/ui/fields/text-input-field.svelte';
  import Button from '$lib/ui/buttons/button.svelte';
  import { request } from '$lib/api/request';
  import { invalidateAll } from '$app/navigation';

  export let settings: {
    apiRoot: string;
    apiKey: string;
  };

  let local = {
    apiRoot: settings.apiRoot,
    apiKey: settings.apiKey
  };

  async function save() {
    await request(window.location.origin, 'server/settings', undefined, local);
    invalidateAll();
  }
</script>

<form>
  <div class="flex flex-col items-start">
    <TextInputField name="API Root" bind:value={local.apiRoot} class="mt-0 w-full" />
    <TextInputField name="API Key" bind:value={local.apiKey} class="mb-0 w-full" />
    <Button size="sm" class="mt-12 min-w-[100px]" on:click={save}>Save</Button>
  </div>
</form>
