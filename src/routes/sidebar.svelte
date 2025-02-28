<script lang="ts">
  import { page } from '$app/stores';
  import Settings from '$lib/ui/icons/settings.svelte';
  import Upload from '$lib/ui/icons/upload.svelte';
  import DashboardSidebar from '$lib/ui/layout/dashboard-sidebar.svelte';
  import MenuItem from '$lib/ui/navigation/menu-item.svelte';
</script>

<DashboardSidebar>
  <menu slot="primary">
    <MenuItem href="/enhance" currentPage={$page.url.pathname === '/enhance'}>
      <Upload slot="icon" />
      <span slot="label">Enhance</span>
    </MenuItem>
    <MenuItem href="/settings" currentPage={$page.url.pathname === '/settings'}>
      <Settings slot="icon" />
      <span slot="label">Settings</span>
    </MenuItem>
  </menu>

  <menu slot="secondary"></menu>
</DashboardSidebar>
