<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '$lib/ui/display/icon.svelte';
  import Button from '$lib/ui/buttons/button.svelte';
  import AudioPreview from '$lib/ui/media/audio-preview.svelte';
  import Speaker from '$lib/ui/icons/speaker.svelte';
  import Information from '$lib/ui/icons/information.svelte';

  // --- Exports ---

  export let filename: string;
  export let originalBuffer: ArrayBuffer;
  export let enhancedBuffer: ArrayBuffer;

  const dispatch = createEventDispatcher<{
    download: number;
  }>();

  export async function generateDownload(): Promise<string> {
    const downloadUrl = await audioPreview.mixPlayerBuffers();
    return downloadUrl;
  }

  // --- Internal ---

  // The mix expressed as a number between 0 and 1
  let mix = 0.5;
  let isLoading = true;
  let audioPreview: AudioPreview;
</script>

<div class="flex w-full flex-col items-center">
  <Icon size="lg" class="mt-2 text-flamingo">
    <Speaker />
  </Icon>

  <h2 class="mb-6 mt-6 text-center">3. Preview</h2>

  <div class="w-full max-w-[460px]">
    <h4 class="trunc mb-1 shrink-0 grow-0 font-normal">{filename}</h4>

    <AudioPreview
      {originalBuffer}
      {enhancedBuffer}
      bind:mix
      on:load={() => {
        isLoading = false;
      }}
      bind:this={audioPreview}
    />

    <div class="mb-9 mt-12 flex items-start gap-2 text-sm text-mineshaft">
      <div class="text-info-blue-fg">
        <Information />
      </div>
      <p class="text-sm text-mineshaft">
        Preview playback might glitch depending on your connection quality. Rest assured that the
        downloaded file will play back flawlessly.
      </p>
    </div>
  </div>

  <Button
    disabled={isLoading}
    size="sm"
    on:click={() => {
      dispatch('download', mix);
    }}>Download</Button
  >
</div>
