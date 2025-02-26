<script lang="ts">
  import type { TShirtSize } from '$lib/utils/size.js';
  import { createToggleGroup, createSync } from '@melt-ui/svelte';
  import { createEventDispatcher } from 'svelte';
  import { twMerge } from 'tailwind-merge';

  type Option = {
    value: string;
    label: string;
    description?: string;
  };

  let className = '';
  export { className as class };
  export let size: Extract<TShirtSize, 'sm' | 'md'> = 'md';
  export let variant: 'bar' | 'well' = 'bar';
  export let name: string | undefined = undefined;
  export let options: Array<Option & any>;
  export let value: string | string[];

  const dispatch = createEventDispatcher<{ change: string | string[] }>();

  const empty = Array.isArray(value) ? [] : '';

  const {
    elements: { root, item },
    states
  } = createToggleGroup({
    type: Array.isArray(value) ? 'multiple' : 'single',
    loop: false,
    onValueChange: v => {
      if (v.next !== v.curr) {
        dispatch('change', v.next ?? empty);
      }
      return v.next;
    }
  });
  const { value: valueStore } = states;

  const sync = createSync(states);
  $: sync.value(value, v => (value = v ?? empty));
</script>

<fieldset {...$root} use:root class={twMerge('group', variant, size, className)}>
  {#each options as option}
    {@const isPressed = Array.isArray($valueStore)
      ? $valueStore.includes(option.value)
      : $valueStore === option.value}
    <button
      {...$item(option.value)}
      use:item
      class={twMerge('option', variant, size)}
      title={option.description}
    >
      <slot option={{ ...option, isPressed }}>
        {option.label}
      </slot>
    </button>
  {/each}

  <!-- 
    For some reason, createToggleGroup doesn't provide a hiddenInput element, 
    so we create it manually with the same attributes.
      <input {...$hiddenInput} use:hiddenInput  />
  -->
  <input
    hidden
    aria-hidden="true"
    tabindex="-1"
    data-melt--hidden-input=""
    style="position: absolute; opacity: 0; pointer-events: none; margin: 0px; transform: translateX(-100%);"
    {name}
    {value}
  />
</fieldset>

<style lang="postcss">
  /* Shared */

  .option {
    @apply bg-white transition-colors;
  }

  .option.sm {
    @apply px-[12px] py-[8px];
  }

  .option.md {
    @apply px-[20px] py-[12px];
  }

  /* Bar */

  .group.bar {
    @apply flex flex-col lg:flex-row items-stretch rounded-lg border border-cloud shadow-sm overflow-hidden;
  }

  .option.bar {
    @apply grow hover:bg-snow;
  }

  .option.bar:not(:first-child) {
    @apply border-t lg:border-t-0 lg:border-l border-cloud;
  }

  .option.bar[data-state='on'] {
    @apply bg-misty-rose;
  }

  /* Well */

  .group.well {
    @apply flex flex-wrap;
  }

  .group.well.sm {
    @apply gap-4;
  }

  .group.well.md {
    @apply gap-5;
  }

  .option.well {
    @apply border border-cloud hover:border-salmon text-black rounded-lg font-medium shadow-sm;
  }
  .option.well[data-state='on'] {
    @apply outline outline-[3px] outline-salmon;
  }
</style>
