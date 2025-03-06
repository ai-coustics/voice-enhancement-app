<script lang="ts">
  import type { Snippet } from 'svelte';
  import { twMerge } from 'tailwind-merge';

  interface Props {
    class?: string;
    children: Snippet;
  }

  const { class: className = '', children }: Props = $props();
</script>

<div class={twMerge('w-full overflow-hidden rounded-2xl border-2 border-cloud p-9', className)}>
  {@render children()}
</div>
