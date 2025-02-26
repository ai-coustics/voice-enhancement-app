<script lang="ts">
  import Toasts from '$lib/ui/display/toasts.svelte';
  import DashboardLayout from '$lib/ui/layout/dashboard-layout.svelte';
  import Sidebar from './sidebar.svelte';
  import '../app.css';
</script>

<DashboardLayout logoUrl="/logos/wordmark.png">
  <Sidebar slot="sidebar" />
  <slot slot="main" />
</DashboardLayout>

<Toasts />
