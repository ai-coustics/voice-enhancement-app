<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import Icon from '../display/icon.svelte';
  import type { TShirtSize } from '../../utils/size.js';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  export interface Props extends HTMLButtonAttributes {
    size?: Exclude<TShirtSize, 'xl'>;
    children: Snippet;
  }

  const {
    class: className = '',
    size = 'md',
    disabled = false,
    children,
    ...rest
  }: Props = $props();

  const sizeStyles = size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-6 w-6' : 'h-8 w-8';
  const enabledStyles = 'text-black hover:text-cobalt active:brightness-[0.8]';
  const disabledStyles = 'text-clay';
</script>

<button
  class={twMerge(
    'shrink-0 grow-0 transition-colors',
    sizeStyles,
    disabled ? disabledStyles : enabledStyles,
    className as string
  )}
  {disabled}
  {...rest}
>
  <Icon>
    {@render children()}
  </Icon>
</button>
