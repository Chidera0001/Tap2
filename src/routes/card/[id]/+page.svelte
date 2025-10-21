<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import Header from '$lib/components/Header.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import { convex } from '$lib/convex';
  import { api } from '$lib/convex-generated/api';
  
  // Get card ID from URL params
  $: cardId = $page.params.id;
  
  // State
  let card: any = null;
  let isLoading = true;
  let hasError = false;
  
  // Load card data on mount
  onMount(async () => {
    if (cardId) {
      try {
        const cardData = await convex.query(api.loyaltyCards.get, { id: cardId });
        card = cardData;
        isLoading = false;
      } catch (error) {
        console.error('Error loading card:', error);
        hasError = true;
        isLoading = false;
      }
    }
  });
  
  // Calculate metrics
  $: engagementRate = card && card.activeCards > 0 
    ? Math.round((card.redemptions / card.activeCards) * 100) 
    : 0;
  $: avgRedemptionsPerCard = card && card.activeCards > 0 
    ? (card.redemptions / card.activeCards).toFixed(1) 
    : 0;
  $: createdDate = card ? new Date(card.createdAt).toLocaleDateString() : '';
  
  // Mock recent activity (this would come from a separate Convex table in production)
  let recentActivity = [
    { type: 'redemption', message: 'Customer redeemed free coffee', time: '2 hours ago' },
    { type: 'new_card', message: 'New loyalty card created', time: '4 hours ago' },
    { type: 'visit', message: 'Customer visited (8/10 stamps)', time: '6 hours ago' },
    { type: 'redemption', message: 'Customer redeemed free pastry', time: '1 day ago' },
  ];
</script>

<svelte:head>
  <title>{card ? card.businessName : 'Loading...'} - Tap2 Loyalty</title>
  <meta name="description" content="Loyalty program details for {card ? card.businessName : 'this business'}" />
</svelte:head>

<Header />

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {#if isLoading}
    <!-- Loading State -->
    <div class="animate-pulse">
      <div class="h-8 bg-gray-200 rounded mb-6 w-48"></div>
      <div class="flex items-center mb-8">
        <div class="w-16 h-16 bg-gray-200 rounded-lg mr-4"></div>
        <div>
          <div class="h-6 bg-gray-200 rounded mb-2 w-48"></div>
          <div class="h-4 bg-gray-200 rounded mb-1 w-32"></div>
          <div class="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {#each Array(4) as _}
          <div class="h-24 bg-gray-200 rounded"></div>
        {/each}
      </div>
    </div>
  {:else if !card}
    <!-- Error State -->
    <div class="text-center py-12">
      <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <span class="text-4xl">❌</span>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Card not found</h3>
      <p class="text-gray-600 mb-6">The loyalty card you're looking for doesn't exist.</p>
      <a href="/" class="btn-primary">
        Back to Dashboard
      </a>
    </div>
  {:else}
  <!-- Breadcrumb -->
  <nav class="mb-6">
    <div class="flex items-center space-x-2 text-sm text-gray-600">
      <a href="/" class="hover:text-tap2-blue">Dashboard</a>
      <span>/</span>
      <span class="text-black">{card.businessName}</span>
    </div>
  </nav>

  <!-- Card Header -->
  <div class="mb-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div class="flex items-center mb-4 md:mb-0">
        <div 
          class="w-16 h-16 rounded-lg mr-4 flex items-center justify-center text-white font-bold text-xl"
          style="background-color: {card.color}"
        >
          {card.businessName.charAt(0)}
        </div>
        <div>
          <h1 class="text-3xl font-bold text-black">{card.businessName}</h1>
          <p class="text-gray-600">{card.location}</p>
          <p class="text-sm text-gray-500">Created {createdDate}</p>
        </div>
      </div>
      
      <div class="flex space-x-3">
        <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Edit Program
        </button>
        <a href="/analytics" class="btn-primary">
          View Analytics
        </a>
      </div>
    </div>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <StatCard 
      title="Active Cards" 
      value={card.activeCards.toLocaleString()} 
      trend="up"
      trendValue="+5 this week"
    />
    <StatCard 
      title="Total Redemptions" 
      value={card.redemptions.toLocaleString()} 
      trend="up"
      trendValue="+3 this week"
    />
    <StatCard 
      title="Engagement Rate" 
      value="{engagementRate}%" 
      trend="up"
      trendValue="+2% this week"
    />
    <StatCard 
      title="Avg per Card" 
      value="{avgRedemptionsPerCard}" 
      trend="neutral"
    />
  </div>

  <!-- Main Content Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Left Column - Program Details -->
    <div class="lg:col-span-2 space-y-6">
      <!-- Program Settings -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-black mb-4">Program Settings</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center py-2 border-b border-gray-100">
            <span class="text-gray-600">Reward Threshold</span>
            <span class="font-medium text-black">{card.rewardThreshold} visits</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-gray-100">
            <span class="text-gray-600">Brand Color</span>
            <div class="flex items-center">
              <div 
                class="w-6 h-6 rounded-full mr-2 border border-gray-200"
                style="background-color: {card.color}"
              ></div>
              <span class="font-mono text-sm">{card.color}</span>
            </div>
          </div>
          <div class="flex justify-between items-center py-2">
            <span class="text-gray-600">Program Status</span>
            <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Active
            </span>
          </div>
        </div>
      </div>

      <!-- Mock Wallet Card Preview -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-black mb-4">Wallet Card Preview</h3>
        <div class="flex justify-center">
          <div 
            class="w-80 h-48 rounded-2xl shadow-lg flex flex-col justify-between p-6 text-white"
            style="background: linear-gradient(135deg, {card.color} 0%, {card.color}dd 100%)"
          >
            <div class="flex justify-between items-start">
              <div>
                <h4 class="text-lg font-bold">{card.businessName}</h4>
                <p class="text-sm opacity-90">{card.location}</p>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold">7</div>
                <div class="text-xs opacity-90">of {card.rewardThreshold}</div>
              </div>
            </div>
            <div class="flex justify-between items-end">
              <div class="text-xs opacity-90">Tap2 Loyalty</div>
              <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span class="text-sm">💳</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column - Recent Activity -->
    <div class="space-y-6">
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-black mb-4">Recent Activity</h3>
        <div class="space-y-3">
          {#each recentActivity as activity}
            <div class="flex items-start space-x-3 py-2">
              <div class="w-2 h-2 bg-tap2-blue rounded-full mt-2 flex-shrink-0"></div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900">{activity.message}</p>
                <p class="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          {/each}
        </div>
        <button class="w-full mt-4 text-sm text-tap2-blue hover:text-blue-700 font-medium">
          View All Activity
        </button>
      </div>

      <!-- Quick Stats -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-black mb-4">Quick Stats</h3>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">This Week</span>
            <span class="font-medium text-black">+8 cards</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">This Month</span>
            <span class="font-medium text-black">+23 cards</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Peak Day</span>
            <span class="font-medium text-black">Friday</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Best Hour</span>
            <span class="font-medium text-black">2-3 PM</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/if}
</main>
