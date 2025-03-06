<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import Icon from '../display/icon.svelte';
  import Link from './link.svelte';
  import type { Props as LinkProps } from './link.svelte';
  import type { Snippet } from 'svelte';

  interface Props extends Omit<LinkProps, 'children'> {
    disabled?: boolean;
    currentPage?: boolean;
    icon: Snippet;
    label: Snippet;
  }

  const {
    class: className = '',
    disabled = false,
    currentPage = false,
    icon,
    label,
    ...rest
  }: Props = $props();
</script>

<li class={twMerge('menu-item ', className)} class:disabled class:currentPage>
  <Link role="nav" {...rest}>
    <Icon size="xs">
      {@render icon()}
    </Icon>
    {@render label()}
  </Link>
</li>

<style lang="postcss">
  .menu-item {
    @apply mb-3 rounded-[10px] px-3 py-2 transition-colors;
  }

  .menu-item > :global(*) {
    @apply flex w-full items-center gap-2;
  }

  .menu-item:hover {
    background-color: hsla(0, 0%, 100%, 0.5);
  }

  .menu-item:active {
    background-color: hsla(0, 0%, 100%, 0.5);
  }

  .menu-item.disabled {
    @apply pointer-events-none opacity-50;
  }

  .menu-item.currentPage {
    @apply bg-rose text-black;
  }

  .menu-item.currentPage :global(a) {
    @apply text-black;
  }
</style>
