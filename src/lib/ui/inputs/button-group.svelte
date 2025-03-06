<script lang="ts">
  import { run } from 'svelte/legacy';

  import type { TShirtSize } from '$lib/utils/size.js';
  import { createToggleGroup, createSync } from '@melt-ui/svelte';
  import { type Snippet } from 'svelte';
  import { twMerge } from 'tailwind-merge';

  type Option = {
    value: string;
    label: string;
    description?: string;
  };

  interface Props {
    class?: string;
    size?: Extract<TShirtSize, 'sm' | 'md'>;
    variant?: 'bar' | 'well';
    name?: string | undefined;
    options: Array<Option & any>;
    value: string | string[];
    onChange?: (value: string | string[]) => void;
    children?: Snippet<[any]>;
  }

  let {
    class: className = '',
    size = 'md',
    variant = 'bar',
    name = undefined,
    options,
    value = $bindable(),
    onChange,
    children
  }: Props = $props();

  const empty = Array.isArray(value) ? [] : '';

  const {
    elements: { root, item },
    states
  } = createToggleGroup({
    type: Array.isArray(value) ? 'multiple' : 'single',
    loop: false,
    onValueChange: (v) => {
      if (v.next !== v.curr) {
        onChange?.(v.next ?? empty);
      }
      return v.next;
    }
  });
  const { value: valueStore } = states;

  const sync = createSync(states);
  run(() => {
    sync.value(value, (v) => (value = v ?? empty));
  });
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
      {#if children}
        {@render children({ option: { ...option, isPressed } })}
      {:else}
        {option.label}
      {/if}
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
    @apply flex flex-col items-stretch overflow-hidden rounded-lg border border-cloud shadow-sm lg:flex-row;
  }

  .option.bar {
    @apply grow hover:bg-snow;
  }

  .option.bar:not(:first-child) {
    @apply border-t border-cloud lg:border-l lg:border-t-0;
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
    @apply rounded-lg border border-cloud font-medium text-black shadow-sm hover:border-salmon;
  }
  .option.well[data-state='on'] {
    @apply outline outline-[3px] outline-salmon;
  }
</style>
