<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import TextInput from '../inputs/text-input.svelte';
  import FieldError from './field-error.svelte';

  let className = '';
  export { className as class };
  export let name: string;
  export let invalid = false;
  export let value = '';
</script>

<div class={twMerge('my-6', className)}>
  <label class="flex flex-col gap-2">
    <span><slot name="label">{name}</slot></span>
    <TextInput {name} bind:value on:input {...$$restProps} />
  </label>
  {#if invalid}
    <FieldError><slot name="error" /></FieldError>
  {/if}
</div>
