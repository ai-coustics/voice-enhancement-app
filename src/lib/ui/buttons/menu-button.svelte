<script lang="ts">
  import BurgerIcon from '$lib/ui/icons/burger.svelte';
  import { twMerge } from 'tailwind-merge';
  import IconButton from './icon-button.svelte';

  let className = '';
  export { className as class };
</script>

<IconButton class={twMerge('text-black', className)} title="Open Menu" on:click {...$$restProps}>
  <BurgerIcon />
</IconButton>
