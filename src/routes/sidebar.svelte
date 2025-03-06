<script lang="ts">
  import { page } from '$app/state';
  import Settings from '$lib/ui/icons/settings.svelte';
  import Upload from '$lib/ui/icons/upload.svelte';
  import DashboardSidebar from '$lib/ui/layout/dashboard-sidebar.svelte';
  import MenuItem from '$lib/ui/navigation/menu-item.svelte';
</script>

<DashboardSidebar>
  {#snippet primary()}
    <menu>
      <MenuItem href="/enhance" currentPage={page.url.pathname.startsWith('/enhance')}>
        {#snippet icon()}
          <Upload />
        {/snippet}
        {#snippet label()}
          <span>Enhance</span>
        {/snippet}
      </MenuItem>
      <MenuItem href="/settings" currentPage={page.url.pathname.startsWith('/settings')}>
        {#snippet icon()}
          <Settings />
        {/snippet}
        {#snippet label()}
          <span>Settings</span>
        {/snippet}
      </MenuItem>
    </menu>
  {/snippet}

  {#snippet secondary()}
    <menu></menu>
  {/snippet}
</DashboardSidebar>
