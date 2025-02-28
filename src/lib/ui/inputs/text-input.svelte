<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { twMerge } from 'tailwind-merge';

  let className = '';
  export { className as class };
  export let type = 'text';
  export let value = '';

  const dispatch = createEventDispatcher<{
    input: string;
  }>();

  // This workaround is necessary if we want to have a dynamic type attribute
  const handleInput = (e: Event) => {
    const inputEl = e.target as HTMLInputElement;
    value = inputEl?.value ?? '';
    dispatch('input', value);
  };
</script>

<input
  class={twMerge('rounded-lg border border-cloud px-3 py-2 shadow-sm', className)}
  {type}
  {value}
  on:input={handleInput}
  on:focus
  {...$$restProps}
/>
