<script lang="ts">
  import PlusIcon from '$lib/ui/icons/plus.svelte';
  import { twMerge } from 'tailwind-merge';
  import IconButton from './icon-button.svelte';
  import type { Props as IconButtonProps } from './icon-button.svelte';

  interface Props extends Omit<IconButtonProps, 'children'> {}

  const { class: className = '', ...rest }: Props = $props();
</script>

<IconButton class={twMerge('rotate-45 text-black', className as string)} title="Close" {...rest}>
  <PlusIcon />
</IconButton>
