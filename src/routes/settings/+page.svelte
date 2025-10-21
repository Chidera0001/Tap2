<script lang="ts">
  import { onMount } from 'svelte';
  import Header from '$lib/components/Header.svelte';
  import { Shield, Palette, Globe } from 'lucide-svelte';
  
  // Settings state
  let userSettings = {
    preferences: {
      language: 'en',
      timezone: 'UTC'
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      marketing: false
    }
  };
  
  // UI state
  let isSaving = false;
  let saveSuccess = false;
  let hasChanges = false;
  
  // Load settings from localStorage on mount
  onMount(() => {
    loadSettings();
  });
  
  function loadSettings() {
    try {
      const saved = localStorage.getItem('tap2-settings');
      if (saved) {
        userSettings = { ...userSettings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }
  
  function updatePreference(type: string, value: string) {
    userSettings.preferences[type as keyof typeof userSettings.preferences] = value;
    hasChanges = true;
  }
  
  function updatePrivacy(type: string, value: boolean) {
    userSettings.privacy[type as keyof typeof userSettings.privacy] = value;
    hasChanges = true;
  }
  
  
  function saveSettings() {
    isSaving = true;
    saveSuccess = false;
    
    try {
      // Save to localStorage
      localStorage.setItem('tap2-settings', JSON.stringify(userSettings));
      
      // Simulate API call delay
      setTimeout(() => {
        isSaving = false;
        saveSuccess = true;
        hasChanges = false;
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          saveSuccess = false;
        }, 3000);
      }, 1000);
      
    } catch (error) {
      console.error('Error saving settings:', error);
      isSaving = false;
    }
  }
  
  function resetToDefaults() {
    userSettings = {
      preferences: {
        language: 'en',
        timezone: 'UTC'
      },
      privacy: {
        dataSharing: false,
        analytics: true,
        marketing: false
      }
    };
    hasChanges = true;
  }
</script>

<svelte:head>
  <title>Settings - Tap2 Loyalty</title>
  <meta name="description" content="Manage your account settings and preferences" />
</svelte:head>

<Header />

<main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <!-- Page Header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
    <p class="text-gray-600">Manage your account settings and preferences</p>
  </div>

  <!-- Settings Sections -->
  <div class="space-y-8">
    <!-- Preferences -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center mb-6">
        <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
          <Palette class="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Preferences</h2>
          <p class="text-sm text-gray-600">Customize your experience</p>
        </div>
      </div>
      
       <div class="space-y-6">
         <div>
          <label for="language-select" class="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select 
            id="language-select"
            bind:value={userSettings.preferences.language}
            on:change={() => updatePreference('language', userSettings.preferences.language)}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tap2-blue focus:border-tap2-blue"
          >
            <option value="en">English</option>
            <option value="nl">Nederlands</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
        
        <div>
          <label for="timezone-select" class="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select 
            id="timezone-select"
            bind:value={userSettings.preferences.timezone}
            on:change={() => updatePreference('timezone', userSettings.preferences.timezone)}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tap2-blue focus:border-tap2-blue"
          >
            <option value="UTC">UTC</option>
            <option value="Europe/Amsterdam">Amsterdam</option>
            <option value="Europe/London">London</option>
            <option value="America/New_York">New York</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Privacy -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center mb-6">
        <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
          <Shield class="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Privacy</h2>
          <p class="text-sm text-gray-600">Control your data and privacy</p>
        </div>
      </div>
      
      <div class="space-y-4">
        <div class="flex items-center justify-between py-3 border-b border-gray-100">
          <div>
            <h3 class="font-medium text-gray-900">Data Sharing</h3>
            <p class="text-sm text-gray-600">Allow data sharing for analytics</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              bind:checked={userSettings.privacy.dataSharing}
              on:change={() => updatePrivacy('dataSharing', userSettings.privacy.dataSharing)}
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tap2-blue"></div>
          </label>
        </div>
        
        <div class="flex items-center justify-between py-3 border-b border-gray-100">
          <div>
            <h3 class="font-medium text-gray-900">Analytics</h3>
            <p class="text-sm text-gray-600">Help improve the platform</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              bind:checked={userSettings.privacy.analytics}
              on:change={() => updatePrivacy('analytics', userSettings.privacy.analytics)}
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tap2-blue"></div>
          </label>
        </div>
        
        <div class="flex items-center justify-between py-3">
          <div>
            <h3 class="font-medium text-gray-900">Marketing</h3>
            <p class="text-sm text-gray-600">Receive marketing communications</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              bind:checked={userSettings.privacy.marketing}
              on:change={() => updatePrivacy('marketing', userSettings.privacy.marketing)}
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tap2-blue"></div>
          </label>
        </div>
      </div>
    </div>
  </div>

  <!-- Save Button -->
  <div class="mt-8 flex justify-between items-center">
    <button 
      on:click={resetToDefaults}
      class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
    >
      Reset to Defaults
    </button>
    
    <div class="flex items-center space-x-4">
      {#if saveSuccess}
        <div class="flex items-center text-green-600">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <span class="text-sm font-medium">Settings saved!</span>
        </div>
      {/if}
      
      <button 
        on:click={saveSettings}
        disabled={isSaving || !hasChanges}
        class="px-6 py-3 bg-tap2-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      >
        {#if isSaving}
          <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Saving...
        {:else}
          Save Settings
        {/if}
      </button>
    </div>
  </div>
</main>
