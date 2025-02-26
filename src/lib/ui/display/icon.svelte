<script lang="ts">
  import type { TShirtSize } from '../../utils/size.js';

  export let size: TShirtSize | undefined = undefined;

  let className = '';
  export { className as class };
</script>

<div class={['icon', size ?? '', className].join(' ')}>
  <slot />
</div>

<style lang="postcss">
  .icon {
    display: inline-block;
  }

  .icon > :global(svg) {
    height: 100%;
    width: 100%;
  }

  .xxs {
    height: 12px;
    width: 12px;
  }

  .xs {
    height: 16px;
    width: 16px;
  }

  .sm {
    height: 20px;
    width: 20px;
  }

  .md {
    height: 24px;
    width: 24px;
  }

  .lg {
    height: 32px;
    width: 32px;
  }

  .xl {
    height: 48px;
    width: 48px;
  }
</style>
