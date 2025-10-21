<script lang="ts">
  import { onMount } from 'svelte';
  import Header from '$lib/components/Header.svelte';
  import AnalyticsStats from '$lib/components/AnalyticsStats.svelte';
  import AnalyticsCharts from '$lib/components/AnalyticsCharts.svelte';
  import AnalyticsInsights from '$lib/components/AnalyticsInsights.svelte';
  import AnalyticsExports from '$lib/components/AnalyticsExports.svelte';
  import FilterPanel from '$lib/components/FilterPanel.svelte';
  import { BarChart3, Plus } from 'lucide-svelte';
  import { convex } from '$lib/convex';
  import { api } from '$lib/convex-generated/api';

  // State
  let loyaltyCards: any[] = [];
  let activities: any[] = [];
  let insights: any[] = [];
  let isLoading = true;

  // Load data on mount
  onMount(async () => {
    try {
      const [cards, activitiesData, insightsData] = await Promise.all([
        convex.query(api.loyaltyCards.list),
        convex.query(api.activities.list, { businessName: selectedBusiness === 'all' ? undefined : selectedBusiness }),
        convex.query(api.insights.list, { businessName: selectedBusiness === 'all' ? undefined : selectedBusiness })
      ]);
      
      loyaltyCards = cards || [];
      activities = activitiesData || [];
      insights = insightsData || [];
      isLoading = false;
    } catch (error) {
      console.error('Error loading analytics data:', error);
      loyaltyCards = [];
      activities = [];
      insights = [];
      isLoading = false;
    }
  });

  // Calculate analytics data from Convex
  $: analyticsData = loyaltyCards && loyaltyCards.length > 0 ? {
    totalPrograms: loyaltyCards.length,
    totalActiveCards: loyaltyCards.reduce((sum: number, card: any) => sum + (card.activeCards || 0), 0),
    totalRedemptions: loyaltyCards.reduce((sum: number, card: any) => sum + (card.redemptions || 0), 0),
    avgEngagement: loyaltyCards.length > 0 
      ? Math.round(loyaltyCards.reduce((sum: number, card: any) => sum + ((card.redemptions || 0) / (card.activeCards || 1)), 0) / loyaltyCards.length * 100)
      : 0,
    topPerformingBusiness: loyaltyCards.length > 0 
      ? loyaltyCards.reduce((top: any, card: any) => ((card.redemptions || 0) / (card.activeCards || 1)) > ((top.redemptions || 0) / (top.activeCards || 1)) ? card : top).businessName
      : 'N/A',
    lowestPerformingBusiness: loyaltyCards.length > 0 
      ? loyaltyCards.reduce((low: any, card: any) => ((card.redemptions || 0) / (low.activeCards || 1)) < ((low.redemptions || 0) / (low.activeCards || 1)) ? card : low).businessName
      : 'N/A',
    mostRedeemedReward: 'Free Coffee', // This would come from a separate table in production
    lastUpdated: new Date().toLocaleDateString()
  } : {
    totalPrograms: 0,
    totalActiveCards: 0,
    totalRedemptions: 0,
    avgEngagement: 0,
    topPerformingBusiness: 'N/A',
    lowestPerformingBusiness: 'N/A',
    mostRedeemedReward: 'N/A',
    lastUpdated: new Date().toLocaleDateString()
  };

  // Generate chart data from Convex data with fallbacks
  $: chartData = loyaltyCards && loyaltyCards.length > 0 ? {
    monthlyGrowth: selectedBusiness === 'all' ? [
      { month: 'Jan', cards: Math.floor(loyaltyCards.length * 0.1), redemptions: Math.floor(analyticsData.totalRedemptions * 0.05) },
      { month: 'Feb', cards: Math.floor(loyaltyCards.length * 0.2), redemptions: Math.floor(analyticsData.totalRedemptions * 0.1) },
      { month: 'Mar', cards: Math.floor(loyaltyCards.length * 0.3), redemptions: Math.floor(analyticsData.totalRedemptions * 0.15) },
      { month: 'Apr', cards: Math.floor(loyaltyCards.length * 0.4), redemptions: Math.floor(analyticsData.totalRedemptions * 0.2) },
      { month: 'May', cards: Math.floor(loyaltyCards.length * 0.5), redemptions: Math.floor(analyticsData.totalRedemptions * 0.25) },
      { month: 'Jun', cards: Math.floor(loyaltyCards.length * 0.6), redemptions: Math.floor(analyticsData.totalRedemptions * 0.3) },
      { month: 'Jul', cards: Math.floor(loyaltyCards.length * 0.7), redemptions: Math.floor(analyticsData.totalRedemptions * 0.35) },
      { month: 'Aug', cards: Math.floor(loyaltyCards.length * 0.8), redemptions: Math.floor(analyticsData.totalRedemptions * 0.4) },
      { month: 'Sep', cards: Math.floor(loyaltyCards.length * 0.85), redemptions: Math.floor(analyticsData.totalRedemptions * 0.5) },
      { month: 'Oct', cards: Math.floor(loyaltyCards.length * 0.9), redemptions: Math.floor(analyticsData.totalRedemptions * 0.6) },
      { month: 'Nov', cards: Math.floor(loyaltyCards.length * 0.95), redemptions: Math.floor(analyticsData.totalRedemptions * 0.8) },
      { month: 'Dec', cards: loyaltyCards.length, redemptions: analyticsData.totalRedemptions }
    ] : getFilteredMonthlyData(),
    businessPerformance: loyaltyCards.map((card: any) => ({
      business: card.businessName,
      cards: card.activeCards,
      redemptions: card.redemptions,
      engagement: Math.round(((card.redemptions || 0) / (card.activeCards || 1)) * 100) || 0
    })),
    weeklyRedemptions: selectedBusiness === 'all' ? [
      { day: 'Mon', redemptions: Math.floor(analyticsData.totalRedemptions * 0.1) },
      { day: 'Tue', redemptions: Math.floor(analyticsData.totalRedemptions * 0.15) },
      { day: 'Wed', redemptions: Math.floor(analyticsData.totalRedemptions * 0.2) },
      { day: 'Thu', redemptions: Math.floor(analyticsData.totalRedemptions * 0.25) },
      { day: 'Fri', redemptions: Math.floor(analyticsData.totalRedemptions * 0.3) },
      { day: 'Sat', redemptions: Math.floor(analyticsData.totalRedemptions * 0.2) },
      { day: 'Sun', redemptions: Math.floor(analyticsData.totalRedemptions * 0.1) }
    ] : getFilteredWeeklyData()
  } : {
    monthlyGrowth: [
      { month: 'Jan', cards: 0, redemptions: 0 },
      { month: 'Feb', cards: 0, redemptions: 0 },
      { month: 'Mar', cards: 0, redemptions: 0 },
      { month: 'Apr', cards: 0, redemptions: 0 },
      { month: 'May', cards: 0, redemptions: 0 },
      { month: 'Jun', cards: 0, redemptions: 0 },
      { month: 'Jul', cards: 0, redemptions: 0 },
      { month: 'Aug', cards: 0, redemptions: 0 },
      { month: 'Sep', cards: 0, redemptions: 0 },
      { month: 'Oct', cards: 0, redemptions: 0 },
      { month: 'Nov', cards: 0, redemptions: 0 },
      { month: 'Dec', cards: 0, redemptions: 0 }
    ],
    businessPerformance: [],
    weeklyRedemptions: [
      { day: 'Mon', redemptions: 0 },
      { day: 'Tue', redemptions: 0 },
      { day: 'Wed', redemptions: 0 },
      { day: 'Thu', redemptions: 0 },
      { day: 'Fri', redemptions: 0 },
      { day: 'Sat', redemptions: 0 },
      { day: 'Sun', redemptions: 0 }
    ]
  };
  
  // Filter state
  let selectedBusiness = 'all';
  let dateRange = '30d';
  let showFilters = false;
  let showExportModal = false;
  
  // Filtered data based on selections
  $: filteredData = selectedBusiness === 'all' ? analyticsData : getFilteredData();
  
  // Recent activity based on filter - only calculate when data is loaded
  $: recentActivity = !isLoading && activities ? getRecentActivity() : [];
  
  // Reactive data loading when filter changes
  $: if (selectedBusiness !== undefined) {
    loadFilteredData();
  }
  
  async function loadFilteredData() {
    try {
      const [activitiesData, insightsData] = await Promise.all([
        convex.query(api.activities.list, { businessName: selectedBusiness === 'all' ? undefined : selectedBusiness }),
        convex.query(api.insights.list, { businessName: selectedBusiness === 'all' ? undefined : selectedBusiness })
      ]);
      
      activities = activitiesData || [];
      insights = insightsData || [];
    } catch (error) {
      console.error('Error loading filtered data:', error);
    }
  }
  
  function getFilteredData() {
    // Filter the data based on selections
    let filtered = { ...analyticsData };
    
    // Ensure we have valid analyticsData
    if (!analyticsData || Object.keys(analyticsData).length === 0) {
      return {
        totalPrograms: 0,
        totalActiveCards: 0,
        totalRedemptions: 0,
        avgEngagement: 0,
        topPerformingBusiness: 'N/A',
        lowestPerformingBusiness: 'N/A',
        mostRedeemedReward: 'N/A',
        lastUpdated: new Date().toLocaleDateString()
      };
    }
    
    if (selectedBusiness !== 'all' && loyaltyCards) {
      // Filter data for specific business
      const businessData = loyaltyCards.find((card: any) => card.businessName === selectedBusiness);
      if (businessData) {
        filtered.totalActiveCards = businessData.activeCards;
        filtered.totalRedemptions = businessData.redemptions;
        filtered.avgEngagement = Math.round(((businessData.redemptions || 0) / (businessData.activeCards || 1)) * 100) || 0;
        filtered.totalPrograms = 1;
        filtered.topPerformingBusiness = businessData.businessName;
      }
    }
    
    return filtered;
  }
  
  function getFilteredMonthlyData() {
    if (selectedBusiness === 'all' || !loyaltyCards) return [];
    
    const businessData = loyaltyCards.find((card: any) => card.businessName === selectedBusiness);
    if (!businessData) return [];
    
    // Generate monthly data for the specific business
    const businessCards = businessData.activeCards;
    const businessRedemptions = businessData.redemptions;
    
    return [
      { month: 'Jan', cards: Math.floor(businessCards * 0.1), redemptions: Math.floor(businessRedemptions * 0.05) },
      { month: 'Feb', cards: Math.floor(businessCards * 0.2), redemptions: Math.floor(businessRedemptions * 0.1) },
      { month: 'Mar', cards: Math.floor(businessCards * 0.3), redemptions: Math.floor(businessRedemptions * 0.15) },
      { month: 'Apr', cards: Math.floor(businessCards * 0.4), redemptions: Math.floor(businessRedemptions * 0.2) },
      { month: 'May', cards: Math.floor(businessCards * 0.5), redemptions: Math.floor(businessRedemptions * 0.25) },
      { month: 'Jun', cards: Math.floor(businessCards * 0.6), redemptions: Math.floor(businessRedemptions * 0.3) },
      { month: 'Jul', cards: Math.floor(businessCards * 0.7), redemptions: Math.floor(businessRedemptions * 0.35) },
      { month: 'Aug', cards: Math.floor(businessCards * 0.8), redemptions: Math.floor(businessRedemptions * 0.4) },
      { month: 'Sep', cards: Math.floor(businessCards * 0.85), redemptions: Math.floor(businessRedemptions * 0.5) },
      { month: 'Oct', cards: Math.floor(businessCards * 0.9), redemptions: Math.floor(businessRedemptions * 0.6) },
      { month: 'Nov', cards: Math.floor(businessCards * 0.95), redemptions: Math.floor(businessRedemptions * 0.8) },
      { month: 'Dec', cards: businessCards, redemptions: businessRedemptions }
    ];
  }
  
  function getFilteredWeeklyData() {
    if (selectedBusiness === 'all' || !loyaltyCards) return [];
    
    const businessData = loyaltyCards.find((card: any) => card.businessName === selectedBusiness);
    if (!businessData) return [];
    
    const businessRedemptions = businessData.redemptions;
    
    return [
      { day: 'Mon', redemptions: Math.floor(businessRedemptions * 0.1) },
      { day: 'Tue', redemptions: Math.floor(businessRedemptions * 0.15) },
      { day: 'Wed', redemptions: Math.floor(businessRedemptions * 0.2) },
      { day: 'Thu', redemptions: Math.floor(businessRedemptions * 0.25) },
      { day: 'Fri', redemptions: Math.floor(businessRedemptions * 0.3) },
      { day: 'Sat', redemptions: Math.floor(businessRedemptions * 0.2) },
      { day: 'Sun', redemptions: Math.floor(businessRedemptions * 0.1) }
    ];
  }
  
  function getRecentActivity() {
    if (!activities || activities.length === 0) {
      return [
        { type: 'info', message: 'No recent activity', time: 'N/A', business: 'N/A' }
      ];
    }
    
    // Filter activities from the past 24 hours
    const now = Date.now();
    const twentyFourHoursAgo = now - (24 * 60 * 60 * 1000);
    
    const recentActivities = activities.filter(activity => 
      activity.timestamp >= twentyFourHoursAgo
    );
    
    if (recentActivities.length === 0) {
      return [
        { type: 'info', message: 'No activity in the past 24 hours', time: 'N/A', business: 'N/A' }
      ];
    }
    
    // Sort by timestamp (latest first) and convert to frontend format
    return recentActivities
      .sort((a, b) => b.timestamp - a.timestamp) // Sort by timestamp descending (latest first)
      .map(activity => ({
        type: activity.type,
        message: activity.message,
        time: getTimeAgo(activity.timestamp),
        business: activity.businessName
      }));
  }
  
  function getTimeAgo(timestamp: number) {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;
    return 'Over a week ago';
  }
</script>

<svelte:head>
  <title>Analytics Dashboard - Tap2 Loyalty</title>
  <meta name="description" content="Comprehensive analytics for your loyalty programs" />
</svelte:head>

<Header />

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <!-- Page Header -->
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
      <p class="text-gray-600">Detailed insights into your loyalty programs' performance</p>
    </div>
    <AnalyticsExports 
      bind:showExportModal 
      bind:showFilters 
      {loyaltyCards} 
      {filteredData}
    />
  </div>

  <!-- Filter Panel -->
  {#if showFilters}
    <FilterPanel 
      bind:selectedBusiness 
      bind:dateRange 
      {loyaltyCards}
      on:close={() => showFilters = false}
    />
  {/if}

  <!-- Loading State -->
  {#if isLoading}
    <div class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-tap2-blue mx-auto mb-4"></div>
        <p class="text-gray-600">Loading analytics data...</p>
      </div>
    </div>
  {:else if loyaltyCards.length === 0}
    <!-- Empty State -->
    <div class="text-center py-12">
      <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <BarChart3 class="w-12 h-12 text-gray-400" />
      </div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No Data Available</h3>
      <p class="text-gray-600 mb-6">Create some loyalty programs to see analytics data.</p>
      <a href="/create" class="inline-flex items-center px-4 py-2 bg-tap2-blue text-white rounded-lg hover:bg-blue-700 transition-colors">
        <Plus class="w-4 h-4 mr-2" />
        Create Program
      </a>
    </div>
  {:else}
    <!-- Analytics Components -->
    <AnalyticsStats {filteredData} />
    <AnalyticsCharts {chartData} />
    <AnalyticsInsights {recentActivity} {insights} />
  {/if}
</main>