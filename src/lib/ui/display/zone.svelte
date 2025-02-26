<script lang="ts">
  import { twMerge } from 'tailwind-merge';

  let className = '';
  export { className as class };
  export let dashed: boolean = false;
</script>

<div
  class={twMerge(
    'flex flex-col items-center justify-center w-full rounded-2xl border-2 border-cloud',
    className
  )}
  class:border-dashed={dashed}
>
  <slot />
</div>
