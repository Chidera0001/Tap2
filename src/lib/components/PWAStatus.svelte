<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { pwaManager } from '$lib/pwa-manager';
  
  let showNotification = false;
  let showIOSInstructions = false;
  let showAndroidInstructions = false;
  let isInstalled = false;
  let canInstall = false;

  onMount(() => {
    // Only initialize in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Initialize state
    updateState();
    
    // Listen for PWA manager events
    window.addEventListener('pwa-notification-show', handleNotificationShow);
    window.addEventListener('pwa-notification-hide', handleNotificationHide);
    window.addEventListener('pwa-ios-instructions-show', handleIOSInstructionsShow);
    window.addEventListener('pwa-android-instructions-show', handleAndroidInstructionsShow);
    
    // Check state periodically
    const interval = setInterval(updateState, 1000);
    
    return () => {
      clearInterval(interval);
    };
  });

  onDestroy(() => {
    // Only remove listeners in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    window.removeEventListener('pwa-notification-show', handleNotificationShow);
    window.removeEventListener('pwa-notification-hide', handleNotificationHide);
    window.removeEventListener('pwa-ios-instructions-show', handleIOSInstructionsShow);
    window.removeEventListener('pwa-android-instructions-show', handleAndroidInstructionsShow);
  });

  function updateState() {
    // Only update state in browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    isInstalled = pwaManager.isPWAInstalled;
    canInstall = pwaManager.canInstallPWA;
    showNotification = pwaManager.shouldShowNotification;
  }

  function handleNotificationShow() {
    showNotification = true;
  }

  function handleNotificationHide() {
    showNotification = false;
  }

  function handleIOSInstructionsShow() {
    showIOSInstructions = true;
  }

  function handleAndroidInstructionsShow() {
    showAndroidInstructions = true;
  }

  async function installPWA() {
    const success = await pwaManager.installPWA();
    if (success) {
      showNotification = false;
    } else {
      // Show a message explaining why installation might not work
      alert("PWA installation not available. This usually works better on mobile devices or when deployed to a real domain (not localhost).");
    }
  }

  function dismissNotification() {
    pwaManager.dismissNotification();
    showNotification = false;
  }

  function dismissIOSInstructions() {
    showIOSInstructions = false;
    pwaManager.dismissNotification();
  }

  function dismissAndroidInstructions() {
    showAndroidInstructions = false;
    pwaManager.dismissNotification();
  }
</script>

<!-- PWA Install Notification Banner -->
{#if !isInstalled && canInstall && showNotification}
  <div class="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg z-50 animate-slide-down" style="transform: translateZ(0);">
    <div class="max-w-7xl mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <img src="/logo/Logo-tap.png" alt="Tap2" class="h-10 w-10 rounded-lg bg-white/20 p-1" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-white leading-tight">Install Tap2</h3>
          </div>
        </div>
        <div class="flex items-center space-x-2 ml-4">
          <button 
            on:click={installPWA}
            class="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-sm flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Install</span>
          </button>
          <button 
            on:click={dismissNotification}
            class="text-white/80 hover:text-white transition-colors p-1 rounded"
            aria-label="Dismiss notification"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- iOS Install Instructions -->
{#if showIOSInstructions}
  <div class="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg z-50 animate-slide-down" style="transform: translateZ(0);">
    <div class="max-w-7xl mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <img src="/logo/Logo-tap.png" alt="Tap2" class="h-10 w-10 rounded-lg bg-white/20 p-1" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-white leading-tight">Install Tap2</h3>
            <p class="text-sm text-white/90 mt-1">Tap the share button and select "Add to Home Screen"</p>
          </div>
        </div>
        <div class="flex items-center space-x-2 ml-4">
          <button 
            on:click={dismissIOSInstructions}
            class="text-white/80 hover:text-white transition-colors p-1 rounded"
            aria-label="Dismiss instructions"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Android Install Instructions -->
{#if showAndroidInstructions}
  <div class="fixed top-0 left-0 right-0 bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg z-50 animate-slide-down" style="transform: translateZ(0);">
    <div class="max-w-7xl mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <img src="/logo/Logo-tap.png" alt="Tap2" class="h-10 w-10 rounded-lg bg-white/20 p-1" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-white leading-tight">Install Tap2</h3>
            <p class="text-sm text-white/90 mt-1">Tap the menu (⋮) and select "Add to Home Screen" or "Install App"</p>
          </div>
        </div>
        <div class="flex items-center space-x-2 ml-4">
          <button 
            on:click={dismissAndroidInstructions}
            class="text-white/80 hover:text-white transition-colors p-1 rounded"
            aria-label="Dismiss instructions"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Small Install Prompt (Fallback) -->
{#if !isInstalled && canInstall && !showNotification && !showIOSInstructions && !showAndroidInstructions}
  <div class="fixed bottom-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
    <div class="flex items-center space-x-3">
      <div class="flex-shrink-0">
        <img src="/logo/Logo-tap.png" alt="Tap2" class="h-8 w-8 rounded-lg bg-white/20 p-1" />
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-sm font-semibold text-white">Install Tap2</h3>
      </div>
      <button 
        on:click={installPWA}
        class="bg-white text-blue-600 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors shadow-sm"
      >
        Install
      </button>
    </div>
  </div>
{/if}

<!-- Success Message -->
{#if isInstalled}
  <div class="fixed top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm flex items-center space-x-2">
    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
    </svg>
    <span class="font-semibold">PWA Installed Successfully!</span>
  </div>
{/if}




<style>
  @keyframes slide-down {
    from {
      transform: translateY(-100%) translateZ(0);
      opacity: 0;
    }
    to {
      transform: translateY(0) translateZ(0);
      opacity: 1;
    }
  }
  
  .animate-slide-down {
    animation: slide-down 0.5s ease-out;
    will-change: transform;
    backface-visibility: hidden;
  }
</style>
