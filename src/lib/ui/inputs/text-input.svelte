<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import type { HTMLInputAttributes } from 'svelte/elements';

  export interface Props extends HTMLInputAttributes {}

  let { class: className = '', type = 'text', value = $bindable(''), ...rest }: Props = $props();
</script>

<input
  class={twMerge('rounded-lg border border-cloud px-3 py-2 shadow-sm', className as string)}
  {type}
  bind:value
  {...rest}
/>
