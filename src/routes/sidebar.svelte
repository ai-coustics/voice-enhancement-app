<script lang="ts">
  import { page } from '$app/stores';
  import Upload from '$lib/ui/icons/upload.svelte';
  import DashboardSidebar from '$lib/ui/layout/dashboard-sidebar.svelte';
  import MenuItem from '$lib/ui/navigation/menu-item.svelte';
</script>

<DashboardSidebar>
  <menu slot="primary">
    <MenuItem
      href="/enhance"
      currentPage={$page.url.pathname === '/enhance'}
      reload={$page.url.pathname === '/enhance'}
    >
      <Upload slot="icon" />
      <span slot="label">Upload</span>
    </MenuItem>
  </menu>

  <menu slot="secondary"></menu>
</DashboardSidebar>
