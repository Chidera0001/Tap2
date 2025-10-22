<script lang="ts">
  import { onMount } from 'svelte';
  import Header from '$lib/components/Header.svelte';
  import LoyaltyCard from '$lib/components/LoyaltyCard.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import { Plus, BarChart3, Settings } from 'lucide-svelte';
  import { convex } from '$lib/convex';
  import { api } from '$lib/convex-generated/api';
  
  // Accept SvelteKit props to prevent warnings
  export const params = undefined;
  export const data = undefined;
  
  // State
  let loyaltyCards: any[] = [];
  let isLoading = true;
  let hasError = false;
  
  // Fallback data for when Convex is not available
  const fallbackData = [
    {
      _id: 'demo-1',
      businessName: 'Café Amsterdam',
      location: 'Amsterdam, Netherlands',
      activeCards: 45,
      redemptions: 12,
      rewardThreshold: 10,
      color: '#0055FF',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'demo-2', 
      businessName: 'Bistro Rotterdam',
      location: 'Rotterdam, Netherlands',
      activeCards: 32,
      redemptions: 8,
      rewardThreshold: 8,
      color: '#FF6B35',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'demo-3',
      businessName: 'The Hague Coffee',
      location: 'The Hague, Netherlands', 
      activeCards: 28,
      redemptions: 15,
      rewardThreshold: 12,
      color: '#28A745',
      createdAt: new Date().toISOString()
    }
  ];
  
  // Load data on mount
  onMount(async () => {
    try {
      const cards = await convex.query(api.loyaltyCards.list);
      loyaltyCards = cards || [];
      isLoading = false;
      
      if (!cards || cards.length === 0) {
        hasError = false; // Not an error, just empty
      }
    } catch (error) {
      console.error('Error loading loyalty cards:', error);
      loyaltyCards = [];
      hasError = true;
      isLoading = false;
    }
  });
  
  // Calculate dashboard stats
  $: totalActiveCards = loyaltyCards ? loyaltyCards.reduce((sum, card) => sum + (card.activeCards || 0), 0) : 0;
  $: totalRedemptions = loyaltyCards ? loyaltyCards.reduce((sum, card) => sum + (card.redemptions || 0), 0) : 0;
  $: totalBusinesses = loyaltyCards ? loyaltyCards.length : 0;
  $: avgEngagement = loyaltyCards && loyaltyCards.length > 0 
    ? Math.round(loyaltyCards.reduce((sum, card) => sum + ((card.redemptions || 0) / (card.activeCards || 1)), 0) / loyaltyCards.length * 100)
    : 0;
  
  // Function to seed data
  async function handleSeedData() {
    try {
      // First seed loyalty cards
      await convex.mutation(api.loyaltyCards.seedData);
      
      // Then manually call the other seed functions using the client directly
      await convex.mutation("activities:seedData");
      await convex.mutation("insights:seedData");
      
      // Reload data
      const cards = await convex.query(api.loyaltyCards.list);
      loyaltyCards = cards || [];
      hasError = false;
    } catch (error) {
      console.error('Error seeding data:', error);
      // For now, use fallback data if Convex fails
      loyaltyCards = fallbackData;
      hasError = false;
    }
  }
</script>

<svelte:head>
  <title>Tap2 Loyalty Dashboard</title>
  <meta name="description" content="Manage your digital loyalty card programs" />
</svelte:head>

<Header />

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

  <!-- Stats Overview -->
  <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-8 pb-8">
    <StatCard 
      title="Total Active Cards" 
      value={(totalActiveCards || 0).toLocaleString()} 
      trend="up"
      trendValue="+12% this month"
    />
    <StatCard 
      title="Total Redemptions" 
      value={(totalRedemptions || 0).toLocaleString()} 
      trend="up"
      trendValue="+8% this month"
    />
    <StatCard 
      title="Active Businesses" 
      value={totalBusinesses} 
      trend="up"
      trendValue="+2 this month"
    />
    <StatCard 
      title="Avg Engagement" 
      value={avgEngagement ? `${avgEngagement}%` : '0%'} 
      trend="up"
      trendValue="+3% this month"
    />
  </div>

  <!-- Loyalty Cards Grid -->
  <div class="mb-8">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-3 sm:space-y-0">
      <h2 class="text-xl font-semibold text-black">Loyalty Programs</h2>
      <div class="flex space-x-3">
        <!-- <button 
          on:click={handleSeedData}
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          Add Demo Data
        </button> -->
        <a 
          href="/create" 
          class="btn-primary text-sm w-full sm:w-auto text-center"
        >
          + Create New Program
        </a>
      </div>
    </div>

    {#if isLoading}
      <!-- Loading State -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each Array(3) as _}
          <div class="card p-6 animate-pulse">
            <div class="h-4 bg-gray-200 rounded mb-4"></div>
            <div class="h-3 bg-gray-200 rounded mb-2"></div>
            <div class="h-3 bg-gray-200 rounded mb-4"></div>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="h-8 bg-gray-200 rounded"></div>
              <div class="h-8 bg-gray-200 rounded"></div>
            </div>
            <div class="h-2 bg-gray-200 rounded mb-2"></div>
            <div class="h-2 bg-gray-200 rounded"></div>
          </div>
        {/each}
      </div>
    {:else if hasError}
      <!-- Error State -->
      <div class="text-center py-12">
        <div class="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <span class="text-4xl">⚠️</span>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Connection Error</h3>
        <p class="text-gray-600 mb-6">Unable to connect to the database. Please check your Convex deployment.</p>
        <div class="space-x-4">
          <button 
            on:click={() => window.location.reload()} 
            class="btn-primary"
          >
            Retry Connection
          </button>
          <a href="/create" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Try Creating a Card
          </a>
        </div>
      </div>
    {:else if loyaltyCards && loyaltyCards.length === 0}
      <!-- Empty State -->
      <div class="text-center py-12">
        <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span class="text-4xl">💳</span>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No loyalty programs yet</h3>
        <p class="text-gray-600 mb-6">Create your first digital loyalty card program to get started.</p>
        <div class="space-x-4">
          <a href="/create" class="btn-primary">
            Create Your First Program
          </a>
          <!-- <button 
            on:click={handleSeedData}
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Add Demo Data
          </button> -->
        </div>
      </div>
    {:else}
      <!-- Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each loyaltyCards as card (card._id)}
          <LoyaltyCard {card} />
        {/each}
      </div>
    {/if}
  </div>

  <!-- Quick Actions -->
  <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 animate-fade-in-up">
    <h3 class="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <a 
        href="/create" 
        class="flex items-center p-6 bg-white rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-tap2-blue/30 group"
      >
        <div class="w-12 h-12 bg-gradient-to-br from-tap2-blue to-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
          <Plus class="w-6 h-6 text-white" />
        </div>
        <div>
          <div class="font-semibold text-gray-900 group-hover:text-tap2-blue transition-colors">Create Program</div>
          <div class="text-sm text-gray-600">Add a new loyalty card</div>
        </div>
      </a>
      
      <a 
        href="/analytics" 
        class="flex items-center p-6 bg-white rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-400/30 group"
      >
        <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
          <BarChart3 class="w-6 h-6 text-white" />
        </div>
        <div>
          <div class="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">View Analytics</div>
          <div class="text-sm text-gray-600">Detailed insights</div>
        </div>
      </a>
      
      <a 
        href="/settings" 
        class="flex items-center p-6 bg-white rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-green-400/30 group"
      >
        <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
          <Settings class="w-6 h-6 text-white" />
        </div>
        <div>
          <div class="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Settings</div>
          <div class="text-sm text-gray-600">Manage preferences</div>
        </div>
      </a>
    </div>
  </div>
</main>
