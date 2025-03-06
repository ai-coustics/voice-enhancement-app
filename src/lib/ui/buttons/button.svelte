<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import type { TShirtSize } from '$lib/utils/size';
  import preset from '$lib/ui/tailwind-preset';
  import Spinner from '$lib/ui/display/spinner.svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  export interface Props extends HTMLButtonAttributes {
    role?: 'primary' | 'secondary' | 'accent';
    size?: Extract<TShirtSize, 'sm' | 'md'>;
    isLoading?: boolean;
    loadingCircleColor?: string | undefined; // Hack
    children: Snippet;
  }

  const {
    class: className = '',
    role = 'primary',
    size = 'md',
    disabled = false,
    isLoading = false,
    loadingCircleColor = undefined,
    children,
    ...rest
  }: Props = $props();

  const isPrimary = role === 'primary';

  const commonStyles =
    'flex items-center justify-center border rounded-lg font-medium transition-colors';

  const primaryStyles = 'bg-black border border-black text-white';
  const primaryEnabledStyles =
    'hover:bg-royal-blue hover:border-royal-blue active:brightness-[0.95]';
  const primaryDisabledStyles = 'bg-sand border-sand text-white';

  const secondaryStyles = 'bg-transparent border border-black text-black';
  const secondaryEnabledStyles =
    'hover:bg-royal-blue hover:border-royal-blue hover:text-white active:brightness-[0.95]';
  const secondaryDisabledStyles = 'border-clay text-clay';
</script>

<button
  class={twMerge(
    commonStyles,
    size === 'md' ? 'px-[20px] py-[12px]' : 'px-[12px] py-[8px]',
    isPrimary ? primaryStyles : secondaryStyles,
    disabled
      ? isPrimary
        ? primaryDisabledStyles
        : secondaryDisabledStyles
      : isPrimary
        ? primaryEnabledStyles
        : secondaryEnabledStyles,
    className as string
  )}
  disabled={disabled || isLoading}
  {...rest}
>
  {#if isLoading}
    <Spinner
      color={loadingCircleColor
        ? loadingCircleColor
        : isPrimary
          ? preset.theme.colors['white']
          : preset.theme.colors['black']}
      size={size === 'sm' ? 16 : 20}
    />
  {:else}
    {@render children()}
  {/if}
</button>
