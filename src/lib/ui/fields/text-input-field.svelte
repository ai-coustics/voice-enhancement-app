<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import TextInput from '../inputs/text-input.svelte';
  import FieldError from './field-error.svelte';
  import type { Props as TextInputProps } from '../inputs/text-input.svelte';
  import type { Snippet } from 'svelte';

  interface Props extends TextInputProps {
    invalid?: boolean;
    label?: Snippet;
    error?: Snippet;
  }

  let {
    class: className = '',
    name,
    invalid = false,
    value = $bindable(''),
    label,
    error,
    ...rest
  }: Props = $props();
</script>

<div class={twMerge('my-6', className as string)}>
  <label class="flex flex-col gap-2">
    <span>
      {#if label}
        {@render label()}
      {:else}
        {name}
      {/if}
    </span>
    <TextInput {name} bind:value {...rest} />
  </label>
  {#if invalid}
    <FieldError>{@render error?.()}</FieldError>
  {/if}
</div>
