<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

<p class="mt-2 text-sm font-semibold text-error-red-fg">
  {@render children()}
</p>
