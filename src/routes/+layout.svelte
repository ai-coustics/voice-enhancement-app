<script lang="ts">
  import DashboardLayout from '$lib/ui/layout/dashboard-layout.svelte';
  import Sidebar from './sidebar.svelte';
  import '../app.css';
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

<DashboardLayout logoUrl="/logos/wordmark.png">
  {#snippet sidebar()}
    <Sidebar />
  {/snippet}
  {#snippet main()}
    {@render children()}
  {/snippet}
</DashboardLayout>
