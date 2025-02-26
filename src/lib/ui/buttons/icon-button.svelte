<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import Icon from '../display/icon.svelte';
  import type { TShirtSize } from '../../utils/size.js';

  let className = '';
  export { className as class };
  export let size: Exclude<TShirtSize, 'xl'> = 'md';
  export let disabled: boolean = false;

  const sizeStyles = size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-6 w-6' : 'h-8 w-8';
  const enabledStyles = 'text-black hover:text-cobalt active:brightness-[0.8]';
  const disabledStyles = 'text-clay';
</script>

<button
  class={twMerge(
    'transition-colors grow-0 shrink-0',
    sizeStyles,
    disabled ? disabledStyles : enabledStyles,
    className
  )}
  {disabled}
  on:click
  {...$$restProps}
>
  <Icon>
    <slot />
  </Icon>
</button>
