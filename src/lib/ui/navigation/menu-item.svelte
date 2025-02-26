<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import Icon from '../display/icon.svelte';
  import Link from './link.svelte';

  let className = '';
  export { className as class };
  export let disabled = false;
  export let currentPage = false;
</script>

<li class={twMerge('menu-item ', className)} class:disabled class:currentPage>
  <Link role="nav" {...$$restProps} on:click>
    <Icon size="xs">
      <slot name="icon" />
    </Icon>
    <slot name="label" />
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
