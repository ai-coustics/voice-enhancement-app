<script lang="ts">
  import { twMerge } from 'tailwind-merge';

  let className = '';
  export { className as class };
</script>

<div class={twMerge('w-full overflow-hidden rounded-2xl border-2 border-cloud p-9', className)}>
  <slot />
</div>
