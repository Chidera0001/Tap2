<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { registerServiceWorker } from '$lib/pwa';
  import { pwaManager } from '$lib/pwa-manager';
  import PWAStatus from '$lib/components/PWAStatus.svelte';
  
  // Accept SvelteKit props to prevent warnings
  export let params: any;
  export let data: any;
  
  export const load = async () => {
    return {};
  };

  onMount(() => {
    // Register service worker
    registerServiceWorker();
    // Initialize PWA manager (it's a singleton, so this ensures it's loaded)
    pwaManager;
  });
</script>

<main class="min-h-screen bg-white">
  <slot />
  <PWAStatus />
</main>