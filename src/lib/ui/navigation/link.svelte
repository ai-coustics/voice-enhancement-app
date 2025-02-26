<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import preset from '../tailwind-preset';
  import Spinner from '../display/spinner.svelte';

  let className = '';
  export { className as class };
  export let href: string = '';
  export let role: 'inline' | 'nav' = 'inline';
  export let target: 'same-tab' | 'new-tab' = 'same-tab';
  export let reload = false;
  export let isLoading = false;
  export let download: string | undefined = undefined;
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
  on:click
>
  <slot />
  {#if isLoading}
    <span class="ml-3">
      <Spinner color={preset.theme.colors['cobalt']} size={14} />
    </span>
  {/if}
</svelte:element>
