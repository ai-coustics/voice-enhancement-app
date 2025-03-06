<script lang="ts">
  import PauseIcon from '$lib/ui/icons/pause.svelte';
  import PlayIcon from '$lib/ui/icons/play.svelte';
  import Button from '../buttons/button.svelte';
  import Spinner from '../display/spinner.svelte';

  interface Props {
    state: 'loading' | 'playing' | 'paused';
    disabled?: boolean;
    onclick: () => void;
  }

  const { state, disabled = false, onclick }: Props = $props();
</script>

<Button
  role="primary"
  {disabled}
  class="mr-2 rounded-full border-8 p-2
    {disabled
    ? 'border-sleet bg-sand'
    : 'cursor-pointer border-misty-rose bg-flamingo hover:border-[hsl(228,50%,90%)]'}"
  {onclick}
>
  {#if state === 'loading'}
    <div>
      <Spinner color="white" size={16} />
    </div>
  {:else if state === 'paused'}
    <div id="play" class="relative left-[1px] h-4 w-4 justify-center">
      <PlayIcon />
    </div>
  {:else}
    <div class="flex h-4 w-4 justify-center">
      <PauseIcon />
    </div>
  {/if}
</Button>
