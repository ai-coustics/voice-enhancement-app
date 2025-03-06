<script lang="ts">
  import TextInputField from '$lib/ui/fields/text-input-field.svelte';
  import Button from '$lib/ui/buttons/button.svelte';
  import { request } from '$lib/api/request';
  import { invalidateAll } from '$app/navigation';

  interface Props {
    settings: {
      apiRoot: string;
      apiKey: string;
      hasServer: boolean;
    };
  }

  const { settings }: Props = $props();

  let local = $state({
    apiRoot: settings.apiRoot,
    apiKey: settings.apiKey
  });

  async function save(e: Event) {
    try {
      if (settings.hasServer) {
        // When running as a node app, we can save settings to our own endpoint.
        await request(window.location.origin, 'server/settings', undefined, local);
      } else {
        // Otherwise, we save to local storage.
        e.preventDefault();
        localStorage.setItem('apiRoot', local.apiRoot);
        localStorage.setItem('apiKey', local.apiKey);
      }
      invalidateAll();
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }
</script>

<form>
  <div class="flex flex-col items-start">
    <TextInputField name="API Root" bind:value={local.apiRoot} class="mt-0 w-full" />
    <TextInputField name="API Key" bind:value={local.apiKey} class="mb-0 w-full" />
    <Button size="sm" class="mt-12 min-w-[100px]" onclick={save}>Save</Button>
  </div>
</form>
