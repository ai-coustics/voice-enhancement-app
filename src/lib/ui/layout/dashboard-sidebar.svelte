<script lang="ts">
  import type { Snippet } from 'svelte';
  import { twMerge } from 'tailwind-merge';

  // This component is intended to be used in conjunction with DashboardLayout,
  // they both adapt to mobile/desktop widths together.

  interface Props {
    class?: string;
    primary?: Snippet;
    secondary?: Snippet;
    other?: Snippet;
  }

  const { class: className = '', primary, secondary, other }: Props = $props();
</script>

<div class={twMerge('dashboard-sidebar', className)}>
  <div class="primary">
    {@render primary?.()}
  </div>
  <div class="secondary">
    {@render secondary?.()}
  </div>
  <div class="other">
    {@render other?.()}
  </div>
</div>

<style lang="postcss">
  /* Common */
  .dashboard-sidebar {
    @apply flex grow flex-col text-mineshaft;
  }

  .other {
    @apply grow;
  }

  /* Mobile */
  @media (max-width: 768px) {
  }

  /* Desktop */
  @media (min-width: 769px) {
    .secondary {
      @apply order-3;
    }
    .other {
      @apply order-2;
    }
  }
</style>
