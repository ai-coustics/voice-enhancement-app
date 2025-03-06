<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    color?: string;
    backgroundColor?: string;
    children: Snippet;
  }

  const { color = 'text-black', backgroundColor = 'bg-sleet', children }: Props = $props();
</script>

<span class="inline-block rounded-md {color} {backgroundColor} px-2 py-1 text-sm font-medium">
  {@render children()}
</span>
