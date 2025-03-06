<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import preset from '../tailwind-preset';
  import Spinner from '../display/spinner.svelte';
  import type { Snippet } from 'svelte';

  export interface Props {
    class?: string;
    href?: string;
    role?: 'inline' | 'nav';
    target?: 'same-tab' | 'new-tab';
    reload?: boolean;
    isLoading?: boolean;
    download?: string | undefined;
    onclick?: () => void;
    children: Snippet;
  }

  const {
    class: className = '',
    href = '',
    role = 'inline',
    target = 'same-tab',
    reload = false,
    isLoading = false,
    download = undefined,
    onclick,
    children
  }: Props = $props();
</script>

<svelte:element
  this={href ? 'a' : 'button'}
  role={href ? 'link' : 'button'}
  type={href ? undefined : 'button'}
  href={href ? href : undefined}
  download={href ? download : undefined}
  target={href ? (target === 'new-tab' ? '_blank' : undefined) : undefined}
  data-sveltekit-reload={reload}
  class={twMerge(
    `inline-flex items-center ${role === 'inline' ? 'text-royal-blue' : 'text-mineshaft'} hover:text-black`,
    className
  )}
  {onclick}
>
  {@render children()}
  {#if isLoading}
    <span class="ml-3">
      <Spinner color={preset.theme.colors['cobalt']} size={14} />
    </span>
  {/if}
</svelte:element>
