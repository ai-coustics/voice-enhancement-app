<script lang="ts">
  import CloseButton from '../buttons/close-button.svelte';
  import MenuButton from '../buttons/menu-button.svelte';

  export let logoUrl: string;

  let hamburgerMenuOpen = false;

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
      <CloseButton on:click={closeMenu} />
    </header>

    <!-- on:click closes mobile menu after clicking a menu item -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="sidebar-container" on:click={closeMenu}>
      <a class="logo-in-sidebar" href="/">
        <img class="w-[100px]" src={logoUrl} alt="Logo" />
      </a>
      <slot name="sidebar" />
    </div>
  </aside>
  <main id="main">
    <header>
      <div class="menu-header">
        <MenuButton on:click={openMenu} />
      </div>
      <slot name="banner" />
    </header>
    <div class="main-wrapper">
      <slot name="main" />
    </div>
  </main>
</div>

<style lang="postcss">
  /* Common */
  .dashboard-layout {
    @apply flex h-dvh overflow-hidden;
  }

  aside {
    @apply flex flex-col bg-misty-rose overflow-y-auto;
  }

  aside header {
    @apply sticky top-0 flex w-full justify-between bg-misty-rose px-6 py-4;
  }

  .sidebar-container {
    @apply flex flex-col h-full;
  }

  .logo-in-sidebar {
    @apply self-center mt-5 mb-10;
  }

  main {
    @apply grow overflow-auto;
  }

  main header {
    @apply sticky top-0 w-full z-10;
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
      @apply absolute w-[300px] top-0 left-0 bottom-0 transition-all duration-500 z-30 shadow-[10px_10px_90px_90px_#00000040] -translate-x-full opacity-0;
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
