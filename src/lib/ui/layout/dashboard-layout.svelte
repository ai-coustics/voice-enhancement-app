<script lang="ts">
  import type { Snippet } from 'svelte';
  import CloseButton from '../buttons/close-button.svelte';
  import MenuButton from '../buttons/menu-button.svelte';

  interface Props {
    logoUrl: string;
    sidebar: Snippet;
    banner?: Snippet;
    main: Snippet;
  }

  const { logoUrl, sidebar, banner, main }: Props = $props();

  let hamburgerMenuOpen = $state(false);

  function openMenu() {
    hamburgerMenuOpen = true;
  }

  function closeMenu() {
    hamburgerMenuOpen = false;
  }
</script>

<div class="dashboard-layout">
  <aside class={hamburgerMenuOpen ? 'hamburger-menu-open' : ''}>
    <header>
      <a class="" href="/"><img class="w-[100px]" src={logoUrl} alt="Logo" /></a>
      <CloseButton onclick={closeMenu} />
    </header>

    <!-- onclick closes mobile menu after clicking a menu item -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="sidebar-container" onclick={closeMenu}>
      <a class="logo-in-sidebar" href="/">
        <img class="w-[100px]" src={logoUrl} alt="Logo" />
      </a>
      {@render sidebar()}
    </div>
  </aside>
  <main id="main">
    <header>
      <div class="menu-header">
        <MenuButton onclick={openMenu} />
      </div>
      {@render banner?.()}
    </header>
    <div class="main-wrapper">
      {@render main()}
    </div>
  </main>
</div>

<style lang="postcss">
  /* Common */
  .dashboard-layout {
    @apply flex h-dvh overflow-hidden;
  }

  aside {
    @apply flex flex-col overflow-y-auto bg-misty-rose;
  }

  aside header {
    @apply sticky top-0 flex w-full justify-between bg-misty-rose px-6 py-4;
  }

  .sidebar-container {
    @apply flex h-full flex-col;
  }

  .logo-in-sidebar {
    @apply mb-10 mt-5 self-center;
  }

  main {
    @apply grow overflow-auto;
  }

  main header {
    @apply sticky top-0 z-10 w-full;
  }

  main .menu-header {
    @apply flex justify-between bg-misty-rose px-4 py-4;
  }

  /* Mobile */
  @media (max-width: 768px) {
    .dashboard-layout {
      @apply relative;
    }

    aside {
      /* Opacity 0 is needed to prevent the drop shadow from bleeding over when closed */
      @apply absolute bottom-0 left-0 top-0 z-30 w-[300px] -translate-x-full opacity-0 shadow-[10px_10px_90px_90px_#00000040] transition-all duration-500;
    }

    aside.hamburger-menu-open {
      @apply translate-x-0 opacity-100;
    }

    aside.hamburger-menu-open ~ main {
      @apply pointer-events-none;
    }

    .sidebar-container {
      @apply p-9;
    }

    .logo-in-sidebar {
      @apply hidden;
    }

    main {
      @apply h-full;
    }

    .main-wrapper {
      @apply px-4 py-4;
    }
  }

  /* Desktop */
  @media (min-width: 769px) {
    aside {
      @apply w-[180px] shrink-0 grow-0;
    }

    aside header,
    main .menu-header {
      @apply hidden;
    }

    .sidebar-container {
      @apply p-4;
    }

    main {
      @apply grow;
    }

    .main-wrapper {
      @apply px-10 py-10;
    }
  }
</style>
