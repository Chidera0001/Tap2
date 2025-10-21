<script lang="ts">
  import { onMount } from 'svelte';
  import Header from '$lib/components/Header.svelte';
  import LoyaltyCard from '$lib/components/LoyaltyCard.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import { Plus, BarChart3, Settings } from 'lucide-svelte';
  
  // Temporary mock data to test if app loads
  let loyaltyCards = [
    {
      _id: '1',
      businessName: 'Café Amsterdam',
      location: 'Amsterdam, Netherlands',
      activeCards: 234,
      redemptions: 89,
      rewardThreshold: 10,
      color: '#0055FF',
      createdAt: Date.now() - 86400000 * 30
    },
    {
      _id: '2',
      businessName: 'Bistro Rotterdam',
      location: 'Rotterdam, Netherlands',
      activeCards: 156,
      redemptions: 67,
      rewardThreshold: 8,
      color: '#FF6B35',
      createdAt: Date.now() - 86400000 * 15
    },
    {
      _id: '3',
      businessName: 'The Hague Coffee',
      location: 'The Hague, Netherlands',
      activeCards: 89,
      redemptions: 23,
      rewardThreshold: 12,
      color: '#28A745',
      createdAt: Date.now() - 86400000 * 7
    }
  ];
  
  // Loading state
  $: isLoading = false;
  
  // Error state
  $: hasError = false;
  
  // Calculate dashboard stats
  $: totalActiveCards = loyaltyCards ? loyaltyCards.reduce((sum, card) => sum + card.activeCards, 0) : 0;
  $: totalRedemptions = loyaltyCards ? loyaltyCards.reduce((sum, card) => sum + card.redemptions, 0) : 0;
  $: totalBusinesses = loyaltyCards ? loyaltyCards.length : 0;
  $: avgEngagement = loyaltyCards && loyaltyCards.length > 0 
    ? Math.round(loyaltyCards.reduce((sum, card) => sum + (card.redemptions / card.activeCards), 0) / loyaltyCards.length * 100)
    : 0;
  
  // Function to seed data
  async function handleSeedData() {
    console.log('Seed data would be added here');
  }
</script>

<svelte:head>
  <title>Tap2 Loyalty Dashboard</title>
  <meta name="description" content="Manage your digital loyalty card programs" />
</svelte:head>

<Header />

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <!-- Page Header -->
  <div class="mb-8 animate-fade-in-up">
    <div class="relative overflow-hidden bg-gradient-to-br from-tap2-blue via-blue-600 to-purple-700 rounded-3xl p-8 text-white mb-6 shadow-2xl">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-full h-full" style="background-image: radial-gradient(circle at 30px 30px, rgba(255,255,255,0.1) 2px, transparent 2px); background-size: 60px 60px;"></div>
      </div>
      
      <!-- Floating Elements -->
      <div class="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      <div class="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
      <div class="absolute top-1/2 right-8 w-12 h-12 bg-white/8 rounded-full blur-md"></div>
      
      <!-- Content -->
      <div class="relative z-10">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h1 class="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Loyalty Dashboard
            </h1>
            <p class="text-blue-100 text-xl mb-4">Manage your digital loyalty card programs with powerful insights</p>
            
            <!-- Quick Stats -->
            <div class="flex items-center space-x-6 mt-6">
              <div class="flex items-center">
                <div class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span class="text-sm text-blue-100">Live Data</span>
              </div>
              <div class="flex items-center">
                <div class="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                <span class="text-sm text-blue-100">Real-time Updates</span>
              </div>
              <div class="flex items-center">
                <div class="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                <span class="text-sm text-blue-100">Secure Platform</span>
              </div>
            </div>
          </div>
          
          <!-- Decorative Icon -->
          <div class="hidden lg:block">
            <div class="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div class="w-24 h-24 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center">
                <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Bottom Wave -->
      <div class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/10 to-transparent"></div>
    </div>
  </div>

  <!-- Stats Overview -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <StatCard 
      title="Total Active Cards" 
      value={totalActiveCards.toLocaleString()} 
      icon="💳"
      trend="up"
      trendValue="+12% this month"
    />
    <StatCard 
      title="Total Redemptions" 
      value={totalRedemptions.toLocaleString()} 
      icon="🎁"
      trend="up"
      trendValue="+8% this month"
    />
    <StatCard 
      title="Active Businesses" 
      value={totalBusinesses} 
      icon="🏪"
      trend="neutral"
    />
    <StatCard 
      title="Avg Engagement" 
      value="{avgEngagement}%" 
      icon="📊"
      trend="up"
      trendValue="+3% this month"
    />
  </div>

  <!-- Loyalty Cards Grid -->
  <div class="mb-8">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-black">Loyalty Programs</h2>
      <a 
        href="/create" 
        class="btn-primary text-sm"
      >
        + Create New Program
      </a>
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
          <button 
            on:click={handleSeedData}
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Add Demo Data
          </button>
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
        href="#" 
        class="flex items-center p-6 bg-white rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-400/30 group"
      >
        <div class="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
          <BarChart3 class="w-6 h-6 text-white" />
        </div>
        <div>
          <div class="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">View Analytics</div>
          <div class="text-sm text-gray-600">Detailed insights</div>
        </div>
      </a>
      
      <a 
        href="#" 
        class="flex items-center p-6 bg-white rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-green-400/30 group"
      >
        <div class="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
          <Settings class="w-6 h-6 text-white" />
        </div>
        <div>
          <div class="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Settings</div>
          <div class="text-sm text-gray-600">Manage preferences</div>
        </div>
      </a>
    </div>
  </div>
</main>
