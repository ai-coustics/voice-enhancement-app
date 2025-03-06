<script lang="ts">
  import BurgerIcon from '$lib/ui/icons/burger.svelte';
  import { twMerge } from 'tailwind-merge';
  import IconButton from './icon-button.svelte';
  import type { Props as IconButtonProps } from './icon-button.svelte';

  interface Props extends Omit<IconButtonProps, 'children'> {}

  const { class: className = '', ...rest }: Props = $props();
</script>

<IconButton class={twMerge('text-black', className as string)} title="Open Menu" {...rest}>
  <BurgerIcon />
</IconButton>
