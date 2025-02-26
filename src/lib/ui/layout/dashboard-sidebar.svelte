<script lang="ts">
  import { twMerge } from 'tailwind-merge';

  // This component is intended to be used in conjunction with DashboardLayout,
  // they both adapt to mobile/desktop widths together.

  let className = '';
  export { className as class };
</script>

<div class={twMerge('dashboard-sidebar', className)}>
  <div class="primary">
    <slot name="primary" />
  </div>
  <div class="secondary">
    <slot name="secondary" />
  </div>
  <div class="other">
    <slot name="other" />
  </div>
</div>

<style lang="postcss">
  /* Common */
  .dashboard-sidebar {
    @apply flex flex-col text-mineshaft grow;
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
