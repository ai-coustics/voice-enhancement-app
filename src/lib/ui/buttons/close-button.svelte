<script lang="ts">
  import PlusIcon from '$lib/ui/icons/plus.svelte';
  import { twMerge } from 'tailwind-merge';
  import IconButton from './icon-button.svelte';

  let className = '';
  export { className as class };
</script>

<IconButton
  class={twMerge('rotate-45 text-black', className)}
  title="Close"
  on:click
  {...$$restProps}
>
  <PlusIcon />
</IconButton>
