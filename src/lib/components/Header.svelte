<script lang="ts">
  import { page } from '$app/stores';
  
  // Navigation items
  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/create', label: 'Create Card' }
  ];
  
  // Mobile menu state
  let mobileMenuOpen = false;
  
  // Toggle mobile menu
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
</script>

<header class="bg-white border-b border-gray-200 sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <!-- Logo -->
      <div class="flex items-center">
        <div class="flex-shrink-0 flex items-center">
          <!-- Tap2 Logo -->
          <div class="flex items-center space-x-3">
            <img 
              src="/logo/Logo-tap.png" 
              alt="Tap2 Logo" 
              class="h-8 w-auto"
            />
            <span class="text-2xl font-bold text-black">Tap2</span>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="hidden md:flex space-x-8">
        {#each navItems as item}
          <a 
            href={item.href}
            class="text-gray-700 hover:text-tap2-blue transition-colors duration-200
                   {$page.url.pathname === item.href ? 'text-tap2-blue font-medium' : ''}"
          >
            {item.label}
          </a>
        {/each}
      </nav>

      <!-- Mobile menu button -->
      <div class="md:hidden">
        <button 
          type="button" 
          class="text-gray-700 hover:text-tap2-blue focus:outline-none focus:text-tap2-blue"
          aria-label="Toggle menu"
          on:click={toggleMobileMenu}
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Navigation -->
  {#if mobileMenuOpen}
    <div class="md:hidden border-t border-gray-200 bg-white">
      <div class="px-2 pt-2 pb-3 space-y-1">
        {#each navItems as item}
          <a 
            href={item.href}
            class="block px-3 py-2 text-gray-700 hover:text-tap2-blue hover:bg-gray-50 rounded-md transition-colors duration-200
                   {$page.url.pathname === item.href ? 'text-tap2-blue bg-gray-50 font-medium' : ''}"
            on:click={() => mobileMenuOpen = false}
          >
            {item.label}
          </a>
        {/each}
      </div>
    </div>
  {/if}
</header>
