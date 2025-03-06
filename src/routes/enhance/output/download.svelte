<script lang="ts">
  import Icon from '$lib/ui/display/icon.svelte';
  import Link from '$lib/ui/navigation/link.svelte';
  import Download from '$lib/ui/icons/download.svelte';
  import Button from '$lib/ui/buttons/button.svelte';
  import Stepper from './stepper.svelte';

  interface Props {
    downloadUrl: string;
    downloadName: string;
    onDownloaded: () => void;
    onReset: () => void;
  }

  const { downloadUrl, downloadName, onDownloaded, onReset }: Props = $props();
</script>

<div class="flex flex-col items-center gap-12 text-center">
  <Stepper current={1} />

  <h3 class="m-0 font-normal [word-break:break-word]">The enhanced file is ready to download.</h3>

  <Link
    class="flex min-w-[180px] max-w-[90%] flex-col items-center overflow-hidden rounded-2xl border-2 p-6"
    href={downloadUrl}
    download={downloadName}
    target="new-tab"
    onclick={onDownloaded}
  >
    <p class="mb-3">Download</p>
    <Icon size="xl" class="mb-1">
      <Download />
    </Icon>
    <p class="trunc font-semibold">
      {downloadName}
    </p>
  </Link>

  <Button role="secondary" size="sm" class="mt-4" onclick={onReset}>Back to preview</Button>
</div>
